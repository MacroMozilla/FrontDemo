/* Drives every library page and every category page in headless Chromium
   and reports anything that fails to start. Usage:
     node scripts/verify.mjs            every library page, then every category page
     node scripts/verify.mjs xyf x6     only these libraries, and the categories they are in
     node scripts/verify.mjs --libs     library pages only
     node scripts/verify.mjs --cats     category pages only
     node scripts/verify.mjs --shots    also write screenshots to /tmp/fd-shots

   A category page runs all of its libraries at once, one panel each, so it
   also catches demos that get in each other's way: an element id used in
   two panels, a page-wide listener or stylesheet that breaks a neighbour.
*/
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
               '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
               '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
               '.png': 'image/png', '.wasm': 'application/wasm' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
      'Content-Length': st.size
    });
    /* Streaming matters here: several vendor bundles are multi-megabyte and
       buffering them all at once resets sockets under load. */
    const stream = fs.createReadStream(f);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});
const PORT = 8123;
await new Promise(r => server.listen(PORT, r));

/* Read the library list straight out of data.js. */
const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(win);

const args = process.argv.slice(2);
const shots = args.includes('--shots');
const doLibs = !args.includes('--cats'), doCats = !args.includes('--libs');
const only = args.filter(a => !a.startsWith('--'));
const libs = doLibs ? win.LIBS.filter(l => !only.length || only.includes(l.k)) : [];
const cats = doCats ? win.CATS.filter(c => win.LIBS.some(l => l.cat === c.id && (!only.length || only.includes(l.k)))) : [];
const unknown = only.filter(k => !win.LIBS.some(l => l.k === k));
if (unknown.length) {
  console.error('no such library: ' + unknown.join(' ') + '\nkeys: ' + win.LIBS.map(l => l.k).join(' '));
  process.exit(2);
}

if (shots) fs.mkdirSync('/tmp/fd-shots', { recursive: true });

/* The draw.io page loads embed.diagrams.net, so go through the environment's
   proxy if it has one. Passed as a flag rather than Playwright's proxy option,
   which would also route the local server through it. */
const PROXY = process.env.HTTPS_PROXY ? ['--proxy-server=' + process.env.HTTPS_PROXY] : [];
const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--use-gl=angle',
         '--enable-webgl', '--ignore-gpu-blocklist', ...PROXY]
});
/* The container reports en-US@posix, which Intl rejects — pin a real locale.
   diagrams.net's Cloudflare front refuses the "HeadlessChrome" user agent,
   so present an ordinary one. */
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, locale: 'en-US', timezoneId: 'UTC',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });

let errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message.split('\n')[0].slice(0, 160)));
/* A 404 from inside draw.io's frame (its notifications feed) is not ours. */
page.on('console', m => {
  if (m.type() === 'error') {
    const t = m.text().slice(0, 160);
    if (/favicon|Failed to load resource: the server responded with a status of 404/.test(t)) return;
    errors.push('console: ' + t);
  }
});

/* The local static server occasionally resets a socket while streaming one
   of the multi-megabyte bundles. That is a harness artefact, not a demo
   failure, so a page whose only complaint is a network reset gets one retry. */
const NET_ONLY = e => /ERR_CONNECTION_RESET|ERR_EMPTY_RESPONSE|net::ERR_FAILED/.test(e);

async function attempt(l) {
  errors = [];
  await page.goto(`http://localhost:${PORT}/#/l/${l.k}`, { waitUntil: 'load' });
  await page.evaluate(k => { location.hash = '#/l/' + k; }, l.k);
  await page.waitForTimeout(140);

  let state = 'timeout';
  const t0 = Date.now();
  while (Date.now() - t0 < 22000) {
    state = await page.evaluate(() => {
      const m = document.getElementById('msg');
      if (!m) return 'nomsg';
      if (m.classList.contains('err')) return 'ERR:' + m.textContent.trim().replace(/\s+/g, ' ').slice(0, 170);
      return m.classList.contains('on') ? 'loading' : 'ok';
    });
    if (state !== 'loading') break;
    await page.waitForTimeout(220);
  }
  await page.waitForTimeout(600);

  /* An empty stage is a silent failure, so check something actually rendered. */
  const painted = await page.evaluate(() => {
    const m = document.getElementById('mount');
    if (!m) return 0;
    if (m.children.length === 0) return 0;
    const r = m.getBoundingClientRect();
    return Math.round(r.width) > 40 && Math.round(r.height) > 40 ? m.querySelectorAll('*').length + 1 : 0;
  });

  const errs = errors.slice(0, 3);
  return { ok: state === 'ok' && painted > 0 && errs.length === 0, state, painted, errors: errs };
}

