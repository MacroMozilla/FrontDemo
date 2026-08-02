/* Regenerates the "Every library" tables in README.md from assets/js/data.js,
   so the registry stays the single source of truth. Run it after adding a
   library; scripts/check.mjs fails the build if the README is stale. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* data.js is a browser file that assigns onto window. */
const sandbox = { window: {} };
const src = fs.readFileSync(path.join(ROOT, 'assets/js/data.js'), 'utf8');
new Function('window', src)(sandbox.window);
const { GROUPS, CATS, LIBS } = sandbox.window;

const START = '<!-- LIBRARY-TABLES:START -->';
const END = '<!-- LIBRARY-TABLES:END -->';

const RN = { y: '✓', p: '◐', n: '✗' };

function size(kb) {
  return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
}
function esc(s) {
  return String(s).replace(/\|/g, '\\|');
}

const out = [];
for (const grp of GROUPS) {
  out.push('### ' + grp.name, '');
  for (const cat of CATS.filter((c) => c.g === grp.id)) {
    const libs = LIBS.filter((l) => l.cat === cat.id);
    if (!libs.length) continue;
    out.push('#### ' + cat.name + ' (' + libs.length + ')', '');
    out.push('| Library | npm | Pick | License | Size | RN | What it is |');
    out.push('|---|---|---|---|---|:--:|---|');
    for (const l of libs) {
      const rn = RN[l.c.split(/\s+/)[6]] || '?';
      out.push('| **' + esc(l.n) + '** | `' + esc(l.pkg) + '` | ' + '★'.repeat(l.st) +
        ' | ' + esc(l.lic) + ' | ' + size(l.kb) + ' | ' + rn + ' | ' + esc(l.what) + ' |');
    }
    out.push('');
  }
}

const readmePath = path.join(ROOT, 'README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
const a = readme.indexOf(START), b = readme.indexOf(END);
if (a < 0 || b < 0) {
  console.error('README.md is missing the ' + START + ' / ' + END + ' markers.');
  process.exit(1);
}

const block = START + '\n\n' + out.join('\n').trimEnd() + '\n\n' + END;
const next = readme.slice(0, a) + block + readme.slice(b + END.length);

if (process.argv.includes('--check')) {
  if (next !== readme) {
    console.error('README.md library tables are stale — run `node scripts/readme.mjs`.');
    process.exit(1);
  }
  console.log('README library tables are up to date (' + LIBS.length + ' libraries).');
} else {
  fs.writeFileSync(readmePath, next);
  console.log('README.md regenerated: ' + LIBS.length + ' libraries in ' +
    CATS.filter((c) => LIBS.some((l) => l.cat === c.id)).length + ' categories.');
}
