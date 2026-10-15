# FrontDemo

**A playground for front-end libraries. 151 of them, across 36 categories, each one actually running
in the page — nine diagram editors among them, drawing the same flowchart side by side.**

Pick a library from the sidebar and you get it mounted on a real stage, with controls that drive its
actual API — not a screenshot, not a canned recording, not a code sample you have to imagine working.

Live: <https://macromozilla.github.io/FrontDemo/>

---

## Why this exists

Choosing a front-end library usually means reading three README files, opening two CodeSandboxes that
have rotted, and still not knowing how the thing feels. This site is the other approach: one page per
library, the library running, and an honest sentence about where it falls down.

Each library page gives you:

| | |
|---|---|
| **A live stage** | The library is loaded on demand and mounted for real. The controls in the grey bar call its API — change the router on a diagram, switch a chart's mark set, throw 40,000 sprites at PixiJS. |
| **The trade-off** | One line for what it is genuinely good at, one line for where it hurts. Both are opinions, and both are stated as such. |
| **Last update** | The page leads with the library's last update: the newer of its latest release and the newest commit to its repository, with both dates beside it. |
| **React Native & mobile** | Whether the library can be used from a React codebase that also targets phones — see below. |
| **Capabilities** | Eight columns, comparable across all 151 libraries, also available as one big [matrix](https://macromozilla.github.io/FrontDemo/#/matrix) with the last update of each. |
| **The source** | The exact builder function that drew the stage, verbatim, at the bottom of every page. |

## What is covered

Two halves. The first is everything that puts pixels on screen; the second is the rest of the
front-end toolbox.

**Graphics & visualization** — diagrams and node editors · graphs and networks · charts ·
high-performance charts · grammar-of-graphics kits · 2D canvas and SVG engines · creative coding and
physics · whiteboards and freehand · maps and geospatial · 3D and WebGL · animation · text-to-diagram
· Gantt and timelines · mind maps · data grids and pivots · documents, codes and export

**Web app building blocks** — editors and rich text · interaction and UI behaviour · data, files and
validation · utility and computation · frameworks and runtimes · media, audio and devices · state and
reactivity · networking and async · headless UI logic · forms and input controls · overlays and
feedback · scroll and layout · templating and text · storage, files and workers ·
internationalization · client-side search · crypto and identifiers · games and audio · delight and
micro-interactions · icons

Nothing here is a stub. Every one of the 151 pages runs its library for real, and
`scripts/verify.mjs` drives them all in headless Chromium.

## Fit for production

Every library on the site is one that can be recommended for production use today. In October 2026
the list was checked against npm deprecation notices, the security advisories on each latest
release, release and commit activity, the projects' own statements, licences and usage, and these
were removed:

| Removed | Why |
|---|---|
| crypto-js, Plyr | Discontinued or deprecated by their own authors (crypto-js points to the Web Crypto API, Plyr to Video.js). |
| html2canvas | Its author calls it experimental and not for production; no release since January 2022. |
| AOS, lunr, Muuri, localForage, Tippy.js, Split.js, Zdog, flatpickr, Toastify | Unmaintained: no release in more than three years and no commit in the last two. |
| Typed.js | GPL-3.0, which rules it out for most closed-source products. |
| Pintora, jsMind | Not production-proven: pre-1.0, with a few hundred to a few thousand downloads a week. |
| chart.xkcd | A novelty style with a few hundred downloads a week. |

SheetJS stays, but from its own distribution: the npm package `xlsx` stopped at 0.18.5, which has
known high-severity vulnerabilities, and SheetJS now publishes on cdn.sheetjs.com.

## Diagram editors, side by side

Picking a diagram framework from README files tells you very little about how it feels to use, so
the **Diagrams & node editors** section puts nine of them side by side — React Flow, meta2d.js,
JointJS, LogicFlow, maxGraph, draw.io, Plait / Drawnix, FlowGram and AntV X6, in the order of the
brief they came from. Each draws **the same approval flowchart** with nothing but what it ships — its
stock shapes, its default theme, its own toolbars and panels — so you can drag things around, wire up
new edges, undo, delete, and then read the exact code it took. The overview page compares them in one
table: what each draws with, which UI framework you write it in, and what comes in the box. Vue Flow,
diagram-js and Baklava.js complete the section with demos of their own.

The flowchart, from one shared definition in `assets/js/demos/diagram.js`:

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

No colours or themes are changed. These nine sit on a plain white surface even when the site is in
dark mode, because that is how their documentation shows them. The few deliberate departures are
stated in the code where they happen: sizes where a framework requires them, LogicFlow's and Drawnix's
diamonds widened so "Approved?" fits, meta2d's lines given an arrowhead and polyline routing (its
`connectLine` draws plain straight lines), and maxGraph's ellipse and rhombus given the perimeters
that belong to them. A **Data** button on each page opens what the framework itself would save —
React Flow's `toObject()`, X6's `toJSON()`, LogicFlow's `getGraphData()`, maxGraph's XML, draw.io's
XML from an `export` message — and the readout counts nodes and edges from the framework's own change
events.

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
  readable XML. It is the only page that needs a host other than this site; if embed.diagrams.net
  cannot be reached, the page says so.
- **Drawnix** — stopped publishing to npm in December 2025 while the repository kept moving, so it is
  compiled from source here. It opens on its hand tool (dragging pans).
- **Chinese defaults** — LogicFlow's control bar and menus, Drawnix, and meta2d's built-in dialogs are
  Chinese out of the box. LogicFlow's labels change through `controlItems` and `setMenuConfig`,
  Drawnix through `initialLanguage`, and meta2d through its locale — which has to be set before the
  first `new Meta2d()`, because the constructor builds its dialogs; the bundle here exports
  `setLocale` for that. draw.io follows the browser's language unless given `lang=en`.
- **Sigma.js** (in *Graphs & networks*) — 4.0 (October 2026) replaced settings such as `labelColor`
  and `defaultEdgeColor` with a styles system; styles you pass replace the defaults unless you layer
  them over `DEFAULT_STYLES`.
- **vis-network** — group names are matched as strings: a node with `group: 1` silently gets the
  default palette even when `groups: { 1: … }` is configured.

## The React Native column

This came out of a real question: *if my app is React on the web and React Native on phones, which of
these can I actually use?*

