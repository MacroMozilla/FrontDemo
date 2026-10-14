/* Produces the vendor/ builds of the diagram frameworks, so every file in
   vendor/ for that category can be regenerated from package.json alone.

     cd scripts/bundles
     npm ci --legacy-peer-deps
     node build.mjs                 everything
     node build.mjs xyflow drawnix  only these

   Two libraries publish a browser build that works as documented (JointJS,
   LogicFlow); those are copied byte for byte. The others only publish ES
   modules, or a browser build that differs from what npm users get (X6),
   so esbuild bundles them from the entries/ folder.

   Drawnix's npm package is a year behind its repository, so its source is
   cloned at the commit pinned below and compiled together with the Plait
   packages from package.json. Set DRAWNIX_SRC to reuse a checkout.

   draw.io is not here at all: the demo embeds the official editor from
   embed.diagrams.net, which is how draw.io documents integration. */
import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const NM = path.join(HERE, 'node_modules');
const VENDOR = path.join(ROOT, 'vendor');
const CSS = path.join(ROOT, 'assets/css/lib');

const DRAWNIX = {
  repo: 'https://github.com/plait-board/drawnix.git',
  commit: 'b138ff867943ddff6c4c79560e10ab6ee3b5600e'     /* 2026-09-07 */
};

const define = { 'process.env.NODE_ENV': '"production"', global: 'globalThis' };

function copy(from, to) {
  fs.copyFileSync(path.join(NM, from), to);
  report(to);
}

function report(file) {
  const kb = fs.statSync(file).size / 1024;
  console.log('  ' + (kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb.toFixed(0) + ' KB').padStart(8) +
              '  ' + path.relative(ROOT, file));
}

async function iife(entry, globalName, out) {
  const outfile = path.join(VENDOR, out);
  await esbuild.build({
    entryPoints: [path.join(HERE, 'entries', entry)],
    bundle: true, format: 'iife', globalName, minify: true, target: 'es2020',
    define, outfile, logLevel: 'warning'
  });
  report(outfile);
}

function drawnixSource() {
  if (process.env.DRAWNIX_SRC) return path.resolve(process.env.DRAWNIX_SRC);
  const dir = path.join(os.tmpdir(), 'frontdemo-drawnix-' + DRAWNIX.commit.slice(0, 7));
  if (!fs.existsSync(path.join(dir, 'packages/drawnix'))) {
    fs.rmSync(dir, { recursive: true, force: true });
    execFileSync('git', ['init', '-q', dir]);
    execFileSync('git', ['-C', dir, 'fetch', '-q', '--depth', '1', DRAWNIX.repo, DRAWNIX.commit]);
    execFileSync('git', ['-C', dir, 'checkout', '-q', 'FETCH_HEAD']);
  }
  return dir;
}

const TASKS = {
  joint() {
    copy('@joint/core/dist/joint.min.js', path.join(VENDOR, 'joint.js'));
  },

  async x6() {
    await iife('x6.js', 'X6', 'x6.js');
  },

  logicflow() {
    copy('@logicflow/core/dist/index.min.js', path.join(VENDOR, 'logicflow.js'));
    copy('@logicflow/extension/dist/index.min.js', path.join(VENDOR, 'logicflow-ext.js'));
    copy('@logicflow/core/dist/index.css', path.join(CSS, 'logicflow.css'));
    copy('@logicflow/extension/dist/index.css', path.join(CSS, 'logicflow-ext.css'));
  },

  async maxgraph() {
    await iife('maxgraph.js', 'maxGraph', 'maxgraph.js');
    copy('@maxgraph/core/css/common.css', path.join(CSS, 'maxgraph.css'));
  },

  async xyflow() {
    await iife('xyflow.js', 'XYFlow', 'xyflow.js');
    copy('@xyflow/react/dist/style.css', path.join(CSS, 'xyflow.css'));
  },

  async meta2d() {
    await iife('meta2d.js', 'meta2djs', 'meta2d.js');
  },

  async flowgram() {
    await iife('flowgram.js', 'FlowGram', 'flowgram.js');
    /* The editor's own stylesheet, then the starter template's, which styles
       the node cards and side panel the demo reuses. */
    const css = path.join(CSS, 'flowgram.css');
    fs.writeFileSync(css,
      fs.readFileSync(path.join(NM, '@flowgram.ai/free-layout-editor/index.css'), 'utf8') + '\n' +
      fs.readFileSync(path.join(HERE, 'entries/flowgram-starter.css'), 'utf8'));
    report(css);
  },

  async drawnix() {
    const src = drawnixSource();
    /* Drawnix's sources import their dependencies (and one stylesheet reaches
       into node_modules by relative path), so give the checkout ours. */
    const link = path.join(src, 'node_modules');
    if (!fs.existsSync(link)) fs.symlinkSync(NM, link, 'dir');

    const outdir = path.join(VENDOR, 'drawnix');
    fs.rmSync(outdir, { recursive: true, force: true });
    await esbuild.build({
      entryPoints: { drawnix: path.join(HERE, 'entries/drawnix.js') },
      bundle: true, format: 'esm', splitting: true, minify: true, target: 'es2020',
      outdir, chunkNames: 'chunks/[name]-[hash]',
      tsconfig: path.join(src, 'tsconfig.base.json'),
      jsx: 'automatic', define, logLevel: 'error',
      plugins: [sassPlugin()]
    });
    fs.renameSync(path.join(outdir, 'drawnix.css'), path.join(CSS, 'drawnix.css'));
    report(path.join(outdir, 'drawnix.js'));
    report(path.join(CSS, 'drawnix.css'));
    const chunks = fs.readdirSync(path.join(outdir, 'chunks'));
    console.log('          + ' + chunks.length + ' lazily loaded chunks in vendor/drawnix/chunks/');
  }
};

const only = process.argv.slice(2);
for (const name of only) if (!TASKS[name]) { console.error('unknown bundle: ' + name); process.exit(1); }
for (const [name, run] of Object.entries(TASKS)) {
  if (only.length && !only.includes(name)) continue;
  console.log(name);
  await run();
}
