/* Static sanity checks, run in CI on every pull request and push to main.
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
const { GROUPS, CATS, CAPS, LIBS, MK, CHECKED } = win;

if (!LIBS?.length) { console.error('data.js exposed no LIBS'); process.exit(1); }

/* Where the version running here is recorded (see scripts/freshness.mjs). */
const bundled = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/bundles/package.json'), 'utf8')).dependencies;
const pinned = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/vendor-versions.json'), 'utf8'));
if (!/^\d{4}-\d{2}-\d{2}$/.test(CHECKED || '')) fail.push('window.CHECKED is not a yyyy-mm-dd date');

const catIds = new Set(CATS.map(c => c.id));
const groupIds = new Set(GROUPS.map(g => g.id));
CATS.forEach(c => {
  if (!groupIds.has(c.g)) fail.push(`category ${c.id} points at unknown group ${c.g}`);
  if (!LIBS.some(l => l.cat === c.id)) fail.push(`category ${c.id} has no libraries`);
});

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
  const rn = CAPS.findIndex(c => c.id === 'rn');
  if (rn >= 0 && !/^[ypn]$/.test(marks[rn])) fail.push(`${at}: the React Native mark must be y, p or n`);
  for (const f of ['n', 'pkg', 'ver', 'pub', 'lic', 'kb', 'st', 'what', 'pro', 'con', 'try', 'rnNote', 'site', 'js']) {
    if (l[f] === undefined || l[f] === '') fail.push(`${at}: missing field "${f}"`);
  }
  if (!(l.st >= 1 && l.st <= 5)) fail.push(`${at}: rating out of range`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(l.pub)) fail.push(`${at}: pub is not a yyyy-mm-dd date`);
  if (l.commit !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(l.commit)) fail.push(`${at}: commit is not a yyyy-mm-dd date`);
  for (const j of l.js || []) {
    if (!fs.existsSync(path.join(ROOT, 'vendor', j + '.js'))) fail.push(`${at}: vendor/${j}.js is missing`);
  }
  if (l.esm && !fs.existsSync(path.join(ROOT, 'vendor', l.esm))) fail.push(`${at}: vendor/${l.esm} is missing`);
  if (!l.ext && !(l.k in pinned) && !bundled[l.pkg])
    fail.push(`${at}: its build's version is in neither scripts/vendor-versions.json nor scripts/bundles/package.json`);
  if (!l.repo) fail.push(`${at}: missing field "repo" (GitHub owner/name, for the commit date)`);
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

/* ---- English only: no CJK text anywhere, vendor builds included ----
   (scripts/bundles/build.mjs writes vendor/ as ASCII.) */
const cjk = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.name === 'node_modules' || e.name === '.git') continue;
    if (e.isDirectory()) { walk(p); continue; }
    if (!/\.(m?js|css|html|md|yml|json|txt)$/.test(e.name)) continue;
    const text = fs.readFileSync(p, 'utf8');
    if (!cjk.test(text)) continue;
    const lines = text.split('\n');
    const at = lines.findIndex(l => cjk.test(l));
    fail.push(`${path.relative(ROOT, p)}:${at + 1} contains CJK text` +
              (lines.length > 1 ? '' : ' (minified file)'));
  }
}
walk(ROOT);

/* ---- report ---- */
for (const w of warn) console.log('warn  ' + w);
for (const f of fail) console.log('FAIL  ' + f);
console.log(`\n${LIBS.length} libraries · ${CATS.length} categories · ${registered.size} builders`);
if (fail.length) { console.log(`${fail.length} problem(s)`); process.exit(1); }
console.log('checks passed');
