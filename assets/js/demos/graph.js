/* Graphs & networks.

   Every demo here takes a node count from its toolbar. Small graphs are
   laid out by the library (or d3-force) as before. From 1,000 nodes up
   the positions come precomputed from big() below, with no layout run,
   so the time to start, shown in the panel header, is the library taking
   in the data and drawing its first frame. Each library offers the sizes
   it gets through: 100,000 only where it does not hang the tab. */
(function () {
"use strict";
var B = window.B;

/* One shared network generator so the libraries stay comparable. */
function sample(n, extra, seed) {
  var s = seed || 7;
  var rnd = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var nodes = [], links = [];
  for (var i = 0; i < n; i++) nodes.push({ id: "n" + i, label: "pkg-" + i, group: i % 5 });
  for (var j = 1; j < n; j++) links.push({ source: "n" + Math.floor(rnd() * j), target: "n" + j });
  for (var k = 0; k < (extra || 0); k++) {
    var a = "n" + Math.floor(rnd() * n), b = "n" + Math.floor(rnd() * n);
    if (a !== b) links.push({ source: a, target: b });
  }
  return { nodes: nodes, links: links };
}

/* A big graph with its positions already worked out, in O(n): clusters
   on a sunflower spiral, nodes scattered around their cluster's centre,
   each node linked to an earlier one of its cluster, plus 4% of links
   across clusters. z is for the 3D demo. */
function big(n) {
  var s = 3;
  var rnd = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var gauss = function () { return (rnd() + rnd() + rnd() + rnd() - 2) * 1.2; };
  var c = Math.max(4, Math.round(Math.sqrt(n) / 2.5));
  var R = Math.sqrt(n) * 9, spread = R / Math.sqrt(c) * .55, centers = [];
  for (var i = 0; i < c; i++) {
    var a = i * 2.399963, r = R * Math.sqrt((i + .5) / c);
    centers.push([Math.cos(a) * r, Math.sin(a) * r, (rnd() - .5) * R * 1.4]);
  }
  var nodes = new Array(n), links = [];
  for (var j = 0; j < n; j++) {
    var k = j % c;
    nodes[j] = { id: "n" + j, label: "pkg-" + j, group: k % 5,
                 x: centers[k][0] + gauss() * spread, y: centers[k][1] + gauss() * spread, z: centers[k][2] + gauss() * spread };
    if (j >= c) links.push({ source: "n" + j, target: "n" + (j - c * (1 + Math.floor(rnd() * Math.min(6, Math.floor(j / c))))) });
  }
  for (var e = 0, m = Math.round(n * .04); e < m; e++) {
    var u = Math.floor(rnd() * n), v = Math.floor(rnd() * n);
    if (u !== v) links.push({ source: "n" + u, target: "n" + v });
  }
  return { nodes: nodes, links: links };
}

var LAID_OUT = 1000;

/* An edge colour faint enough that 100,000 edges do not bury the nodes. */
function faint(hex, n) {
  var a = n >= 50000 ? .12 : n >= 5000 ? .25 : 1, c = rgb(hex);
  return a === 1 ? hex : "rgba(" + c.join(",") + "," + a + ")";
}   /* below this the library lays the graph out itself */

/* The node-count choice: the small default plus the given big sizes. */
function sizes(ctx, small, bigs) {
  var opts = [{ v: String(small), t: small.toLocaleString() + " (laid out)" }].concat(bigs.map(function (n) {
    return { v: String(n), t: n.toLocaleString() };
  }));
  return +ctx.choose("nodes", opts, small);
}

function say(ctx, data, how) {
  ctx.readout("<b>" + data.nodes.length.toLocaleString() + "</b> nodes · <b>" + data.links.length.toLocaleString() +
              "</b> edges" + (data.nodes.length >= LAID_OUT ? " · positions precomputed, no layout" : "") + (how ? " · " + how : ""));
}

/* ----------------------------------------------------------------- AntV G6 */
B.g6 = async function (ctx) {
  var T = ctx.T;
  /* 10,000 is not offered: G6 had not drawn it after two minutes, and the
     tab froze meanwhile. */
  var N = sizes(ctx, 46, [1000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(46, 12);

  /* With the force layout a dragged node pulls the simulation along, so
     the rest of the graph reacts; with the others it simply moves. Both
     drag behaviours stay installed and the current layout decides which
     one acts (a swapped-out behaviour would leave listeners behind, see
     onDestroy below). */
  var current = "force";
  function layout(type) {
    return type === "force" ? { type: "d3-force", link: { distance: 62 }, collide: { radius: 18 } } : { type: type };
  }

  var graph = new G6.Graph({
    container: ctx.el,
    autoFit: "view",
    background: T.stage,
    data: {
      nodes: data.nodes.map(function (n) {
        return { id: n.id, data: { group: n.group, label: n.label }, style: bigN ? { x: n.x, y: n.y } : undefined };
      }),
      edges: data.links.map(function (l, i) { return { id: "e" + i, source: l.source, target: l.target }; })
    },
    node: {
      style: {
        size: bigN ? 6 : 18,
        fill: function (d) { return ctx.series(d.data.group); },
        stroke: T.stage, lineWidth: bigN ? 0 : 1.5,
        labelText: bigN ? undefined : function (d) { return d.data.label; },
        labelFill: T.muted, labelFontSize: 9, labelPlacement: "bottom"
      },
      state: { active: { fill: T.accent, halo: true, labelFill: T.ink, labelFontSize: 11 } }
    },
    edge: { style: { stroke: T.edge, lineWidth: 1, endArrow: false, strokeOpacity: .55 } },
    layout: bigN ? undefined : layout("force"),
    behaviors: bigN ? ["drag-canvas", "zoom-canvas"] : ["drag-canvas", "zoom-canvas",
                { type: "drag-element-force", enable: function () { return current === "force"; } },
                { type: "drag-element", enable: function () { return current !== "force"; } },
                "hover-activate"]
  });
  /* A layout still running when the page is left gets finished by G6
     after destroy() and fails on the destroyed graph. Nothing is left to
     spoil by then, so that failure is dropped. */
  function quiet() {}
  /* The first frame of a preset graph is the end of render(); a small
     graph's render() also waits out the animated force layout. */
  var drawn = graph.render().catch(quiet);
  if (bigN) await drawn;

  /* Switching re-runs a layout on the same graph rather than building a
     new one, which would leave listeners behind the same way. */
  if (!bigN) ctx.select("layout", [
    { v: "force", t: "force directed" },
    { v: "radial", t: "radial" },
    { v: "circular", t: "circular" },
    { v: "concentric", t: "concentric" },
    { v: "grid", t: "grid" }
  ], function (type) {
    current = type;
    graph.setLayout(layout(type));
    graph.layout().then(function () { if (!ctx.dead()) graph.fitView(); }).catch(quiet);
  }, "force");
  say(ctx, data, bigN ? "labels off at this size" : "every position is computed, none authored");

  ctx.onResize(function () { graph.resize(); });
  ctx.onDestroy(function () {
    /* G6's drag behaviours leave their keyboard shortcuts (three listeners
       on window each) behind when the graph is destroyed, so release them
       first. */
    var behaviors = graph.context && graph.context.behavior;
    Object.values((behaviors && behaviors.extensionMap) || {}).forEach(function (b) {
      if (b && b.shortcut && b.shortcut.destroy) b.shortcut.destroy();
    });
    graph.destroy();
  });
};

/* ---------------------------------------------------------- Cytoscape.js */
B.cy = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 34, [1000, 10000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(34, 9);

  var cy = cytoscape({
    container: ctx.el,
    elements: data.nodes.map(function (n) {
      return { data: { id: n.id, label: n.label, g: n.group }, position: bigN ? { x: n.x, y: n.y } : undefined };
    })
      .concat(data.links.map(function (l, i) {
        return { data: { id: "e" + i, source: l.source, target: l.target } };
      })),
    style: [
      { selector: "node", style: {
          "background-color": function (e) { return ctx.series(e.data("g")); },
          label: "data(label)", color: T.muted, "font-size": 11, "font-family": T.mono,
          "text-valign": "bottom", "text-margin-y": 3, width: bigN ? 6 : 18, height: bigN ? 6 : 18,
          /* On a big graph names appear once zoomed in far enough to read. */
          "min-zoomed-font-size": bigN ? 9 : 0 } },
      { selector: "edge", style: { width: bigN ? .6 : 1.2, "line-color": T.edge, "curve-style": bigN ? "haystack" : "bezier", opacity: .6 } },
      { selector: ".path", style: {
          "line-color": T.accent, "background-color": T.accent, width: 3.5, "z-index": 10, opacity: 1 } },
      { selector: ".ends", style: {
          "background-color": T.yes, width: 28, height: 28,
          "border-width": 2, "border-color": T.stage, color: T.ink, "font-size": 11 } }
    ],
    layout: bigN ? { name: "preset" } : { name: "cose", animate: false, nodeRepulsion: 9000, idealEdgeLength: 62 },
    hideEdgesOnViewport: bigN, textureOnViewport: bigN
  });

  say(ctx, data);
  var out = ctx.readout("click any two nodes, or press the button");
  function clear() { cy.elements().removeClass("path ends"); }

  /* Cytoscape ships the graph algorithms — this is a real Dijkstra run. */
  function runPath(from, to) {
    clear();
    var dij = cy.elements().dijkstra({ root: cy.$id(from), directed: false });
    var p = dij.pathTo(cy.$id(to));
    if (!p || !p.length) { out("no path between those two"); return; }
    p.addClass("path");
    cy.$id(from).addClass("ends");
    cy.$id(to).addClass("ends");
    out("dijkstra <b>" + from + " → " + to + "</b> · " +
        "<b>" + dij.distanceTo(cy.$id(to)) + "</b> hops · " + p.nodes().length + " nodes on the path");
  }

  var picked = [];
  cy.on("tap", "node", function (e) {
    if (picked[0] === e.target.id()) return;      /* a node and itself are no path */
    picked.push(e.target.id());
    if (picked.length === 2) { runPath(picked[0], picked[1]); picked = []; }
    else { clear(); e.target.addClass("ends"); out("from <b>" + picked[0] + "</b> — now pick a second node"); }
  });

  ctx.btn("Random shortest path", function () {
    var ns = cy.nodes(), a = Math.floor(Math.random() * ns.length), b = Math.floor(Math.random() * (ns.length - 1));
    picked = [];
    runPath(ns[a].id(), ns[b >= a ? b + 1 : b].id());
  }, true);
  /* Betweenness is O(nodes x edges): instant at 34 nodes, minutes at 10,000. */
  if (!bigN) ctx.btn("Betweenness", function () {
    clear();
    var bc = cy.elements().betweennessCentrality({ directed: false });
    var max = 0;
    cy.nodes().forEach(function (n) { max = Math.max(max, bc.betweenness(n)); });
    cy.nodes().forEach(function (n) {
      var f = max ? bc.betweenness(n) / max : 0;
      n.style({ width: 14 + f * 34, height: 14 + f * 34 });
    });
    out("node size is now <b>betweenness centrality</b> — also built in");
  });
  ctx.btn("Reset", function () {
    clear(); picked = [];
    cy.nodes().style({ width: bigN ? 6 : 18, height: bigN ? 6 : 18 });
    out("click any two nodes, or press the button");
  });

  ctx.onResize(function () { cy.resize(); cy.fit(undefined, 30); });
  ctx.onDestroy(function () { cy.destroy(); });
};

/* ----------------------------------------------------------- vis-network */
B.vn = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 42, [1000, 10000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(42, 12);
  var nodes = new vis.DataSet(data.nodes.map(function (n) {
    /* vis matches group names as strings */
    return bigN ? { id: n.id, label: n.label, group: String(n.group), x: n.x, y: n.y }
                : { id: n.id, label: n.label, group: String(n.group) };
  }));
  var edges = new vis.DataSet(data.links.map(function (l, i) {
    return { id: "e" + i, from: l.source, to: l.target };
  }));

  var groups = {};
  [0, 1, 2, 3, 4].forEach(function (i) {
    groups[i] = { color: { background: ctx.series(i), border: T.stage,
                           highlight: { background: T.accent, border: T.ink } } };
  });

  var net = new vis.Network(ctx.el, { nodes: nodes, edges: edges }, {
    /* Names are drawn once they are big enough on screen (drawThreshold). */
    nodes: { shape: "dot", size: bigN ? 5 : 12, borderWidth: bigN ? 0 : 1.5,
             font: { color: T.muted, size: 14, face: "monospace" }, scaling: { label: { drawThreshold: 6 } } },
    edges: { color: { color: T.edge, opacity: .6 }, width: 1, smooth: bigN ? false : { type: "continuous" } },
    groups: groups,
    physics: bigN ? false : {
      solver: "forceAtlas2Based",
      forceAtlas2Based: { gravitationalConstant: -58, springLength: 90, damping: .5 },
      stabilization: { iterations: 200 }
    },
    interaction: { hover: true, tooltipDelay: 120 }
  });

  say(ctx, data);
  var physics = !bigN, out = ctx.readout(bigN ? "physics off at this size: drag to pan, scroll to zoom" : "stabilising…");
  function settled() { if (physics) out("physics settled — drag a node and let go, it springs back"); }
  net.on("stabilizationIterationsDone", settled);
  net.on("stabilized", settled);

  if (!bigN) ctx.check("physics", true, function (on) {
    physics = on;
    net.setOptions({ physics: { enabled: on } });
    out(on ? "physics on — the graph pushes back" : "physics off — nodes stay where you drop them");
  });
  /* With physics on the graph pulls itself back together; off, it stays scattered. */
  if (!bigN) ctx.btn("Scatter", function () {
    nodes.forEach(function (n) {
      net.moveNode(n.id, (Math.random() - .5) * 620, (Math.random() - .5) * 460);
    });
    if (physics) { net.startSimulation(); out("scattered — watch the physics pull it back"); }
  });
  ctx.btn("Fit", function () { net.fit({ animation: true }); });

  ctx.onDestroy(function () { net.destroy(); });
};

/* ------------------------------------------------------------ force-graph */
B.fg = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 160, [1000, 10000, 100000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(160, 45), labels = N <= LAID_OUT;
  var g = ForceGraph()(ctx.el)
    .backgroundColor(T.stage)
    .graphData({ nodes: data.nodes, links: data.links })
    .nodeRelSize(4)
    .nodeColor(function (n) { return ctx.series(n.group); })
    .linkColor(function () { return faint(T.edge, N); })
    .linkWidth(bigN ? .4 : .7)
    .nodeLabel(function (n) { return n.label; })
    /* The name under every node, drawn on the same canvas after the dot;
       it keeps one size on screen whatever the zoom. */
    .nodeCanvasObjectMode(function () { return labels ? "after" : null; })
    .nodeCanvasObject(function (n, g2, scale) {
      g2.font = (10 / scale) + "px " + T.mono;
      g2.textAlign = "center"; g2.textBaseline = "top";
      g2.fillStyle = T.muted;
      g2.fillText(n.label, n.x, n.y + 5 + 2 / scale);
    })
    .nodeRelSize(bigN ? 2 : 4)
    /* Big graphs keep their precomputed positions: no simulation ticks. */
    .warmupTicks(0)
    .cooldownTicks(bigN ? 0 : 140)
    .d3VelocityDecay(.28);

  say(ctx, data, "scroll to zoom, drag to pan");
  ctx.check("labels", labels, function (on) { labels = on; g.nodeCanvasObjectMode(g.nodeCanvasObjectMode()); });
  ctx.check("flow particles", false, function (on) {
    g.linkDirectionalParticles(on ? 2 : 0)
     .linkDirectionalParticleWidth(2)
     .linkDirectionalParticleColor(function () { return T.accent; });
  });
  if (!bigN) {
    ctx.range("repulsion", { min: -240, max: -20, value: -90 }, function (v) {
      g.d3Force("charge").strength(v);
      g.d3ReheatSimulation();
    });
    ctx.btn("Reheat", function () { g.d3ReheatSimulation(); });
  }

  function fit() { g.width(ctx.el.clientWidth).height(ctx.el.clientHeight); }
  fit(); ctx.onResize(fit);
  /* With no ticks to run the engine stops at once, and the fit can see
     where everything is. */
  if (bigN) g.onEngineStop(function () { g.zoomToFit(0, 20); });
  ctx.onDestroy(function () { if (g._destructor) g._destructor(); });
};

/* --------------------------------------------------------------- Reagraph */
B.rg = async function (ctx) {
  /* Reagraph bundles its own React copy, so use that one. */
  var React = Reagraph.React, ReactDOM = Reagraph.ReactDOM;
  var h = React.createElement;
  /* 10,000 is not offered: Reagraph builds one three.js mesh per node and
     per edge, and the tab stalled for minutes on it in our test. */
  var N = sizes(ctx, 80, [1000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(80, 22);

  var nodes = data.nodes.map(function (n) {
    return { id: n.id, label: n.label, fill: ctx.series(n.group) };
  }), at = {};
  data.nodes.forEach(function (n) { at[n.id] = n; });
  var edges = data.links.map(function (l, i) {
    return { id: "e" + i, source: l.source, target: l.target };
  });

  var api = {};
  function App() {
    var a = React.useState(bigN ? "custom" : "forceDirected2d"), layout = a[0], setLayout = a[1];
    var b = React.useState(N <= LAID_OUT), labels = b[0], setLabels = b[1];
    api.setLayout = setLayout;
    api.setLabels = setLabels;
    /* Selection as Reagraph's docs wire it: useSelection keeps the
       selected node and, with pathSelectionType "all", its neighbours;
       the canvas draws them. */
    var ref = React.useRef(null);
    var sel = Reagraph.useSelection({ ref: ref, nodes: nodes, edges: edges, pathSelectionType: "all" });
    return h(Reagraph.GraphCanvas, {
      ref: ref,
      nodes: nodes, edges: edges,
      layoutType: layout,
      /* Reagraph's node labels have one fixed size in graph units; a tighter
         force layout makes the camera fit closer, so they read on screen. */
      layoutOverrides: bigN ? { getNodePosition: function (id) { var n = at[id]; return { x: n.x, y: n.y, z: 0 }; } }
                            : { linkDistance: 18, nodeStrength: -34 },
      cameraMode: layout === "forceDirected3d" ? "rotate" : "pan",
      selections: sel.selections, actives: sel.actives,
      onNodeClick: sel.onNodeClick, onCanvasClick: sel.onCanvasClick,
      theme: ctx.dark ? Reagraph.darkTheme : Reagraph.lightTheme,
      labelType: labels ? "all" : "none",
      /* A local font, so the labels never wait on a CDN (see build.mjs). */
      labelFontUrl: new URL("vendor/fonts/KaTeX_SansSerif-Regular.ttf", document.baseURI).href,
      draggable: true
    });
  }

  var root = ReactDOM.createRoot(ctx.el);
  root.render(h(App));
  ctx.onDestroy(function () { root.unmount(); });
  /* React renders later than this line, so the start counts until its
     canvas exists and has painted, not until render() returns. */
  await new Promise(function (done) {
    (function look() {
      if (ctx.dead() || ctx.el.querySelector("canvas")) {
        requestAnimationFrame(function () { requestAnimationFrame(done); });
      } else setTimeout(look, 16);
    })();
  });

  if (!bigN) ctx.select("layout", [
    { v: "forceDirected2d", t: "force 2D" },
    { v: "forceDirected3d", t: "force 3D" },
    { v: "radialOut2d", t: "radial" },
    { v: "circular2d", t: "circular" }
  ], function (v) { if (api.setLayout) api.setLayout(v); }, "forceDirected2d");
  ctx.check("labels", N <= LAID_OUT, function (v) { if (api.setLabels) api.setLabels(v); });
  say(ctx, data, "WebGL, each node still selectable");
};

/* --------------------------------------------------------------- Sigma.js */
B.sig = async function (ctx) {
  var T = ctx.T;
  await ctx.need("d3");                       /* graphology holds data, d3-force does layout */
  var Graph = SigmaLib.Graph, Sigma = SigmaLib.Sigma;
  var N = sizes(ctx, 400, [10000, 100000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(400, 160, 11);

  var g = new Graph();
  data.nodes.forEach(function (n) {
    g.addNode(n.id, { label: n.label, x: bigN ? n.x : Math.random(), y: bigN ? n.y : Math.random(),
                      size: (bigN ? 1 : 2.5) + (n.group % 4) * (bigN ? .5 : 1), color: ctx.series(n.group) });
  });
  data.links.forEach(function (l) {
    if (l.source !== l.target && !g.hasEdge(l.source, l.target)) {
      g.addEdge(l.source, l.target, { color: faint(T.edge, N), size: bigN ? .3 : .5 });
    }
  });

  function relayout(iterations) {
    var ns = g.nodes().map(function (id) { return { id: id, x: g.getNodeAttribute(id, "x"), y: g.getNodeAttribute(id, "y") }; });
    var ls = g.edges().map(function (e) { return { source: g.source(e), target: g.target(e) }; });
    var sim = d3.forceSimulation(ns)
      .force("link", d3.forceLink(ls).id(function (d) { return d.id; }).distance(24).strength(.6))
      .force("charge", d3.forceManyBody().strength(-26))
      .force("center", d3.forceCenter(0, 0))
      .stop();
    for (var i = 0; i < iterations; i++) sim.tick();
    ns.forEach(function (n) { g.setNodeAttribute(n.id, "x", n.x); g.setNodeAttribute(n.id, "y", n.y); });
  }
  if (!bigN) relayout(220);

  /* Sigma 4 styles layer over its defaults, which already read x, y, size,
     colour and label from the node attributes; only the labels change here. */
  var renderer = new Sigma(g, ctx.el, {
    /* Up to 400 nodes every node gets its name: a dense label grid and no
       size threshold turn off Sigma's habit of naming only the biggest.
       On a big graph Sigma's own label grid decides. */
    settings: bigN ? { renderLabels: true, allowInvalidContainer: true, hideEdgesOnMove: N > 20000 }
                   : { renderLabels: true, labelRenderedSizeThreshold: 0, labelDensity: 50, labelGridCellSize: 20, allowInvalidContainer: true },
    styles: { nodes: [SigmaLib.DEFAULT_STYLES.nodes, { labelColor: T.muted, labelFont: T.mono, labelSize: 9 }] }
  });

  ctx.check("labels", true, function (on) { renderer.setSetting("renderLabels", on); });
  if (!bigN) ctx.btn("Re-run layout", function () { relayout(140); renderer.refresh(); });
  ctx.btn("Reset view", function () { renderer.getCamera().reset(); });
  say(ctx, data, bigN ? "Sigma names the nodes that have room; zoom in for more" : "drawn by WebGL");

  ctx.onResize(function () { renderer.refresh(); });
  ctx.onDestroy(function () { renderer.kill(); });
};

/* --------------------------------------------------------- 3d-force-graph */
B.fg3 = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 120, [1000, 10000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(120, 34);
  /* Orbit controls rather than the default trackball: only they can auto-rotate. */
  var g = ForceGraph3D({ controlType: "orbit" })(ctx.el)
    .backgroundColor(T.stage)
    .graphData({ nodes: data.nodes, links: data.links })
    .nodeRelSize(bigN ? 2 : 4)
    .nodeColor(function (n) { return ctx.series(n.group); })
    .linkColor(function () { return T.edge; })
    .linkOpacity(bigN ? .12 : .35)
    .nodeLabel(function (n) { return n.label; })
    .showNavInfo(false)
    .enableNodeDrag(!bigN)
    .nodeResolution(bigN ? 4 : 8)
    .warmupTicks(0)
    .cooldownTicks(bigN ? 0 : Infinity);

  /* The name of every node, as HTML over the canvas: each frame projects
     the node to the screen. Nodes behind the camera hide their label, and
     farther ones fade. */
  var layer = ctx.mk("div", "fg3-labels"), labels = N <= LAID_OUT, tmp = null, spans = !labels ? [] : data.nodes.map(function (n) {
    var sp = ctx.mk("span", null, ctx.esc(n.label));
    sp.style.cssText = "position:absolute;left:0;top:0;white-space:nowrap;display:none";
    layer.appendChild(sp);
    return sp;
  });
  layer.style.cssText = "position:absolute;inset:0;pointer-events:none;overflow:hidden;font:10px " + T.mono + ";color:" + T.muted;
  ctx.el.style.position = "relative";
  ctx.el.appendChild(layer);
  ctx.raf(function () {
    if (!labels) return;
    var cam = g.camera(), w = ctx.el.clientWidth, h2 = ctx.el.clientHeight;
    if (!tmp) tmp = cam.position.clone();
    data.nodes.forEach(function (n, i) {
      var sp = spans[i];
      if (n.x == null) { sp.style.display = "none"; return; }
      /* In camera space a node in front of the camera has z < 0. */
      var v = tmp.set(n.x, n.y, n.z).applyMatrix4(cam.matrixWorldInverse);
      var p = g.graph2ScreenCoords(n.x, n.y, n.z);
      if (v.z >= 0 || p.x < -40 || p.y < -20 || p.x > w + 40 || p.y > h2 + 20) { sp.style.display = "none"; return; }
      sp.style.display = "";
      sp.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px) translate(-50%, 7px)";
      sp.style.opacity = String(Math.max(.55, Math.min(1, 700 / -v.z)));
    });
  });

  var controls = g.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  /* One HTML label per node: fine at 1,000, not offered at 10,000. */
  if (N <= LAID_OUT) ctx.check("labels", true, function (on) { labels = on; layer.style.display = on ? "" : "none"; });
  ctx.check("auto-rotate", true, function (on) { controls.autoRotate = on; });
  ctx.check("link particles", false, function (on) {
    g.linkDirectionalParticles(on ? 2 : 0)
     .linkDirectionalParticleWidth(1.6)
     .linkDirectionalParticleColor(function () { return T.accent; });
  });
  if (!bigN) ctx.btn("Reheat", function () { g.d3ReheatSimulation(); });
  say(ctx, data, bigN ? "one three.js object per node" : "simulated in three dimensions");

  function fit() { g.width(ctx.el.clientWidth).height(ctx.el.clientHeight); }
  fit(); ctx.onResize(fit);
  /* zoomToFit has nothing to go on before the engine has ticked, so a big
     graph's camera is placed from the extent of its positions. */
  if (bigN) {
    var ext = 0;
    data.nodes.forEach(function (n) { ext = Math.max(ext, Math.abs(n.x), Math.abs(n.y)); });
    g.cameraPosition({ x: 0, y: 0, z: ext * 2.3 }, { x: 0, y: 0, z: 0 }, 0);
  }
  ctx.onDestroy(function () { if (g._destructor) g._destructor(); });
};

/* "#6EA8FE" -> [110, 168, 254] */
function rgb(hex) {
  var h = hex.replace("#", "");
  if (h.length === 3) h = h.replace(/./g, "$&$&");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/* -------------------------------------------------------------- cosmos.gl */
B.cos = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 400, [10000, 100000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(400, 160, 11), paused = false, labels = N <= LAID_OUT;

  /* cosmos.gl takes flat typed arrays: x,y per point, source,target per
     link, r,g,b,a per point colour (0..1), all addressed by index. Big
     graphs start from their precomputed positions, small ones from a
     random scatter; either way the GPU simulation then runs. */
  var at = {}, pos = new Float32Array(N * 2), col = new Float32Array(N * 4), sz = new Float32Array(N), r = ctx.rng(5);
  data.nodes.forEach(function (d, i) {
    at[d.id] = i;
    pos[i * 2] = bigN ? d.x : r() * 4096; pos[i * 2 + 1] = bigN ? d.y : r() * 4096;
    var c = rgb(ctx.series(d.group));
    col[i * 4] = c[0] / 255; col[i * 4 + 1] = c[1] / 255; col[i * 4 + 2] = c[2] / 255; col[i * 4 + 3] = 1;
    sz[i] = (bigN ? 2 : 4) + (d.group % 4);
  });
  var links = new Float32Array(data.links.length * 2);
  data.links.forEach(function (l, j) { links[j * 2] = at[l.source]; links[j * 2 + 1] = at[l.target]; });

  var graph = new Cosmos.Graph(ctx.el, {
    backgroundColor: T.stage,
    pointDefaultColor: T.accent,
    linkDefaultColor: T.edge,
    linkOpacity: .5,
    linkDefaultWidth: 1,
    pointGreyoutOpacity: .12,
    linkGreyoutOpacity: .05,
    renderHoveredPointRing: true,
    hoveredPointRingColor: T.ink,
    enableDrag: true,
    fitViewOnInit: true,
    fitViewDelay: bigN ? 300 : 1200,
    fitViewPadding: .15,
    simulationRepulsion: .6,
    simulationLinkSpring: 1,
    simulationLinkDistance: 6,
    simulationGravity: .25,
    simulationFriction: .85,
    onPointClick: function (i) {
      var near = graph.getNeighboringPointIndices(i);
      graph.setConfigPartial({ highlightedPointIndices: [i].concat(near),
                               highlightedLinkIndices: graph.getConnectedLinkIndices(i), focusedPointIndex: i });
    },
    /* The layout spreads out as it runs, so fit once more when it settles. */
    onSimulationEnd: function () { graph.fitView(600); },
    onBackgroundClick: function () {
      graph.setConfigPartial({ highlightedPointIndices: undefined, highlightedLinkIndices: undefined, focusedPointIndex: undefined });
    }
  });
  ctx.onDestroy(function () { graph.destroy(); });
  await graph.ready;
  graph.setPointPositions(pos);
  graph.setPointColors(col);
  graph.setPointSizes(sz);
  graph.setLinks(links);
  var all = [];
  for (var i = 0; i < Math.min(N, 400); i++) all.push(i);
  if (N <= 400) graph.trackPointPositionsByIndices(all);
  graph.render();
  graph.start(1);

  /* cosmos.gl draws no text, so the names go on a 2D canvas over its own:
     each frame reads where the points are and writes the names under them.
     Up to 400 nodes every point is tracked; beyond that cosmos.gl's
     sampler picks an evenly spread set of the visible ones, and zooming
     in names more of them. */
  var over = ctx.mk("canvas");
  over.style.cssText = "position:absolute;inset:0;pointer-events:none";
  ctx.el.style.position = "relative";
  ctx.el.appendChild(over);
  var g2 = over.getContext("2d");
  ctx.raf(function () {
    var w = ctx.el.clientWidth, h = ctx.el.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (over.width !== Math.round(w * dpr) || over.height !== Math.round(h * dpr)) {
      over.width = Math.round(w * dpr); over.height = Math.round(h * dpr);
    }
    g2.setTransform(dpr, 0, 0, dpr, 0, 0);
    g2.clearRect(0, 0, w, h);
    if (!labels) return;
    var where = N <= 400 ? graph.getTrackedPointPositionsMap({ nonBlocking: true })
                         : graph.getSampledPointPositionsMap({ nonBlocking: true });
    g2.font = "10px " + T.mono;
    g2.textAlign = "center"; g2.textBaseline = "top";
    g2.fillStyle = T.muted;
    where.forEach(function (p, idx) {
      var sp = graph.spaceToScreenPosition(p);
      if (sp[0] < -30 || sp[1] < -12 || sp[0] > w + 30 || sp[1] > h + 12) return;
      g2.fillText("pkg-" + idx, sp[0], sp[1] + 6);
    });
  });

  var pauseBtn = ctx.btn("Pause", function () {
    paused = !paused;
    if (paused) graph.pause(); else graph.unpause();
    pauseBtn.textContent = paused ? "Resume" : "Pause";
  });
  ctx.btn("Fit view", function () { graph.fitView(500); });
  ctx.check("labels", labels, function (on) { labels = on; });
  ctx.readout("<b>" + N.toLocaleString() + "</b> nodes · <b>" + data.links.length.toLocaleString() +
              "</b> edges · layout and drawing on the GPU");
};

/* ----------------------------------------- deck.gl (as a graph renderer) */
B.dkg = async function (ctx) {
  var T = ctx.T;
  var N = sizes(ctx, 400, [10000, 100000]), bigN = N >= LAID_OUT;
  var data = bigN ? big(N) : sample(400, 160, 11), byId = {}, nbr = {};
  data.nodes.forEach(function (n) { byId[n.id] = n; nbr[n.id] = {}; n.size = (bigN ? 1.5 : 3) + (n.group % 4) * (bigN ? .5 : 1); });
  data.links.forEach(function (l) { nbr[l.source][l.target] = 1; nbr[l.target][l.source] = 1; });

  /* deck.gl draws; it does not lay out. d3-force works out the positions
     of the small graph; a big one comes with them. */
  function relayout(iterations) {
    var ls = data.links.map(function (l) { return { source: l.source, target: l.target }; });
    var sim = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(ls).id(function (d) { return d.id; }).distance(24).strength(.6))
      .force("charge", d3.forceManyBody().strength(-26))
      .force("center", d3.forceCenter(0, 0))
      .stop();
    for (var i = 0; i < iterations; i++) sim.tick();
  }
  if (!bigN) relayout(220);

  var edge = rgb(T.edge), muted = rgb(T.muted), ink = rgb(T.ink), acc = rgb(T.accent);
  /* Labels for 100,000 nodes would be 700,000 glyphs: big graphs start
     with labels off, and "no overlap" brings back the names that fit. */
  var hover = null, labels = bigN ? "off" : "all";

  function fit() {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    data.nodes.forEach(function (n) {
      if (n.x < x0) x0 = n.x; if (n.x > x1) x1 = n.x; if (n.y < y0) y0 = n.y; if (n.y > y1) y1 = n.y;
    });
    var w = Math.max(1, ctx.el.clientWidth), h = Math.max(1, ctx.el.clientHeight);
    var zoom = Math.log2(Math.min(w / ((x1 - x0) * 1.12), h / ((y1 - y0) * 1.12)));
    return { target: [(x0 + x1) / 2, (y0 + y1) / 2, 0], zoom: zoom, minZoom: zoom - 2, maxZoom: zoom + 8 };
  }

  function lit(id) { return !hover || id === hover || nbr[hover][id]; }

  function layers() {
    return [
      new deck.LineLayer({
        id: "edges", data: data.links,
        getSourcePosition: function (l) { return [byId[l.source].x, byId[l.source].y]; },
        getTargetPosition: function (l) { return [byId[l.target].x, byId[l.target].y]; },
        getColor: function (l) {
          var on = hover && (l.source === hover || l.target === hover);
          return on ? acc.concat([230]) : edge.concat([hover ? 25 : (bigN ? 60 : 110)]);
        },
        getWidth: function (l) { return hover && (l.source === hover || l.target === hover) ? 2 : 1; },
        updateTriggers: { getColor: hover, getWidth: hover }
      }),
      new deck.ScatterplotLayer({
        id: "nodes", data: data.nodes, pickable: true,
        radiusUnits: "pixels", stroked: !bigN, lineWidthUnits: "pixels", getLineWidth: 1,
        getPosition: function (n) { return [n.x, n.y]; },
        getRadius: function (n) { return n.size; },
        getFillColor: function (n) { return rgb(ctx.series(n.group)).concat([lit(n.id) ? 255 : 40]); },
        getLineColor: rgb(T.stage),
        updateTriggers: { getFillColor: hover },
        onHover: function (info) {
          var id = info.object ? info.object.id : null;
          if (id !== hover) { hover = id; deckgl.setProps({ layers: layers() }); }
        }
      }),
      new deck.TextLayer({
        id: "labels-" + labels, data: data.nodes, visible: labels !== "off",
        getPosition: function (n) { return [n.x, n.y]; },
        getText: function (n) { return n.label; },
        getSize: 11, fontFamily: T.mono,
        getPixelOffset: function (n) { return [0, n.size + 8]; },
        getColor: function (n) { return n.id === hover ? ink : muted.concat([lit(n.id) ? 255 : 50]); },
        updateTriggers: { getColor: hover },
        /* Labels that would overlap one another are dropped, bigger nodes
           first: deck.gl's collision filter, run on the GPU every frame. */
        extensions: labels === "filter" ? [new deck.CollisionFilterExtension()] : [],
        getCollisionPriority: function (n) { return n.id === hover ? 100 : n.size; },
        collisionTestProps: { sizeScale: 2 }
      })
    ];
  }

  var deckgl = new deck.DeckGL({
    container: ctx.el,
    views: new deck.OrthographicView({ flipY: false }),
    initialViewState: fit(),
    controller: true,
    parameters: { clearColor: [0, 0, 0, 0] },
    getCursor: function (st) { return st.isHovering ? "pointer" : st.isDragging ? "grabbing" : "grab"; },
    layers: layers()
  });
  ctx.el.style.background = T.stage;
  ctx.onDestroy(function () { deckgl.finalize(); });

  ctx.select("labels", [{ v: "filter", t: "no overlap" }, { v: "all", t: "all" }, { v: "off", t: "off" }],
             function (v) { labels = v; deckgl.setProps({ layers: layers() }); }, labels);
  if (!bigN) ctx.btn("Re-run layout", function () {
    relayout(140);
    deckgl.setProps({ layers: layers(), initialViewState: fit() });
  });
  ctx.btn("Reset view", function () { deckgl.setProps({ initialViewState: Object.assign(fit(), { transitionDuration: 400 }) }); });
  say(ctx, data, "three layers: points, lines, labels");
};

})();
