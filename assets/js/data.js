/* ------------------------------------------------------------------
   FrontDemo — single source of truth.

   Everything on the page (sidebar, search, detail pages, comparison
   table and matrix, counters) is generated from the tables below.
   Add a library here, write a builder in assets/js/demos/*.js, done.

   Version / release date / license are the real values published on
   the npm registry (or, for draw.io, on its GitHub releases), and the
   commit date is the newest commit on each repository; all of them are
   refreshed by scripts/freshness.mjs. `kb` is the size of the browser
   build the demo actually downloads.
   ------------------------------------------------------------------ */

/* Top-level sections in the sidebar. */
window.GROUPS = [
  { id: "graph", name: "Graphs",
    blurb: "Graph editing on one side, graph visualization on the other." }
];

/* Categories. Order here is the order in the sidebar. */
window.CATS = [
  { id: "flow",  g: "graph", name: "Diagram & flow editors",
    blurb: "Nine frameworks, one flowchart, each in its out-of-the-box form." },
  { id: "graph", g: "graph", name: "Graphs & networks",
    blurb: "Force layouts, clustering, graph algorithms." }
];

/* Capability columns, in matrix order. `c` on each library is eight
   marks separated by spaces, matching this array position for position.
   y = yes   p = partly / needs work   n = no   a = not applicable      */
window.CAPS = [
  { id: "edit",  short: "Interactive<br>editing",  full: "The user can drag, draw or modify what is on screen — not just look at it." },
  { id: "data",  short: "Data<br>driven",          full: "Hand it an array and it renders. You are not placing coordinates by hand." },
  { id: "big",   short: "Scales to<br>10k+",       full: "Stays responsive with tens of thousands of elements or data points." },
  { id: "gpu",   short: "GPU /<br>Canvas",         full: "Renders through Canvas or WebGL rather than one DOM node per element." },
  { id: "react", short: "React<br>binding",        full: "A first-party (or de-facto standard) React wrapper exists." },
  { id: "touch", short: "Touch &<br>mobile web",   full: "Pointer/touch gestures work, and it is usable on a phone-sized screen." },
  { id: "rn",    short: "React Native<br>/ Expo",  full: "Usable from a React Native / Expo app running on a real device. y = runs natively (official port or pure JS you can drive react-native-svg with). p = works on Expo web only; on native you need react-native-webview. n = no path into a React Native app." },
  { id: "ts",    short: "TypeScript<br>types",     full: "Ships its own type declarations." }
];

/* Mark rendering. */
window.MK = { y: ["y", "✓"], p: ["p", "◐"], n: ["n", "✗"], a: ["a", "—"] };

/* The day the versions, release dates and commit dates below were last
   looked up. `node scripts/freshness.mjs --write` refreshes them all. */
window.CHECKED = "2026-10-14";

/* ------------------------------------------------------------------
   Libraries.
     k       key, used in the URL (#/l/key)
     n/pkg   display name / npm package
     ver     latest version on npm (draw.io: latest GitHub release)
     pub     when that version was published
     commit  date of the newest commit on the repository's default branch
     vend    the version actually running here, when it is not ver
     lic     license as declared on npm
     kb      size of the browser build the demo downloads
     cat     category id
     st      how strongly I'd reach for it, 1-5
     c       capability marks, see CAPS
     rnNote  the honest React Native story
     what    one line: what this thing actually is
     pro/con the trade-off in one line each
     try     what to do in the demo
     js/css  vendor files the demo needs, loaded in order
     esm     an ES-module build under vendor/, imported into ctx.mod
     site    homepage            repo  GitHub owner/name

   Diagram editors only — they feed the comparison table on the
   overview page:
     render  what draws the diagram
     ui      which UI framework you write it in
     box     what the library hands you without writing UI yourself
     build   where the build on this page came from, when that is unusual
     npm     false when there is no npm package to install
     ext     the host the demo loads its code from, when not vendor/
   ------------------------------------------------------------------ */
