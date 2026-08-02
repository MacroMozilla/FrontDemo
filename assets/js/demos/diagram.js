/* Diagrams & node editors. */
(function () {
"use strict";
var B = window.B;

/* ---------------------------------------------------------------- AntV X6 */
B.x6 = async function (ctx) {
  var T = ctx.T;
  var g = new X6.Graph({
    container: ctx.el,
    autoResize: true,
    background: { color: T.stage },
    grid: { visible: true, type: "dot", args: { color: T.grid, thickness: 1 } },
    panning: true,
    mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
    connecting: {
      router: "manhattan",
      connector: { name: "rounded" },
      allowBlank: false,
      allowLoop: false,
      snap: { radius: 24 },
      highlight: true,
      createEdge: function () {
        return this.createEdge({ attrs: edgeAttrs(T.accent) });
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: { attrs: { fill: T.accent, stroke: T.accent, strokeWidth: 2 } }
      }
    }
  });

  function edgeAttrs(color) {
    return { line: { stroke: color, strokeWidth: 1.6, targetMarker: { name: "block", width: 9, height: 7 } } };
  }

  function node(x, y, label, accent) {
    return g.addNode({
      x: x, y: y, width: 128, height: 44, label: label, shape: "rect",
      attrs: {
        body: { fill: T.nodeFill, stroke: accent || T.nodeLine, rx: 8, ry: 8, strokeWidth: accent ? 1.8 : 1.2 },
        label: { fill: T.ink, fontSize: 12.5, fontFamily: T.sans }
      },
      ports: {
        groups: {
          g: {
            position: "absolute",
            attrs: { circle: { r: 5, magnet: true, stroke: T.accent, fill: T.stage, strokeWidth: 1.6 } }
          }
        },
        items: [
          { group: "g", args: { x: "50%", y: 0 } },
          { group: "g", args: { x: "100%", y: "50%" } },
          { group: "g", args: { x: "50%", y: "100%" } },
          { group: "g", args: { x: 0, y: "50%" } }
        ]
      }
    });
  }

  var a = node(60, 40, "Draft", T.accent),
      b = node(60, 170, "Review"),
      c = node(280, 170, "Legal check"),
      d = node(280, 300, "Schedule"),
      e = node(500, 300, "Publish", T.yes);

  [[a, b], [b, c], [c, d], [d, e]].forEach(function (p) {
    g.addEdge({ source: p[0], target: p[1], router: "manhattan", connector: "rounded", attrs: edgeAttrs(T.edge) });
  });

  var routers = ["manhattan", "orth", "metro", "er", "normal"];
  ctx.select("router", routers, function (v) {
    g.getEdges().forEach(function (ed) { ed.setRouter(v === "normal" ? null : v); });
  }, "manhattan");

  ctx.check("grid", true, function (on) { on ? g.showGrid() : g.hideGrid(); });

  var n = 0;
  ctx.btn("Add node", function () {
    n++;
    var nd = node(80 + (n % 4) * 150, 420, "Step " + n);
    g.addEdge({ source: e, target: nd, router: "manhattan", connector: "rounded", attrs: edgeAttrs(T.edge) });
    g.zoomToFit({ padding: 24, maxScale: 1 });
  });
  ctx.btn("Fit", function () { g.zoomToFit({ padding: 24, maxScale: 1 }); });

  var out = ctx.readout("");
  function report() {
    out("<b>" + g.getNodes().length + "</b> nodes · <b>" + g.getEdges().length + "</b> edges");
  }
  g.on("node:added node:removed edge:added edge:removed", report);
  report();

  g.zoomToFit({ padding: 24, maxScale: 1 });
  ctx.onResize(function () { g.zoomToFit({ padding: 24, maxScale: 1 }); });
  ctx.onDestroy(function () { g.dispose(); });
};

/* ------------------------------------------------------------ React Flow */
B.xyf = async function (ctx) {
  var T = ctx.T;
  var React = XYFlow.React, ReactDOM = XYFlow.ReactDOM, RF = XYFlow;
  var h = React.createElement;

  /* A custom node type — the whole reason people pick React Flow. */
  function StageNode(props) {
    var d = props.data;
    return h("div", {
      style: {
        background: T.nodeFill, border: "1px solid " + (d.accent || T.nodeLine),
        borderLeft: "4px solid " + (d.accent || T.nodeLine),
        borderRadius: 8, padding: "8px 12px", minWidth: 140,
        color: T.ink, fontFamily: T.sans, fontSize: 12.5,
        boxShadow: "0 1px 3px rgba(0,0,0,.25)"
      }
    },
      h(RF.Handle, { type: "target", position: RF.Position.Top, style: { background: T.accent, width: 8, height: 8 } }),
      h("div", { style: { fontWeight: 600 } }, d.label),
      h("div", { style: { fontSize: 10.5, color: T.muted, fontFamily: T.mono, marginTop: 2 } }, d.meta),
      h(RF.Handle, { type: "source", position: RF.Position.Bottom, style: { background: T.accent, width: 8, height: 8 } })
    );
  }
  var nodeTypes = { stage: StageNode };

  var initialNodes = [
    { id: "1", type: "stage", position: { x: 40,  y: 20 },  data: { label: "Ingest", meta: "s3://raw", accent: T.accent } },
    { id: "2", type: "stage", position: { x: 40,  y: 150 }, data: { label: "Validate", meta: "zod schema" } },
    { id: "3", type: "stage", position: { x: 260, y: 150 }, data: { label: "Enrich", meta: "3 lookups" } },
    { id: "4", type: "stage", position: { x: 150, y: 290 }, data: { label: "Warehouse", meta: "postgres", accent: T.yes } }
  ];
  var initialEdges = [
    { id: "e1", source: "1", target: "2", animated: true, style: { stroke: T.accent } },
    { id: "e2", source: "2", target: "3", style: { stroke: T.edge } },
    { id: "e3", source: "3", target: "4", style: { stroke: T.edge } }
  ];

  var api = {};
  function Flow() {
    var ns = React.useState(initialNodes), nodes = ns[0], setNodes = ns[1];
    var es = React.useState(initialEdges), edges = es[0], setEdges = es[1];
    var mm = React.useState(true), showMap = mm[0], setShowMap = mm[1];
    api.add = function () {
      setNodes(function (cur) {
        var id = String(cur.length + 1);
        return cur.concat({ id: id, type: "stage",
          position: { x: 430, y: 40 + cur.length * 46 },
          data: { label: "Task " + id, meta: "new" } });
      });
    };
    api.map = setShowMap;
    api.count = function () { return { n: nodes.length, e: edges.length }; };

    return h(RF.ReactFlow, {
      nodes: nodes, edges: edges, nodeTypes: nodeTypes, fitView: true,
      colorMode: ctx.dark ? "dark" : "light",
      proOptions: { hideAttribution: true },
      defaultEdgeOptions: { type: "smoothstep" },
      onNodesChange: function (ch) { setNodes(function (cur) { return RF.applyNodeChanges(ch, cur); }); },
      onEdgesChange: function (ch) { setEdges(function (cur) { return RF.applyEdgeChanges(ch, cur); }); },
      onConnect: function (c) {
        setEdges(function (cur) {
          return RF.addEdge(Object.assign({}, c, { style: { stroke: T.accent }, animated: true }), cur);
        });
      }
    },
      h(RF.Background, { color: T.grid, gap: 18, size: 1.4 }),
      h(RF.Controls, { showInteractive: false }),
      showMap ? h(RF.MiniMap, {
        pannable: true, zoomable: true,
        style: { background: T.sunk, border: "1px solid " + T.line },
        nodeColor: function () { return T.accent; }
      }) : null
    );
  }

  var root = ReactDOM.createRoot(ctx.el);
  root.render(h(RF.ReactFlowProvider, null, h(Flow)));
  ctx.onDestroy(function () { root.unmount(); });

  ctx.btn("Add node", function () { api.add && api.add(); });
  ctx.check("minimap", true, function (v) { api.map && api.map(v); });
  ctx.readout("every node above is a React component");
};

/* -------------------------------------------------------------- Vue Flow */
B.vf = async function (ctx) {
  var T = ctx.T;
  var h = Vue.h;
  var mount = ctx.el;

  var nodeStyle = {
    background: T.nodeFill, color: T.ink, border: "1px solid " + T.nodeLine,
    borderRadius: "8px", fontSize: "12px", width: "128px", padding: "9px 0",
    textAlign: "center", fontFamily: T.sans
  };

  var nodes = Vue.reactive([
    { id: "1", position: { x: 40, y: 30 },  data: { label: "Form input" }, style: nodeStyle },
    { id: "2", position: { x: 40, y: 150 }, data: { label: "Validate" },   style: nodeStyle },
    { id: "3", position: { x: 250, y: 150 },data: { label: "Persist" },    style: nodeStyle },
    { id: "4", position: { x: 250, y: 270 },data: { label: "Notify" },     style: nodeStyle }
  ]);
  var edges = Vue.reactive([
    { id: "e1", source: "1", target: "2", animated: true, style: { stroke: T.accent } },
    { id: "e2", source: "2", target: "3", style: { stroke: T.edge } },
    { id: "e3", source: "3", target: "4", style: { stroke: T.edge } }
  ]);

  var app = Vue.createApp({
    setup: function () {
      return function () {
        return h(VueFlow.VueFlow, {
          nodes: nodes, edges: edges, fitViewOnInit: true,
          style: { width: "100%", height: "100%", background: T.stage },
          onConnect: function (c) {
            edges.push({ id: "u" + edges.length, source: c.source, target: c.target,
                         animated: true, style: { stroke: T.accent } });
            update();
          }
        });
      };
    }
  });
  app.mount(mount);
  ctx.onDestroy(function () { app.unmount(); });

  var out = ctx.readout("");
  function update() { out("<b>" + nodes.length + "</b> nodes · <b>" + edges.length + "</b> edges"); }
  update();

  var n = 0;
  ctx.btn("Add node", function () {
    n++;
    nodes.push({ id: "n" + n, position: { x: 430, y: 40 + n * 60 },
                 data: { label: "Step " + n }, style: nodeStyle });
    update();
  });
  ctx.label("drag between handles to connect");
};

/* --------------------------------------------------------------- JointJS */
B.joint = async function (ctx) {
  var T = ctx.T;
  var j = window.joint;
  var graph = new j.dia.Graph({}, { cellNamespace: j.shapes });
  var paper = new j.dia.Paper({
    el: ctx.el, model: graph, width: "100%", height: "100%",
    gridSize: 10, drawGrid: { name: "dot", args: { color: T.grid } },
    background: { color: T.stage },
    cellViewNamespace: j.shapes,
    defaultLink: function () {
      return new j.shapes.standard.Link({
        attrs: { line: { stroke: T.accent, strokeWidth: 1.8, targetMarker: { type: "path", d: "M 9 -4 0 0 9 4 z" } } }
      });
    },
    linkPinning: false,
    interactive: { linkMove: true }
  });

  function box(x, y, label, fill) {
    var r = new j.shapes.standard.Rectangle();
    r.position(x, y);
    r.resize(130, 48);
    r.attr({
      body: { fill: fill || T.nodeFill, stroke: T.nodeLine, strokeWidth: 1.2, rx: 8, ry: 8 },
      label: { text: label, fill: T.ink, fontSize: 12.5, fontFamily: T.sans }
    });
    r.addTo(graph);
    return r;
  }

  var a = box(60, 40, "Order placed"),
      b = box(280, 40, "Payment"),
      c = box(280, 180, "Fulfilment"),
      d = box(60, 180, "Refund");

  function link(s, t, label) {
    var l = new j.shapes.standard.Link();
    l.source(s); l.target(t);
    l.attr({ line: { stroke: T.edge, strokeWidth: 1.8, targetMarker: { type: "path", d: "M 9 -4 0 0 9 4 z" } } });
    if (label) l.labels([{ attrs: { text: { text: label, fill: T.ink2, fontSize: 10.5, fontFamily: T.mono },
                                    rect: { fill: T.stage, stroke: T.line } } }]);
    l.addTo(graph);
    return l;
  }
  link(a, b, "ok");
  link(b, c, "captured");
  link(b, d, "declined");

  /* Link tools are the reason to pick JointJS — surface them on hover. */
  var tools = new j.dia.ToolsView({
    tools: [
      new j.linkTools.Vertices({ snapRadius: 8 }),
      new j.linkTools.Segments(),
      new j.linkTools.SourceArrowhead(),
      new j.linkTools.TargetArrowhead(),
      new j.linkTools.Remove({ distance: 24 })
    ]
  });
  paper.on("link:mouseenter", function (lv) { lv.addTools(tools.constructor === Function ? tools : new j.dia.ToolsView({
    tools: [new j.linkTools.Vertices({ snapRadius: 8 }), new j.linkTools.Segments(),
            new j.linkTools.SourceArrowhead(), new j.linkTools.TargetArrowhead(),
            new j.linkTools.Remove({ distance: 24 })]
  })); });
  paper.on("link:mouseleave", function (lv) { lv.removeTools(); });

  var routers = [
    { v: "normal", t: "straight" }, { v: "orthogonal", t: "orthogonal" },
    { v: "manhattan", t: "manhattan" }, { v: "metro", t: "metro" }
  ];
  ctx.select("router", routers, function (v) {
    graph.getLinks().forEach(function (l) { l.router(v === "normal" ? null : v); });
  }, "normal");

  var i = 0;
  ctx.btn("Add element", function () {
    i++;
    var n = box(500, 40 + i * 70, "Task " + i);
    link(c, n);
  });
  ctx.readout("hover a link for its vertex, segment and endpoint tools");

  ctx.onResize(function () { paper.setDimensions("100%", "100%"); });
  ctx.onDestroy(function () { paper.remove(); });
};

/* ----------------------------------------------------------- diagram-js */
B.djs = async function (ctx) {
  var T = ctx.T;
  var D = window.DJS;

  /* diagram-js ships no shapes at all, so a renderer is the first thing
     you write. This one is the entire visual language of the demo. */
  function Renderer(eventBus, styles) {
    D.Diagram.prototype;                       /* (keeps the bundler honest) */
    this.canRender = function () { return true; };
    this.drawShape = function (parent, el) {
      var r = D.svgCreate("rect");
      D.svgAttr(r, { x: 0, y: 0, width: el.width, height: el.height, rx: 8, ry: 8,
                     fill: el.color || T.nodeFill, stroke: T.nodeLine, strokeWidth: 1.4 });
      D.svgAppend(parent, r);
      var t = D.svgCreate("text");
      D.svgAttr(t, { x: el.width / 2, y: el.height / 2 + 4, "text-anchor": "middle",
                     fill: T.ink, "font-size": "12.5px", "font-family": T.sans });
      t.textContent = el.name || el.id;
      D.svgAppend(parent, t);
      return r;
    };
    this.drawConnection = function (parent, con) {
      var pts = con.waypoints.map(function (p) { return p.x + "," + p.y; }).join(" ");
      var l = D.svgCreate("polyline");
      D.svgAttr(l, { points: pts, fill: "none", stroke: T.edge, strokeWidth: 1.8,
                     "marker-end": "url(#djs-arrow)" });
      D.svgAppend(parent, l);
      return l;
    };
    this.getShapePath = function (s) {
      return "M" + s.x + "," + s.y + "h" + s.width + "v" + s.height + "h-" + s.width + "z";
    };
  }
  Renderer.$inject = ["eventBus", "styles"];

  var CustomRenderer = {
    __init__: ["customRenderer"],
    customRenderer: ["type", Renderer]
  };

  var diagram = new D.Diagram({
    canvas: { container: ctx.el },
    modules: [
      D.ModelingModule, D.MoveModule, D.MoveCanvasModule, D.ZoomScrollModule,
      D.SelectionModule, D.OutlineModule, D.ResizeModule, D.ConnectModule,
      D.BendpointsModule, D.RulesModule, D.LassoToolModule, CustomRenderer
    ]
  });

  var canvas = diagram.get("canvas"),
      factory = diagram.get("elementFactory"),
      modeling = diagram.get("modeling"),
      stack = diagram.get("commandStack"),
      bus = diagram.get("eventBus");

  /* Arrow marker for the connection renderer. */
  var defs = D.svgCreate("defs");
  defs.innerHTML = '<marker id="djs-arrow" viewBox="0 0 10 10" refX="9" refY="5" ' +
                   'markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
                   '<path d="M0,0 L10,5 L0,10 z" fill="' + T.edge + '"/></marker>';
  D.svgAppend(canvas.getLayer("base").parentNode, defs);

  var root = canvas.getRootElement();
  function shape(x, y, name, color) {
    var s = factory.createShape({ x: x, y: y, width: 132, height: 54, name: name, color: color });
    canvas.addShape(s, root);
    return s;
  }
  var a = shape(70, 60, "Request", T.dark ? "#243046" : "#E8EFFC"),
      b = shape(300, 60, "Handler"),
      c = shape(300, 220, "Queue");
  modeling.connect(a, b);
  modeling.connect(b, c);

  var out = ctx.readout("");
  function report() {
    out("command stack — undo <b>" + (stack.canUndo() ? "ready" : "empty") +
        "</b> · redo <b>" + (stack.canRedo() ? "ready" : "empty") + "</b>");
  }
  bus.on("commandStack.changed", report);
  report();

  ctx.btn("Undo", function () { if (stack.canUndo()) stack.undo(); });
  ctx.btn("Redo", function () { if (stack.canRedo()) stack.redo(); });
  var n = 0;
  ctx.btn("Add + connect", function () {
    n++;
    var s = shape(70 + (n % 3) * 170, 380, "Node " + n);
    modeling.connect(c, s);
  }, true);
  ctx.label("drag shapes · every change is one undoable command");

  ctx.onDestroy(function () { diagram.destroy(); });
};

/* ----------------------------------------------------------- Baklava.js */
B.bak = async function (ctx) {
  var Core = BaklavaJS.Core, RV = BaklavaJS.RendererVue, Engine = BaklavaJS.Engine;

  /* createBaklava mounts the Vue editor and hands back its view model. */
  var baklava = BaklavaJS.createBaklava(ctx.el);
  var editor = baklava.editor;
  ctx.el.style.background = ctx.T.stage;

  var NumberNode = Core.defineNode({
    type: "Number", title: "Number",
    inputs:  { set: function () { return new RV.NumberInterface("Value", 4).setPort(false); } },
    outputs: { value: function () { return new Core.NodeInterface("Out", 0); } },
    calculate: function (i) { return { value: i.set }; }
  });

  var MathNode = Core.defineNode({
    type: "Math", title: "Math",
    inputs: {
      a: function () { return new Core.NodeInterface("A", 0); },
      b: function () { return new Core.NodeInterface("B", 0); },
      op: function () { return new RV.SelectInterface("Operation", "Multiply", ["Add", "Subtract", "Multiply"]).setPort(false); }
    },
    outputs: { result: function () { return new Core.NodeInterface("Result", 0); } },
    calculate: function (i) {
      var r = i.op === "Add" ? i.a + i.b : i.op === "Subtract" ? i.a - i.b : i.a * i.b;
      return { result: r };
    }
  });

  var DisplayNode = Core.defineNode({
    type: "Display", title: "Result",
    inputs: { value: function () { return new Core.NodeInterface("Value", 0); } },
    outputs: { shown: function () { return new RV.TextInterface("=", "0"); } },
    calculate: function (i) { return { shown: String(Math.round(i.value * 1000) / 1000) }; }
  });

  [NumberNode, MathNode, DisplayNode].forEach(function (t) { editor.registerNodeType(t); });

  function place(node, x, y) {
    editor.graph.addNode(node);
    node.position = { x: x, y: y };
    return node;
  }
  var n1 = place(new NumberNode(), 30, 40),
      n2 = place(new NumberNode(), 30, 230),
      m  = place(new MathNode(),  310, 110),
      dp = place(new DisplayNode(), 610, 150);

  editor.graph.addConnection(n1.outputs.value, m.inputs.a);
  editor.graph.addConnection(n2.outputs.value, m.inputs.b);
  editor.graph.addConnection(m.outputs.result, dp.inputs.value);

  /* The dependency engine is what makes this a dataflow graph rather
     than a drawing: change an input and everything downstream recomputes. */
  var engine = new Engine.DependencyEngine(editor);
  engine.start();
  ctx.onDestroy(function () { engine.stop(); });

  var out = ctx.readout("engine idle");
  engine.events.afterRun.subscribe(ctx, function (res) {
    var vals = [];
    res.forEach(function (outputs, nodeId) {
      var node = editor.graph.nodes.find(function (n) { return n.id === nodeId; });
      if (node && node.type === "Display") vals.push(outputs.get("shown"));
    });
    out(vals.length ? "recomputed → <b>" + vals.join(", ") + "</b>" : "engine running");
  });

  ctx.label("change a Number, watch Result follow");
};

/* --------------------------------------------------------------- maxGraph */
B.max = async function (ctx) {
  var T = ctx.T;
  var M = window.maxGraph || window.mxgraph || window;
  var Graph = M.Graph, InternalEvent = M.InternalEvent, RubberBandHandler = M.RubberBandHandler;

  ctx.el.style.background = T.stage;
  InternalEvent.disableContextMenu(ctx.el);

  var graph = new Graph(ctx.el);
  graph.setPanning(true);
  graph.setConnectable(true);
  graph.setCellsEditable(true);
  if (RubberBandHandler) new RubberBandHandler(graph);

  var vstyle = "rounded=1;arcSize=14;fillColor=" + T.nodeFill + ";strokeColor=" + T.nodeLine +
               ";fontColor=" + T.ink + ";fontSize=12;strokeWidth=1.2";
  var estyle = "edgeStyle=orthogonalEdgeStyle;rounded=1;strokeColor=" + T.edge +
               ";strokeWidth=1.6;fontColor=" + T.ink2 + ";fontSize=10";

  var parent = graph.getDefaultParent();
  var cells = {};
  graph.batchUpdate(function () {
    cells.a = graph.insertVertex(parent, null, "Idle",     60,  50, 130, 46, vstyle);
    cells.b = graph.insertVertex(parent, null, "Running",  300, 50, 130, 46, vstyle);
    cells.c = graph.insertVertex(parent, null, "Failed",   300, 210, 130, 46, vstyle);
    cells.d = graph.insertVertex(parent, null, "Done",     540, 50, 130, 46, vstyle);
    graph.insertEdge(parent, null, "start", cells.a, cells.b, estyle);
    graph.insertEdge(parent, null, "error", cells.b, cells.c, estyle);
    graph.insertEdge(parent, null, "ok",    cells.b, cells.d, estyle);
    graph.insertEdge(parent, null, "retry", cells.c, cells.b, estyle);
  });

  ctx.btn("Fit", function () { graph.fit(); graph.center(); });
  var n = 0;
  ctx.btn("Add state", function () {
    n++;
    graph.batchUpdate(function () {
      var v = graph.insertVertex(parent, null, "State " + n, 540, 200 + n * 70, 130, 46, vstyle);
      graph.insertEdge(parent, null, "", cells.d, v, estyle);
    });
  });
  ctx.readout("drag from a node's edge to draw a connection · double-click to rename");

  ctx.onDestroy(function () { graph.destroy(); });
};

})();