| Mark | Meaning |
|:--:|---|
| ✓ | Runs in a React Native / Expo app **on device** — either through an official native port (MapLibre, Lottie, Babylon, three.js via `expo-gl`) or because the library is pure JavaScript with no DOM access, so you can drive `react-native-svg` or Skia with it (D3's scale/shape modules, Matter.js, Turf, perfect-freehand, Rough.js, `qrcode`, Zod, Day.js, Fuse.js). |
| ◐ | Works on **Expo web only**, through `react-native-web`. On device you would need `react-native-webview`. This is where most DOM and canvas libraries land. |
| ✗ | No path into a React Native app at all — Lit's custom elements, Alpine's HTML directives, htmx's hypermedia model. |

Every library page also carries a one-line note naming the specific package or technique you would
reach for, so a ◐ is never just a shrug.

## Themes

Two palettes, dark and light, neither of them pure black. Demos read their colours from theme tokens
rather than hard-coding hex values, so switching the theme re-renders the current demo in the new
palette instead of leaving a dark chart on a white page. The nine flowchart editors are the
exception: they keep their own white page in either theme, so a theme switch leaves them — and
whatever you drew — as they are.

## English only

The site, its code and comments, and every file in `vendor/` are in English. The few libraries whose
own interface defaults to Chinese (or follows the browser's language) are switched to English through
their own APIs, and the browser builds that contained CJK text — locale tables, sample strings — have
those characters written as `\uXXXX` escapes, which run the same. `scripts/check.mjs` fails on any
CJK text in the repository.

## Running it

It is a static site with no build step:

```bash
git clone https://github.com/MacroMozilla/FrontDemo.git
cd FrontDemo
npx http-server -p 8080     # or python3 -m http.server 8080
```

Then open <http://localhost:8080>. The draw.io page needs internet access; map tiles on the
geospatial pages come from their usual tile servers; everything else is in `vendor/`.

## Project structure

```
index.html                  the shell — everything else is rendered by JS
assets/css/app.css          layout, both themes, and the shared demo primitives
assets/css/vendor.css       stylesheets the older libraries ship with, merged
assets/css/lib/*.css        per-library stylesheets, loaded on demand
assets/js/data.js           ★ single source of truth: libraries, categories, capabilities
assets/js/app.js            sidebar, search, routing, theming, the demo context API
assets/js/demos/*.js        one file per area; every demo builder lives here
                            (diagram.js holds the nine editors and their shared flowchart)
assets/fragments/*.html     HTML fragments the htmx demo fetches
vendor/*.js                 browser builds of every library
vendor/drawnix/             Drawnix as an ES module, with its lazily loaded chunks
scripts/bundles/            how the diagram-editor and graph-library builds are produced
scripts/vendor-versions.json  the version of every pinned build in vendor/
scripts/freshness.mjs       refreshes versions, release and commit dates, and sizes in data.js
scripts/check.mjs           static checks, run in CI on every pull request and push to main
scripts/verify.mjs          drives every page in headless Chromium
scripts/audit.mjs           screenshots every stage and measures what was actually painted
scripts/montage.mjs         tiles the audit screenshots into contact sheets
scripts/readme.mjs          regenerates the library tables in this file from data.js
scripts/probe.mjs           loads one vendor build and evaluates an expression against it
scripts/shot.mjs            screenshots one route in either theme
```

## Adding a library

1. Drop its browser build into `vendor/` (or add an entry to `scripts/bundles/`), and any stylesheet
   into `assets/css/lib/`. A pinned build also gets its version in `scripts/vendor-versions.json`.
2. Add one entry to `LIBS` in `assets/js/data.js`, with its GitHub `repo` for the commit date. A build
   that is an ES module goes in `esm` and is handed to the builder as `ctx.mod`.
3. Write a builder in the matching `assets/js/demos/*.js`:

```js
B.mylib = async function (ctx) {
  var T = ctx.T;                       // theme tokens — never hard-code colours
  var chart = new MyLib(ctx.el, {       // ctx.el is the mount node, already sized
    background: T.stage,
    color: ctx.series(0)                // the categorical palette
  });

  ctx.select("mode", ["a", "b"], function (v) { chart.setMode(v); }, "a");
  ctx.readout("what to notice while playing with it");

  ctx.onResize(function () { chart.resize(); });
  ctx.onDestroy(function () { chart.destroy(); });
};
```

The context object gives you `el`, `T`, `series(i)`, layout helpers (`panes`, `canvas`, `editor`,
`tall`, `mount`), toolbar controls (`btn`, `select`, `range`, `check`, `text`, `readout`, `label`),
`mod` for an ES-module build, and lifecycle hooks (`raf`, `every`, `after`, `on`, `onResize`,
`onDestroy`) that are all torn down automatically when you navigate away. A builder that throws gets
its error shown on the stage; `fail(text)` does the same for a failure noticed later, and `ownTheme()`
marks a demo that looks the same in either theme, so a theme switch leaves it running. A diagram
editor in `diagram.js` uses that file's helpers instead: `paper(ctx)` for the white page, `counter`
for the node and edge readout, `dataButton` for the Data panel, and `FLOW` for the flowchart.

4. Run the checks:

```bash
node scripts/check.mjs             # registry integrity, missing builders, missing vendor files
node scripts/readme.mjs            # regenerate the library tables in README.md
node scripts/verify.mjs            # every page in headless Chromium
node scripts/verify.mjs mylib      # just yours
node scripts/verify.mjs --shots    # also write screenshots to /tmp/fd-shots
node scripts/audit.mjs mylib       # did it actually paint anything?
```

The browser scripts need Playwright and its Chromium, and `audit.mjs` and `montage.mjs` also need
pngjs. Without a `package.json` at the root, install them without saving one:

```bash
npm i --no-save playwright pngjs
npx playwright install chromium
```

`verify.mjs`, `audit.mjs` and `shot.mjs` present an ordinary Chrome user agent and honour `HTTPS_PROXY`,
because the draw.io page has to reach embed.diagrams.net.

`verify.mjs` only proves a demo ran without throwing — a blank canvas passes it. `audit.mjs` is the
answer to that: it screenshots each stage through the Chrome DevTools Protocol (so animated pages
that never reach visual stability still get captured), then measures how much of the stage is
non-background, how many distinct colours appear, how far the content spreads, and how many controls
the toolbar has. Anything suspicious is flagged for a human to look at.

## Builds in vendor/

Two kinds of files live in `vendor/`:

- **The diagram editors and graph libraries** (and d3) are produced by `scripts/bundles/` from the
  versions pinned in its `package.json`:

  ```bash
  cd scripts/bundles
  npm ci
  node build.mjs                 # everything
  node build.mjs xyflow drawnix  # only these
  ```

  `build.mjs` copies the browser builds that work as documented (keeping their licence headers),
  bundles the rest with esbuild from `scripts/bundles/entries/`, and clones Drawnix at the pinned
  commit (set `DRAWNIX_SRC` to reuse a checkout).
- **Every other library** ships the browser build it publishes, pinned in the repository and recorded
  with its version in `scripts/vendor-versions.json`. Where npm has moved on since, the page says
  *running X here* and the demo is written against the API of the build it runs.
  `node build.mjs ascii` writes the CJK text in any of these builds as `\uXXXX` escapes.

`build.mjs` refuses to finish while any file in `vendor/` or `assets/css/lib/` contains CJK text.

## Keeping versions and dates current

```bash
node scripts/freshness.mjs           # what is current on npm and GitHub
node scripts/freshness.mjs --write   # write it into data.js, then:
node scripts/readme.mjs
```

It looks up each library's latest npm version and its release date (draw.io: the latest GitHub
release tag) and the date of the newest commit on its repository, eight libraries at a time. The
version running here comes from `scripts/bundles/package.json` or `scripts/vendor-versions.json`;
where it differs from npm latest, the page says *running X here*. Sizes are re-measured for the builds
`scripts/bundles` makes; a pinned build keeps the size recorded for it. To move a bundled library to a
new release, bump its pin in `scripts/bundles/package.json`, rebuild, and run the checks.

## Deployment

GitHub Pages publishes the `main` branch as it is: there is no build step, and `.nojekyll` keeps
Pages from processing it. `.github/workflows/deploy.yml` runs `scripts/check.mjs` and
`scripts/readme.mjs --check` on every pull request and every push to `main`, so a library with no
builder, a missing `vendor/` file, a stale README table or any CJK text shows up as a red check
before it is merged. The workflow's own deploy job only runs if the repository's Pages source is
switched to GitHub Actions.

## A note on versions and licences

The version badge on each page is the **latest release on npm**, checked against the registry, and
the page leads with the newer of that release and the newest commit. Where the build in `vendor/` is
another version — an older major line for some — the page says *running X here* and the demo is
written against that API.

Licences are as declared on npm (draw.io: its GitHub repository) and worth reading before you ship:

- **GSAP** uses its own no-charge licence, not an OSI one.
- **ApexCharts** publishes as `SEE LICENSE IN LICENSE`.
- **p5.js** is LGPL-2.1.
- **JointJS** core is **MPL-2.0**; the polished editor tier (JointJS+) is commercial.
- **AG Grid**'s community build is MIT; row grouping and the pivot panel are Enterprise, which is why
  this demo stays inside what the free build ships.
- **LogicFlow**, **maxGraph**, **draw.io** and **Reagraph** are **Apache-2.0**; vis-network is
  dual-licensed Apache-2.0 or MIT. The draw.io page embeds the hosted editor at embed.diagrams.net;
  self-hosting means deploying the draw.io webapp yourself.

Everything under `vendor/` belongs to its respective authors. The builds made by `scripts/bundles/`
come from the published packages, and the copied ones keep the licence header they ship with; the
pinned builds are the libraries' own files, unmodified apart from `\uXXXX` escapes in the few that
contained CJK text. The code in `assets/`, `scripts/` and `index.html` is MIT — see
[LICENSE](LICENSE).

---

## Every library

★ is how readily I would reach for it, not a quality score. **RN** is the React Native column
described above. These tables are generated from `assets/js/data.js` by `node scripts/readme.mjs` —
edit the registry, not the table.

<!-- LIBRARY-TABLES:START -->

_Versions, release dates and commit dates checked 2026-10-15 (`node scripts/freshness.mjs --write` refreshes them)._

### Graphics & visualization

#### Diagrams & node editors (12)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **React Flow** | `@xyflow/react` | ★★★★★ | MIT | 395 KB | 2026-09-24 | ◐ | The node-based editor most React apps end up using. Nodes are your own React components; the library owns the viewport, dragging, selection and wiring. |
| **meta2d.js** | `@meta2d/core` | ★★★ | MIT | 766 KB | 2026-10-14 | ◐ | Le5le's canvas engine for interactive 2D diagrams and SCADA screens. Shapes ('pens') and lines live on one canvas with anchors, resize and rotate handles, animation and live data binding. |
| **JointJS** | `@joint/core` | ★★★★ | MPL-2.0 | 463 KB | 2026-10-14 | ◐ | The open-source core of JointJS: a graph model of cells and an SVG paper that renders it, with standard shapes, ports, routers, connectors and interactive tools. |
| **LogicFlow** | `@logicflow/core` | ★★★★ | Apache-2.0 | 991 KB | 2026-10-10 | ◐ | Didi's flowchart editing framework: an MVC core with built-in flowchart nodes and a large set of first-party extensions — drag-in panel, control bar, menus, minimap, BPMN. |
| **maxGraph** | `@maxgraph/core` | ★★★ | Apache-2.0 | 613 KB | 2026-10-15 | ◐ | The TypeScript successor to mxGraph, the engine draw.io was built on, maintained by the community since mxGraph was archived. A graph model, an SVG view, and a deep set of handlers, styles and layouts. |
| **draw.io** | — (embedded from embed.diagrams.net) | ★★★★ | Apache-2.0 | 9.7 MB | 2026-10-08 | ◐ | The complete draw.io editor, embedded the way draw.io documents it: an iframe in embed mode, driven over postMessage with a small JSON protocol. Not a library — the whole application. |
| **Plait / Drawnix** | `@plait/core` | ★★★ | MIT | 681 KB | 2026-09-23 | ◐ | Plait is a plugin-based drawing framework — flowchart shapes, mind maps, freehand — and Drawnix is the open-source whiteboard built on it. This page mounts the Drawnix React component. |
| **FlowGram** | `@flowgram.ai/free-layout-editor` | ★★★★ | MIT | 1000 KB | 2026-10-13 | ◐ | ByteDance's workflow-canvas framework, the engine behind Coze-style AI workflow builders. Nodes are React components backed by a form engine; plugins add minimap, snapping, auto-layout and history. |
| **AntV X6** | `@antv/x6` | ★★★★ | MIT | 590 KB | 2026-10-15 | ◐ | Ant Group's graph-editing engine: SVG nodes and edges with ports, routers and connectors, plus stencil, selection, snapline, history, clipboard, keyboard, transform and minimap — all in the core package since 3.0. |
| **Vue Flow** | `@vue-flow/core` | ★★★★ | MIT | 164 KB | 2026-06-23 | ✗ | React Flow's model, ported to Vue. Same concepts, Vue components instead. |
| **diagram-js** | `diagram-js` | ★★★ | MIT | 121 KB | 2026-10-07 | ◐ | The kernel underneath bpmn.io. Canvas, selection, dragging and an undoable command stack — and nothing else. The core is 35 KB; the build here adds the modeling, move, connect and bendpoint features. |
| **Baklava.js** | `baklavajs` | ★★★ | MIT | 172 KB | 2026-09-17 | ✗ | A node editor where the graph is also a program — connect nodes and values flow through them. |

#### Graphs & networks (7)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **AntV G6** | `@antv/g6` | ★★★★ | MIT | 1.3 MB | 2026-10-13 | ◐ | A graph toolkit with a large box of layouts and behaviours, from Ant Group. |
| **Cytoscape.js** | `cytoscape` | ★★★★★ | MIT | 425 KB | 2026-09-07 | ◐ | Graph rendering plus a real graph-theory library: shortest path, centrality, clustering, all built in. |
| **vis-network** | `vis-network` | ★★★★ | Apache-2.0 OR MIT | 640 KB | 2026-09-13 | ◐ | Network graphs with a physics simulation that keeps running while you interact. |
| **force-graph** | `force-graph` | ★★★★ | MIT | 169 KB | 2026-09-29 | ◐ | d3-force plus a canvas renderer, wrapped so that one config object gets you a working graph. |
| **Reagraph** | `reagraph` | ★★★★ | Apache-2.0 | 1.9 MB | 2026-06-25 | ◐ | WebGL graph rendering as React components, built on three.js. |
| **Sigma.js** | `sigma` | ★★★★ | MIT | 437 KB | 2026-10-14 | ◐ | A WebGL renderer for graphology graphs. Rendering only — the data model lives in graphology. |
| **3d-force-graph** | `3d-force-graph` | ★★★ | MIT | 1.3 MB | 2026-09-29 | ◐ | The same force-graph idea, but the simulation runs in three dimensions and renders through three.js. |

#### Charts (8)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **ECharts** | `echarts` | ★★★★★ | Apache-2.0 | 1.1 MB | 2026-10-04 | ✓ | The most complete open-source chart library there is. If a chart type exists, ECharts has it. |
| **Chart.js** | `chart.js` | ★★★★★ | MIT | 204 KB | 2026-10-03 | ◐ | The sensible default. Eight chart types, good animations, small bundle, huge community. |
| **ApexCharts** | `apexcharts` | ★★★★ | See LICENSE file | 561 KB | 2026-10-15 | ◐ | Dashboard charts that look finished out of the box — annotations, brush zoom, sparklines included. |
| **AntV G2** | `@antv/g2` | ★★★★ | MIT | 1.0 MB | 2026-10-15 | ◐ | A grammar of graphics implementation: you compose marks and scales instead of picking a chart type. |
| **billboard.js** | `billboard.js` | ★★★★ | MIT | 774 KB | 2026-09-30 | ◐ | A maintained, modernised take on C3.js, built on D3. |
| **Plotly.js** | `plotly.js-basic-dist-min` | ★★★★ | MIT | 1.1 MB | 2026-10-14 | ◐ | Scientific charting with a built-in toolbar — the JS half of the Python/R Plotly family. |
| **Recharts** | `recharts` | ★★★★ | MIT | 766 KB | 2026-10-14 | ◐ | Charts as JSX. Every axis, bar and tooltip is a React component in your tree. |
| **Chartist** | `chartist` | ★★★ | MIT OR WTFPL | 37 KB | 2026-10-14 | ◐ | 37 KB of pure SVG charts where the styling is entirely CSS's job. |

#### High-performance charts (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Lightweight Charts** | `lightweight-charts` | ★★★★★ | Apache-2.0 | 192 KB | 2026-10-13 | ✓ | TradingView's financial chart core: candles, volume, crosshair, at 45 KB gzipped. |
| **Dygraphs** | `dygraphs` | ★★★★ | MIT | 127 KB | 2026-07-29 | ◐ | An old, extremely fast time-series charter designed for very dense data. |
| **µPlot** | `uplot` | ★★★★★ | MIT | 50 KB | 2026-10-11 | ◐ | 50 KB that plots 150,000 points in around 100 ms. The benchmark other chart libraries get compared against. |
| **webgl-plot** | `webgl-plot` | ★★★ | MIT | 79 KB | 2026-02-16 | ◐ | A WebGL line plotter for real-time streams — oscilloscopes, sensor traces, audio. |

#### Grammar & low-level kits (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **D3.js** | `d3` | ★★★★★ | ISC | 0 KB | 2026-05-28 | ✓ | Not a chart library — a box of primitives (scales, shapes, layouts, transitions, geo projections) that most other chart libraries are built on top of. |
| **Vega-Lite** | `vega-lite` | ★★★★★ | BSD-3-Clause | 245 KB | 2026-10-08 | ✓ | A JSON grammar for statistical graphics. You describe the chart; the compiler decides how to draw it. |
| **Vega** | `vega` | ★★★★ | BSD-3-Clause | 504 KB | 2026-10-13 | ✓ | The lower layer Vega-Lite compiles down to: a full visualization runtime described by JSON. |
| **Observable Plot** | `@observablehq/plot` | ★★★★ | ISC | 204 KB | 2026-09-01 | ◐ | D3's own team asking 'what if the common case were one line?'. Marks and transforms over D3. |

#### 2D canvas & SVG engines (7)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Konva** | `konva` | ★★★★★ | MIT | 182 KB | 2026-10-15 | ◐ | A canvas scene graph with hit detection, layers, transforms and events — the shortest path to a custom editor. |
| **Fabric.js** | `fabric` | ★★★★★ | MIT | 292 KB | 2026-10-14 | ◐ | The canvas library behind most browser image editors: selection boxes, group transforms, JSON serialisation, SVG import/export. |
| **PixiJS** | `pixi.js` | ★★★★★ | MIT | 779 KB | 2026-10-10 | ◐ | The fastest 2D WebGL renderer on the web. Games, particle systems, and any UI that has to move. |
| **Paper.js** | `paper` | ★★★★ | MIT | 234 KB | 2024-07-17 | ◐ | A vector graphics scene graph with real boolean path operations — unite, subtract, intersect — on curves. |
| **SVG.js** | `@svgdotjs/svg.js` | ★★★★ | MIT | 90 KB | 2026-08-04 | ◐ | A small chainable wrapper for building and animating SVG — jQuery's ergonomics for vector graphics. |
| **Two.js** | `two.js` | ★★★ | MIT | 199 KB | 2026-10-11 | ◐ | One drawing API that can output SVG, Canvas or WebGL — you pick the renderer at construction time. |
| **ZRender** | `zrender` | ★★★ | BSD-3-Clause | 216 KB | 2026-05-26 | ◐ | The rendering kernel ECharts is built on, usable on its own. |

#### Creative coding & physics (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **p5.js** | `p5` | ★★★★ | LGPL-2.1 | 1.0 MB | 2026-10-14 | ◐ | Processing for the web. The library that teaches most people creative coding: setup(), draw(), and go. |
| **Matter.js** | `matter-js` | ★★★★ | MIT | 82 KB | 2026-09-30 | ✓ | A rigid-body 2D physics engine: gravity, collisions, constraints, friction. |
| **Rough.js** | `roughjs` | ★★★★ | MIT | 27 KB | 2023-11-20 | ✓ | Draws in a hand-sketched style. It is what makes Excalidraw look like Excalidraw. |

#### Whiteboards & freehand (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Excalidraw** | `@excalidraw/excalidraw` | ★★★★★ | MIT | 1.1 MB | 2026-10-14 | ◐ | An entire whiteboard app you embed as one React component — tools, undo, export, collaboration hooks. |
| **perfect-freehand** | `perfect-freehand` | ★★★★★ | MIT | 5 KB | 2026-02-01 | ✓ | 5 KB that turns pointer positions into a pressure-sensitive stroke outline. Not a renderer — just the maths. |

#### Maps & geospatial (6)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **MapLibre GL** | `maplibre-gl` | ★★★★★ | BSD-3-Clause | 1.0 MB | 2026-10-14 | ✓ | The community fork of Mapbox GL JS from before it went proprietary. Vector tiles, GPU rendering, 3D tilt. |
| **Leaflet** | `leaflet` | ★★★★★ | BSD-2-Clause | 144 KB | 2026-09-19 | ◐ | The most widely deployed map library on the web. 144 KB, no dependencies, and a plugin for everything. |
| **deck.gl** | `deck.gl` | ★★★★★ | MIT | 1.6 MB | 2026-10-13 | ◐ | Uber's GPU layer system for very large geospatial datasets — millions of points, arcs, hexbins. |
| **OpenLayers** | `ol` | ★★★★ | BSD-2-Clause | 1019 KB | 2026-10-13 | ◐ | The GIS-grade option: projections, WMS/WFS, editing, measurement — the serious mapping stack. |
| **AntV L7** | `@antv/l7` | ★★★★ | MIT | 1.4 MB | 2026-07-30 | ◐ | AntV's geospatial visualization engine, strong on Chinese basemaps and stylised layers. |
| **Turf.js** | `@turf/turf` | ★★★★★ | MIT | 550 KB | 2026-09-30 | ✓ | Geospatial analysis in plain JavaScript: buffers, unions, distance, point-in-polygon, clustering. No map required. |

#### 3D & WebGL (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Three.js** | `three` | ★★★★★ | MIT | 654 KB | 2026-10-14 | ✓ | The default way to do 3D on the web. Scene, camera, lights, materials, loaders, post-processing. |
| **Babylon.js** | `@babylonjs/core` | ★★★★ | Apache-2.0 | 7.4 MB | 2026-10-15 | ✓ | A full 3D engine rather than a renderer: physics, animation, audio, XR, and an in-browser editor. |
| **3Dmol.js** | `3dmol` | ★★★★ | BSD-3-Clause | 525 KB | 2026-09-11 | ◐ | Molecular visualization: parses PDB/SDF/CIF and renders cartoons, sticks, surfaces. |

#### Animation (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **GSAP** | `gsap` | ★★★★★ | No-charge standard license | 71 KB | 2026-04-13 | ✓ | The professional animation engine. Timelines, staggers, scroll triggers, and it will animate literally any property. |
| **anime.js** | `animejs` | ★★★★ | MIT | 17 KB | 2026-08-09 | ✓ | 17 KB of tidy animation: CSS properties, SVG attributes, DOM attributes and plain JS objects. |
| **Lottie** | `lottie-web` | ★★★★★ | MIT | 298 KB | 2025-05-21 | ✓ | Plays animations exported from After Effects as JSON. Designers animate; you ship the file. |
| **Motion** | `motion` | ★★★★★ | MIT | 64 KB | 2026-10-15 | ◐ | Framer Motion's engine, now framework-agnostic. Springs, layout animation and gestures on the Web Animations API. |

#### Text to diagram (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Mermaid** | `mermaid` | ★★★★★ | MIT | 3.3 MB | 2026-10-14 | ◐ | Markdown-ish text in, laid-out diagram out. Flowcharts, sequence, class, gantt, ER, state. |
| **Viz.js (Graphviz)** | `@viz-js/viz` | ★★★★ | MIT | 1.3 MB | 2026-09-28 | ◐ | Real Graphviz compiled to WebAssembly. The same dot layout engine everyone has used since 1991. |
| **WaveDrom** | `wavedrom` | ★★★★ | MIT | 39 KB | 2026-08-31 | ◐ | Digital timing diagrams from JSON. Standard equipment in hardware documentation. |

#### Gantt & timelines (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Frappe Gantt** | `frappe-gantt` | ★★★★ | MIT | 47 KB | 2026-03-05 | ◐ | A small, good-looking Gantt chart where bars are draggable and dependencies redraw themselves. |
| **vis-timeline** | `vis-timeline` | ★★★★ | Apache-2.0 OR MIT | 543 KB | 2026-10-14 | ◐ | A zoomable, editable timeline that scales from milliseconds to centuries. |
| **jsGantt Improved** | `jsgantt-improved` | ★★★ | ISC | 243 KB | 2026-04-13 | ◐ | A project-management Gantt: durations, percent complete, owners, cost, collapsible groups. |

#### Mind maps (1)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Mind Elixir** | `mind-elixir` | ★★★★ | MIT | 88 KB | 2026-08-11 | ◐ | A drop-in mind map editor: editable nodes, drag to re-parent, keyboard shortcuts, undo. |

#### Data grids & pivots (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **AG Grid** | `ag-grid-community` | ★★★★★ | MIT | 1.9 MB | 2026-10-14 | ◐ | The enterprise data grid. Virtual scrolling, grouping, pinning, editing, filtering — the community build alone is substantial. |
| **Tabulator** | `tabulator-tables` | ★★★★ | MIT | 436 KB | 2026-10-01 | ◐ | A fully MIT data grid with editing, grouping, downloads and formatters included, no paid tier. |
| **AntV S2** | `@antv/s2` | ★★★★ | MIT | 1.1 MB | 2026-06-11 | ◐ | A canvas-rendered pivot table — multi-level rows and columns, the way a BI tool does it. |

#### Documents, codes & export (5)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **JsBarcode** | `jsbarcode` | ★★★★ | MIT | 65 KB | 2026-01-07 | ◐ | Renders CODE128, EAN, UPC, ITF, Codabar and more into a canvas or SVG element. |
| **QRCode** | `qrcode` | ★★★★★ | MIT | 25 KB | 2024-08-05 | ✓ | The reference QR generator for JavaScript: canvas, SVG, data URL, or a raw bit matrix. |
| **PDF.js** | `pdfjs-dist` | ★★★★★ | Apache-2.0 | 313 KB | 2026-10-14 | ◐ | Mozilla's PDF renderer — the one built into Firefox. Parses and rasterises PDF entirely in JavaScript. |
| **jsPDF** | `jspdf` | ★★★★ | MIT | 357 KB | 2026-09-13 | ◐ | Generates PDF files client-side: text, vectors, images, tables, and metadata. |
| **KaTeX** | `katex` | ★★★★★ | MIT | 270 KB | 2026-10-14 | ◐ | Khan Academy's maths typesetter. Renders LaTeX to HTML synchronously and far faster than MathJax. |

### Web app building blocks

#### Editors & rich text (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **CodeMirror 6** | `codemirror` | ★★★★★ | MIT | 554 KB | 2026-04-15 | ◐ | A code editor rebuilt from scratch around immutable state and a transaction model. Accessible, mobile-capable, extensible. |
| **Quill** | `quill` | ★★★★ | BSD-3-Clause | 204 KB | 2025-07-25 | ◐ | A rich-text editor whose document model is Delta — a JSON operation list, not HTML. |
| **marked** | `marked` | ★★★★★ | MIT | 39 KB | 2026-10-13 | ✓ | The fast, small Markdown compiler. Text in, HTML out, with a hookable renderer. |
| **highlight.js** | `highlight.js` | ★★★★ | BSD-3-Clause | 125 KB | 2026-08-30 | ✓ | Syntax highlighting for around 190 languages, with automatic language detection. |

#### Interaction & UI behaviour (6)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **SortableJS** | `sortablejs` | ★★★★★ | MIT | 44 KB | 2026-03-24 | ✗ | Drag-and-drop list reordering, including between lists. No dependencies, works on touch. |
| **interact.js** | `interactjs` | ★★★★ | MIT | 96 KB | 2026-08-01 | ✗ | Drag, resize and multi-touch gestures on any element, with snapping, inertia and restriction modifiers. |
| **Floating UI** | `@floating-ui/dom` | ★★★★★ | MIT | 10 KB | 2026-09-28 | ✓ | The positioning engine under most tooltip and dropdown libraries. Places a floating element and keeps it on screen. |
| **Swiper** | `swiper` | ★★★★★ | MIT | 150 KB | 2026-10-06 | ✗ | The touch slider that ships in a large share of the world's mobile web. Carousels, coverflow, parallax, virtual slides. |
| **Driver.js** | `driver.js` | ★★★★ | MIT | 21 KB | 2026-10-13 | ✗ | Product tours and feature highlights: dims the page, spotlights an element, walks the user through steps. |
| **hotkeys-js** | `hotkeys-js` | ★★★★ | MIT | 7 KB | 2026-09-10 | ✗ | Keyboard shortcuts with scopes: 7 KB, no dependencies, and it knows not to fire while you are typing in a field. |

#### Data, files & validation (7)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Fuse.js** | `fuse.js` | ★★★★★ | Apache-2.0 | 26 KB | 2026-08-08 | ✓ | Fuzzy search over a local array. Typo-tolerant, weighted across fields, no index server needed. |
| **Papa Parse** | `papaparse` | ★★★★★ | MIT | 19 KB | 2026-10-09 | ✓ | The CSV parser for JavaScript. Streaming, worker-threaded, and it gets the quoting edge cases right. |
| **SheetJS** | `xlsx` | ★★★★ | Apache-2.0 | 1.2 MB | 2024-01-31 | ✓ | Reads and writes Excel, ODS, CSV and a dozen other spreadsheet formats, entirely in the browser. |
| **Day.js** | `dayjs` | ★★★★★ | MIT | 7 KB | 2026-09-15 | ✓ | Moment.js's API in 7 KB, immutable, with everything else behind opt-in plugins. |
| **Zod** | `zod` | ★★★★★ | MIT | 173 KB | 2026-10-13 | ✓ | Schema validation where the TypeScript type is inferred from the schema — one definition, not two. |
| **js-yaml** | `js-yaml` | ★★★★★ | MIT | 39 KB | 2026-10-06 | ✓ | The YAML parser and serialiser for JavaScript. If a tool reads YAML in Node, this is usually what is doing it. |
| **Ajv** | `ajv` | ★★★★ | MIT | 125 KB | 2026-04-24 | ✓ | The JSON Schema validator. Compiles a schema to a specialised function, which is why it is the fastest one. |

#### Utility & computation (6)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Lodash** | `lodash` | ★★★★ | MIT | 71 KB | 2026-09-11 | ✓ | The utility belt: groupBy, cloneDeep, debounce, chunk, and 300 more, each handling the edge cases. |
| **chroma.js** | `chroma-js` | ★★★★★ | BSD-3-Clause AND Apache-2.0 | 41 KB | 2026-09-15 | ✓ | Colour manipulation done properly: perceptual colour spaces, scales, interpolation, contrast checks. |
| **math.js** | `mathjs` | ★★★★ | Apache-2.0 | 668 KB | 2026-08-10 | ✓ | An extensive maths library with an expression parser, matrices, complex numbers, units and symbolic derivatives. |
| **DOMPurify** | `dompurify` | ★★★★★ | MPL-2.0 OR Apache-2.0 | 22 KB | 2026-10-12 | ◐ | The XSS sanitiser. Give it untrusted HTML, get back HTML that is safe to insert. |
| **Ramda** | `ramda` | ★★★ | MIT | 52 KB | 2026-10-11 | ✓ | Functional utilities where everything is curried and data comes last, so composition is the default way to work. |
| **validator.js** | `validator` | ★★★★ | MIT | 94 KB | 2026-09-11 | ✓ | String validators and sanitisers: email, URL, IBAN, credit card, postal codes, MIME types — around a hundred of them. |

#### Frameworks & runtimes (7)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Preact** | `preact` | ★★★★★ | MIT | 11 KB | 2026-10-13 | ✗ | React's API and component model in 3 KB gzipped, with the same hooks and a compatibility layer. |
| **Alpine.js** | `alpinejs` | ★★★★ | MIT | 44 KB | 2026-10-05 | ✗ | Reactivity as HTML attributes. Sprinkle x-data and x-on onto server-rendered markup and you are done. |
| **Lit** | `lit` | ★★★★ | BSD-3-Clause | 15 KB | 2026-09-14 | ✗ | Web Components with a thin, fast reactive layer. Real custom elements that work in any framework. |
| **htmx** | `htmx.org` | ★★★★ | 0BSD | 50 KB | 2026-09-22 | ✗ | Extends HTML so any element can issue a request and swap the response into the page. The server sends HTML, not JSON. |
| **Vue 3** | `vue` | ★★★★★ | MIT | 162 KB | 2026-10-13 | ✗ | The framework that made fine-grained reactivity mainstream. Templates, a signals-style reactivity core, and a gentle upgrade path. |
| **React** | `react` | ★★★★★ | MIT | 139 KB | 2026-10-14 | ✓ | The one the rest of this category is measured against. A component model, a reconciler, and an ecosystem larger than most languages have. |
| **jQuery** | `jquery` | ★★★ | MIT | 85 KB | 2026-10-05 | ✗ | Still on a large share of the web. It exists here because knowing what it solved explains why the modern APIs look the way they do. |

#### Media, audio & devices (5)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **WaveSurfer.js** | `wavesurfer.js` | ★★★★ | BSD-3-Clause | 42 KB | 2026-10-13 | ◐ | Audio waveform display and navigation, with plugins for regions, spectrograms, timelines and recording. |
| **Tone.js** | `tone` | ★★★★ | MIT | 338 KB | 2026-10-04 | ◐ | A music framework over the Web Audio API: synths, effects, and a transport that keeps musical time. |
| **Cropper.js** | `cropperjs` | ★★★★ | MIT | 36 KB | 2026-10-08 | ✗ | The image cropper: aspect ratios, rotation, zoom, and a canvas of exactly the region selected. |
| **Signature Pad** | `signature_pad` | ★★★★ | MIT | 12 KB | 2026-09-29 | ◐ | Smooth signature capture: variable-width Bézier strokes from pointer input, exported as PNG or SVG. |
| **xterm.js** | `@xterm/xterm` | ★★★★★ | MIT | 283 KB | 2026-10-13 | ✗ | The terminal emulator inside VS Code. Full xterm escape sequence support, GPU-accelerated rendering. |

#### State & reactivity (6)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Zustand** | `zustand` | ★★★★★ | MIT | 1 KB | 2026-09-29 | ✓ | A store in about a kilobyte. No provider, no reducers, no context — you call a hook and read state. |
| **XState** | `xstate` | ★★★★ | MIT | 46 KB | 2026-10-13 | ✓ | Statecharts for JavaScript. You declare the states and the transitions between them; impossible states stop being reachable. |
| **MobX** | `mobx` | ★★★★ | MIT | 54 KB | 2026-10-13 | ✓ | Transparent reactive state: mutate a plain object, and anything that read it re-runs. No selectors, no immutability rules. |
| **RxJS** | `rxjs` | ★★★★ | Apache-2.0 | 86 KB | 2026-08-05 | ✓ | Events as streams you can compose. Debounce, retry, switch, combine — the operators most async bugs are really asking for. |
| **Immer** | `immer` | ★★★★★ | MIT | 14 KB | 2026-10-02 | ✓ | Write mutating code, get an immutable result. A Proxy records your changes and produces a structurally shared copy. |
| **Nano Stores** | `nanostores` | ★★★★ | MIT | 5 KB | 2026-10-14 | ✓ | Framework-agnostic atoms in under a kilobyte, with lazy subscription — a store with no listeners does no work. |

#### Networking & async (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Axios** | `axios` | ★★★★ | MIT | 53 KB | 2026-10-14 | ✓ | The HTTP client most codebases already have. Interceptors, automatic JSON, cancellation, and the same API in Node. |
| **ky** | `ky` | ★★★★ | MIT | 14 KB | 2026-10-09 | ✓ | A tiny wrapper over fetch that adds the things fetch is missing: retries, timeouts, hooks and a throwing error model. |
| **TanStack Query** | `@tanstack/query-core` | ★★★★★ | MIT | 40 KB | 2026-10-15 | ✓ | Server state, treated as its own thing: caching, deduplication, background refetch, stale-while-revalidate. Not a data-fetching library — a cache. |

#### Headless UI logic (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **TanStack Table** | `@tanstack/table-core` | ★★★★★ | MIT | 56 KB | 2026-10-12 | ✓ | A table engine with no markup at all. Sorting, filtering, grouping and pagination as state; you render every cell yourself. |
| **TanStack Virtual** | `@tanstack/virtual-core` | ★★★★★ | MIT | 23 KB | 2026-10-15 | ✓ | Renders only the rows in view. 100,000 items, a couple of dozen DOM nodes. |

#### Forms & input controls (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Tom Select** | `tom-select` | ★★★★★ | Apache-2.0 | 49 KB | 2026-10-02 | ✗ | The maintained successor to Selectize: autocomplete, tagging, remote loading and option creation on a plain select element. |
| **IMask** | `imask` | ★★★★ | MIT | 58 KB | 2024-10-11 | ◐ | Input masking that holds up: phone numbers, card numbers, currency, dates — including paste, deletion and cursor position. |
| **noUiSlider** | `nouislider` | ★★★★ | MIT | 27 KB | 2024-11-26 | ✗ | A range slider with no dependencies: multiple handles, non-linear scales, keyboard support and proper touch behaviour. |
| **Pickr** | `@simonwep/pickr` | ★★★★ | MIT | 23 KB | 2026-09-08 | ✗ | A colour picker with no dependencies, alpha support and every output format you would want. |

#### Overlays & feedback (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **SweetAlert2** | `sweetalert2` | ★★★★ | MIT | 73 KB | 2026-10-14 | ✗ | A replacement for alert(), confirm() and prompt() that is promise-based, themeable and accessible. |
| **PhotoSwipe** | `photoswipe` | ★★★★ | MIT | 53 KB | 2025-12-04 | ✗ | The image lightbox: pinch zoom, momentum panning, keyboard control, and a proper open/close animation from the thumbnail. |
| **Micromodal** | `micromodal` | ★★★★ | ISC | 7 KB | 2026-06-03 | ✗ | 7 KB of accessible modal: focus trapping, aria wiring, escape and overlay dismissal. You bring the markup. |

#### Scroll & layout (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Lenis** | `lenis` | ★★★★ | MIT | 14 KB | 2026-10-01 | ✗ | Smooth scrolling that keeps the real scrollbar and native anchor behaviour, rather than faking the whole viewport. |
| **SimpleBar** | `simplebar` | ★★★★ | MIT | 27 KB | 2025-11-09 | ✗ | Custom scrollbars that keep native scrolling. It styles the bar and leaves the scrolling to the browser. |

#### Templating & text (4)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Handlebars** | `handlebars` | ★★★★ | MIT | 86 KB | 2026-10-05 | ✓ | Logic-less templates that compile to a function. Still the lingua franca for server-rendered HTML and email. |
| **markdown-it** | `markdown-it` | ★★★★★ | MIT | 121 KB | 2026-09-11 | ✓ | The other Markdown parser: CommonMark-exact, plugin-driven, and it exposes the token stream so you can rewrite anything. |
| **jsdiff** | `diff` | ★★★★ | BSD-3-Clause | 77 KB | 2026-10-14 | ✓ | Text diffing: characters, words, lines, sentences, JSON and CSS — plus unified patch output. |
| **Linkify** | `linkifyjs` | ★★★★ | MIT | 19 KB | 2026-06-22 | ✓ | Finds URLs, emails, mentions and hashtags in plain text and turns them into links — with a real scanner, not a regex. |

#### Storage, files & workers (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Dexie.js** | `dexie` | ★★★★★ | Apache-2.0 | 92 KB | 2026-10-14 | ◐ | IndexedDB with an API you can actually use: promises, compound indexes, live queries and versioned migrations. |
| **Comlink** | `comlink` | ★★★★★ | Apache-2.0 | 5 KB | 2025-06-17 | ✓ | Makes a Web Worker look like an object you can await. It hides postMessage behind a proxy. |
| **FilePond** | `filepond` | ★★★★ | MIT | 115 KB | 2026-07-13 | ✗ | A file upload control with drag and drop, previews, reordering, validation and chunked uploads. |

#### Internationalization (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **i18next** | `i18next` | ★★★★★ | MIT | 43 KB | 2026-10-14 | ✓ | The translation framework: interpolation, pluralisation, context, namespaces, fallback chains and lazy loading. |
| **Luxon** | `luxon` | ★★★★★ | MIT | 79 KB | 2026-08-09 | ✓ | Moment's successor from the same author, built on the Intl API. Immutable, time-zone aware, and honest about durations. |
| **date-fns** | `date-fns` | ★★★★★ | MIT | 72 KB | 2026-09-22 | ✓ | 200-odd small functions over the native Date. No wrapper object, no prototype patching — import only what you call. |

#### Client-side search (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **MiniSearch** | `minisearch` | ★★★★★ | MIT | 84 KB | 2025-09-16 | ✓ | A real inverted index in the browser: prefix search, fuzzy matching, field boosting, and an index you can serialise. |
| **FlexSearch** | `flexsearch` | ★★★★ | Apache-2.0 | 16 KB | 2026-05-29 | ✓ | The fastest full-text search library in the browser, by a wide margin, with contextual indexing and worker support. |

#### Crypto & identifiers (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Nano ID** | `nanoid` | ★★★★★ | MIT | 1 KB | 2026-10-10 | ✓ | URL-safe unique ids in 130 bytes, using the platform's cryptographic random source. |
| **uuid** | `uuid` | ★★★★★ | MIT | 11 KB | 2026-10-13 | ✓ | RFC-compliant UUIDs: v4 random, v7 time-ordered, plus the namespace-based v3 and v5. |

#### Games & audio (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Phaser** | `phaser` | ★★★★★ | MIT | 1.1 MB | 2026-08-21 | ◐ | The 2D game framework for the web: scenes, sprites, physics, tweens, input and asset loading in one package. |
| **Howler.js** | `howler` | ★★★★ | MIT | 35 KB | 2025-11-23 | ◐ | Audio for applications and games: sprites, fades, spatial panning, and one API over Web Audio and HTML5 audio. |

#### Delight & micro-interactions (3)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **canvas-confetti** | `canvas-confetti` | ★★★★ | ISC | 24 KB | 2025-10-25 | ◐ | Confetti. It performs well, it can run off the main thread, and it is on rather more production sites than anyone admits. |
| **CountUp.js** | `countup.js` | ★★★★ | MIT | 6 KB | 2026-07-02 | ✓ | Animates a number from one value to another, with easing, grouping and locale-aware formatting. |
| **AutoAnimate** | `@formkit/auto-animate` | ★★★★★ | MIT | 8 KB | 2026-07-10 | ✗ | One function call on a parent element, and every add, remove and reorder inside it animates. That is the whole API. |

#### Icons (2)

| Library | npm | Pick | License | Size | Last update | RN | What it is |
|---|---|---|---|---|---|:--:|---|
| **Lucide** | `lucide` | ★★★★★ | ISC | 340 KB | 2026-10-14 | ✓ | The community fork of Feather, grown to over 1,500 icons. Consistent 24px grid, stroke-based, tree-shakeable. |
| **Feather** | `feather-icons` | ★★★★ | MIT | 74 KB | 2025-03-10 | ✓ | 287 minimal icons on a 24px grid — the set Lucide forked from, still widely used. |

<!-- LIBRARY-TABLES:END -->
