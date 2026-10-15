/* Diagram & flow editors.

   Every builder below draws the same flowchart (FLOW) with nothing but
   what its framework ships: stock shapes, stock theme, stock panels and
   toolbars, wired up the way the framework's own getting-started code
   does it. Where a framework has no diamond or terminator, its plain node
   stands in — nothing here is a hand-made custom shape.

   The only code shared between builders is the flowchart itself, the
   white page the editors sit on, and the Data / count helpers. */
(function () {
"use strict";
var B = window.B;

/* The flowchart. x / y are node centres on a top-to-bottom layout; each
   builder converts to what its framework wants (most take a top-left
   corner). */
var FLOW = {
  nodes: [
    { id: "start",   label: "Start",            kind: "terminal", x: 300, y: 40 },
    { id: "submit",  label: "Submit request",   kind: "process",  x: 300, y: 160 },
    { id: "approve", label: "Approved?",        kind: "decision", x: 300, y: 290 },
    { id: "order",   label: "Place order",      kind: "process",  x: 150, y: 430 },
    { id: "notify",  label: "Notify requester", kind: "process",  x: 450, y: 430 },
    { id: "end",     label: "End",              kind: "terminal", x: 300, y: 560 }
  ],
  edges: [
    { id: "e1", from: "start",   to: "submit" },
    { id: "e2", from: "submit",  to: "approve" },
    { id: "e3", from: "approve", to: "order",  label: "Yes" },
    { id: "e4", from: "approve", to: "notify", label: "No" },
    { id: "e5", from: "order",   to: "end" },
    { id: "e6", from: "notify",  to: "end" }
  ]
};

/* Editors sit on a plain white page with black text, the way their own
   docs show them, rather than inheriting this site's (possibly dark) theme. */
function paper(ctx) {
  ctx.tall();
  ctx.el.style.background = "#fff";
  ctx.el.style.color = "#000";
  ctx.el.style.colorScheme = "light";
}

/* "Data": what the framework itself would save, in its own format.
   `read` may return an object, a string, or a promise of either. */
function dataButton(ctx, read) {
  var panel = null, reading = false;
  ctx.btn("Data", async function () {
    if (panel) { panel.remove(); panel = null; return; }
    if (reading) return;                 /* a second click while draw.io answers */
    reading = true;
    var v;
    try { v = await read(); } finally { reading = false; }
    if (ctx.dead()) return;
    panel = ctx.mk("pre", "demo-json");
    panel.textContent = typeof v === "string" ? v : JSON.stringify(v, null, 2);
    ctx.stage.appendChild(panel);
  });
}

/* A live "n nodes · m edges" readout, fed from the framework's own
   change events. Returns the function to call with fresh counts. */
function counter(ctx) {
  var out = ctx.readout("");
  return function (nodes, edges) {
    out("<b>" + nodes + "</b> nodes · <b>" + edges + "</b> edges");
  };
}

/* ------------------------------------------------------------ React Flow */
B.xyf = async function (ctx) {
  var RF = XYFlow, React = RF.React, h = React.createElement;
  paper(ctx);
  var count = counter(ctx);

  /* Stock node types: "input" has only a source handle, "output" only a
     target handle, "default" both. A default node is 150 px wide. */
  var initialNodes = FLOW.nodes.map(function (n) {
    return {
      id: n.id,
      type: n.id === "start" ? "input" : n.id === "end" ? "output" : "default",
      position: { x: n.x - 75, y: n.y - 18 },
      data: { label: n.label }
    };
  });
  var initialEdges = FLOW.edges.map(function (e) {
    return { id: e.id, source: e.from, target: e.to, label: e.label };
  });

  var api = {};
  function Flow() {
    var ns = RF.useNodesState(initialNodes), es = RF.useEdgesState(initialEdges);
    var nodes = ns[0], setNodes = ns[1], onNodesChange = ns[2];
    var edges = es[0], setEdges = es[1], onEdgesChange = es[2];
    var flow = RF.useReactFlow();
    var onConnect = React.useCallback(function (params) {
      setEdges(function (eds) { return RF.addEdge(params, eds); });
    }, [setEdges]);
    React.useEffect(function () { count(nodes.length, edges.length); }, [nodes.length, edges.length]);
    api.flow = flow;
    api.setNodes = setNodes;

    return h(RF.ReactFlow, {
      nodes: nodes, edges: edges,
      onNodesChange: onNodesChange, onEdgesChange: onEdgesChange, onConnect: onConnect,
      fitView: true
    },
      h(RF.Controls),
      h(RF.MiniMap),
      h(RF.Background, { variant: "dots", gap: 12, size: 1 })
    );
  }

  var root = RF.ReactDOM.createRoot(ctx.el);
  root.render(h(RF.ReactFlowProvider, null, h(Flow)));
  ctx.onDestroy(function () { root.unmount(); });

  var added = 0;
  ctx.btn("Add node", function () {
    added++;
    var r = ctx.el.getBoundingClientRect();
    var p = api.flow.screenToFlowPosition({ x: r.left + r.width / 2, y: r.top + r.height / 3 });
    api.setNodes(function (nds) {
      return nds.concat({ id: "n" + added, position: { x: p.x - 75 + added * 12, y: p.y + added * 12 },
                          data: { label: "Node " + added } });
    });
  });
  dataButton(ctx, function () { return api.flow.toObject(); });
};

/* -------------------------------------------------------------- meta2d.js */
B.m2d = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);

  /* meta2d's own UI strings default to Chinese, and its dialogs are built in
     the constructor, so the language is set first. Lines carry no arrowhead
     unless asked for one; a flowchart wants it. */
  meta2djs.setLocale("en");
  var meta2d = new Meta2d(ctx.el, { toArrow: "triangleSolid" });
  registerCommonDiagram();               /* flowchart, activity, class, sequence… pens */
  ctx.onDestroy(function () { meta2d.destroy(); });

  /* The shapes meta2d's own editor offers for flowcharts: a rectangle is a
     process, a fully rounded rectangle a terminal, a diamond a decision. */
  meta2d.open({
    pens: FLOW.nodes.map(function (n) {
      var w = 120, hh = n.kind === "decision" ? 70 : 40;
      return {
        id: n.id, name: n.kind === "decision" ? "diamond" : "rectangle",
        borderRadius: n.kind === "terminal" ? 0.5 : 0,
        text: n.label, x: n.x - w / 2, y: n.y - hh / 2, width: w, height: hh
      };
    })
  });
  /* Lines leave a shape's bottom anchor (or a side, out of the diamond)
     and arrive on the top one; anchors run top, right, bottom, left.
     connectLine draws straight; polyline reads better as a flowchart. */
  FLOW.edges.forEach(function (e) {
    var a = meta2d.findOne(e.from), b = meta2d.findOne(e.to);
    var out = a.name === "diamond" && b.y > a.y + a.height ? (b.x < a.x ? 3 : 1) : 2;
    var into = b.name === "rectangle" && b.borderRadius && a.x !== b.x ? (a.x < b.x ? 3 : 1) : 0;
    var line = meta2d.connectLine(a, b, a.calculative.worldAnchors[out], b.calculative.worldAnchors[into]);
    meta2d.updateLineType(line, "polyline");
    meta2d.setValue({ id: line.id, toArrow: "triangleSolid", text: e.label || "" }, { render: false });
  });
  meta2d.fitView(true, 40);

  function report() {
    var pens = meta2d.data().pens.filter(function (p) { return !p.parentId; });
    var lines = pens.filter(function (p) { return p.type === 1; }).length;
    count(pens.length - lines, lines);
  }
  ["add", "delete", "undo", "redo", "paste"].forEach(function (ev) { meta2d.on(ev, report); });
  report();

  /* A palette like meta2d's own examples: drag a chip onto the canvas and
     meta2d's drop handler reads the pen out of dataTransfer. */
  [
    { t: "Process", pen: { name: "rectangle", text: "Process", width: 120, height: 40 } },
    { t: "Terminal", pen: { name: "rectangle", text: "Terminal", width: 120, height: 40, borderRadius: 0.5 } },
    { t: "Decision", pen: { name: "diamond", text: "Decision", width: 120, height: 70 } },
    { t: "Input/Output", pen: { name: "flowData", text: "Input/Output", width: 120, height: 50 } },
    { t: "Document", pen: { name: "flowDocument", text: "Document", width: 120, height: 60 } }
  ].forEach(function (item) {
    var b = ctx.btn("⠿ " + item.t, function () {});
    b.draggable = true;
    b.title = "Drag onto the canvas";
    b.addEventListener("dragstart", function (e) { e.dataTransfer.setData("Meta2d", JSON.stringify(item.pen)); });
  });

  ctx.select("new lines", ["curve", "polyline", "line", "mind"], function (v) {
    meta2d.setOptions({ drawingLineName: v });
  }, "curve");
  ctx.btn("Undo", function () { meta2d.undo(); });
  ctx.btn("Redo", function () { meta2d.redo(); });
  ctx.check("minimap", false, function (on) { on ? meta2d.showMap() : meta2d.hideMap(); });
  ctx.btn("Fit", function () { meta2d.fitView(true, 40); });
  dataButton(ctx, function () { return meta2d.data(); });
};

