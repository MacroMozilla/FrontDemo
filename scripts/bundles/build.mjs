/* Produces every file in vendor/ and the library stylesheets in
   assets/css/lib/ from the versions pinned in package.json, so the whole set
   can be rebuilt, or moved to new releases, from that file alone.

     cd scripts/bundles
     npm ci
     node build.mjs                  everything
     node build.mjs echarts xyflow   only these (a build is named after its file in vendor/)

   There are three kinds of build:

   - COPIED: the library publishes a browser build (a UMD or IIFE file that
     defines a global), and it is copied from the package as it is.
   - BUNDLED: the library only publishes ES modules, or its browser build
     differs from what npm users get (X6), so esbuild bundles it from an
     entry in entries/ into one file that defines one global.
   - The tasks at the end, for the few that need more than one file:
     Drawnix and Excalidraw as ES modules with lazily loaded chunks, KaTeX
     with its fonts, MapLibre and pdf.js with their workers.

   Every JavaScript file written is ASCII: non-ASCII characters in strings
   and regular expressions are written as \uXXXX escapes (see asciiOnly), so
   the code that runs is the same while the repository stays free of
   non-English text.

   SheetJS is installed from its own distribution, cdn.sheetjs.com, as its
   documentation says to: the npm package xlsx stopped at 0.18.5. Drawnix
   stopped publishing to npm in December 2025, so its source is cloned at the
   commit pinned below and compiled together with the Plait packages from
   package.json. Set DRAWNIX_SRC to reuse a checkout.

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

/* vendor/<name>.js, copied from the published browser build. */
const COPIED = {
  /* diagram editors and graphs */
  joint: '@joint/core/dist/joint.min.js',
  logicflow: '@logicflow/core/dist/index.min.js',
  'logicflow-ext': '@logicflow/extension/dist/index.min.js',
  vue: 'vue/dist/vue.global.prod.js',
  baklava: 'baklavajs/dist/bundle.js',
  g6: '@antv/g6/dist/g6.min.js',
  cytoscape: 'cytoscape/dist/cytoscape.min.js',
  visnetwork: 'vis-network/standalone/umd/vis-network.min.js',
  forcegraph: 'force-graph/dist/force-graph.min.js',
  fg3d: '3d-force-graph/dist/3d-force-graph.min.js',
  d3: 'd3/dist/d3.min.js',
  /* charts and grammars */
  echarts: 'echarts/dist/echarts.min.js',
  chartjs: 'chart.js/dist/chart.umd.min.js',
  g2: '@antv/g2/dist/g2.min.js',
  billboard: 'billboard.js/dist/billboard.pkgd.min.js',
  plotly: 'plotly.js-basic-dist-min/plotly-basic.min.js',
  chartist: 'chartist/dist/index.umd.js',
  lwcharts: 'lightweight-charts/dist/lightweight-charts.standalone.production.js',
  dygraph: 'dygraphs/dist/dygraph.min.js',
  uplot: 'uplot/dist/uPlot.iife.min.js',
  webglplot: 'webgl-plot/dist/webglplot.umd.js',
  vega: 'vega/build/vega.min.js',
  vegalite: 'vega-lite/build/vega-lite.min.js',
  vegaembed: 'vega-embed/build/vega-embed.min.js',
  plot: '@observablehq/plot/dist/plot.umd.min.js',
  /* canvas and creative coding */
  konva: 'konva/konva.min.js',
  fabric: 'fabric/dist/index.min.js',
  pixi: 'pixi.js/dist/pixi.min.js',
  paper: 'paper/dist/paper-full.min.js',
  svgjs: '@svgdotjs/svg.js/dist/svg.min.js',
  two: 'two.js/build/two.min.js',
  zrender: 'zrender/dist/zrender.min.js',
  p5: 'p5/lib/p5.min.js',
  matter: 'matter-js/build/matter.min.js',
  rough: 'roughjs/bundled/rough.js',
  /* maps, 3D and animation */
  leaflet: 'leaflet/dist/leaflet.js',
  deck: 'deck.gl/dist.min.js',
  ol: 'ol/dist/ol.js',
  l7: '@antv/l7/dist/l7.js',
  turf: '@turf/turf/turf.min.js',
  mol3d: '3dmol/build/3Dmol-min.js',
  gsap: 'gsap/dist/gsap.min.js',
  anime: 'animejs/dist/bundles/anime.umd.min.js',
  lottie: 'lottie-web/build/player/lottie.min.js',
  motion: 'motion/dist/motion.js',
  /* text to diagram, time, tables and documents */
  mermaid: 'mermaid/dist/mermaid.min.js',
  viz: '@viz-js/viz/dist/viz-global.js',
  wavedrom: 'wavedrom/wavedrom.min.js',
  'wavedrom-skin': 'wavedrom/skins/default.js',
  gantt: 'frappe-gantt/dist/frappe-gantt.umd.js',
  vistimeline: 'vis-timeline/standalone/umd/vis-timeline-graph2d.min.js',
  jsgantt: 'jsgantt-improved/dist/jsgantt.js',
  mindelixir: 'mind-elixir/dist/MindElixir.iife.js',
  aggrid: 'ag-grid-community/dist/ag-grid-community.min.js',
  tabulator: 'tabulator-tables/dist/js/tabulator.min.js',
  s2: '@antv/s2/dist/s2.min.js',
  jsbarcode: 'jsbarcode/dist/JsBarcode.all.min.js',
  jspdf: 'jspdf/dist/jspdf.umd.min.js',
  /* editors and interaction */
  quill: 'quill/dist/quill.js',
  marked: 'marked/lib/marked.umd.js',
  hljs: '@highlightjs/cdn-assets/highlight.min.js',
  sortable: 'sortablejs/Sortable.min.js',
  interact: 'interactjs/dist/interact.min.js',
  'floatingui-core': '@floating-ui/core/dist/floating-ui.core.umd.min.js',
  floatingui: '@floating-ui/dom/dist/floating-ui.dom.umd.min.js',
  swiper: 'swiper/swiper-bundle.min.js',
  driver: 'driver.js/dist/driver.js.iife.js',
  /* data and utilities */
  papaparse: 'papaparse/papaparse.min.js',
  xlsx: 'xlsx/dist/xlsx.full.min.js',
  dayjs: 'dayjs/dayjs.min.js',
  'dayjs-rel': 'dayjs/plugin/relativeTime.js',
  'dayjs-dur': 'dayjs/plugin/duration.js',
  'dayjs-utc': 'dayjs/plugin/utc.js',
  'dayjs-tz': 'dayjs/plugin/timezone.js',
  'dayjs-adv': 'dayjs/plugin/advancedFormat.js',
  lodash: 'lodash/lodash.min.js',
  chroma: 'chroma-js/dist/chroma.min.cjs',          /* a UMD file, despite the extension */
  mathjs: 'mathjs/lib/browser/math.js',
  dompurify: 'dompurify/dist/purify.min.js',
  ramda: 'ramda/dist/ramda.min.js',
  validator: 'validator/validator.min.js',
  jsyaml: 'js-yaml/dist/browser/js-yaml.umd.min.js',
  /* frameworks */
  alpine: 'alpinejs/dist/cdn.min.js',
  htmx: 'htmx.org/dist/htmx.min.js',
  jquery: 'jquery/dist/jquery.min.js',
  /* media and devices */
  wavesurfer: 'wavesurfer.js/dist/wavesurfer.min.js',
  'wavesurfer-regions': 'wavesurfer.js/dist/plugins/regions.min.js',
  tone: 'tone/build/Tone.js',
  cropper: 'cropperjs/dist/cropper.min.js',
  signaturepad: 'signature_pad/dist/signature_pad.umd.min.js',
  xterm: '@xterm/xterm/lib/xterm.js',
  'xterm-fit': '@xterm/addon-fit/lib/addon-fit.js',
  /* state and networking */
  xstate: 'xstate/dist/xstate.umd.min.js',
  mobx: 'mobx/dist/mobx.umd.production.min.js',
  rxjs: 'rxjs/dist/bundles/rxjs.umd.min.js',
  axios: 'axios/dist/axios.min.js',
  /* forms, overlays, scroll and layout */
  tomselect: 'tom-select/dist/js/tom-select.complete.min.js',
  imask: 'imask/dist/imask.min.js',
  nouislider: 'nouislider/dist/nouislider.min.js',
  pickr: '@simonwep/pickr/dist/pickr.min.js',
  sweetalert2: 'sweetalert2/dist/sweetalert2.all.min.js',
  photoswipe: 'photoswipe/dist/umd/photoswipe.umd.min.js',
  'photoswipe-lb': 'photoswipe/dist/umd/photoswipe-lightbox.umd.min.js',
  micromodal: 'micromodal/dist/micromodal.min.js',
  lenis: 'lenis/dist/lenis.min.js',
  simplebar: 'simplebar/dist/simplebar.min.js',
  /* text, storage, internationalization and search */
  handlebars: 'handlebars/dist/handlebars.min.js',
  markdownit: 'markdown-it/dist/browser/markdown-it.umd.min.js',
  jsdiff: 'diff/dist/diff.min.js',
  linkify: 'linkifyjs/dist/linkify.min.js',
  'linkify-html': 'linkify-html/dist/linkify-html.min.js',
  dexie: 'dexie/dist/dexie.min.js',
  comlink: 'comlink/dist/umd/comlink.min.js',
  filepond: 'filepond/dist/filepond.min.js',
  i18next: 'i18next/dist/umd/i18next.min.js',
  luxon: 'luxon/build/global/luxon.min.js',
  minisearch: 'minisearch/dist/umd/index.js',
  flexsearch: 'flexsearch/dist/flexsearch.bundle.min.js',
  /* games, delight, icons and keys */
  phaser: 'phaser/dist/phaser.min.js',
  howler: 'howler/dist/howler.min.js',
  confetti: 'canvas-confetti/dist/confetti.browser.js',
  countup: 'countup.js/dist/countUp.umd.js',
  lucide: 'lucide/dist/umd/lucide.min.js',
  feather: 'feather-icons/dist/feather.min.js',
  hotkeys: 'hotkeys-js/dist/hotkeys-js.min.js'
};

