/* Graphs & networks. */
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

/* ----------------------------------------------------------------- AntV G6 */
B.g6 = async function (ctx) {
  var T = ctx.T;
  var data = sample(46, 12);
  var graph = null;

  function build(layoutType) {
    if (graph) { graph.destroy(); ctx.el.innerHTML = ""; }
    graph = new G6.Graph({
      container: ctx.el,
      autoFit: "view",
      background: T.stage,
      data: {
        nodes: data.nodes.map(function (n) { return { id: n.id, data: { group: n.group } }; }),
        edges: data.links.map(function (l, i) { return { id: "e" + i, source: l.source, target: l.target }; })
      },
      node: {
        style: {
          size: 18,
          fill: function (d) { return ctx.series(d.data.group); },
          stroke: T.stage, lineWidth: 1.5,
          labelText: function (d) { return d.id; },
          labelFill: T.muted, labelFontSize: 9, labelPlacement: "bottom"
        },
        state: { active: { fill: T.accent, halo: true, labelFill: T.ink, labelFontSize: 11 } }
      },
      edge: { style: { stroke: T.edge, lineWidth: 1, endArrow: false, strokeOpacity: .55 } },
      layout: layoutType === "force"
        ? { type: "d3-force", link: { distance: 62 }, collide: { radius: 18 } }
        : { type: layoutType },
      behaviors: ["drag-canvas", "zoom-canvas", "drag-element", "hover-activate"]
    });
    graph.render();
  }
  build("force");

  ctx.select("layout", [
    { v: "force", t: "force directed" },
    { v: "radial", t: "radial" },
    { v: "circular", t: "circular" },
    { v: "concentric", t: "concentric" },
    { v: "grid", t: "grid" }
  ], build, "force");
  ctx.readout("<b>" + data.nodes.length + "</b> nodes · <b>" + data.links.length +
              "</b> edges — every position is computed, none authored");

  ctx.onResize(function () { if (graph) graph.resize(); });
  ctx.onDestroy(function () { if (graph) graph.destroy(); });
};

/* ---------------------------------------------------------- Cytoscape.js */
B.cy = async function (ctx) {
  var T = ctx.T;
  var data = sample(34, 9);

  var cy = cytoscape({
    container: ctx.el,
    elements: data.nodes.map(function (n) { return { data: { id: n.id, g: n.group } }; })
      .concat(data.links.map(function (l, i) {
        return { data: { id: "e" + i, source: l.source, target: l.target } };
      })),
    style: [
      { selector: "node", style: {
          "background-color": function (e) { return ctx.series(e.data("g")); },
          label: "data(id)", color: T.muted, "font-size": 8, "font-family": T.mono,
          "text-valign": "bottom", "text-margin-y": 3, width: 18, height: 18 } },
      { selector: "edge", style: { width: 1.2, "line-color": T.edge, "curve-style": "bezier", opacity: .6 } },
      { selector: ".path", style: {
          "line-color": T.accent, "background-color": T.accent, width: 3.5, "z-index": 10, opacity: 1 } },
      { selector: ".ends", style: {
          "background-color": T.yes, width: 28, height: 28,
          "border-width": 2, "border-color": T.stage, color: T.ink, "font-size": 11 } }
    ],
    layout: { name: "cose", animate: false, nodeRepulsion: 9000, idealEdgeLength: 62 }
  });

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
    picked.push(e.target.id());
    if (picked.length === 2) { runPath(picked[0], picked[1]); picked = []; }
    else { clear(); e.target.addClass("ends"); out("from <b>" + picked[0] + "</b> — now pick a second node"); }
  });

  ctx.btn("Random shortest path", function () {
    var ns = cy.nodes();
    picked = [];
    runPath(ns[Math.floor(Math.random() * ns.length)].id(),
            ns[Math.floor(Math.random() * ns.length)].id());
  }, true);
  ctx.btn("Betweenness", function () {
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
    cy.nodes().style({ width: 18, height: 18 });
    out("click any two nodes, or press the button");
  });

  ctx.onResize(function () { cy.resize(); cy.fit(undefined, 30); });
  ctx.onDestroy(function () { cy.destroy(); });
};