/* ---------------------------------------------------------------- JointJS */
B.joint = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);

  var namespace = joint.shapes;
  var graph = new joint.dia.Graph({}, { cellNamespace: namespace });
  var view = new joint.dia.Paper({
    el: ctx.el, model: graph, width: "100%", height: "100%",
    gridSize: 10,
    background: { color: "#F5F5F5" },
    cellViewNamespace: namespace,
    defaultLink: function () { return new joint.shapes.standard.Link(); },
    linkPinning: false                     /* a link has to end on a shape */
  });
  ctx.onDestroy(function () { view.remove(); });

  /* Standard shapes. standard.Polygon is a rectangle until given points. */
  var cells = {};
  FLOW.nodes.forEach(function (n) {
    var size = n.kind === "decision" ? { width: 140, height: 80 } : { width: 140, height: 50 };
    var Shape = n.kind === "decision" ? joint.shapes.standard.Polygon
              : n.kind === "terminal" ? joint.shapes.standard.Ellipse
              : joint.shapes.standard.Rectangle;
    var el = new Shape({
      position: { x: n.x - size.width / 2, y: n.y - size.height / 2 },
      size: size,
      attrs: { label: { text: n.label } }
    });
    if (n.kind === "decision") el.attr("body/points", "calc(w/2) 0 calc(w) calc(h/2) calc(w/2) calc(h) 0 calc(h/2)");
    cells[n.id] = el;
  });
  var links = FLOW.edges.map(function (e) {
    var l = new joint.shapes.standard.Link({ source: { id: cells[e.from].id }, target: { id: cells[e.to].id } });
    if (e.label) l.appendLabel({ attrs: { text: { text: e.label } } });
    return l;
  });
  graph.addCells(Object.keys(cells).map(function (k) { return cells[k]; }).concat(links));

  function report() { count(graph.getElements().length, graph.getLinks().length); }
  graph.on("add remove", report);
  report();

  /* Editing in the core is done with tools, shown on hover. */
  view.on("element:mouseenter", function (ev) {
    ev.addTools(new joint.dia.ToolsView({ tools: [
      new joint.elementTools.Boundary(),
      new joint.elementTools.HoverConnect(),
      new joint.elementTools.Remove()
    ] }));
  });
  view.on("link:mouseenter", function (ev) {
    ev.addTools(new joint.dia.ToolsView({ tools: [
      new joint.linkTools.Vertices(),
      new joint.linkTools.Segments(),
      new joint.linkTools.SourceArrowhead(),
      new joint.linkTools.TargetArrowhead(),
      new joint.linkTools.Boundary(),
      new joint.linkTools.Remove()
    ] }));
  });
  view.on("cell:mouseleave", function (ev) { ev.removeTools(); });

  function fit() { view.transformToFitContent({ padding: 30, maxScale: 1, verticalAlign: "middle", horizontalAlign: "middle" }); }
  fit();
  ctx.onResize(fit);

  ctx.select("router", ["normal", "manhattan", "orthogonal", "metro", "rightAngle"], function (v) {
    view.options.defaultRouter = { name: v };
    graph.getLinks().forEach(function (l) { l.router(v); });
  }, "normal");
  ctx.select("connector", ["normal", "straight", "rounded", "smooth", "curve", "jumpover"], function (v) {
    view.options.defaultConnector = { name: v };
    graph.getLinks().forEach(function (l) { l.connector(v); });
  }, "normal");
  var added = 0;
  ctx.btn("Add shape", function () {
    added++;
    var r = new joint.shapes.standard.Rectangle({
      position: { x: 520 + added * 15, y: 140 + added * 15 }, size: { width: 140, height: 50 },
      attrs: { label: { text: "Shape " + added } }
    });
    graph.addCell(r);
  });
  ctx.btn("Fit", fit);
  dataButton(ctx, function () { return graph.toJSON(); });
};

