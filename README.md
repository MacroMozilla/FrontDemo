# FrontDemo

**Nine diagram and flow editor frameworks drawing the same flowchart in their out-of-the-box form,
plus seven graph visualization libraries. Every one is running in the page.**

Live: <https://macromozilla.github.io/FrontDemo/>

---

## What it is for

Picking a diagram framework from README files and feature lists tells you very little about how it
feels to use. This site puts the candidates side by side instead: each framework gets a page where it
draws **the same approval flowchart** with nothing but what it ships — its stock shapes, its default
theme, its own toolbars and panels — so you can drag things around, wire up new edges, undo, delete,
and then read the exact code it took.

The site has two sections, the two halves of "graph" work:

| Section | What it holds |
|---|---|
| **Diagram & flow editors** (graph editing) | React Flow · meta2d.js · JointJS · LogicFlow · maxGraph · draw.io · Plait / Drawnix · FlowGram · AntV X6 — in the order of the brief they came from |
| **Graphs & networks** (graph visualization) | AntV G6 · Cytoscape.js · vis-network · force-graph · Reagraph · Sigma.js · 3d-force-graph |

## The flowchart, and what "default form" means

Every editor draws this, from one shared definition in `assets/js/demos/diagram.js`:

```
Start → Submit request → Approved? ─ Yes → Place order ──────┐
                                    └ No  → Notify requester ─┴→ End
```

Each page uses the framework the way its own getting-started code does:

| Framework | What the page uses |
|---|---|
| React Flow | stock `input` / `default` / `output` nodes, `<Controls/>`, `<MiniMap/>`, `<Background variant="dots"/>`, `useNodesState` / `useEdgesState` / `addEdge` |
| meta2d.js | `new Meta2d()` with `registerCommonDiagram()`, the pens its own editor uses for flowcharts, a drag-in palette like its ES5 example |
| JointJS | `standard.*` shapes and links, link and element tools on hover (the open-source core has no editor UI) |
| LogicFlow | built-in nodes plus the DndPanel, SelectionSelect, Control, Menu and MiniMap extensions |
| maxGraph | the setup of maxGraph's own JavaScript example, plus the opt-in `UndoManager` and `KeyHandler` |
| draw.io | the whole editor from embed.diagrams.net, driven over the documented postMessage protocol |
| Plait / Drawnix | the Drawnix React component, fed elements made with Plait's own creators |
| FlowGram | the free-layout starter template (`npx @flowgram.ai/create-app`), written without JSX |
| AntV X6 | the getting-started look plus Stencil, Selection, Snapline, Keyboard, Clipboard, History, Transform and MiniMap |

No colours or themes are changed. The editors sit on a plain white surface even when the site is in
dark mode, because that is how their documentation shows them. The few deliberate departures are
stated in the code where they happen: sizes where a framework requires them, LogicFlow's and Drawnix's
diamonds widened so "Approved?" fits, meta2d's lines given an arrowhead and polyline routing (its
`connectLine` draws plain straight lines), and maxGraph's ellipse and rhombus given the perimeters
that belong to them.

## How a page reads

| | |
|---|---|
| **Stage** | The framework, loaded only when you open its page and mounted for real. Its own panels and toolbars sit inside the stage. |
| **Bar** | Calls into the framework's API — undo, add, fit, line style — and shows a live node and edge count fed by the framework's own change events. |
| **Data** | Opens what the framework itself would save: React Flow's `toObject()`, X6's `toJSON()`, LogicFlow's `getGraphData()`, maxGraph's XML, draw.io's XML from an `export` message, and so on. |
| **Overview table** | What each framework draws with, which UI framework you write it in, and what comes in the box. |
| **Source** | The exact builder function that drew the stage, verbatim, at the bottom of every page — so the amount of code each framework needed is there to compare. |

## Versions, and where each build comes from