/* ----------------------------------------------------------- vis-network */
B.vn = async function (ctx) {
  var T = ctx.T;
  var data = sample(42, 12);
  var nodes = new vis.DataSet(data.nodes.map(function (n) {
    return { id: n.id, label: n.label, group: n.group };
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
    nodes: { shape: "dot", size: 12, borderWidth: 1.5,
             font: { color: T.muted, size: 10, face: "monospace" } },
    edges: { color: { color: T.edge, opacity: .6 }, width: 1, smooth: { type: "continuous" } },
    groups: groups,
    physics: {
      solver: "forceAtlas2Based",
      forceAtlas2Based: { gravitationalConstant: -58, springLength: 90, damping: .5 },
      stabilization: { iterations: 200 }
    },
    interaction: { hover: true, tooltipDelay: 120 }
  });

  var out = ctx.readout("stabilising…");
  net.on("stabilizationIterationsDone", function () {
    out("physics settled — drag a node and let go, it springs back");
  });

  ctx.check("physics", true, function (on) {
    net.setOptions({ physics: { enabled: on } });
    out(on ? "physics on — the graph pushes back" : "physics off — nodes stay where you drop them");
  });
  ctx.btn("Scatter", function () {
    net.setOptions({ physics: { enabled: true } });
    nodes.forEach(function (n) {
      net.moveNode(n.id, (Math.random() - .5) * 620, (Math.random() - .5) * 460);
    });
  });
  ctx.btn("Fit", function () { net.fit({ animation: true }); });

  ctx.onDestroy(function () { net.destroy(); });
};

/* ------------------------------------------------------------ force-graph */
B.fg = async function (ctx) {
  var T = ctx.T;
  var data = sample(160, 45);
  var g = ForceGraph()(ctx.el)
    .backgroundColor(T.stage)
    .graphData({ nodes: data.nodes, links: data.links })
    .nodeRelSize(4)
    .nodeColor(function (n) { return ctx.series(n.group); })
    .linkColor(function () { return T.edge; })
    .linkWidth(.7)
    .nodeLabel(function (n) { return n.label; })
    .cooldownTicks(140)
    .d3VelocityDecay(.28);

  ctx.check("flow particles", false, function (on) {
    g.linkDirectionalParticles(on ? 2 : 0)
     .linkDirectionalParticleWidth(2)
     .linkDirectionalParticleColor(function () { return T.accent; });
  });
  ctx.range("repulsion", { min: -240, max: -20, value: -90 }, function (v) {
    g.d3Force("charge").strength(v);
    g.d3ReheatSimulation();
  });
  ctx.btn("Reheat", function () { g.d3ReheatSimulation(); });
  ctx.readout("<b>" + data.nodes.length + "</b> nodes on one canvas — scroll to zoom, drag to pan");

  function fit() { g.width(ctx.el.clientWidth).height(ctx.el.clientHeight); }
  fit(); ctx.onResize(fit);
  ctx.onDestroy(function () { if (g._destructor) g._destructor(); });
};

/* --------------------------------------------------------------- Reagraph */
B.rg = async function (ctx) {
  /* Reagraph bundles its own React copy, so use that one. */
  var React = Reagraph.React, ReactDOM = Reagraph.ReactDOM;
  var h = React.createElement;
  var data = sample(80, 22);

  var nodes = data.nodes.map(function (n) {
    return { id: n.id, label: n.label, fill: ctx.series(n.group) };
  });
  var edges = data.links.map(function (l, i) {
    return { id: "e" + i, source: l.source, target: l.target };
  });

  var api = {};
  function App() {
    var a = React.useState("forceDirected2d"), layout = a[0], setLayout = a[1];
    var b = React.useState(false), labels = b[0], setLabels = b[1];
    api.setLayout = setLayout;
    api.setLabels = setLabels;
    return h(Reagraph.GraphCanvas, {
      nodes: nodes, edges: edges,
      layoutType: layout,
      theme: ctx.dark ? Reagraph.darkTheme : Reagraph.lightTheme,
      labelType: labels ? "all" : "none",
      draggable: true
    });
  }

  var root = ReactDOM.createRoot(ctx.el);
  root.render(h(App));
  ctx.onDestroy(function () { root.unmount(); });

  ctx.select("layout", [
    { v: "forceDirected2d", t: "force 2D" },
    { v: "forceDirected3d", t: "force 3D" },
    { v: "radialOut2d", t: "radial" },
    { v: "circular2d", t: "circular" }
  ], function (v) { if (api.setLayout) api.setLayout(v); }, "forceDirected2d");
  ctx.check("labels", false, function (v) { if (api.setLabels) api.setLabels(v); });
  ctx.readout("<b>" + nodes.length + "</b> nodes through WebGL — each one still selectable");
};

/* --------------------------------------------------------------- Sigma.js */
B.sig = async function (ctx) {
  var T = ctx.T;
  await ctx.need("d3");                       /* graphology holds data, d3-force does layout */
  var Graph = SigmaLib.Graph, Sigma = SigmaLib.Sigma;
  var data = sample(400, 160, 11);

  var g = new Graph();
  data.nodes.forEach(function (n) {
    g.addNode(n.id, { label: n.label, x: Math.random(), y: Math.random(),
                      size: 2.5 + (n.group % 4), color: ctx.series(n.group) });
  });
  data.links.forEach(function (l) {
    if (l.source !== l.target && !g.hasEdge(l.source, l.target)) {
      g.addEdge(l.source, l.target, { color: T.edge, size: .5 });
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
  relayout(220);

  var renderer = new Sigma(g, ctx.el, {
    labelColor: { color: T.muted },
    labelFont: T.mono, labelSize: 9,
    defaultEdgeColor: T.edge,
    renderLabels: false,
    allowInvalidContainer: true
  });
  renderer.getCamera().animatedReset();

  ctx.check("labels", false, function (on) { renderer.setSetting("renderLabels", on); });
  ctx.btn("Re-run layout", function () { relayout(140); renderer.refresh(); });
  ctx.btn("Reset view", function () { renderer.getCamera().animatedReset(); });
  ctx.readout("<b>" + g.order + "</b> nodes · <b>" + g.size + "</b> edges, drawn by WebGL");

  ctx.onResize(function () { renderer.refresh(); });
  ctx.onDestroy(function () { renderer.kill(); });
};

/* --------------------------------------------------------- 3d-force-graph */
B.fg3 = async function (ctx) {
  var T = ctx.T;
  var data = sample(120, 34);
  var g = ForceGraph3D()(ctx.el)
    .backgroundColor(T.stage)
    .graphData({ nodes: data.nodes, links: data.links })
    .nodeRelSize(4)
    .nodeColor(function (n) { return ctx.series(n.group); })
    .linkColor(function () { return T.edge; })
    .linkOpacity(.35)
    .nodeLabel(function (n) { return n.label; })
    .showNavInfo(false)
    .enableNodeDrag(true);

  var controls = g.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.1;
  ctx.check("auto-rotate", true, function (on) { controls.autoRotate = on; });
  ctx.check("link particles", false, function (on) {
    g.linkDirectionalParticles(on ? 2 : 0)
     .linkDirectionalParticleWidth(1.6)
     .linkDirectionalParticleColor(function () { return T.accent; });
  });
  ctx.btn("Reheat", function () { g.d3ReheatSimulation(); });
  ctx.readout("the same kind of graph, simulated in three dimensions");

  function fit() { g.width(ctx.el.clientWidth).height(ctx.el.clientHeight); }
  fit(); ctx.onResize(fit);
  ctx.onDestroy(function () { if (g._destructor) g._destructor(); });
};

})();
