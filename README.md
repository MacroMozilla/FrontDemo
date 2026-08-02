# FrontDemo

**A playground for front-end libraries. 102 of them, each one actually running in the page.**

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
| **React Native & mobile** | Whether the library can be used from a React codebase that also targets phones — see below. |
| **Capabilities** | Eight columns, comparable across all 102 libraries, also available as one big [matrix](https://macromozilla.github.io/FrontDemo/#/matrix). |
| **The source** | The exact builder function that drew the stage, verbatim, at the bottom of every page. |

## The React Native column

This came out of a real question: *if my app is React on the web and React Native on phones, which of
these can I actually use?*

| Mark | Meaning |
|:--:|---|
| ✓ | Runs in a React Native / Expo app **on device** — either through an official native port (MapLibre, Lottie, Babylon, three.js via `expo-gl`) or because the library is pure JavaScript with no DOM access, so you can drive `react-native-svg` or Skia with it (D3's scale/shape modules, Matter.js, Turf, perfect-freehand, Rough.js, `qrcode`, Zod, Day.js, Fuse.js). |
| ◐ | Works on **Expo web only**, through `react-native-web`. On device you would need `react-native-webview`. This is where most DOM and canvas libraries land. |
| ✗ | No path into a React Native app at all — Lit's custom elements, Alpine's HTML directives, htmx's hypermedia model, html2canvas's DOM rasteriser. |

Every library page also carries a one-line note naming the specific package or technique you would
reach for, so a ◐ is never just a shrug.

## Themes

Two palettes, dark and light, neither of them pure black. Demos read their colours from theme tokens
rather than hard-coding hex values, so switching the theme re-renders the current demo in the new
palette instead of leaving a dark chart on a white page.

## Running it

It is a static site with no build step:

```bash
git clone https://github.com/MacroMozilla/FrontDemo.git
cd FrontDemo
npx http-server -p 8080     # or python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Project structure

```
index.html                  the shell — everything else is rendered by JS
assets/css/app.css          layout, both themes, and the shared demo primitives
assets/css/vendor.css       stylesheets the older libraries ship with, merged
assets/css/lib/*.css        per-library stylesheets, loaded on demand
assets/js/data.js           ★ single source of truth: libraries, categories, capabilities
assets/js/app.js            sidebar, search, routing, theming, the demo context API
assets/js/demos/*.js        one file per area; every demo builder lives here
assets/fragments/*.html     HTML fragments the htmx demo fetches
vendor/*.js                 pinned browser builds of every library
scripts/check.mjs           static checks, run in CI before each deploy
scripts/verify.mjs          drives all 102 pages in headless Chromium
scripts/probe.mjs           prints what global a vendor build exposes
scripts/shot.mjs            screenshots one route in either theme
```

## Adding a library

1. Drop its browser build into `vendor/`, and any stylesheet into `assets/css/lib/`.
2. Add one entry to `LIBS` in `assets/js/data.js`.
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
and lifecycle hooks (`raf`, `every`, `after`, `on`, `onResize`, `onDestroy`) that are all torn down
automatically when you navigate away.

4. Run the checks:

```bash
node scripts/check.mjs             # registry integrity, missing builders, missing vendor files
node scripts/verify.mjs            # every page in headless Chromium
node scripts/verify.mjs mylib      # just yours
node scripts/verify.mjs --shots    # also write screenshots to /tmp/fd-shots
```

`scripts/verify.mjs` needs Playwright's Chromium; `npm i -D playwright` if you do not have it.

## Deployment

`.github/workflows/deploy.yml` publishes to GitHub Pages on every push to the working branch.
`scripts/check.mjs` gates the deploy, so a library with no builder — or a `vendor/` file that was
never committed — fails the build instead of shipping a blank stage.

## A note on versions and licences

The version badge on each page is the **latest release on npm**, checked against the registry.
`vendor/` holds a **pinned browser build**, which for a few libraries is an older major line —
those pages say *running X here* and the demo is written against that API.

Licences are as declared on npm and worth reading before you ship:

- **GSAP** uses its own no-charge licence, not an OSI one.
- **ApexCharts** publishes as `SEE LICENSE IN LICENSE`.
- **p5.js** is LGPL-2.1.
- **JointJS** is MPL-2.0, with the polished tier commercial.
- **AG Grid**'s community build is MIT; row grouping and the pivot panel are Enterprise, which is why
  this demo stays inside what the free build ships.

Everything under `vendor/` belongs to its respective authors and is included unmodified. The code in
`assets/`, `scripts/` and `index.html` is MIT — see [LICENSE](LICENSE).

---

## Every library

★ is how readily I would reach for it, not a quality score. **RN** is the React Native column
described above.

### Graphics & visualization

#### Diagrams & node editors (7)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **AntV X6** | `@antv/x6` | ★★★★★ | MIT | 483 KB | ◐ | A diagram engine with the boring parts already solved: ports, snapping, orthogonal routing, undo. |
| **React Flow** | `@xyflow/react` | ★★★★★ | MIT | 376 KB | ◐ | The node editor most React apps end up using. Every node is your own React component. |
| **Vue Flow** | `@vue-flow/core` | ★★★★ | MIT | 164 KB | ✗ | React Flow's model, ported to Vue. Same concepts, Vue components instead. |
| **JointJS** | `@joint/core` | ★★★★ | MPL-2.0 | 462 KB | ◐ | The old guard of browser diagramming: a full shape/link/tool model you extend. |
| **diagram-js** | `diagram-js` | ★★★ | MIT | 121 KB | ◐ | The kernel underneath bpmn.io. Canvas, selection, dragging and an undoable command stack — and nothing else. The core is 35 KB; the build here adds the modeling, move, connect and bendpoint features. |
| **Baklava.js** | `baklavajs` | ★★★ | MIT | 172 KB | ✗ | A node editor where the graph is also a program — connect nodes and values flow through them. |
| **maxGraph** | `@maxgraph/core` | ★★★ | Apache-2.0 | 609 KB | ◐ | The maintained TypeScript successor to mxGraph, the engine that powered draw.io for a decade. |

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

#### Charts (9)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **ECharts** | `echarts` | ★★★★★ | Apache-2.0 | 1.1 MB | ✓ | The most complete open-source chart library there is. If a chart type exists, ECharts has it. |
| **Chart.js** | `chart.js` | ★★★★★ | MIT | 204 KB | ◐ | The sensible default. Eight chart types, good animations, small bundle, huge community. |
| **ApexCharts** | `apexcharts` | ★★★★ | See LICENSE file | 561 KB | ◐ | Dashboard charts that look finished out of the box — annotations, brush zoom, sparklines included. |
| **AntV G2** | `@antv/g2` | ★★★★ | MIT | 1.0 MB | ◐ | A grammar of graphics implementation: you compose marks and scales instead of picking a chart type. |
| **billboard.js** | `billboard.js` | ★★★★ | MIT | 774 KB | ◐ | A maintained, modernised take on C3.js, built on D3. |
| **Plotly.js** | `plotly.js-basic-dist-min` | ★★★★ | MIT | 1.1 MB | ◐ | Scientific charting with a built-in toolbar — the JS half of the Python/R Plotly family. |
| **Recharts** | `recharts` | ★★★★ | MIT | 766 KB | ◐ | Charts as JSX. Every axis, bar and tooltip is a React component in your tree. |
| **Chartist** | `chartist` | ★★★ | MIT OR WTFPL | 37 KB | ◐ | 37 KB of pure SVG charts where the styling is entirely CSS's job. |
| **chart.xkcd** | `chart.xkcd` | ★★★ | MIT | 152 KB | ◐ | Charts drawn in the xkcd hand-sketched style — for when a chart should read as a sketch, not a result. |

#### High-performance charts (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Lightweight Charts** | `lightweight-charts` | ★★★★★ | Apache-2.0 | 192 KB | ✓ | TradingView's financial chart core: candles, volume, crosshair, at 45 KB gzipped. |
| **Dygraphs** | `dygraphs` | ★★★★ | MIT | 127 KB | ◐ | An old, extremely fast time-series charter designed for very dense data. |
| **µPlot** | `uplot` | ★★★★★ | MIT | 50 KB | ◐ | 50 KB that plots 150,000 points in around 100 ms. The benchmark other chart libraries get compared against. |
| **webgl-plot** | `webgl-plot` | ★★★ | MIT | 79 KB | ◐ | A WebGL line plotter for real-time streams — oscilloscopes, sensor traces, audio. |

#### Grammar & low-level kits (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **D3.js** | `d3` | ★★★★★ | ISC | 273 KB | ✓ | Not a chart library — a box of primitives (scales, shapes, layouts, transitions, geo projections) that most other chart libraries are built on top of. |
| **Vega-Lite** | `vega-lite` | ★★★★★ | BSD-3-Clause | 245 KB | ✓ | A JSON grammar for statistical graphics. You describe the chart; the compiler decides how to draw it. |
| **Vega** | `vega` | ★★★★ | BSD-3-Clause | 504 KB | ✓ | The lower layer Vega-Lite compiles down to: a full visualization runtime described by JSON. |
| **Observable Plot** | `@observablehq/plot` | ★★★★ | ISC | 204 KB | ◐ | D3's own team asking 'what if the common case were one line?'. Marks and transforms over D3. |

#### 2D canvas & SVG engines (7)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Konva** | `konva` | ★★★★★ | MIT | 182 KB | ◐ | A canvas scene graph with hit detection, layers, transforms and events — the shortest path to a custom editor. |
| **Fabric.js** | `fabric` | ★★★★★ | MIT | 292 KB | ◐ | The canvas library behind most browser image editors: selection boxes, group transforms, JSON serialisation, SVG import/export. |
| **PixiJS** | `pixi.js` | ★★★★★ | MIT | 779 KB | ◐ | The fastest 2D WebGL renderer on the web. Games, particle systems, and any UI that has to move. |
| **Paper.js** | `paper` | ★★★★ | MIT | 234 KB | ◐ | A vector graphics scene graph with real boolean path operations — unite, subtract, intersect — on curves. |
| **SVG.js** | `@svgdotjs/svg.js` | ★★★★ | MIT | 90 KB | ◐ | A small chainable wrapper for building and animating SVG — jQuery's ergonomics for vector graphics. |
| **Two.js** | `two.js` | ★★★ | MIT | 199 KB | ◐ | One drawing API that can output SVG, Canvas or WebGL — you pick the renderer at construction time. |
| **ZRender** | `zrender` | ★★★ | BSD-3-Clause | 215 KB | ◐ | The rendering kernel ECharts is built on, usable on its own. |

#### Creative coding & physics (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **p5.js** | `p5` | ★★★★ | LGPL-2.1 | 1.0 MB | ◐ | Processing for the web. The library that teaches most people creative coding: setup(), draw(), and go. |
| **Matter.js** | `matter-js` | ★★★★ | MIT | 82 KB | ✓ | A rigid-body 2D physics engine: gravity, collisions, constraints, friction. |
| **Zdog** | `zdog` | ★★★ | MIT | 29 KB | ◐ | A 29 KB pseudo-3D engine: real 3D maths, flat-shaded round shapes, canvas or SVG output. |
| **Rough.js** | `roughjs` | ★★★★ | MIT | 27 KB | ✓ | Draws in a hand-sketched style. It is what makes Excalidraw look like Excalidraw. |

#### Whiteboards & freehand (2)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Excalidraw** | `@excalidraw/excalidraw` | ★★★★★ | MIT | 1.1 MB | ◐ | An entire whiteboard app you embed as one React component — tools, undo, export, collaboration hooks. |
| **perfect-freehand** | `perfect-freehand` | ★★★★★ | MIT | 5 KB | ✓ | 5 KB that turns pointer positions into a pressure-sensitive stroke outline. Not a renderer — just the maths. |

#### Maps & geospatial (6)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **MapLibre GL** | `maplibre-gl` | ★★★★★ | BSD-3-Clause | 1.0 MB | ✓ | The community fork of Mapbox GL JS from before it went proprietary. Vector tiles, GPU rendering, 3D tilt. |
| **Leaflet** | `leaflet` | ★★★★★ | BSD-2-Clause | 144 KB | ◐ | The most widely deployed map library on the web. 144 KB, no dependencies, and a plugin for everything. |
| **deck.gl** | `deck.gl` | ★★★★★ | MIT | 1.6 MB | ◐ | Uber's GPU layer system for very large geospatial datasets — millions of points, arcs, hexbins. |
| **OpenLayers** | `ol` | ★★★★ | BSD-2-Clause | 1019 KB | ◐ | The GIS-grade option: projections, WMS/WFS, editing, measurement — the serious mapping stack. |
| **AntV L7** | `@antv/l7` | ★★★★ | MIT | 1.4 MB | ◐ | AntV's geospatial visualization engine, strong on Chinese basemaps and stylised layers. |
| **Turf.js** | `@turf/turf` | ★★★★★ | MIT | 550 KB | ✓ | Geospatial analysis in plain JavaScript: buffers, unions, distance, point-in-polygon, clustering. No map required. |

#### 3D & WebGL (3)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Three.js** | `three` | ★★★★★ | MIT | 654 KB | ✓ | The default way to do 3D on the web. Scene, camera, lights, materials, loaders, post-processing. |
| **Babylon.js** | `@babylonjs/core` | ★★★★ | Apache-2.0 | 7.4 MB | ✓ | A full 3D engine rather than a renderer: physics, animation, audio, XR, and an in-browser editor. |
| **3Dmol.js** | `3dmol` | ★★★★ | BSD-3-Clause | 525 KB | ◐ | Molecular visualization: parses PDB/SDF/CIF and renders cartoons, sticks, surfaces. |

#### Animation (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **GSAP** | `gsap` | ★★★★★ | No-charge standard license | 71 KB | ✓ | The professional animation engine. Timelines, staggers, scroll triggers, and it will animate literally any property. |
| **anime.js** | `animejs` | ★★★★ | MIT | 17 KB | ✓ | 17 KB of tidy animation: CSS properties, SVG attributes, DOM attributes and plain JS objects. |
| **Lottie** | `lottie-web` | ★★★★★ | MIT | 298 KB | ✓ | Plays animations exported from After Effects as JSON. Designers animate; you ship the file. |
| **Motion** | `motion` | ★★★★★ | MIT | 64 KB | ◐ | Framer Motion's engine, now framework-agnostic. Springs, layout animation and gestures on the Web Animations API. |

#### Text to diagram (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Mermaid** | `mermaid` | ★★★★★ | MIT | 3.3 MB | ◐ | Markdown-ish text in, laid-out diagram out. Flowcharts, sequence, class, gantt, ER, state. |
| **Viz.js (Graphviz)** | `@viz-js/viz` | ★★★★ | MIT | 1.3 MB | ◐ | Real Graphviz compiled to WebAssembly. The same dot layout engine everyone has used since 1991. |
| **WaveDrom** | `wavedrom` | ★★★★ | MIT | 39 KB | ◐ | Digital timing diagrams from JSON. Standard equipment in hardware documentation. |
| **Pintora** | `@pintora/standalone` | ★★★ | MIT | 582 KB | ◐ | A Mermaid-style text-to-diagram renderer at a sixth of the size, with good CJK text handling. |

#### Gantt & timelines (3)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Frappe Gantt** | `frappe-gantt` | ★★★★ | MIT | 47 KB | ◐ | A small, good-looking Gantt chart where bars are draggable and dependencies redraw themselves. |
| **vis-timeline** | `vis-timeline` | ★★★★ | Apache-2.0 OR MIT | 534 KB | ◐ | A zoomable, editable timeline that scales from milliseconds to centuries. |
| **jsGantt Improved** | `jsgantt-improved` | ★★★ | ISC | 234 KB | ◐ | A project-management Gantt: durations, percent complete, owners, cost, collapsible groups. |

#### Mind maps (2)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Mind Elixir** | `mind-elixir` | ★★★★ | MIT | 88 KB | ◐ | A drop-in mind map editor: editable nodes, drag to re-parent, keyboard shortcuts, undo. |
| **jsMind** | `jsmind` | ★★★ | BSD-3-Clause | 50 KB | ◐ | A long-lived 50 KB mind map renderer and editor with no dependencies. |

#### Data grids & pivots (3)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **AG Grid** | `ag-grid-community` | ★★★★★ | MIT | 1.9 MB | ◐ | The enterprise data grid. Virtual scrolling, grouping, pinning, editing, filtering — the community build alone is substantial. |
| **Tabulator** | `tabulator-tables` | ★★★★ | MIT | 436 KB | ◐ | A fully MIT data grid with editing, grouping, downloads and formatters included, no paid tier. |
| **AntV S2** | `@antv/s2` | ★★★★ | MIT | 1.1 MB | ◐ | A canvas-rendered pivot table — multi-level rows and columns, the way a BI tool does it. |

#### Documents, codes & export (6)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **JsBarcode** | `jsbarcode` | ★★★★ | MIT | 65 KB | ◐ | Renders CODE128, EAN, UPC, ITF, Codabar and more into a canvas or SVG element. |
| **QRCode** | `qrcode` | ★★★★★ | MIT | 25 KB | ✓ | The reference QR generator for JavaScript: canvas, SVG, data URL, or a raw bit matrix. |
| **PDF.js** | `pdfjs-dist` | ★★★★★ | Apache-2.0 | 313 KB | ◐ | Mozilla's PDF renderer — the one built into Firefox. Parses and rasterises PDF entirely in JavaScript. |
| **jsPDF** | `jspdf` | ★★★★ | MIT | 357 KB | ◐ | Generates PDF files client-side: text, vectors, images, tables, and metadata. |
| **html2canvas** | `html2canvas` | ★★★ | MIT | 194 KB | ✗ | Screenshots a DOM subtree by re-implementing a chunk of CSS layout onto a canvas. |
| **KaTeX** | `katex` | ★★★★★ | MIT | 270 KB | ◐ | Khan Academy's maths typesetter. Renders LaTeX to HTML synchronously and far faster than MathJax. |

### Web app building blocks

#### Editors & rich text (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **CodeMirror 6** | `codemirror` | ★★★★★ | MIT | 554 KB | ◐ | A code editor rebuilt from scratch around immutable state and a transaction model. Accessible, mobile-capable, extensible. |
| **Quill** | `quill` | ★★★★ | BSD-3-Clause | 204 KB | ◐ | A rich-text editor whose document model is Delta — a JSON operation list, not HTML. |
| **marked** | `marked` | ★★★★★ | MIT | 39 KB | ✓ | The fast, small Markdown compiler. Text in, HTML out, with a hookable renderer. |
| **highlight.js** | `highlight.js` | ★★★★ | BSD-3-Clause | 125 KB | ✓ | Syntax highlighting for around 190 languages, with automatic language detection. |

#### Interaction & UI behaviour (5)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **SortableJS** | `sortablejs` | ★★★★★ | MIT | 44 KB | ✗ | Drag-and-drop list reordering, including between lists. No dependencies, works on touch. |
| **interact.js** | `interactjs` | ★★★★ | MIT | 96 KB | ✗ | Drag, resize and multi-touch gestures on any element, with snapping, inertia and restriction modifiers. |
| **Floating UI** | `@floating-ui/dom` | ★★★★★ | MIT | 10 KB | ✓ | The positioning engine under most tooltip and dropdown libraries. Places a floating element and keeps it on screen. |
| **Swiper** | `swiper` | ★★★★★ | MIT | 150 KB | ✗ | The touch slider that ships in a large share of the world's mobile web. Carousels, coverflow, parallax, virtual slides. |
| **Driver.js** | `driver.js` | ★★★★ | MIT | 21 KB | ✗ | Product tours and feature highlights: dims the page, spotlights an element, walks the user through steps. |

#### Data, files & validation (5)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Fuse.js** | `fuse.js` | ★★★★★ | Apache-2.0 | 26 KB | ✓ | Fuzzy search over a local array. Typo-tolerant, weighted across fields, no index server needed. |
| **Papa Parse** | `papaparse` | ★★★★★ | MIT | 19 KB | ✓ | The CSV parser for JavaScript. Streaming, worker-threaded, and it gets the quoting edge cases right. |
| **SheetJS** | `xlsx` | ★★★★ | Apache-2.0 | 861 KB | ✓ | Reads and writes Excel, ODS, CSV and a dozen other spreadsheet formats, entirely in the browser. |
| **Day.js** | `dayjs` | ★★★★★ | MIT | 7 KB | ✓ | Moment.js's API in 7 KB, immutable, with everything else behind opt-in plugins. |
| **Zod** | `zod` | ★★★★★ | MIT | 173 KB | ✓ | Schema validation where the TypeScript type is inferred from the schema — one definition, not two. |

#### Utility & computation (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Lodash** | `lodash` | ★★★★ | MIT | 71 KB | ✓ | The utility belt: groupBy, cloneDeep, debounce, chunk, and 300 more, each handling the edge cases. |
| **chroma.js** | `chroma-js` | ★★★★★ | BSD-3-Clause AND Apache-2.0 | 41 KB | ✓ | Colour manipulation done properly: perceptual colour spaces, scales, interpolation, contrast checks. |
| **math.js** | `mathjs` | ★★★★ | Apache-2.0 | 668 KB | ✓ | An extensive maths library with an expression parser, matrices, complex numbers, units and symbolic derivatives. |
| **DOMPurify** | `dompurify` | ★★★★★ | MPL-2.0 OR Apache-2.0 | 22 KB | ◐ | The XSS sanitiser. Give it untrusted HTML, get back HTML that is safe to insert. |

#### Frameworks & runtimes (4)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **Preact** | `preact` | ★★★★★ | MIT | 11 KB | ✗ | React's API and component model in 3 KB gzipped, with the same hooks and a compatibility layer. |
| **Alpine.js** | `alpinejs` | ★★★★ | MIT | 44 KB | ✗ | Reactivity as HTML attributes. Sprinkle x-data and x-on onto server-rendered markup and you are done. |
| **Lit** | `lit` | ★★★★ | BSD-3-Clause | 15 KB | ✗ | Web Components with a thin, fast reactive layer. Real custom elements that work in any framework. |
| **htmx** | `htmx.org` | ★★★★ | 0BSD | 50 KB | ✗ | Extends HTML so any element can issue a request and swap the response into the page. The server sends HTML, not JSON. |

#### Media, audio & devices (5)

| Library | npm | Pick | License | Size | RN | What it is |
|---|---|---|---|---|:--:|---|
| **WaveSurfer.js** | `wavesurfer.js` | ★★★★ | BSD-3-Clause | 42 KB | ◐ | Audio waveform display and navigation, with plugins for regions, spectrograms, timelines and recording. |
| **Tone.js** | `tone` | ★★★★ | MIT | 338 KB | ◐ | A music framework over the Web Audio API: synths, effects, and a transport that keeps musical time. |
| **Cropper.js** | `cropperjs` | ★★★★ | MIT | 36 KB | ✗ | The image cropper: aspect ratios, rotation, zoom, and a canvas of exactly the region selected. |
| **Signature Pad** | `signature_pad` | ★★★★ | MIT | 12 KB | ◐ | Smooth signature capture: variable-width Bézier strokes from pointer input, exported as PNG or SVG. |
| **xterm.js** | `@xterm/xterm` | ★★★★★ | MIT | 283 KB | ✗ | The terminal emulator inside VS Code. Full xterm escape sequence support, GPU-accelerated rendering. |