window.LIBS = [

/* ---------------- Diagram & flow editors ----------------
   Ordered as in the brief this section was built from. Every demo draws
   the same approval flowchart with the library's own default shapes,
   theme and stock UI, so the pages compare like for like. */
{ k:"xyf", n:"React Flow", pkg:"@xyflow/react", ver:"12.12.0", pub:"2026-09-24", commit:"2026-09-24", lic:"MIT", kb:395, cat:"flow", st:5,
  c:"y y p n y y p y",
  render:"HTML nodes, SVG edges", ui:"React (Svelte Flow for Svelte)",
  box:"Controls, MiniMap, Background, connect, multi-select, keyboard delete",
  what:"The node-based editor most React apps end up using. Nodes are your own React components; the library owns the viewport, dragging, selection and wiring.",
  pro:"Nodes are ordinary React components, the docs are the best of the nine, and the ecosystem (layouts, templates, examples) is the largest",
  con:"React only, and it is a node editor rather than a diagramming kit: no shape library, no auto-layout, and undo/redo or helper lines are recipes you build (or buy as Pro examples)",
  try:"Drag a node. Drag from the dot under a node onto the dot above another to connect them. Click an edge or node and press Backspace to delete it. Bottom-left is the stock <Controls/>, bottom-right the stock <MiniMap/>.",
  rnNote:"No React Native renderer. Expo web works through react-native-web; on a device you would host it in a WebView.",
  js:["xyflow"], css:["xyflow"], site:"https://reactflow.dev/", repo:"xyflow/xyflow" },

{ k:"m2d", n:"meta2d.js", pkg:"@meta2d/core", ver:"2.0.0", vend:"1.1.32", pub:"2026-09-18", commit:"2026-10-14", lic:"MIT", kb:766, cat:"flow", st:3,
  c:"y y y y n y p y",
  render:"Canvas", ui:"any (plain JS)",
  box:"anchors and line drawing, resize and rotate handles, undo/redo, minimap, line styles, flowchart pens",
  build:"official bundle entry, rebuilt on @meta2d/core 1.1.32",
  what:"Le5le's canvas engine for interactive 2D diagrams and SCADA screens. Shapes ('pens') and lines live on one canvas with anchors, resize and rotate handles, animation and live data binding.",
  pro:"Canvas rendering with a large pen library (flowchart, activity, class, sequence, charts) and data binding built for real-time dashboards",
  con:"Documentation is mostly Chinese. The 2.0.0 on npm (September 2026) is a worker-based rewrite whose build points at .ts worker files it does not ship, so this page runs the 1.x line that GitHub and the docs describe",
  try:"Hover a shape to show its anchors, then drag from one anchor to another shape to draw a line. Click a shape for resize and rotate handles; Ctrl/⌘+Z undoes. The bar adds shapes, switches the line style and toggles the minimap.",
  rnNote:"Web only (canvas plus DOM events); on a device you would need a WebView.",
  js:["meta2d"], site:"https://doc.le5le.com/document/136", repo:"le5le-com/meta2d.js" },

{ k:"joint", n:"JointJS", pkg:"@joint/core", ver:"4.3.3", pub:"2026-09-04", commit:"2026-10-14", lic:"MPL-2.0", kb:463, cat:"flow", st:4,
  c:"y y p n p y p y",
  render:"SVG", ui:"any (plain JS; @joint/react for React)",
  box:"model/view split, standard shapes, routers and connectors, link tools, element tools",
  what:"The open-source core of JointJS: a graph model of cells and an SVG paper that renders it, with standard shapes, ports, routers, connectors and interactive tools.",
  pro:"A clean model/view split and a very complete, well-documented core; link tools, routers (manhattan, metro) and connectors come free",
  con:"No editor UI in the open-source core — stencil, inspector, undo/redo (CommandManager) and minimap are JointJS+, which is commercial; core is MPL-2.0",
  try:"Drag shapes. Hover a link for its tools: drag the small handles to add bends or move an end, the ✕ deletes it. Hover a shape and drag its round connect handle onto another shape to draw a link.",
  rnNote:"Web only; WebView on native.",
  js:["joint"], site:"https://www.jointjs.com/", repo:"clientIO/joint" },

{ k:"lf", n:"LogicFlow", pkg:"@logicflow/core", ver:"2.2.5", pub:"2026-07-30", commit:"2026-10-10", lic:"Apache-2.0", kb:991, cat:"flow", st:4,
  c:"y y p n p p p y",
  render:"SVG", ui:"any (plain JS; React and Vue node renderers)",
  box:"flowchart nodes, drag-in panel, control bar, context menu, minimap, snaplines, undo/redo, box select",
  what:"Didi's flowchart editing framework: an MVC core with built-in flowchart nodes and a large set of first-party extensions — drag-in panel, control bar, menus, minimap, BPMN.",
  pro:"The most complete free flowchart editor in a box: undo/redo, shortcuts, snaplines, a drag-in panel, context menus and a minimap are all first-party",
  con:"Docs and community are mainly Chinese, custom nodes go through its own model/view classes, and SVG rendering slows down on very large graphs",
  try:"Drag a shape from the panel on the left onto the canvas. Hover a node to show its anchors and drag one onto another node to connect. Right-click for the menu, double-click to edit text. Top-right zooms, undoes and redoes.",
  rnNote:"Web only; WebView on native.",
  js:["logicflow","logicflow-ext"], css:["logicflow","logicflow-ext"], site:"https://site.logic-flow.cn/", repo:"didi/LogicFlow" },

{ k:"max", n:"maxGraph", pkg:"@maxgraph/core", ver:"0.25.0", pub:"2026-10-06", commit:"2026-10-14", lic:"Apache-2.0", kb:613, cat:"flow", st:3,
  c:"y y p n n p p y",
  render:"SVG", ui:"any (plain JS)",
  box:"rubber-band select, connections, in-place label editing, undo manager, keyboard handler, XML codec",
  what:"The TypeScript successor to mxGraph, the engine draw.io was built on, maintained by the community since mxGraph was archived. A graph model, an SVG view, and a deep set of handlers, styles and layouts.",
  pro:"Decades of diagramming in the core: swimlanes, grouping and folding, many edge styles, layouts, an undo manager and XML round-tripping",
  con:"Still pre-1.0 with API changes most releases; the API shows its mxGraph age, and there is no editor UI (palette, toolbar, format panel) to start from",
  try:"Grab a shape near its border to move it; drag from its middle onto another shape to connect them — maxGraph's default hotspot is the centre of the shape. Double-click to edit a label, drag on empty space to rubber-band select, right-drag to pan, Delete removes. Undo and zoom are in the bar.",
  rnNote:"Web only; WebView on native.",
  js:["maxgraph"], css:["maxgraph"], site:"https://maxgraph.github.io/maxGraph/", repo:"maxGraph/maxGraph" },

{ k:"drawio", n:"draw.io", pkg:"jgraph/drawio", npm:false, ver:"32.4.1", pub:"2026-10-08", commit:"2026-10-08", lic:"Apache-2.0", kb:9972, cat:"flow", st:4,
  c:"y p p n p y p n",
  render:"the whole app, in an iframe", ui:"any (postMessage)",
  box:"the complete draw.io editor: every shape library, format panel, layers, find, export",
  ext:"embed.diagrams.net",
  what:"The complete draw.io editor, embedded the way draw.io documents it: an iframe in embed mode, driven over postMessage with a small JSON protocol. Not a library — the whole application.",
  pro:"Nothing to build: the full editor your users may already know, every shape library, styles, layers and export, free and Apache-2.0",
  con:"It is an iframe. You trade XML over postMessage and cannot put your own components on the canvas; self-hosting means shipping the whole webapp",
  try:"This is the real editor. Drag shapes in from the left, restyle them on the right, use the menus. The flowchart arrived in a load message; press Data to ask draw.io for the XML back with an export message.",
  rnNote:"No native component. On a device it is a web page in a WebView, like anything else.",
  js:[], site:"https://www.drawio.com/doc/faq/embed-mode", repo:"jgraph/drawio" },

{ k:"dnx", n:"Plait / Drawnix", pkg:"@plait/core", ver:"0.94.1", pub:"2026-09-23", commit:"2026-09-07", lic:"MIT", kb:681, cat:"flow", st:3,
  c:"y y p n y y p y",
  render:"SVG", ui:"React (Plait core is framework-agnostic)",
  box:"whiteboard toolbar, flowchart shapes, arrows, mind maps, pen, text, themes, export, Mermaid import",
  build:"Drawnix built from source @ b138ff8",
  what:"Plait is a plugin-based drawing framework — flowchart shapes, mind maps, freehand — and Drawnix is the open-source whiteboard built on it. This page mounts the Drawnix React component.",
  pro:"Whiteboard, flowchart and mind map in one MIT app; Plait's plugins let you take just the pieces you need, and Mermaid and Markdown import are built in",
  con:"Young and pre-1.0 with a small team, thin documentation, and Drawnix stopped publishing to npm in December 2025 while its repository kept moving",
  try:"Drawnix opens on its hand tool, so dragging pans. Pick the arrow (V) to select and move shapes — a selected shape shows dots on each side to drag new arrows from — or take shapes, arrows, pen, text or mind map from the toolbar. The menu at top-left exports and converts Mermaid.",
  rnNote:"Web only; WebView on native.",
  js:[], esm:"drawnix/drawnix.js", css:["drawnix"], site:"https://drawnix.com/", repo:"plait-board/drawnix" },

{ k:"fgm", n:"FlowGram", pkg:"@flowgram.ai/free-layout-editor", ver:"1.0.16", pub:"2026-10-13", commit:"2026-10-12", lic:"MIT", kb:1000, cat:"flow", st:4,
  c:"y y p n y p p y",
  render:"HTML nodes, SVG lines", ui:"React",
  box:"free-layout canvas, ports, node forms, minimap, snapping, auto-layout, undo/redo, line styles",
  what:"ByteDance's workflow-canvas framework, the engine behind Coze-style AI workflow builders. Nodes are React components backed by a form engine; plugins add minimap, snapping, auto-layout and history.",
  pro:"Built for workflow builders: per-node forms and variables, typed ports, auto-layout and undo/redo, in both free and fixed (structured) layouts",
  con:"A heavy dependency-injection architecture (inversify) with a real learning curve, and the starter UI is deliberately bare — you design the nodes and the toolbar",
  try:"Drag Node or Condition from the left panel onto the canvas. Drag from a port on a node's right edge to another node's left edge. The bottom bar zooms, fits, auto-lays-out, switches line style and undoes; the minimap sits above it.",
  rnNote:"No React Native renderer; WebView on native.",
  js:["flowgram"], css:["flowgram"], site:"https://flowgram.ai/", repo:"bytedance/flowgram.ai" },

{ k:"x6", n:"AntV X6", pkg:"@antv/x6", ver:"3.1.8", pub:"2026-08-11", commit:"2026-10-14", lic:"MIT", kb:590, cat:"flow", st:4,
  c:"y y p n p y p y",
  render:"SVG (HTML nodes optional)", ui:"any (React and Vue node shapes)",
  box:"stencil, ports, selection, snaplines, history, clipboard, keyboard, transform, minimap",
  what:"Ant Group's graph-editing engine: SVG nodes and edges with ports, routers and connectors, plus stencil, selection, snapline, history, clipboard, keyboard, transform and minimap — all in the core package since 3.0.",
  pro:"Everything an editor needs is in one MIT package, documented in Chinese and English, with React and Vue node shapes",
  con:"Commit activity has dropped to a trickle in 2026, and SVG rendering drops frames past a couple of thousand nodes",
  try:"Drag a shape in from the stencil on the left. Hover a node to show its ports and drag from one onto another node. Drag on blank space to box-select; Ctrl/⌘+C / V copies, Ctrl/⌘+Z undoes, Delete removes.",
  rnNote:"Web only; WebView on native.",
  js:["x6"], site:"https://x6.antv.antgroup.com/", repo:"antvis/X6" },

/* ---------------- Graphs & networks ---------------- */
{ k:"g6", n:"AntV G6", pkg:"@antv/g6", ver:"5.1.1", pub:"2026-05-08", commit:"2026-10-13", lic:"MIT", kb:1353, cat:"graph", st:4,
  c:"y y y y p y p y",
  what:"A graph toolkit with a large box of layouts and behaviours, from Ant Group.",
  pro:"Layouts, behaviours and graph analysis plugins all in one package",
  con:"Big, and v5 rewrote the API from v4",
  try:"Nothing here is hand-placed — the force layout worked out every position. Drag a node and the whole graph reacts.",
  rnNote:"Web only. AntV's mobile answer is F2, a different library.",
  js:["g6"], site:"https://g6.antv.antgroup.com/", repo:"antvis/G6" },

{ k:"cy", n:"Cytoscape.js", pkg:"cytoscape", ver:"3.34.3", pub:"2026-09-07", commit:"2026-09-07", lic:"MIT", kb:425, cat:"graph", st:5,
  c:"y y y y p y p y",
  what:"Graph rendering plus a real graph-theory library: shortest path, centrality, clustering, all built in.",
  pro:"The algorithms are the selling point — you rarely need a second package",
  con:"Styling uses its own CSS-like language you have to learn",
  try:"Press the button to run a real Dijkstra shortest path across the graph and watch it highlight.",
  rnNote:"The algorithms are pure JS and work anywhere; the renderer needs a browser canvas.",
  js:["cytoscape"], site:"https://js.cytoscape.org/", repo:"cytoscape/cytoscape.js" },

{ k:"vn", n:"vis-network", pkg:"vis-network", ver:"10.1.2", pub:"2026-08-19", commit:"2026-09-13", lic:"Apache-2.0 OR MIT", kb:640, cat:"graph", st:4,
  c:"y y p y n y p y",
  what:"Network graphs with a physics simulation that keeps running while you interact.",
  pro:"Looks good with almost no configuration",
  con:"The physics engine is hard to tame on large graphs",
  try:"Drag a node and let go. It springs back — the simulation never stopped running.",
  rnNote:"Web only; WebView on native.",
  js:["visnetwork"], site:"https://visjs.github.io/vis-network/docs/network/", repo:"visjs/vis-network" },

{ k:"fg", n:"force-graph", pkg:"force-graph", ver:"1.52.0", pub:"2026-09-28", commit:"2026-09-29", lic:"MIT", kb:169, cat:"graph", st:4,
  c:"y y y y p y p y",
  what:"d3-force plus a canvas renderer, wrapped so that one config object gets you a working graph.",
  pro:"Zoom, pan, drag and force layout out of one call",
  con:"Custom node visuals mean drawing on the canvas yourself",
  try:"Scroll to zoom, drag the background to pan, drag a node to pull the layout around.",
  rnNote:"Web only, but the d3-force layout underneath is pure JS and does run in React Native.",
  js:["forcegraph"], site:"https://github.com/vasturiano/force-graph", repo:"vasturiano/force-graph" },

{ k:"rg", n:"Reagraph", pkg:"reagraph", ver:"4.32.0", pub:"2026-06-25", commit:"2026-06-25", lic:"Apache-2.0", kb:1931, cat:"graph", st:4,
  c:"y y y y y y p y",
  what:"WebGL graph rendering as React components, built on three.js.",
  pro:"Tens of thousands of nodes that you can still click and select",
  con:"Heavy bundle, and three.js comes along for the ride",
  try:"Click a node to select it and light up its neighbours; drag the background to pan, or to rotate in force 3D. All of this is WebGL, not SVG.",
  rnNote:"Built on three.js, so a react-three-fiber/native port is conceivable but does not exist today.",
  js:["reagraph"], site:"https://reagraph.dev/", repo:"reaviz/reagraph" },

{ k:"sig", n:"Sigma.js", pkg:"sigma", ver:"4.0.1", pub:"2026-10-13", commit:"2026-10-13", lic:"MIT", kb:437, cat:"graph", st:4,
  c:"y y y y n y p y",
  what:"A WebGL renderer for graphology graphs. Rendering only — the data model lives in graphology.",
  pro:"Very large graphs stay interactive",
  con:"You need graphology alongside it; sigma alone does nothing",
  try:"400 nodes here — the same code handles 30,000. Drag and zoom to feel the WebGL path; with labels on, Sigma names the nodes it draws large enough, so zoom in to read them.",
  rnNote:"Web only; WebView on native.",
  js:["sigma","d3"], site:"https://www.sigmajs.org/", repo:"jacomyal/sigma.js" },

{ k:"fg3", n:"3d-force-graph", pkg:"3d-force-graph", ver:"1.80.1", pub:"2026-09-29", commit:"2026-09-29", lic:"MIT", kb:1357, cat:"graph", st:3,
  c:"y y y y p y p y",
  what:"The same force-graph idea, but the simulation runs in three dimensions and renders through three.js.",
  pro:"Genuinely useful for dense graphs where 2D turns into hairball",
  con:"Pulls in all of three.js",
  try:"Drag to orbit the graph, scroll to fly in and out, drag a node to disturb the 3D layout.",
  rnNote:"three.js underneath, so expo-gl is theoretically possible; no ready-made port.",
  js:["fg3d"], site:"https://github.com/vasturiano/3d-force-graph", repo:"vasturiano/3d-force-graph" },

];