/* -------------------------------------------------------------- LogicFlow */
B.lf = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);
  var LogicFlow = Core.LogicFlow || Core.default, X = Extension;

  var lf = new LogicFlow({
    container: ctx.el,
    grid: true,
    keyboard: { enabled: true },
    plugins: [X.DndPanel, X.SelectionSelect, X.Control, X.Menu, X.MiniMap],
    pluginsOptions: { miniMap: { headerTitle: "Mini map" } }   /* hidden, but Chinese by default */
  });
  ctx.onDestroy(function () { lf.destroy(); });

  /* The drag-in panel takes an icon per item; these are plain outlines. */
  function icon(shape) {
    return "data:image/svg+xml," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#fff" stroke="#000" stroke-width="1.6">' +
      shape + "</svg>");
  }
  lf.extension.dndPanel.setPatternItems([
    { label: "Select", icon: icon('<rect x="5" y="5" width="22" height="22" stroke-dasharray="3 2"/>'),
      callback: function () { lf.extension.selectionSelect.openSelectionSelect(); } },
    { type: "circle", text: "Start", label: "Start", icon: icon('<circle cx="16" cy="16" r="11"/>') },
    { type: "rect", label: "Task", icon: icon('<rect x="4" y="8" width="24" height="16"/>') },
    { type: "diamond", label: "Condition", icon: icon('<path d="M16 4 28 16 16 28 4 16z"/>') },
    { type: "circle", text: "End", label: "End", icon: icon('<circle cx="16" cy="16" r="11" stroke-width="3"/>') }
  ]);
  lf.on("selection:selected", function () { lf.extension.selectionSelect.closeSelectionSelect(); });

  /* The control bar and the right-click menus default to Chinese labels.
     The control items are relabelled by key; the menus are set again with
     the same actions as the defaults, through LogicFlow's own menu API. */
  var controls = { "zoom-out": "Zoom out", "zoom-in": "Zoom in", reset: "Fit", undo: "Undo", redo: "Redo" };
  lf.extension.control.controlItems.forEach(function (item) {
    if (controls[item.key]) item.text = item.title = controls[item.key];
  });
  lf.setMenuConfig({
    nodeMenu: [
      { text: "Delete", callback: function (node) { lf.deleteNode(node.id); } },
      { text: "Edit text", callback: function (node) { lf.graphModel.editText(node.id); } },
      { text: "Duplicate", callback: function (node) { lf.cloneNode(node.id); } }
    ],
    edgeMenu: [
      { text: "Delete", callback: function (edge) { lf.deleteEdge(edge.id); } },
      { text: "Edit text", callback: function (edge) { lf.graphModel.editText(edge.id); } }
    ],
    selectionMenu: [
      { text: "Delete", callback: function (sel) {
        lf.clearSelectElements();
        sel.edges.forEach(function (e) { lf.deleteEdge(e.id); });
        sel.nodes.forEach(function (n) { lf.deleteNode(n.id); });
      } }
    ]
  });

  /* Built-in node types at their default sizes, the diamond widened so its
     label fits; LogicFlow's x / y are centres, like FLOW's. */
  lf.render({
    nodes: FLOW.nodes.map(function (n) {
      return { id: n.id, x: n.x, y: n.y, text: n.label,
               type: n.kind === "decision" ? "diamond" : n.kind === "terminal" ? "circle" : "rect",
               properties: n.kind === "decision" ? { rx: 62, ry: 40 } : {} };
    }),
    edges: FLOW.edges.map(function (e) {
      return { id: e.id, type: "polyline", sourceNodeId: e.from, targetNodeId: e.to, text: e.label };
    })
  });
  lf.fitView(40);
  lf.extension.miniMap.show();

  function report() {
    var g = lf.getGraphRawData();
    count(g.nodes.length, g.edges.length);
  }
  lf.on("history:change", report);
  report();

  ctx.select("new edges", ["polyline", "line", "bezier"], function (v) { lf.setDefaultEdgeType(v); }, "polyline");
  ctx.check("minimap", true, function (on) { on ? lf.extension.miniMap.show() : lf.extension.miniMap.hide(); });
  dataButton(ctx, function () { return lf.getGraphData(); });
};

