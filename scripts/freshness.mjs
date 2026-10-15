/* Refreshes the "last update" facts in assets/js/data.js:

     ver     latest version on npm (draw.io: latest GitHub release tag)
     pub     when that version was published
     commit  date of the newest commit on the repository's main line
     vend    the version actually running here, when it is not ver
     kb      size of the files the demo loads, for builds made by
             scripts/bundles (pinned builds keep the size recorded for them)

   and window.CHECKED, the day the facts were last looked up.

   The version running here comes from scripts/bundles/package.json for
   the builds scripts/bundles makes, and from scripts/vendor-versions.json
   for the pinned builds copied into vendor/ as published. Replace a pinned
   build, and update its entry there.

     node scripts/freshness.mjs           print what is current
     node scripts/freshness.mjs --write   also rewrite data.js (then run readme.mjs)

   Needs network access to registry.npmjs.org and github.com, and git. */
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
const pinned = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/vendor-versions.json'), 'utf8'));

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
  const dir = path.join(tmp, repo.replace('/', '_') + '_' + ref.replace(/\W/g, ''));
  await git('init', '-q', '--bare', dir);
  await git('-C', dir, 'fetch', '-q', '--depth', '1', '--filter=tree:0', 'https://github.com/' + repo + '.git', ref);
  return git('-C', dir, 'log', '-1', '--format=%cs', 'FETCH_HEAD');
}

/* The newest commit on the repository's main line: HEAD, main or master,
   whichever is newest, because a repository can point HEAD at an old
   branch (sigma.js's HEAD is archive/v0.1, last touched in 2014). */
async function newestCommit(repo) {
  const seen = new Set(), dates = [];
  for (const line of (await git('ls-remote', 'https://github.com/' + repo + '.git', 'HEAD', 'refs/heads/main', 'refs/heads/master')).split('\n')) {
    const [sha, ref] = line.split('\t');
    if (!ref || seen.has(sha)) continue;
    seen.add(sha);
    dates.push(await commitDate(repo, ref));
  }
  return dates.sort().pop() || '';
}

/* draw.io is not on npm: its releases are vX.Y.Z tags on GitHub. */
async function latestTag(repo) {
  const tags = (await git('ls-remote', '--tags', '--refs', 'https://github.com/' + repo + '.git'))
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
  const running = l.k in pinned ? pinned[l.k] : pins[l.pkg];
  r.vend = running && running !== r.ver ? running : '';
  /* An embedded app is measured by hand, and a pinned build never changes. */
  r.kb = l.ext || l.k in pinned ? l.kb : sizeKb(l);
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
