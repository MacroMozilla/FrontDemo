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

/* scripts/bundles builds everything in vendor/, so its package.json records
   the version running here (see scripts/freshness.mjs). */
const bundled = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/bundles/package.json'), 'utf8')).dependencies;
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
  if (!l.ext && !bundled[l.dist || l.pkg])
    fail.push(`${at}: ${l.dist || l.pkg} is not pinned in scripts/bundles/package.json`);
  /* A library installed from somewhere other than npm says how, and says
     the same thing as the pin. */
  if (l.install && !l.install.endsWith(' ' + bundled[l.pkg]))
    fail.push(`${at}: install command "${l.install}" does not match the pin ${bundled[l.pkg]}`);
  if (!l.repo) fail.push(`${at}: missing field "repo" (GitHub owner/name or a git URL, for the commit date)`);
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

/* ---- every file in vendor/ and assets/css/lib/ is loaded by some page ----
   A library's js, css and esm files, plus what a demo or the shell asks for
   by name (need("d3"), ctx.css("filepond")) or by path ("vendor/x.js"). */
const shellSrc = fs.readFileSync(path.join(ROOT, 'assets/js/app.js'), 'utf8');
const usedJs = new Set(), usedCss = new Set(), usedPaths = new Set();
for (const l of LIBS) {
  (l.js || []).forEach(j => usedJs.add(j));
  (l.css || []).forEach(c => usedCss.add(c));
  if (l.esm) usedPaths.add(path.dirname(l.esm) === '.' ? l.esm : path.dirname(l.esm) + '/');
}
for (const src of [shellSrc, demoSrcAll()]) {
  for (const m of src.matchAll(/\bneed\("([\w-]+)"\)/g)) usedJs.add(m[1]);
  for (const m of src.matchAll(/\bcss\("([\w-]+)"\)/g)) usedCss.add(m[1]);
  for (const m of src.matchAll(/vendor\/([\w./-]+?\.js)\b/g)) usedPaths.add(m[1].includes('/') ? m[1].split('/')[0] + '/' : m[1]);
}
function demoSrcAll() {
  return fs.readdirSync(path.join(ROOT, 'assets/js/demos')).filter(f => f.endsWith('.js'))
    .map(f => fs.readFileSync(path.join(ROOT, 'assets/js/demos', f), 'utf8')).join('\n');
}
for (const e of fs.readdirSync(path.join(ROOT, 'vendor'), { withFileTypes: true })) {
  const used = e.isDirectory() ? usedPaths.has(e.name + '/') : usedJs.has(e.name.replace(/\.js$/, '')) || usedPaths.has(e.name);
  if (!used) warn.push(`vendor/${e.name}${e.isDirectory() ? '/' : ''} is not loaded by any page`);
}
for (const f of fs.readdirSync(path.join(ROOT, 'assets/css/lib'))) {
  if (f.endsWith('.css') && !usedCss.has(f.slice(0, -4))) warn.push(`assets/css/lib/${f} is not loaded by any page`);
}

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
