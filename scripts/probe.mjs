/* Loads one vendor build into a blank page and prints the value of an
   expression, to see what a build exposes before writing a demo for it.

     node scripts/probe.mjs cytoscape "typeof cytoscape"
     node scripts/probe.mjs sigma "Object.keys(SigmaLib)" */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8' };

const [file, expr] = process.argv.slice(2);
if (!file || !expr) {
  console.error('usage: node scripts/probe.mjs <vendor file without .js> "<expression>"');
  process.exit(2);
}

const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    res.end(d);
  });
});
await new Promise((r) => server.listen(0, r));
const base = 'http://localhost:' + server.address().port;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(base + '/scripts/blank.html');
await page.addScriptTag({ url: '/vendor/' + file + '.js' });
await page.waitForTimeout(200);
console.log(await page.evaluate((e) => { try { return (0, eval)(e); } catch (err) { return 'ERR ' + err.message; } }, expr));
await browser.close();
server.close();
