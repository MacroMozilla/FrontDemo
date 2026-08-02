/* Visual audit: screenshots each library's stage and measures whether
   anything meaningful is actually on it. verify.mjs proves a demo runs;
   this catches the ones that run and still show nothing worth looking at.

     node scripts/audit.mjs             all libraries
     node scripts/audit.mjs d3 leaflet  only these
   Screenshots land in /tmp/fd-audit/. */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
               '.woff2': 'font/woff2', '.wasm': 'application/wasm' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
                         'Content-Length': st.size });
    fs.createReadStream(f).pipe(res).on('error', () => res.destroy());
  });
});
const PORT = Number(process.env.FD_PORT || 8155);
await new Promise(r => server.listen(PORT, r));

const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(win);
const only = process.argv.slice(2).filter(a => !a.startsWith('--'));
const libs = win.LIBS.filter(l => !only.length || only.includes(l.k));

fs.mkdirSync('/tmp/fd-audit', { recursive: true });

const browser = await chromium.launch({
  args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--use-gl=angle']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, locale: 'en-US', timezoneId: 'UTC' });
/* Playwright's screenshot waits for the page to be visually stable, which a
   demo driving requestAnimationFrame forever never is. Go straight to CDP. */
const cdp = await page.context().newCDPSession(page);

/* How much of the stage is not just flat background, and how varied is it. */
function analyse(buf) {
  const png = PNG.sync.read(buf);
  const { width: w, height: h, data } = png;
  const at = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2]]; };
  const bg = at(2, 2);
  const near = (c, d) => Math.abs(c[0] - d[0]) + Math.abs(c[1] - d[1]) + Math.abs(c[2] - d[2]) < 24;

  let painted = 0, total = 0;
  const colours = new Set();
  const colUsed = new Array(w).fill(false);
  const rowUsed = new Array(h).fill(false);

  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const c = at(x, y);
      total++;
      if (!near(c, bg)) {
        painted++;
        colUsed[x] = true;
        rowUsed[y] = true;
        colours.add((c[0] >> 4) + ',' + (c[1] >> 4) + ',' + (c[2] >> 4));
      }
    }
  }

  /* Bounding box of the painted region, as a fraction of the stage. */
  const firstCol = colUsed.indexOf(true), lastCol = colUsed.lastIndexOf(true);
  const firstRow = rowUsed.indexOf(true), lastRow = rowUsed.lastIndexOf(true);
  const spanX = firstCol < 0 ? 0 : (lastCol - firstCol) / w;
  const spanY = firstRow < 0 ? 0 : (lastRow - firstRow) / h;

  return {
    ink: painted / total,
    colours: colours.size,
    spanX, spanY,
    w, h
  };
}

const rows = [];
for (const l of libs) {
  await page.goto(`http://localhost:${PORT}/#/l/${l.k}`, { waitUntil: 'load' });
  await page.evaluate(k => { location.hash = '#/l/' + k; }, l.k);
  await page.waitForTimeout(200);

  /* Wait for the loading overlay to clear. */
  const t0 = Date.now();
  while (Date.now() - t0 < 20000) {
    const st = await page.evaluate(() => {
      const m = document.getElementById('msg');
      return !m ? 'none' : m.classList.contains('err') ? 'err' : m.classList.contains('on') ? 'loading' : 'ok';
    });
    if (st !== 'loading') break;
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(Number(process.env.FD_SETTLE || 1500));   /* let animations settle */

  const stage = await page.$('#stage');
  let a = { ink: 0, colours: 0, spanX: 0, spanY: 0 };
  if (stage) {
    /* Several demos animate forever. `animations: disabled` tries to settle
       CSS animations and times out on rAF loops, so fall back to a plain
       grab rather than reporting a blank stage. */
    const box = await stage.boundingBox();
    let buf = null;
    try {
      /* A plain viewport grab never waits for the page to go still, which
         a rAF-driven demo never does. Crop to the stage afterwards. */
      const shot = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const full = PNG.sync.read(Buffer.from(shot.data, 'base64'));
      const x0 = Math.max(0, Math.round(box.x)), y0 = Math.max(0, Math.round(box.y));
      const w = Math.min(full.width - x0, Math.round(box.width));
      const h = Math.min(full.height - y0, Math.round(box.height));
      const crop = new PNG({ width: w, height: h });
      PNG.bitblt(full, crop, x0, y0, w, h, 0, 0);
      buf = PNG.sync.write(crop);
    } catch (e) {
      console.log('   (could not screenshot ' + l.k + ': ' + e.message.split('\n')[0].slice(0, 50) + ')');
    }
    if (buf) {
      fs.writeFileSync(`/tmp/fd-audit/${l.k}.png`, buf);
      a = analyse(buf);
    }
  }

  /* Does the toolbar actually offer anything to play with? */
  const controls = await page.evaluate(() => {
    const bar = document.getElementById('bar');
    if (!bar) return 0;
    return bar.querySelectorAll('button, select, input').length;
  });

  const flags = [];
  if (a.ink < 0.012) flags.push('BLANK');
  else if (a.ink < 0.035) flags.push('sparse');
  if (a.colours <= 2) flags.push('flat');
  if (a.spanX < 0.45 || a.spanY < 0.35) flags.push('small');
  if (controls === 0) flags.push('no-controls');

  rows.push({ k: l.k, n: l.n, ink: a.ink, colours: a.colours, spanX: a.spanX, spanY: a.spanY, controls, flags });
  console.log(
    (flags.length ? ' ! ' : '   ') + l.k.padEnd(10) + l.n.padEnd(22) +
    'ink ' + (a.ink * 100).toFixed(1).padStart(5) + '%  ' +
    'colours ' + String(a.colours).padStart(4) + '  ' +
    'span ' + (a.spanX * 100).toFixed(0).padStart(3) + '×' + (a.spanY * 100).toFixed(0).padStart(3) + '  ' +
    'ctl ' + String(controls).padStart(2) + '  ' + flags.join(' ')
  );
}

const bad = rows.filter(r => r.flags.length);
console.log(`\n${rows.length - bad.length}/${rows.length} look healthy`);
if (bad.length) console.log('needs a look: ' + bad.map(r => r.k).join(' '));
fs.writeFileSync('/tmp/fd-audit/report.json', JSON.stringify(rows, null, 1));

await browser.close();
server.close();