/* --------------------------------------------------------------- maxGraph */
B.max = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);
  var M = maxGraph;

  /* As in maxGraph's own JavaScript example. */
  M.InternalEvent.disableContextMenu(ctx.el);
  var graph = new M.Graph(ctx.el, undefined, M.getDefaultPlugins().concat([M.RubberBandHandler]));
  graph.setPanning(true);                  /* right mouse button pans */
  graph.setConnectable(true);              /* drag out of a shape to connect */
  ctx.onDestroy(function () { graph.destroy(); });

  var parent = graph.getDefaultParent(), v = {};
  graph.batchUpdate(function () {
    FLOW.nodes.forEach(function (n) {
      var w = 120, hh = n.kind === "decision" ? 80 : 40;
      v[n.id] = graph.insertVertex({
        parent: parent, value: n.label,
        position: [n.x - w / 2, n.y - hh / 2], size: [w, hh],
        style: n.kind === "decision" ? { shape: "rhombus", perimeter: "rhombusPerimeter" }
             : n.kind === "terminal" ? { shape: "ellipse", perimeter: "ellipsePerimeter" } : {}
      });
    });
    FLOW.edges.forEach(function (e) {
      graph.insertEdge({ parent: parent, value: e.label || "", source: v[e.from], target: v[e.to] });
    });
  });

  /* Undo is opt-in: an UndoManager fed by the model's undoable edits. */
  var undo = new M.UndoManager();
  var remember = function (sender, evt) { undo.undoableEditHappened(evt.getProperty("edit")); };
  graph.getDataModel().addListener(M.InternalEvent.UNDO, remember);
  graph.getView().addListener(M.InternalEvent.UNDO, remember);

  /* So are keys: a KeyHandler binds nothing until told to. */
  var keys = new M.KeyHandler(graph);
  keys.bindKey(46, function () { graph.removeCells(); });             /* Delete */
  keys.bindKey(8, function () { graph.removeCells(); });              /* Backspace */
  keys.bindControlKey(90, function () { undo.undo(); });              /* Ctrl+Z */
  keys.bindControlKey(89, function () { undo.redo(); });              /* Ctrl+Y */
  ctx.onDestroy(function () { keys.onDestroy(); });

  function report() {
    count(graph.getChildVertices(parent).length, graph.getChildEdges(parent).length);
  }
  graph.getDataModel().addListener(M.InternalEvent.CHANGE, report);
  report();

  function fit() { graph.getPlugin("fit").fitCenter({ margin: 24 }); }
  fit();
  ctx.onResize(fit);

  ctx.btn("Undo", function () { undo.undo(); });
  ctx.btn("Redo", function () { undo.redo(); });
  ctx.btn("Zoom in", function () { graph.zoomIn(); });
  ctx.btn("Zoom out", function () { graph.zoomOut(); });
  ctx.btn("Fit", fit);
  dataButton(ctx, function () { return new M.ModelXmlSerializer(graph.getDataModel()).export(); });
};