/* vendor/<name>.js, bundled by esbuild from entries/<name>.js into the global
   named here (null: the entry puts its globals on window itself). */
const BUNDLED = {
  xyflow: 'XYFlow',
  vueflow: 'VueFlowCore',
  meta2d: 'meta2djs',
  maxgraph: 'maxGraph',
  x6: 'X6',
  reagraph: 'Reagraph',
  sigma: 'SigmaLib',
  diagramjs: 'DJS',
  recharts: 'Recharts',
  freehand: 'Freehand',
  three: 'THREE',
  babylon: 'BABYLON',
  qrcode: 'QRCodeLib',
  codemirror: 'CM',
  datefns: 'DateFns',
  zod: 'Zod',
  lit: 'Lit',
  react: null,
  preact: null,
  fuse: null,
  zustand: 'Zustand',
  immer: 'Immer',
  nanostores: 'NanoStores',
  ky: 'KyNS',
  tanquery: 'TanQuery',
  tantable: 'TanTable',
  tanvirtual: 'TanVirtual',
  nanoid: 'NanoID',
  uuid: 'UUID',
  autoanimate: 'AutoAnimateNS',
  ajv: 'AjvNS'
};

/* Imports that a bundle takes from a global another file in vendor/ defines,
   instead of carrying a copy of its own: Vue Flow renders through the page's
   Vue, and two copies of Vue would not share reactivity. */
