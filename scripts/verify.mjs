/* Drives every library page in headless Chromium and reports anything
   that fails to start. Usage:
     node scripts/verify.mjs            all libraries
     node scripts/verify.mjs d3 leaflet only these
     node scripts/verify.mjs --shots    also write screenshots to /tmp/fd-shots
*/
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
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
const only = args.filter(a => !a.startsWith('--'));
const libs = win.LIBS.filter(l => !only.length || only.includes(l.k));

if (shots) fs.mkdirSync('/tmp/fd-shots', { recursive: true });

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--use-gl=angle',
         '--enable-webgl', '--ignore-gpu-blocklist']
});
/* The container reports en-US@posix, which Intl rejects — pin a real locale. */
const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, locale: 'en-US', timezoneId: 'UTC' });

let errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message.split('\n')[0].slice(0, 160)));
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

console.log(`\n${libs.length - bad.length}/${libs.length} ok`);
if (bad.length) console.log('failing: ' + bad.map(b => b.k).join(' '));

await browser.close();
server.close();
process.exit(bad.length ? 1 : 0);