| Framework | Running here | Build |
|---|---|---|
| React Flow | `@xyflow/react` 12.12.0 | esbuild bundle with React 19.2 |
| meta2d.js | `@meta2d/core` 1.1.32 | meta2d's own browser-bundle entry, rebuilt on the current 1.x packages |
| JointJS | `@joint/core` 4.3.3 | `dist/joint.min.js`, unchanged |
| LogicFlow | `@logicflow/core` 2.2.5, `@logicflow/extension` 2.3.1 | `dist/index.min.js` of each, unchanged |
| maxGraph | `@maxgraph/core` 0.25.0 | esbuild bundle (it only publishes ES modules) |
| draw.io | whatever embed.diagrams.net serves | not vendored — release 32.4.1 at the time of writing |
| Plait / Drawnix | `@plait/*` 0.94.1, Drawnix at commit `b138ff8` | esbuild ES-module bundle compiled from Drawnix's source |
| FlowGram | `@flowgram.ai/free-layout-editor` 1.0.16 | esbuild bundle with React 19.2 |
| AntV X6 | `@antv/x6` 3.1.8 | esbuild bundle from its ES modules |

Things found while building these, which are worth knowing if you are choosing between them:

- **meta2d.js** — npm `latest` is a 2.0.0 published in September 2026: a rewrite as a custom element
  with worker rendering. Its published build points its workers at `.ts` files the package does not
  ship, so it does not run from a plain bundle yet. GitHub `main` and the documentation are still the
  1.x line, which is what this page runs (the page says *running 1.1.32 here*).
- **AntV X6** — the `dist/x6.min.js` in the npm package leaves out the plugins' graph methods
  (`graph.bindKey`, `graph.undo`, `graph.copy`…) that X6's own docs use; the ES modules have them, so
  the bundle here is built from those. X6's `autoResize` sizes the graph to its container's *parent*.
- **maxGraph** — 0.25 moved `graph.fit()` into the default `FitPlugin`
  (`graph.getPlugin('fit').fitCenter()`); API changes like this arrive with most releases.
- **draw.io** — embed.diagrams.net sits behind Cloudflare, which refuses requests with a `localhost`
  referrer, so the iframe uses `referrerpolicy="no-referrer"` (otherwise the page breaks when run
  locally). The `configure` handshake switches off XML compression so autosave and export return
  readable XML.
- **Drawnix** — stopped publishing to npm in December 2025 while the repository kept moving, so it is
  compiled from source here. It opens on its hand tool (dragging pans); its UI and LogicFlow's control
  bar default to Chinese labels.

## Running it

It is a static site with no build step:

```bash
git clone https://github.com/MacroMozilla/FrontDemo.git
cd FrontDemo
npx http-server -p 8080     # or python3 -m http.server 8080
```

Then open <http://localhost:8080>. The draw.io page needs internet access; everything else is in
`vendor/`.

## Rebuilding the vendor bundles

Every diagram-editor file in `vendor/` can be regenerated from pinned versions:

```bash
cd scripts/bundles
npm ci
node build.mjs                 # everything
node build.mjs xyflow drawnix  # only these
```

`build.mjs` copies the browser builds that work as documented (JointJS, LogicFlow), bundles the rest
with esbuild from `scripts/bundles/entries/`, and clones Drawnix at the pinned commit (set
`DRAWNIX_SRC` to reuse a checkout). The graph-visualization builds in `vendor/` are pinned files and
are not rebuilt by it.

## Project structure

