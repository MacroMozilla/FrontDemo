/* Produces the vendor/ builds of the diagram editors and graph libraries
   (and the stylesheets that go with them), so each can be regenerated from
   package.json alone. Every other file in vendor/ is a pinned browser build,
   copied as its library published it; the ascii task below keeps those
   free of CJK text too.

     cd scripts/bundles
     npm ci
     node build.mjs                 everything
     node build.mjs xyflow drawnix  only these
     node build.mjs ascii           only escape CJK text in pinned builds

   Libraries that publish a browser build that works as documented are
   copied from their dist/ folder. The others only publish ES modules, or a
   browser build that differs from what npm users get (X6), so esbuild
   bundles them from the entries/ folder.

   Every file written to vendor/ is ASCII: non-ASCII characters in strings
   and regular expressions are written as \uXXXX escapes (see asciiOnly),
   so the code that runs is the same while the repository stays free of
   non-English text. Pinned builds that contain CJK text get the same
   treatment from the ascii task.

   Drawnix stopped publishing to npm in December 2025, so its source is
   cloned at the commit pinned below and compiled together with the Plait
   packages from package.json. Set DRAWNIX_SRC to reuse a checkout.

   draw.io is not here at all: the demo embeds the official editor from
   embed.diagrams.net, which is how draw.io documents integration. The
   highlight.js file used by the source panel is a pinned file, not built. */
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
const CJK = /[\u3000-\u303f\u3400-\u4dbf\u4e00-\u9fff\uff00-\uffef]/;

function report(file) {
  const kb = fs.statSync(file).size / 1024;
  console.log('  ' + (kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb.toFixed(0) + ' KB').padStart(8) +
              '  ' + path.relative(ROOT, file));
}

/* A published browser build, byte for byte, except that non-ASCII characters
   are escaped (see asciiOnly), the typographic quotes and dashes in the
   licence header it opens with are made plain, and a source-map link to a
   file that is not shipped is dropped. */
