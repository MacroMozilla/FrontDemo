/* Refreshes the "last update" facts in assets/js/data.js:

     ver     latest version on npm (a library marked npm:false, such as
             draw.io or SheetJS: the latest vX.Y.Z tag in its repository)
     pub     when that version was published
     commit  date of the newest commit on the repository's main line
     vend    the version actually running here, when it is not ver
     kb      size of the files the demo loads (an embedded app: the size
             recorded for it)

   and window.CHECKED, the day the facts were last looked up.

   The version running here is the one scripts/bundles/package.json pins,
   since scripts/bundles builds everything in vendor/: the pin of the
   library's package, or of the package named in its dist field when the
   browser build comes from another one (highlight.js publishes its browser
   build as @highlightjs/cdn-assets).

     node scripts/freshness.mjs           print what is current
     node scripts/freshness.mjs --write   also rewrite data.js (then run readme.mjs)

   Needs network access to registry.npmjs.org and to the repositories, and git. */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA = path.join(ROOT, 'assets/js/data.js');
const write = process.argv.includes('--write');

const win = {};
new Function('window', fs.readFileSync(DATA, 'utf8'))(win);
const pins = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/bundles/package.json'), 'utf8')).dependencies;

/* A pin is a version, or the URL of a tarball named after its version
   (SheetJS installs from cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz). */
const pinnedVersion = (pin) => pin && (/-(\d+\.\d+\.\d+[^/]*)\.tgz$/.exec(pin) || [, pin])[1];

/* A repository is a GitHub owner/name, or the URL of any git host. */
const repoUrl = (repo) => /^https?:/.test(repo) ? repo : 'https://github.com/' + repo + '.git';

/* Helper builds a demo loads that are not part of the library it shows. */
const HELPERS = new Set(['d3']);

const day = (iso) => iso.slice(0, 10);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fd-fresh-'));
const run = promisify(execFile);
const git = async (...args) => (await run('git', args, { encoding: 'utf8', maxBuffer: 64 << 20 })).stdout.trim();

async function npmLatest(pkg) {
  const res = await fetch('https://registry.npmjs.org/' + pkg.replace('/', '%2F'));
  if (!res.ok) throw new Error(pkg + ': registry answered ' + res.status);
  const j = await res.json();
  const ver = j['dist-tags'].latest;
  return { ver, pub: day(j.time[ver]) };
}

/* The date of the commit a ref points at: just that commit is fetched,
   without history, trees or files. */
async function commitDate(repo, ref) {
  const dir = path.join(tmp, repo.replace(/\W/g, '_') + '_' + ref.replace(/\W/g, ''));
  await git('init', '-q', '--bare', dir);
  await git('-C', dir, 'fetch', '-q', '--depth', '1', '--filter=tree:0', repoUrl(repo), ref);
  return git('-C', dir, 'log', '-1', '--format=%cs', 'FETCH_HEAD');
}

/* The newest commit on the repository's main line: HEAD, main or master,
   whichever is newest, because a repository can point HEAD at an old
   branch (sigma.js's HEAD is archive/v0.1, last touched in 2014). */
async function newestCommit(repo) {
  const seen = new Set(), dates = [];
  for (const line of (await git('ls-remote', repoUrl(repo), 'HEAD', 'refs/heads/main', 'refs/heads/master')).split('\n')) {
    const [sha, ref] = line.split('\t');
    if (!ref || seen.has(sha)) continue;
    seen.add(sha);
    dates.push(await commitDate(repo, ref));
  }
  return dates.sort().pop() || '';
}

/* draw.io is not on npm, and SheetJS left it: their releases are vX.Y.Z tags. */
async function latestTag(repo) {
  const tags = (await git('ls-remote', '--tags', '--refs', repoUrl(repo)))
    .split('\n').map(l => l.split('refs/tags/')[1]).filter(t => /^v\d+\.\d+\.\d+$/.test(t));
  tags.sort((a, b) => {
    const x = a.slice(1).split('.').map(Number), y = b.slice(1).split('.').map(Number);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
  });
  const tag = tags[tags.length - 1];
  return { ver: tag.slice(1), pub: await commitDate(repo, 'refs/tags/' + tag) };
}

function sizeKb(l) {
  const files = (l.js || []).filter(j => !HELPERS.has(j)).map(j => 'vendor/' + j + '.js')
    .concat(l.esm ? ['vendor/' + l.esm] : [])
    .concat((l.css || []).map(c => 'assets/css/lib/' + c + '.css'));
  return Math.round(files.reduce((s, f) => s + fs.statSync(path.join(ROOT, f)).size, 0) / 1024);
}

async function look(l) {
  const r = { k: l.k, n: l.n };
  try {
    Object.assign(r, l.npm === false ? await latestTag(l.repo) : await npmLatest(l.pkg));
    r.commit = l.repo ? await newestCommit(l.repo) : '';
  } catch (e) {
    console.error('  ' + l.k + ': ' + String(e.message).split('\n')[0]);
    Object.assign(r, { ver: l.ver, pub: l.pub, commit: l.commit || '' });
  }
  const running = pinnedVersion(pins[l.dist || l.pkg]);
  r.vend = running && running !== r.ver ? running : '';
  /* An embedded app is measured by hand. */
  r.kb = l.ext ? l.kb : sizeKb(l);
  return r;
}

/* Eight lookups at a time; results keep the registry's order. */
const rows = new Array(win.LIBS.length);
let next = 0;
await Promise.all(Array.from({ length: 8 }, async () => {
  while (next < win.LIBS.length) { const i = next++; rows[i] = await look(win.LIBS[i]); }
}));
fs.rmSync(tmp, { recursive: true, force: true });
for (const r of rows) {
  console.log(r.k.padEnd(11) + r.n.padEnd(22) + r.ver.padEnd(12) + r.pub + '  commit ' + (r.commit || '—') +
              (r.vend ? '  running ' + r.vend : '') + '  ' + r.kb + ' KB');
}

if (write) {
  let src = fs.readFileSync(DATA, 'utf8');
  for (const r of rows) {
    const start = src.indexOf('{ k:"' + r.k + '",');
    const end = src.indexOf('\n', start);
    let line = src.slice(start, end)
      .replace(/ vend:"[^"]*",/, '')
      .replace(/ commit:"[^"]*",/, '')
      .replace(/ver:"[^"]*",/, 'ver:"' + r.ver + '",' + (r.vend ? ' vend:"' + r.vend + '",' : ''))
      .replace(/pub:"[^"]*",/, 'pub:"' + r.pub + '",' + (r.commit ? ' commit:"' + r.commit + '",' : ''))
      .replace(/kb:\d+,/, 'kb:' + r.kb + ',');
    src = src.slice(0, start) + line + src.slice(end);
  }
  const today = new Date().toISOString().slice(0, 10);
  src = src.replace(/window\.CHECKED = "[^"]*";/, 'window.CHECKED = "' + today + '";');
  fs.writeFileSync(DATA, src);
  console.log('\ndata.js updated; checked ' + today + '. Now run: node scripts/readme.mjs');
}
