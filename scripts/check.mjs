/* Static sanity checks, run in CI before every deploy.
   Catches the mistakes that would otherwise ship a blank page:
   a library with no builder, a vendor file that is not there,
   a duplicate key, a malformed capability string. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = [];
const warn = [];

/* ---- load the registry ---- */
const win = {};
new Function('window', fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8'))(win);
const { GROUPS, CATS, CAPS, LIBS, MK } = win;

if (!LIBS?.length) { console.error('data.js exposed no LIBS'); process.exit(1); }

const catIds = new Set(CATS.map(c => c.id));
const groupIds = new Set(GROUPS.map(g => g.id));
CATS.forEach(c => { if (!groupIds.has(c.g)) fail.push(`category ${c.id} points at unknown group ${c.g}`); });

/* ---- registry integrity ---- */
const seen = new Set();
for (const l of LIBS) {
  const at = `lib ${l.k}`;
  if (seen.has(l.k)) fail.push(`${at}: duplicate key`);
  seen.add(l.k);
  if (!catIds.has(l.cat)) fail.push(`${at}: unknown category ${l.cat}`);
  const marks = String(l.c).trim().split(/\s+/);
  if (marks.length !== CAPS.length) fail.push(`${at}: ${marks.length} capability marks, expected ${CAPS.length}`);
  marks.forEach(m => { if (!MK[m]) fail.push(`${at}: bad capability mark "${m}"`); });
  for (const f of ['n', 'pkg', 'ver', 'pub', 'lic', 'kb', 'st', 'what', 'pro', 'con', 'try', 'rnNote', 'site', 'js']) {
    if (l[f] === undefined || l[f] === '') fail.push(`${at}: missing field "${f}"`);
  }
  if (!(l.st >= 1 && l.st <= 5)) fail.push(`${at}: rating out of range`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.pub)) fail.push(`${at}: pub is not a yyyy-mm-dd date`);
  for (const j of l.js || []) {
    if (!fs.existsSync(path.join(ROOT, 'vendor', j + '.js'))) fail.push(`${at}: vendor/${j}.js is missing`);
  }
  for (const c of l.css || []) {
    if (!fs.existsSync(path.join(ROOT, 'assets/css/lib', c + '.css'))) fail.push(`${at}: assets/css/lib/${c}.css is missing`);
  }
}

/* ---- every library needs a demo builder ---- */
const demoDir = path.join(ROOT, 'assets/js/demos');
const demoSrc = fs.readdirSync(demoDir).filter(f => f.endsWith('.js'))
  .map(f => fs.readFileSync(path.join(demoDir, f), 'utf8')).join('\n');
const registered = new Set([...demoSrc.matchAll(/^\s*B(?:\.(\w+)|\[["'](\w+)["']\])\s*=/gm)]
  .map(m => m[1] || m[2]));
for (const l of LIBS) if (!registered.has(l.k)) fail.push(`lib ${l.k}: no builder registered in assets/js/demos/`);
for (const k of registered) if (!LIBS.some(l => l.k === k)) warn.push(`builder "${k}" has no entry in data.js`);

/* ---- every demo file is referenced by index.html ---- */
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
for (const f of fs.readdirSync(demoDir)) {
  if (f.endsWith('.js') && !html.includes('assets/js/demos/' + f)) fail.push(`index.html does not load demos/${f}`);
}

/* ---- no Chinese left in shipped source ---- */
const cjk = /[一-鿿]/;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'vendor') continue;
    if (e.isDirectory()) { walk(p); continue; }
    if (!/\.(js|css|html|md|yml)$/.test(e.name)) continue;
    if (p.includes('assets/css/vendor.css') || p.includes('assets/css/lib/')) continue;
    const text = fs.readFileSync(p, 'utf8');
    text.split('\n').forEach((line, i) => {
      if (cjk.test(line)) warn.push(`${path.relative(ROOT, p)}:${i + 1} contains CJK text`);
    });
  }
}
walk(ROOT);

/* ---- report ---- */
for (const w of warn) console.log('warn  ' + w);
for (const f of fail) console.log('FAIL  ' + f);
console.log(`\n${LIBS.length} libraries · ${CATS.length} categories · ${registered.size} builders`);
if (fail.length) { console.log(`${fail.length} problem(s)`); process.exit(1); }
console.log('checks passed');