```
index.html                    the shell — everything else is rendered by JS
assets/css/app.css            layout, both themes, and the shared demo primitives
assets/css/lib/*.css          per-library stylesheets, loaded on demand
assets/js/data.js             ★ single source of truth: libraries, categories, capabilities
assets/js/app.js              sidebar, search, routing, theming, the demo context API
assets/js/demos/diagram.js    the nine editors and the shared flowchart
assets/js/demos/graph.js      the seven graph-visualization demos
vendor/*.js                   browser builds of every library
vendor/drawnix/               Drawnix as an ES module, with its lazily loaded chunks
scripts/bundles/              how the editor builds in vendor/ are produced
scripts/check.mjs             static checks, run in CI before each deploy
scripts/verify.mjs            drives every page in headless Chromium
scripts/audit.mjs             screenshots every stage and measures what was actually painted
scripts/montage.mjs           tiles the audit screenshots into contact sheets
scripts/readme.mjs            regenerates the library tables in this file from data.js
scripts/probe.mjs             prints what global a vendor build exposes
scripts/shot.mjs              screenshots one route in either theme
```

## Adding a library

1. Put its browser build in `vendor/` (or add an entry to `scripts/bundles/`), and any stylesheet in
   `assets/css/lib/`.
2. Add one entry to `LIBS` in `assets/js/data.js`. A build that is an ES module goes in `esm` and is
   handed to the builder as `ctx.mod`.
3. Write a builder in the matching `assets/js/demos/*.js`:

```js
B.mylib = async function (ctx) {
  paper(ctx);                          // diagram.js helpers: white surface, tall stage…
  var count = counter(ctx);            // …and the "n nodes · m edges" readout

  var editor = new MyLib(ctx.el, { /* the library's own defaults */ });
  editor.load(toMyFormat(FLOW));       // the shared flowchart
  editor.on("change", function () { count(editor.nodes().length, editor.edges().length); });

  ctx.btn("Undo", function () { editor.undo(); });
  dataButton(ctx, function () { return editor.toJSON(); });
  ctx.onDestroy(function () { editor.destroy(); });
};
```

The context object gives you `el`, `T` (theme tokens), `series(i)`, layout helpers (`panes`, `canvas`,
`editor`, `tall`, `mount`), toolbar controls (`btn`, `select`, `range`, `check`, `text`, `readout`,
`label`), `mod` for an ES-module build, and lifecycle hooks (`raf`, `every`, `after`, `on`,
`onResize`, `onDestroy`) that are all torn down automatically when you navigate away.

4. Run the checks:

```bash
node scripts/check.mjs             # registry integrity, missing builders, missing vendor files
node scripts/readme.mjs            # regenerate the library tables in README.md
node scripts/verify.mjs            # every page in headless Chromium
node scripts/verify.mjs mylib      # just yours
node scripts/audit.mjs mylib       # did it actually paint anything?
```

`scripts/verify.mjs` needs Playwright's Chromium; `npm i -D playwright` if you do not have it. Both
browser scripts present an ordinary Chrome user agent and honour `HTTPS_PROXY`, because the draw.io
page has to reach embed.diagrams.net.

## Deployment

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to the default branch.
`scripts/check.mjs` gates the deploy, so a library with no builder — or a `vendor/` file that was
never committed — fails the build instead of shipping a blank stage.

## A note on licences

Licences are as declared on npm (draw.io: its GitHub repository) and worth reading before you ship:

- **JointJS** core is **MPL-2.0**; the polished editor tier (JointJS+) is commercial.
- **LogicFlow**, **maxGraph** and **draw.io** are **Apache-2.0**. The draw.io page embeds the hosted
  editor at embed.diagrams.net; self-hosting means deploying the draw.io webapp yourself.
- **React Flow**, **meta2d.js**, **Plait / Drawnix**, **FlowGram** and **AntV X6** are **MIT**.

Everything under `vendor/` belongs to its respective authors; the copied builds are unmodified and
the bundled ones are produced by `scripts/bundles/` from the published packages. The code in
`assets/`, `scripts/` and `index.html` is MIT — see [LICENSE](LICENSE).

---

## Every library

★ is how readily I would reach for it, not a quality score. **RN** is whether it can be used from a
React Native app: ✓ on device, ◐ on Expo web only (a WebView on device), ✗ not at all. These tables
are generated from `assets/js/data.js` by `node scripts/readme.mjs` — edit the registry, not the table.

<!-- LIBRARY-TABLES:START -->

