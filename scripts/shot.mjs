/* Screenshots one route of the site in either theme.

     node scripts/shot.mjs                         the home page, dark, 1440x950
     node scripts/shot.mjs /l/xyf light            a library page in the light theme
     node scripts/shot.mjs /matrix dark 1280 800   at another size

   The picture lands in /tmp/fd-shots/view.png. */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
               '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const OUT = '/tmp/fd-shots';

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Content-Length': st.size });
    fs.createReadStream(f).pipe(res).on('error', () => res.destroy());
  });
});
await new Promise((r) => server.listen(0, r));
const base = 'http://localhost:' + server.address().port;

const [route, theme, w, h] = [process.argv[2] || '/', process.argv[3] || 'dark', +(process.argv[4] || 1440), +(process.argv[5] || 950)];
fs.mkdirSync(OUT, { recursive: true });

/* The draw.io page needs embed.diagrams.net, so go through the environment's
   proxy if it has one (as verify.mjs does). */
const PROXY = process.env.HTTPS_PROXY ? ['--proxy-server=' + process.env.HTTPS_PROXY] : [];
const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--use-gl=angle', ...PROXY] });
const page = await browser.newPage({ viewport: { width: w, height: h }, locale: 'en-US',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' });
await page.goto(base + '/');
await page.evaluate((t) => localStorage.setItem('fd-theme', t), theme);
await page.goto(base + '/#' + route);
await page.reload();
await page.waitForTimeout(4200);
await page.screenshot({ path: path.join(OUT, 'view.png') });
console.log(path.join(OUT, 'view.png'));
await browser.close();
server.close();