function copyJs(from, to) {
  let code = fs.readFileSync(path.join(NM, from), 'utf8');
  const head = code.match(/^(?:\s*(?:\/\*[\s\S]*?\*\/|\/\/[^\n]*))*/)[0];
  code = plain(head) + code.slice(head.length).replace(/\n?\/\/# sourceMappingURL=\S+\s*$/, '\n');
  fs.writeFileSync(path.join(VENDOR, to), code);
  asciiOnly(path.join(VENDOR, to));
  report(path.join(VENDOR, to));
}

function plain(text) {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-').replace(/\u00a9/g, '(c)').replace(/\u00a0/g, ' ');
}

function copyCss(from, to) {
  fs.copyFileSync(path.join(NM, from), path.join(CSS, to));
  report(path.join(CSS, to));
}

/* Writes every non-ASCII character in a file as a \uXXXX escape. In a
   string, a template, a regular expression, an identifier or a comment that
   is the same character; only a tag function that reads a template's raw
   text would see the difference. esbuild's charset: 'ascii' already escapes
   the bundles, except in regular-expression literals and tagged templates,
   which it leaves as written. A non-ASCII character right after a backslash
   is left alone (escaping it would change its meaning); the check at the end
   of this script would flag it. */
function asciiOnly(file) {
  const code = fs.readFileSync(file, 'utf8');
  const out = code.replace(/(?<!\\)[^\x00-\x7f]/gu, (ch) => {
    const cp = ch.codePointAt(0);
    if (cp <= 0xffff) return '\\u' + cp.toString(16).padStart(4, '0');
    const hi = 0xd800 + ((cp - 0x10000) >> 10), lo = 0xdc00 + ((cp - 0x10000) & 0x3ff);
    return '\\u' + hi.toString(16) + '\\u' + lo.toString(16);
  });
  if (out !== code) fs.writeFileSync(file, out);
}

async function iife(entry, globalName, out) {
  const outfile = path.join(VENDOR, out);
  await esbuild.build({
    entryPoints: [path.join(HERE, 'entries', entry)],
    bundle: true, format: 'iife', globalName, minify: true, target: 'es2020', charset: 'ascii',
    define, outfile, logLevel: 'warning'
  });
  asciiOnly(outfile);
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
  /* ---- diagram & flow editors ---- */
  async xyflow() {
    await iife('xyflow.js', 'XYFlow', 'xyflow.js');
    copyCss('@xyflow/react/dist/style.css', 'xyflow.css');
  },

  async meta2d() {
    await iife('meta2d.js', 'meta2djs', 'meta2d.js');
  },

  async joint() {
    await copyJs('@joint/core/dist/joint.min.js', 'joint.js');
  },

  async logicflow() {
    await copyJs('@logicflow/core/dist/index.min.js', 'logicflow.js');
    await copyJs('@logicflow/extension/dist/index.min.js', 'logicflow-ext.js');
    copyCss('@logicflow/core/dist/index.css', 'logicflow.css');
    copyCss('@logicflow/extension/dist/index.css', 'logicflow-ext.css');
  },

  async maxgraph() {
    await iife('maxgraph.js', 'maxGraph', 'maxgraph.js');
    copyCss('@maxgraph/core/css/common.css', 'maxgraph.css');
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
      bundle: true, format: 'esm', splitting: true, minify: true, target: 'es2020', charset: 'ascii',
      outdir, chunkNames: 'chunks/[name]-[hash]',
      tsconfig: path.join(src, 'tsconfig.base.json'),
      jsx: 'automatic', define, logLevel: 'error',
      plugins: [sassPlugin()]
    });
    fs.renameSync(path.join(outdir, 'drawnix.css'), path.join(CSS, 'drawnix.css'));
    for (const f of fs.readdirSync(outdir, { recursive: true })) {
      if (f.endsWith('.js')) asciiOnly(path.join(outdir, f));
    }
    report(path.join(outdir, 'drawnix.js'));
    report(path.join(CSS, 'drawnix.css'));
    const chunks = fs.readdirSync(path.join(outdir, 'chunks'));
    console.log('          + ' + chunks.length + ' lazily loaded chunks in vendor/drawnix/chunks/');
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

  async x6() {
    await iife('x6.js', 'X6', 'x6.js');
  },

  /* ---- graphs & networks ---- */
  async g6() {
    await copyJs('@antv/g6/dist/g6.min.js', 'g6.js');
  },

  async cytoscape() {
    await copyJs('cytoscape/dist/cytoscape.min.js', 'cytoscape.js');
  },

  async visnetwork() {
    await copyJs('vis-network/standalone/umd/vis-network.min.js', 'visnetwork.js');
  },

  async forcegraph() {
    await copyJs('force-graph/dist/force-graph.min.js', 'forcegraph.js');
  },

  async reagraph() {
    await iife('reagraph.js', 'Reagraph', 'reagraph.js');
  },

  async sigma() {
    await iife('sigma.js', 'SigmaLib', 'sigma.js');
  },

  async fg3d() {
    await copyJs('3d-force-graph/dist/3d-force-graph.min.js', 'fg3d.js');
  },

  async d3() {
    await copyJs('d3/dist/d3.min.js', 'd3.js');
  },

  /* ---- pinned builds ---- */
  async ascii() {
    for (const f of fs.readdirSync(VENDOR)) {
      const file = path.join(VENDOR, f);
      if (!f.endsWith('.js') || !CJK.test(fs.readFileSync(file, 'utf8'))) continue;
      asciiOnly(file);
      report(file);
    }
  }
};

const only = process.argv.slice(2);
for (const name of only) if (!TASKS[name]) { console.error('unknown bundle: ' + name); process.exit(1); }
for (const [name, run] of Object.entries(TASKS)) {
  if (only.length && !only.includes(name)) continue;
  console.log(name);
  await run();
}

/* Nothing non-English may reach vendor/ or the stylesheets. */
const leaks = [];
for (const dir of [VENDOR, CSS]) {
  for (const f of fs.readdirSync(dir, { recursive: true })) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isFile() && /\.(js|css)$/.test(p) && CJK.test(fs.readFileSync(p, 'utf8'))) leaks.push(path.relative(ROOT, p));
  }
}
if (leaks.length) { console.error('CJK text left in: ' + leaks.join(', ')); process.exit(1); }