const SHARED = {
  vueflow: { vue: 'Vue' }
};

/* assets/css/lib/<name>.css, copied from the published stylesheet (several
   files are joined in order), built together with vendor/<name>.js. */
const STYLES = {
  xyflow: '@xyflow/react/dist/style.css',
  diagramjs: 'diagram-js/assets/diagram-js.css',
  logicflow: '@logicflow/core/dist/index.css',
  'logicflow-ext': '@logicflow/extension/dist/index.css',
  maxgraph: '@maxgraph/core/css/common.css',
  vueflow: ['@vue-flow/core/dist/style.css', '@vue-flow/core/dist/theme-default.css'],
  baklava: '@baklavajs/themes/dist/syrup-dark.css',
  billboard: 'billboard.js/dist/billboard.min.css',
  chartist: 'chartist/dist/index.css',
  dygraph: 'dygraphs/dist/dygraph.min.css',
  uplot: 'uplot/dist/uPlot.min.css',
  leaflet: 'leaflet/dist/leaflet.css',
  ol: 'ol/ol.css',
  gantt: 'frappe-gantt/dist/frappe-gantt.css',
  vistimeline: 'vis-timeline/dist/vis-timeline-graph2d.min.css',
  jsgantt: 'jsgantt-improved/dist/jsgantt.css',
  mindelixir: 'mind-elixir/dist/MindElixir.css',
  tabulator: 'tabulator-tables/dist/css/tabulator_midnight.min.css',
  quill: 'quill/dist/quill.snow.css',
  hljs: '@highlightjs/cdn-assets/styles/github-dark.min.css',
  swiper: 'swiper/swiper-bundle.min.css',
  driver: 'driver.js/dist/driver.css',
  xterm: '@xterm/xterm/css/xterm.css',
  tomselect: 'tom-select/dist/css/tom-select.min.css',
  nouislider: 'nouislider/dist/nouislider.min.css',
  pickr: '@simonwep/pickr/dist/themes/nano.min.css',
  photoswipe: 'photoswipe/dist/photoswipe.css',
  simplebar: 'simplebar/dist/simplebar.min.css',
  filepond: 'filepond/dist/filepond.min.css'
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
  const out = path.join(VENDOR, to);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, code);
  asciiOnly(out);
  report(out);
}