/* The stage message of one panel: loading, ok, or the error it shows. */
function panelState(k) {
  return page.evaluate(k => {
    const m = document.querySelector('.panel[data-k="' + k + '"] .stage-msg');
    if (!m) return 'nomsg';
    if (m.classList.contains('err')) return 'ERR:' + m.textContent.trim().replace(/\s+/g, ' ').slice(0, 170);
    return m.classList.contains('on') ? 'loading' : 'ok';
  }, k);
}

/* Opens a category page and brings each panel into view in turn (panels
   start when they are seen), then checks every one of them is up and
   painted, with no element id shared between two panels. */
async function attemptCat(c) {
  errors = [];
  await page.goto(`http://localhost:${PORT}/#/c/${c.id}`, { waitUntil: 'load' });
  await page.evaluate(id => { location.hash = '#/c/' + id; }, c.id);
  await page.waitForTimeout(200);
  const keys = await page.evaluate(() => [...document.querySelectorAll('.panel')]
    .sort((a, b) => a.style.order - b.style.order).map(p => p.dataset.k));
  const state = {};
  for (const k of keys) {
    await page.evaluate(([id, k]) => { location.hash = '#/c/' + id + '/' + k; }, [c.id, k]);
    const t0 = Date.now();
    do {
      await page.waitForTimeout(220);
      state[k] = await panelState(k);
    } while (state[k] === 'loading' && Date.now() - t0 < 22000);
    if (state[k] === 'loading') state[k] = 'timeout';
  }
  await page.waitForTimeout(800);
  const info = await page.evaluate(() => {
    const ids = {};
    document.querySelectorAll('[id]').forEach(e => {
      const p = e.closest('.panel');
      (ids[e.id] = ids[e.id] || new Set()).add(p ? p.dataset.k : 'page');
    });
    const painted = {};
    document.querySelectorAll('.panel').forEach(p => {
      const m = p.querySelector('.mount'), r = m.getBoundingClientRect();
      painted[p.dataset.k] = m.children.length && r.width > 40 && r.height > 40 ? m.querySelectorAll('*').length + 1 : 0;
    });
    return { shared: Object.keys(ids).filter(i => ids[i].size > 1).map(i => i + ' (' + [...ids[i]].join(', ') + ')'), painted };
  });
  const failing = keys.filter(k => state[k] !== 'ok' || !info.painted[k]).map(k => k + ': ' + (state[k] === 'ok' ? 'nothing painted' : state[k]));
  const errs = errors.slice(0, 3);
  return { ok: !failing.length && !info.shared.length && !errs.length, n: keys.length, failing, shared: info.shared, errors: errs };
}

const bad = [];
for (const l of libs) {
  let r = await attempt(l);
  if (!r.ok && r.errors.length && r.errors.every(NET_ONLY)) r = await attempt(l);

  if (!r.ok) bad.push({ k: l.k, n: l.n, ...r });
  console.log(
    (r.ok ? '  ok  ' : ' FAIL ') + l.k.padEnd(10) + l.n.padEnd(22) +
    String(r.painted).padStart(5) + ' nodes  ' + (r.state === 'ok' ? '' : r.state) +
    (r.errors.length ? '  ⟨' + r.errors.slice(0, 2).join(' | ') + '⟩' : '')
  );

  if (shots) await page.screenshot({ path: `/tmp/fd-shots/${l.k}.png`, clip: { x: 0, y: 0, width: 1440, height: 950 } });
}

const badCats = [];
if (cats.length && libs.length) console.log('');
for (const c of cats) {
  let r = await attemptCat(c);
  if (!r.ok && !r.failing.length && !r.shared.length && r.errors.every(NET_ONLY)) r = await attemptCat(c);
  if (!r.ok) badCats.push(c.id);
  console.log(
    (r.ok ? '  ok  ' : ' FAIL ') + ('#/c/' + c.id).padEnd(16) + String(r.n).padStart(2) + ' panels' +
    (r.failing.length ? '  ' + r.failing.join('; ') : '') +
    (r.shared.length ? '  ids in two panels: ' + r.shared.slice(0, 4).join(', ') : '') +
    (r.errors.length ? '  ⟨' + r.errors.slice(0, 2).join(' | ') + '⟩' : '')
  );
  if (shots) {
    await page.evaluate(() => { const m = document.getElementById('main'); m.style.scrollBehavior = 'auto'; m.scrollTop = 0; });
    await page.waitForTimeout(700);
    await page.screenshot({ path: `/tmp/fd-shots/c-${c.id}.png` });
  }
}

if (libs.length) console.log(`\n${libs.length - bad.length}/${libs.length} library pages ok`);
if (bad.length) console.log('failing: ' + bad.map(b => b.k).join(' '));
if (cats.length) console.log(`${cats.length - badCats.length}/${cats.length} category pages ok`);
if (badCats.length) console.log('failing: ' + badCats.join(' '));

await browser.close();
server.close();
process.exit(bad.length || badCats.length ? 1 : 0);
