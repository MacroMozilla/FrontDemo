/* Measures how long every demo takes to start and how much memory it holds,
   and writes the results to assets/js/perf.js, which the site shows beside
   each demo. Usage:
     node scripts/perf.mjs              every library
     node scripts/perf.mjs sig cos      only these (merged into the file)

   A normal web page cannot read its own memory precisely (Chrome rounds
   performance.memory and refreshes it rarely), so this runs headless
   Chromium with --enable-precise-memory-info and garbage collection
   exposed. For each library, in a fresh page:

     1. open the site's home page, collect garbage, read the JS heap
     2. open the library's page and wait until the demo reports it is ready
        (the same start time the site shows: download, set-up, first frame)
     3. let it run for a second, collect garbage, read the heap again

   The difference is the JavaScript heap the demo adds, its library code
   included. GPU memory, and anything in another process (draw.io's
   iframe), is not in it. A demo with a node-count choice is measured at
   every size it offers, as "key@size".

   Headless Chromium draws WebGL in software, so start times here are
   slower than on a machine with a GPU; they compare libraries with one
   another rather than promise a time. */
import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets/js/perf.js');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
               '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
               '.json': 'application/json', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.svg': 'image/svg+xml',
               '.png': 'image/png', '.wasm': 'application/wasm' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': st.size });
    const stream = fs.createReadStream(f);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
});
const PORT = 8124;
await new Promise(r => server.listen(PORT, r));

const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(win);
const only = process.argv.slice(2);
const libs = win.LIBS.filter(l => !only.length || only.includes(l.k));

/* Keep earlier results for the libraries not measured this time. */
const prev = {};
if (only.length && fs.existsSync(OUT)) new Function('window', fs.readFileSync(OUT, 'utf8'))(prev);
const results = only.length && prev.PERF ? { ...prev.PERF.libs } : {};
for (const k of Object.keys(results)) if (only.includes(k.split('@')[0])) delete results[k];

const browser = await chromium.launch({ args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'] });
const version = browser.version();

const heap = (page) => page.evaluate(async () => {
  for (let i = 0; i < 4; i++) { gc(); await new Promise(r => setTimeout(r, 80)); }
  return performance.memory.usedJSHeapSize;
});
const readyCount = (page) => page.evaluate(() => (window.__fdReady ? window.__fdReady.n : 0));
const waitReady = (page, n, timeout = 90000) =>
  page.waitForFunction(m => window.__fdReady && window.__fdReady.n > m, n, { timeout }).then(() => page.evaluate(() => window.__fdReady));

const MB = 1024 * 1024;
let done = 0;
for (const l of libs) {
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  try {
    await page.goto(`http://localhost:${PORT}/#/`, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const base = await heap(page);
    let n = await readyCount(page);
    await page.evaluate(k => { location.hash = '#/l/' + k; }, l.k);
    let r = await waitReady(page, n);
    await page.waitForTimeout(1000);
    results[r.key] = { ms: r.ms, mb: +(((await heap(page)) - base) / MB).toFixed(1) };
    /* The default size also under the plain key, for before a choice is made. */
    if (r.key !== l.k) results[l.k] = results[r.key];
    let line = `${l.k.padEnd(8)} ${String(r.ms).padStart(6)} ms ${results[r.key].mb.toFixed(1).padStart(7)} MB`;

    /* Every other size of a node-count choice. */
    const sizes = await page.$$eval('.stage-bar .ctl', cs => {
      const c = cs.find(x => (x.querySelector('.k') || {}).textContent === 'nodes');
      return c ? [...c.querySelectorAll('option')].map(o => o.value) : [];
    });
    for (const v of sizes.slice(1)) {
      n = r.n;
      await page.$$eval('.stage-bar .ctl', (cs, val) => {
        const s = cs.find(x => (x.querySelector('.k') || {}).textContent === 'nodes').querySelector('select');
        s.value = val; s.dispatchEvent(new Event('change'));
      }, v);
      r = await waitReady(page, n, 240000);
      await page.waitForTimeout(1000);
      results[r.key] = { ms: r.ms, mb: +(((await heap(page)) - base) / MB).toFixed(1) };
      line += ` | @${v} ${r.ms} ms ${results[r.key].mb} MB`;
    }
    console.log(line);
  } catch (e) {
    console.log(`${l.k.padEnd(8)} not measured: ${String(e.message || e).split('\n')[0]}`);
  }
  await page.close();
  done++;
}

const today = new Date().toISOString().slice(0, 10);
const sorted = Object.fromEntries(Object.keys(results).sort().map(k => [k, results[k]]));
const body = '/* Generated by scripts/perf.mjs: start time (ms) and JavaScript heap\n' +
  '   added (MB) for every demo, measured alone in headless Chromium. */\n' +
  'window.PERF = ' + JSON.stringify({ date: today, env: 'headless Chromium ' + version + ' (software GPU)', libs: sorted }, null, 0)
    .replace(/},"/g, '},\n  "').replace('"libs":{', '"libs":{\n  ') + ';\n';
fs.writeFileSync(OUT, body);
console.log(`\n${done} libraries, ${Object.keys(sorted).length} measurements written to assets/js/perf.js`);
await browser.close();
server.close();