### Graphs

#### Diagram & flow editors (9)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **React Flow** | `@xyflow/react` | ★★★★★ | MIT | 395 KB | ◐ | The node-based editor most React apps end up using. Nodes are your own React components; the library owns the viewport, dragging, selection and wiring. |
| **meta2d.js** | `@meta2d/core` | ★★★ | MIT | 766 KB | ◐ | Le5le's canvas engine for interactive 2D diagrams and SCADA screens. Shapes ('pens') and lines live on one canvas with anchors, resize and rotate handles, animation and live data binding. |
| **JointJS** | `@joint/core` | ★★★★ | MPL-2.0 | 463 KB | ◐ | The open-source core of JointJS: a graph model of cells and an SVG paper that renders it, with standard shapes, ports, routers, connectors and interactive tools. |
| **LogicFlow** | `@logicflow/core` | ★★★★ | Apache-2.0 | 989 KB | ◐ | Didi's flowchart editing framework: an MVC core with built-in flowchart nodes and a large set of first-party extensions — drag-in panel, control bar, menus, minimap, BPMN. |
| **maxGraph** | `@maxgraph/core` | ★★★ | Apache-2.0 | 613 KB | ◐ | The TypeScript successor to mxGraph, the engine draw.io was built on, maintained by the community since mxGraph was archived. A graph model, an SVG view, and a deep set of handlers, styles and layouts. |
| **draw.io** | — (embedded from embed.diagrams.net) | ★★★★ | Apache-2.0 | 9.7 MB | ◐ | The complete draw.io editor, embedded the way draw.io documents it: an iframe in embed mode, driven over postMessage with a small JSON protocol. Not a library — the whole application. |
| **Plait / Drawnix** | `@plait/core` | ★★★ | MIT | 681 KB | ◐ | Plait is a plugin-based drawing framework — flowchart shapes, mind maps, freehand — and Drawnix is the open-source whiteboard built on it. This page mounts the Drawnix React component. |
| **FlowGram** | `@flowgram.ai/free-layout-editor` | ★★★★ | MIT | 1000 KB | ◐ | ByteDance's workflow-canvas framework, the engine behind Coze-style AI workflow builders. Nodes are React components backed by a form engine; plugins add minimap, snapping, auto-layout and history. |
| **AntV X6** | `@antv/x6` | ★★★★ | MIT | 590 KB | ◐ | Ant Group's graph-editing engine: SVG nodes and edges with ports, routers and connectors, plus stencil, selection, snapline, history, clipboard, keyboard, transform and minimap — all in the core package since 3.0. |

#### Graphs & networks (7)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **AntV G6** | `@antv/g6` | ★★★★ | MIT | 1.3 MB | ◐ | A graph toolkit with a large box of layouts and behaviours, from Ant Group. |
| **Cytoscape.js** | `cytoscape` | ★★★★★ | MIT | 425 KB | ◐ | Graph rendering plus a real graph-theory library: shortest path, centrality, clustering, all built in. |
| **vis-network** | `vis-network` | ★★★★ | Apache-2.0 OR MIT | 629 KB | ◐ | Network graphs with a physics simulation that keeps running while you interact. |
| **force-graph** | `force-graph` | ★★★★ | MIT | 173 KB | ◐ | d3-force plus a canvas renderer, wrapped so that one config object gets you a working graph. |
| **Reagraph** | `reagraph` | ★★★★ | Apache-2.0 | 1.5 MB | ◐ | WebGL graph rendering as React components, built on three.js. |
| **Sigma.js** | `sigma` | ★★★★ | MIT | 155 KB | ◐ | A WebGL renderer for graphology graphs. Rendering only — the data model lives in graphology. |
| **3d-force-graph** | `3d-force-graph` | ★★★ | MIT | 1.3 MB | ◐ | The same force-graph idea, but the simulation runs in three dimensions and renders through three.js. |

<!-- LIBRARY-TABLES:END -->