/* ---------------------------------------------------------------- draw.io */
B.drawio = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);

  /* The flowchart in draw.io's own XML, with the styles its General
     palette gives each shape and edge. */
  var style = {
    terminal: "rounded=1;whiteSpace=wrap;html=1;arcSize=50;",
    process: "rounded=0;whiteSpace=wrap;html=1;",
    decision: "rhombus;whiteSpace=wrap;html=1;"
  };
  function attr(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  var cells = FLOW.nodes.map(function (n) {
    var w = 120, hh = n.kind === "decision" ? 80 : n.kind === "terminal" ? 40 : 60;
    return '<mxCell id="' + n.id + '" value="' + attr(n.label) + '" style="' + style[n.kind] + '" vertex="1" parent="1">' +
           '<mxGeometry x="' + (n.x - w / 2) + '" y="' + (n.y - hh / 2) + '" width="' + w + '" height="' + hh +
           '" as="geometry"/></mxCell>';
  }).concat(FLOW.edges.map(function (e) {
    return '<mxCell id="' + e.id + '" value="' + attr(e.label || "") + '" ' +
           'style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" ' +
           'edge="1" parent="1" source="' + e.from + '" target="' + e.to + '">' +
           '<mxGeometry relative="1" as="geometry"/></mxCell>';
  }));
  var xml = '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>' + cells.join("") +
            "</root></mxGraphModel>";

  /* embed=1 is embed mode, proto=json the JSON message protocol, spin=1 a
     spinner until the diagram arrives, configure=1 a chance to configure
     the editor first, lang=en English whatever the browser's language; the
     rest hide the Save/Exit buttons an embedding app would otherwise wire up. */
  var origin = "https://embed.diagrams.net";
  var frame = ctx.mk("iframe");
  frame.title = "draw.io";
  frame.referrerPolicy = "no-referrer";   /* diagrams.net refuses localhost referrers */
  frame.src = origin + "/?embed=1&proto=json&spin=1&configure=1&lang=en&noSaveBtn=1&noExitBtn=1&saveAndExit=0";
  frame.style.cssText = "display:block;width:100%;height:100%;border:0";
  ctx.el.appendChild(frame);

  function send(msg) { frame.contentWindow.postMessage(JSON.stringify(msg), origin); }
  function report(xmlNow) {
    count((xmlNow.match(/vertex="1"/g) || []).length, (xmlNow.match(/edge="1"/g) || []).length);
  }
  /* Without embed.diagrams.net (offline, or a network that blocks it) the
     frame would just stay empty, so say why after a while. */
  var answered = false, unfail = null;
  ctx.after(45000, function () {
    if (!answered) unfail = ctx.fail("draw.io has not loaded after 45 seconds. Its editor comes from " +
      "embed.diagrams.net, which this page has to reach; every other page runs from this site alone.");
  });

  var waiting = [];
  ctx.on(window, "message", function (evt) {
    if (evt.origin !== origin || evt.source !== frame.contentWindow) return;
    answered = true;
    if (unfail) { unfail(); unfail = null; }
    var msg = JSON.parse(evt.data);
    /* configure → init → load: plain rather than compressed XML, then the diagram. */
    if (msg.event === "configure") send({ action: "configure", config: { compressXml: false } });
    if (msg.event === "init") { send({ action: "load", xml: xml, autosave: 1 }); report(xml); }
    if (msg.event === "autosave") report(msg.xml);
    if (msg.event === "export") { report(msg.xml); waiting.splice(0).forEach(function (fn) { fn(msg.xml); }); }
  });

  /* Asking for the diagram back is an export message. */
  dataButton(ctx, function () {
    return new Promise(function (resolve) {
      waiting.push(resolve);
      send({ action: "export", format: "xml" });
    });
  });
};

/* -------------------------------------------------------- Plait / Drawnix */
B.dnx = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);
  var D = ctx.mod, React = D.React, h = React.createElement;

  /* Plait's own flowchart symbols (default sizes, with the diamond widened
     enough for its label), joined by elbow arrow-lines bound to them — the
     same element creators Drawnix's toolbar uses. */
  var size = { terminal: [120, 60], process: [120, 60], decision: [170, 80] };
  var els = {}, nodes = {};
  FLOW.nodes.forEach(function (n) {
    var s = size[n.kind];
    nodes[n.id] = n;
    els[n.id] = D.createGeometryElement(D.FlowchartSymbols[n.kind],
      [[n.x - s[0] / 2, n.y - s[1] / 2], [n.x + s[0] / 2, n.y + s[1] / 2]], n.label);
  });
  /* Where an arrow leaves and lands, as [x, y] fractions of each box:
     straight down, out of the diamond's side, or into the side of End. */
  function connections(a, b) {
    if (a.x === b.x) return [[0.5, 1], [0.5, 0]];
    if (a.kind === "decision") return [[b.x < a.x ? 0 : 1, 0.5], [0.5, 0]];
    return [[0.5, 1], [b.x > a.x ? 0 : 1, 0.5]];
  }
  function at(el, c) {
    var p = el.points;
    return [p[0][0] + (p[1][0] - p[0][0]) * c[0], p[0][1] + (p[1][1] - p[0][1]) * c[1]];
  }
  var lines = FLOW.edges.map(function (e) {
    var c = connections(nodes[e.from], nodes[e.to]), a = els[e.from], b = els[e.to];
    return D.createArrowLineElement(D.ArrowLineShape.elbow, [at(a, c[0]), at(b, c[1])],
      { boundId: a.id, connection: c[0], marker: D.ArrowLineMarkerType.none },
      { boundId: b.id, connection: c[1], marker: D.ArrowLineMarkerType.arrow },
      e.label ? [{ text: { children: [{ text: e.label }] }, position: 0.5 }] : []);
  });
  var value = Object.keys(els).map(function (k) { return els[k]; }).concat(lines);

  function report(children) {
    var n = children.filter(function (c) { return c.type !== "arrow-line" && c.type !== "vector-line"; }).length;
    count(n, children.length - n);
  }
  /* Open zoomed to fit, below the floating toolbar. */
  var W = ctx.el.clientWidth, H = ctx.el.clientHeight;
  var zoom = Math.min(1, (H - 130) / 590);
  var viewport = { zoom: zoom, origination: [300 - W / 2 / zoom, 10 - 86 / zoom] };

  var latest = value;
  var root = D.ReactDOM.createRoot(ctx.el);
  root.render(h(D.Drawnix, {
    value: value,
    viewport: viewport,
    initialLanguage: "en",                /* Drawnix defaults to Chinese */
    onChange: function (data) { latest = data.children; report(latest); }
  }));
  ctx.onDestroy(function () { root.unmount(); });
  report(value);

  dataButton(ctx, function () { return latest; });
};