function plain(text) {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-').replace(/\u00a9/g, '(c)').replace(/\u00a0/g, ' ');
}

/* One stylesheet from one or more published ones, with Unix line endings
   (which is what git stores anyway). */
function copyCss(from, to, rewrite = (css) => css) {
  const css = [].concat(from).map(f => fs.readFileSync(path.join(NM, f), 'utf8').replace(/\r\n/g, '\n'));
  const out = path.join(CSS, to);
  fs.writeFileSync(out, rewrite(css.join('\n')));
  report(out);
}

function copyFiles(fromDir, toDir, keep = () => true) {
  let n = 0;
  for (const f of fs.readdirSync(path.join(NM, fromDir), { recursive: true })) {
    const src = path.join(NM, fromDir, f);
    if (!fs.statSync(src).isFile() || !keep(f)) continue;
    fs.mkdirSync(path.dirname(path.join(toDir, f)), { recursive: true });
    fs.copyFileSync(src, path.join(toDir, f));
    n++;
  }
  console.log('          + ' + n + ' files in ' + path.relative(ROOT, toDir) + '/');
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

/* Resolves the named imports to globals (see SHARED). */
function fromGlobals(map) {
  const filter = new RegExp('^(' + Object.keys(map).map(k => k.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')).join('|') + ')$');
  return {
    name: 'from-globals',
    setup(build) {
      build.onResolve({ filter }, (args) => ({ path: args.path, namespace: 'from-globals' }));
      build.onLoad({ filter: /.*/, namespace: 'from-globals' }, (args) => ({
        contents: 'module.exports = globalThis[' + JSON.stringify(map[args.path]) + '];', loader: 'js'
      }));
    }
  };
}

async function iife(entry, globalName, out, shared) {
  const outfile = path.join(VENDOR, out);
  await esbuild.build({
    entryPoints: [path.join(HERE, 'entries', entry)],
    bundle: true, format: 'iife', minify: true, target: 'es2020', charset: 'ascii',
    ...(globalName ? { globalName } : {}),
    plugins: shared ? [fromGlobals(shared)] : [],
    define, outfile, logLevel: 'warning'
  });
  asciiOnly(outfile);
  report(outfile);
}

/* An ES-module build with lazily loaded chunks, in a folder of its own. */
async function esmSplit(entry, dir, extra = {}) {
  const outdir = path.join(VENDOR, dir);
  fs.rmSync(outdir, { recursive: true, force: true });
  await esbuild.build({
    entryPoints: { [dir]: path.join(HERE, 'entries', entry) },
    bundle: true, format: 'esm', splitting: true, minify: true, target: 'es2020', charset: 'ascii',
    outdir, chunkNames: 'chunks/[name]-[hash]', define, logLevel: 'error', ...extra
  });
  for (const f of fs.readdirSync(outdir, { recursive: true })) {
    if (f.endsWith('.js')) asciiOnly(path.join(outdir, f));
  }
  report(path.join(outdir, dir + '.js'));
  const chunks = fs.existsSync(path.join(outdir, 'chunks')) ? fs.readdirSync(path.join(outdir, 'chunks')).length : 0;
  console.log('          + ' + chunks + ' lazily loaded chunks in vendor/' + dir + '/chunks/');
  return outdir;
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

const TASKS = {};
for (const [name, from] of Object.entries(COPIED)) {
  TASKS[name] = async () => {
    copyJs(from, name + '.js');
    if (STYLES[name]) copyCss(STYLES[name], name + '.css');
  };
}
for (const [name, globalName] of Object.entries(BUNDLED)) {
  TASKS[name] = async () => {
    await iife(name + '.js', globalName, name + '.js', SHARED[name]);
    if (STYLES[name]) copyCss(STYLES[name], name + '.css');
  };
}

Object.assign(TASKS, {
  async drawnix() {
    const src = drawnixSource();
    /* Drawnix's sources import their dependencies (and one stylesheet reaches
       into node_modules by relative path), so give the checkout ours. */
    const link = path.join(src, 'node_modules');
    if (!fs.existsSync(link)) fs.symlinkSync(NM, link, 'dir');
    const outdir = await esmSplit('drawnix.js', 'drawnix', {
      tsconfig: path.join(src, 'tsconfig.base.json'), jsx: 'automatic', plugins: [sassPlugin()]
    });
    fs.renameSync(path.join(outdir, 'drawnix.css'), path.join(CSS, 'drawnix.css'));
    report(path.join(CSS, 'drawnix.css'));
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

  /* Excalidraw only publishes ES modules. Its fonts are served from
     vendor/excalidraw/fonts/ (see entries/excalidraw.js), except the 13 MB
     Chinese, Japanese and Korean one, which it fetches from its CDN when such
     text is typed; its stylesheet's own fonts are pointed there too. */
  async excalidraw() {
    const outdir = await esmSplit('excalidraw.js', 'excalidraw');
    copyFiles('@excalidraw/excalidraw/dist/prod/fonts', path.join(outdir, 'fonts'), f => !f.startsWith('Xiaolai'));
    copyCss('@excalidraw/excalidraw/dist/prod/index.css', 'excalidraw.css',
      css => css.replace(/url\((["']?)\.\/fonts\//g, 'url($1../../../vendor/excalidraw/fonts/'));
  },

  async katex() {
    copyJs('katex/dist/katex.min.js', 'katex.js');
    copyCss('katex/dist/katex.min.css', 'katex.css');
    /* Every browser the site supports takes WOFF2, the first format listed. */
    copyFiles('katex/dist/fonts', path.join(CSS, 'fonts'), f => f.endsWith('.woff2'));
  },

  /* MapLibre 6 only publishes ES modules: the map and its worker. */
  async maplibre() {
    copyJs('maplibre-gl/dist/maplibre-gl.mjs', 'maplibre/maplibre-gl.js');
    copyJs('maplibre-gl/dist/maplibre-gl-worker.mjs', 'maplibre/maplibre-gl-worker.js');
    copyCss('maplibre-gl/dist/maplibre-gl.css', 'maplibre.css');
  },

  /* pdf.js only publishes ES modules since version 4; the page gets the
     library as the global pdfjsLib, as before, and the worker as it is. Both
     are its legacy build (see entries/pdfjs.js). */
  async pdfjs() {
    await iife('pdfjs.js', 'pdfjsLib', 'pdfjs.js');
    copyJs('pdfjs-dist/legacy/build/pdf.worker.min.mjs', 'pdfjs.worker.js');
  }
});

const only = process.argv.slice(2);
for (const name of only) if (!TASKS[name]) { console.error('unknown build: ' + name); process.exit(1); }
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