/* --------------------------------------------------------------- FlowGram */
B.fgm = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);
  var F = FlowGram, React = F.React, h = React.createElement;

  /* FlowGram's free-layout starter template (npx @flowgram.ai/create-app,
     "free-layout-simple"), written without JSX and trimmed to the node
     types this flowchart needs. Ports are left = in, right = out, so the
     chart runs left to right here. */
  var CONDITION_ITEM_HEIGHT = 35;
  var conditionForm = {
    formatOnInit: function (value) { return Object.assign({ portKeys: ["if", "else"] }, value); },
    effect: {
      portKeys: [{
        event: F.DataEvent.onValueInitOrChange,
        effect: function (p) {
          p.context.node.ports.updateAllPorts([{ type: "input" }].concat(p.value.map(function (portID, i) {
            return { type: "output", portID: portID, location: "right",
                     locationConfig: { right: 0, top: (i + 1) * CONDITION_ITEM_HEIGHT } };
          })));
        }
      }]
    },
    render: function () {
      return h(React.Fragment, null,
        h(F.Field, { name: "title" }, function (p) { return h("div", { className: "demo-free-node-title" }, p.field.value); }),
        h(F.Field, { name: "portKeys" }, function (p) {
          var value = p.field.value, onChange = p.field.onChange;
          return h("div", { className: "demo-free-node-content",
                            style: { width: 160, height: value.length * CONDITION_ITEM_HEIGHT, minHeight: 2 * CONDITION_ITEM_HEIGHT } },
            h("div", null, h("button", { onClick: function () { onChange(value.concat("if_" + value.length)); } }, "Add Port")),
            h("div", { style: { marginTop: 8 } },
              h("button", { onClick: function () { onChange(value.slice(0, -1)); } }, "Delete Port")));
        }));
    }
  };
  var nodeRegistries = [
    { type: "start", meta: { isStart: true, deleteDisable: true, copyDisable: true, defaultPorts: [{ type: "output" }] } },
    { type: "end", meta: { deleteDisable: true, copyDisable: true, defaultPorts: [{ type: "input" }] } },
    { type: "custom", meta: { defaultPorts: [{ type: "output" }, { type: "input" }] } },
    { type: "condition", meta: { defaultPorts: [{ type: "input" }] }, formMeta: conditionForm }
  ];

  var initialData = {
    nodes: FLOW.nodes.map(function (n) {
      return {
        id: n.id,
        type: n.kind === "decision" ? "condition" : n.id === "start" || n.id === "end" ? n.id : "custom",
        meta: { position: { x: (n.y - 40) * 2.3, y: (n.x - 300) * 1.1 } },
        data: { title: n.label, content: "" }
      };
    }),
    edges: FLOW.edges.map(function (e) {
      var port = e.label === "Yes" ? "if" : e.label === "No" ? "else" : undefined;
      return port ? { sourceNodeID: e.from, targetNodeID: e.to, sourcePortID: port }
                  : { sourceNodeID: e.from, targetNodeID: e.to };
    })
  };

  var editorProps = {
    background: true,
    readonly: false,
    initialData: initialData,
    nodeRegistries: nodeRegistries,
    getNodeDefaultRegistry: function (type) {
      return {
        type: type,
        meta: { defaultExpanded: true },
        formMeta: {
          render: function () {
            return h(React.Fragment, null,
              h(F.Field, { name: "title" }, function (p) { return h("div", { className: "demo-free-node-title" }, p.field.value); }),
              h("div", { className: "demo-free-node-content" }, h(F.Field, { name: "content" }, h("input"))));
          }
        }
      };
    },
    materials: {
      renderDefaultNode: function (props) {
        var r = F.useNodeRender();
        return h(F.WorkflowNodeRenderer, { className: "demo-free-node", node: props.node,
                                           style: r.node.getNodeMeta().wrapperStyle },
                 r.form && r.form.render());
      }
    },
    onContentChange: function (c) {
      var json = c.document.toJSON();
      count(json.nodes.length, json.edges.length);
    },
    nodeEngine: { enable: true },
    history: { enable: true, enableChangeNode: true },
    onAllLayersRendered: function (c) { c.document.fitView(false); },
    plugins: function () {
      return [
        F.createMinimapPlugin({
          disableLayer: true,
          canvasStyle: {
            canvasWidth: 182, canvasHeight: 102, canvasPadding: 50,
            canvasBackground: "rgba(245, 245, 245, 1)", canvasBorderRadius: 10,
            viewportBackground: "rgba(235, 235, 235, 1)", viewportBorderRadius: 4,
            viewportBorderColor: "rgba(201, 201, 201, 1)", viewportBorderWidth: 1, viewportBorderDashLength: 2,
            nodeColor: "rgba(255, 255, 255, 1)", nodeBorderRadius: 2, nodeBorderWidth: 0.145,
            nodeBorderColor: "rgba(6, 7, 9, 0.10)", overlayColor: "rgba(255, 255, 255, 0)"
          }
        }),
        F.createFreeSnapPlugin({ edgeColor: "#00B2B2", alignColor: "#00B2B2", edgeLineWidth: 1,
                                 alignLineWidth: 1, alignCrossWidth: 8 })
      ];
    }
  };

  /* The template's three components: the drag-in side panel, the tool
     bar and the minimap. On a phone-sized stage the minimap would cover
     the canvas, so it is left out there, and the tool bar wraps from the
     left edge instead of starting beside the panel. */
  var narrow = ctx.el.clientWidth < 640;
  function NodeAddPanel() {
    var drag = F.useService(F.WorkflowDragService);
    var doc = F.useService(F.WorkflowDocument);
    var context = F.useClientContext();
    return h("div", { className: "demo-free-sidebar" }, [["custom", "Node"], ["condition", "Condition"]].map(function (c) {
      return h("div", { key: c[0], className: "demo-free-card", onMouseDown: function (e) {
        var json = (doc.getNodeRegistry(c[0]).onAdd || function () { return {}; })(context);
        drag.startDragCard(c[0], e, Object.assign({}, json, { data: { title: "New " + c[1], content: "" } }));
      } }, c[1]);
    }));
  }
  function Tools() {
    var history = F.useClientContext().history, tools = F.usePlaygroundTools();
    var u = React.useState(false), r = React.useState(false);
    React.useEffect(function () {
      var d = history.undoRedoService.onChange(function () { u[1](history.canUndo()); r[1](history.canRedo()); });
      return function () { d.dispose(); };
    }, [history]);
    var bezier = tools.lineType === F.LineType.BEZIER;
    return h("div", { style: { position: "absolute", zIndex: 10, bottom: 16, left: narrow ? 16 : 226, right: 16,
                               display: "flex", flexWrap: "wrap", gap: 8 } },
      h("button", { onClick: function () { tools.zoomin(); } }, "ZoomIn"),
      h("button", { onClick: function () { tools.zoomout(); } }, "ZoomOut"),
      h("button", { onClick: function () { tools.fitView(); } }, "Fitview"),
      h("button", { onClick: function () { tools.autoLayout(); } }, "AutoLayout"),
      h("button", { onClick: function () { tools.switchLineType(bezier ? F.LineType.LINE_CHART : F.LineType.BEZIER); } },
        bezier ? "Bezier" : "Fold"),
      h("button", { onClick: function () { history.undo(); }, disabled: !u[0] }, "Undo"),
      h("button", { onClick: function () { history.redo(); }, disabled: !r[0] }, "Redo"),
      h("span", null, Math.floor(tools.zoom * 100) + "%"));
  }
  function Minimap() {
    return h("div", { style: { position: "absolute", left: 226, bottom: 51, zIndex: 100, width: 198 } },
      h(F.MinimapRender, {
        containerStyles: { pointerEvents: "auto", position: "relative", top: "unset", right: "unset", bottom: "unset", left: "unset" },
        inactiveStyle: { opacity: 1, scale: 1, translateX: 0, translateY: 0 }
      }));
  }
  var api = {};
  function Grab() { api.ctx = F.useClientContext(); return null; }

  var root = F.ReactDOM.createRoot(ctx.el);
  root.render(h(F.FreeLayoutEditorProvider, editorProps,
    h("div", { className: "demo-free-container" },
      h("div", { className: "demo-free-layout" }, h(NodeAddPanel), h(F.EditorRenderer, { className: "demo-free-editor" })),
      h(Tools), narrow ? null : h(Minimap), h(Grab))));
  ctx.onDestroy(function () { root.unmount(); });
  count(initialData.nodes.length, initialData.edges.length);

  dataButton(ctx, function () { return api.ctx.document.toJSON(); });
};

/* ---------------------------------------------------------------- AntV X6 */
B.x6 = async function (ctx) {
  paper(ctx);
  var count = counter(ctx);

  /* Stencil on the left, graph on the right, minimap in the corner — the
     layout of X6's own editor examples, minus the minimap on a phone-sized
     stage, where it would cover the graph. autoResize sizes the graph to
     its container's parent, hence the wrapper. */
  var narrow = ctx.el.clientWidth < 640;
  var side = ctx.mk("div"), wrap = ctx.mk("div"), main = ctx.mk("div"), map = ctx.mk("div");
  side.style.cssText = "position:absolute;left:0;top:0;bottom:0;width:200px;border-right:1px solid #dfe3e8";
  wrap.style.cssText = "position:absolute;left:200px;right:0;top:0;bottom:0";
  map.style.cssText = "position:absolute;right:12px;bottom:12px;width:200px;height:140px;" +
                      "border:1px solid #dfe3e8;background:#fff;z-index:2";
  wrap.appendChild(main);
  ctx.el.appendChild(side); ctx.el.appendChild(wrap);
  if (!narrow) ctx.el.appendChild(map);

  /* Colours from X6's getting-started example. */
  var line = { stroke: "#8f8f8f", strokeWidth: 1 };
  var body = { fill: "#fff", stroke: "#8f8f8f", strokeWidth: 1 };
  var port = { circle: { r: 4, magnet: true, stroke: "#8f8f8f", strokeWidth: 1, fill: "#fff",
                         style: { visibility: "hidden" } } };
  var ports = {
    groups: { top: { position: "top", attrs: port }, right: { position: "right", attrs: port },
              bottom: { position: "bottom", attrs: port }, left: { position: "left", attrs: port } },
    items: [{ group: "top" }, { group: "right" }, { group: "bottom" }, { group: "left" }]
  };
  function shape(kind, label) {
    return kind === "decision" ? { shape: "polygon", width: 120, height: 70, label: label, ports: ports,
                                   attrs: { body: Object.assign({ refPoints: "0,10 10,0 20,10 10,20" }, body) } }
         : kind === "terminal" ? { shape: "ellipse", width: 120, height: 44, label: label, ports: ports, attrs: { body: body } }
         : { shape: "rect", width: 120, height: 44, label: label, ports: ports,
             attrs: { body: Object.assign({ rx: 6, ry: 6 }, body) } };
  }

  var graph = new X6.Graph({
    container: main,
    autoResize: true,
    background: { color: "#F2F7FA" },
    grid: true,
    panning: { enabled: true, eventTypes: ["mouseWheel"] },
    mousewheel: { enabled: true, modifiers: ["ctrl", "meta"] },
    connecting: {
      snap: true, allowBlank: false, allowLoop: false, highlight: true,
      createEdge: function () { return this.createEdge({ shape: "edge", attrs: { line: line } }); }
    }
  });
  graph
    .use(new X6.Transform({ resizing: true }))
    .use(new X6.Selection({ rubberband: true, showNodeSelectionBox: true }))
    .use(new X6.Snapline())
    .use(new X6.Keyboard())
    .use(new X6.Clipboard())
    .use(new X6.History());
  if (!narrow) graph.use(new X6.MiniMap({ container: map, width: 198, height: 138 }));
  ctx.onDestroy(function () { graph.dispose(); });

  graph.fromJSON({
    nodes: FLOW.nodes.map(function (n) {
      var s = shape(n.kind, n.label);
      return Object.assign(s, { id: n.id, x: n.x - s.width / 2, y: n.y - s.height / 2 });
    }),
    edges: FLOW.edges.map(function (e) {
      return { shape: "edge", source: e.from, target: e.to, label: e.label, attrs: { line: line } };
    })
  });
  function fit() { graph.zoomToFit({ padding: 40, maxScale: 1 }); }
  fit();

  /* Ports appear on hover, as in X6's flowchart example. */
  function showPorts(show) {
    main.querySelectorAll(".x6-port-body").forEach(function (p) { p.style.visibility = show ? "visible" : "hidden"; });
  }
  graph.on("node:mouseenter", function () { showPorts(true); });
  graph.on("node:mouseleave", function () { showPorts(false); });

  /* The plugins bring the commands; the shortcuts are bound by hand. */
  graph.bindKey(["meta+c", "ctrl+c"], function () {
    var cells = graph.getSelectedCells();
    if (cells.length) graph.copy(cells);
    return false;
  });
  graph.bindKey(["meta+v", "ctrl+v"], function () {
    if (!graph.isClipboardEmpty()) { var cells = graph.paste({ offset: 32 }); graph.cleanSelection(); graph.select(cells); }
    return false;
  });
  graph.bindKey(["meta+z", "ctrl+z"], function () { if (graph.canUndo()) graph.undo(); return false; });
  graph.bindKey(["meta+shift+z", "ctrl+shift+z"], function () { if (graph.canRedo()) graph.redo(); return false; });
  graph.bindKey(["backspace", "delete"], function () {
    var cells = graph.getSelectedCells();
    if (cells.length) graph.removeCells(cells);
  });

  var stencil = new X6.Stencil({
    title: "Flowchart",
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 0,
    collapsable: false,
    groups: [{ name: "basic", title: "Basic shapes" }],
    layoutOptions: { columns: 1, columnWidth: 180, rowHeight: 70 }
  });
  side.appendChild(stencil.container);
  stencil.load([
    graph.createNode(shape("process", "Process")),
    graph.createNode(shape("decision", "Decision")),
    graph.createNode(shape("terminal", "Start / End"))
  ], "basic");

  /* A dragged-out edge is a dry run until it lands, so count on connect too. */
  function report() { count(graph.getNodes().length, graph.getEdges().length); }
  ["cell:added", "cell:removed", "edge:connected"].forEach(function (ev) { graph.on(ev, report); });
  report();

  ctx.btn("Undo", function () { graph.undo(); });
  ctx.btn("Redo", function () { graph.redo(); });
  ctx.btn("Fit", fit);
  dataButton(ctx, function () { return graph.toJSON(); });
};

})();
