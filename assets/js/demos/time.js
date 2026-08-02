/* Gantt charts, timelines and mind maps. */
(function () {
"use strict";
var B = window.B;

function iso(d) { return new Date(d).toISOString().slice(0, 10); }
var DAY = 86400000;
var T0 = Date.UTC(2026, 2, 2);

var TASKS = [
  { id: "1", name: "Discovery",        start: 0,  days: 6,  progress: 100, deps: "" },
  { id: "2", name: "Design system",    start: 5,  days: 10, progress: 88,  deps: "1" },
  { id: "3", name: "API contract",     start: 6,  days: 7,  progress: 70,  deps: "1" },
  { id: "4", name: "Front-end build",  start: 14, days: 16, progress: 42,  deps: "2,3" },
  { id: "5", name: "Back-end build",   start: 13, days: 14, progress: 55,  deps: "3" },
  { id: "6", name: "Integration",      start: 29, days: 6,  progress: 8,   deps: "4,5" },
  { id: "7", name: "QA pass",          start: 34, days: 7,  progress: 0,   deps: "6" },
  { id: "8", name: "Launch",           start: 41, days: 3,  progress: 0,   deps: "7" }
];

/* ---------------------------------------------------------- Frappe Gantt */
B.fgt = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;overflow:auto;padding:8px";
  ctx.el.appendChild(host);
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  host.appendChild(svg);

  var tasks = TASKS.map(function (t) {
    return { id: t.id, name: t.name,
             start: iso(T0 + t.start * DAY), end: iso(T0 + (t.start + t.days) * DAY),
             progress: t.progress, dependencies: t.deps };
  });

  var out = ctx.readout("drag a bar to move a task · drag its edges to change duration");
  var gantt = new Gantt(svg, tasks, {
    view_mode: "Week",
    bar_height: 22,
    padding: 16,
    readonly: false,
    on_date_change: function (task, start, end) {
      out("<b>" + task.name + "</b> → " + iso(start) + " … " + iso(end) +
          " (" + Math.round((end - start) / DAY) + " days)");
    },
    on_progress_change: function (task, progress) {
      out("<b>" + task.name + "</b> progress → " + Math.round(progress) + "%");
    }
  });

  ctx.select("view", ["Quarter Day", "Half Day", "Day", "Week", "Month"], function (v) {
    gantt.change_view_mode(v);
  }, "Week");
  ctx.btn("Today", function () { gantt.scroll_current(); });

  ctx.onDestroy(function () { host.innerHTML = ""; });
};

/* ----------------------------------------------------------- vis-timeline */
B.vt = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var groups = new vis.DataSet([
    { id: "design", content: "Design" },
    { id: "build", content: "Build" },
    { id: "ship", content: "Ship" }
  ]);
  var lane = { "1": "design", "2": "design", "3": "build", "4": "build",
               "5": "build", "6": "ship", "7": "ship", "8": "ship" };

  var items = new vis.DataSet(TASKS.map(function (t, i) {
    return {
      id: t.id, group: lane[t.id], content: t.name,
      start: new Date(T0 + t.start * DAY),
      end: new Date(T0 + (t.start + t.days) * DAY),
      style: "background-color:" + ctx.series(i % 8) + "33;border-color:" + ctx.series(i % 8) +
             ";color:" + T.ink + ";border-radius:6px"
    };
  }).concat([
    { id: "m1", group: "ship", content: "Go / no-go", type: "point",
      start: new Date(T0 + 40 * DAY),
      style: "color:" + T.ink }
  ]));

  var timeline = new vis.Timeline(ctx.el, items, groups, {
    editable: { updateTime: true, updateGroup: true, add: false, remove: false },
    stack: true,
    orientation: "top",
    zoomMin: 1000 * 60,
    zoomMax: 1000 * 60 * 60 * 24 * 365 * 5,
    margin: { item: 8, axis: 12 },
    start: new Date(T0 - 2 * DAY),
    end: new Date(T0 + 48 * DAY)
  });

  var out = ctx.readout("scroll to zoom the axis — keep going and you reach milliseconds");
  timeline.on("rangechanged", function (p) {
    var span = p.end - p.start;
    var label = span > 86400000 * 400 ? (span / (86400000 * 365)).toFixed(1) + " years"
              : span > 86400000 * 2 ? Math.round(span / 86400000) + " days"
              : span > 3600000 ? (span / 3600000).toFixed(1) + " hours"
              : span > 60000 ? (span / 60000).toFixed(1) + " minutes"
              : (span / 1000).toFixed(1) + " seconds";
    out("visible window: <b>" + label + "</b>");
  });
  items.on("update", function (ev, props) {
    var it = props.data[0];
    out("moved <b>" + it.content + "</b> to " + iso(it.start));
  });

  ctx.btn("Fit", function () { timeline.fit({ animation: true }); });
  ctx.btn("Zoom to one day", function () {
    timeline.setWindow(new Date(T0 + 14 * DAY), new Date(T0 + 15 * DAY), { animation: true });
  });
  ctx.btn("Zoom to one minute", function () {
    var c = T0 + 14 * DAY;
    timeline.setWindow(new Date(c), new Date(c + 60000), { animation: true });
  });

  ctx.onDestroy(function () { timeline.destroy(); });
};

/* -------------------------------------------------------- jsGantt Improved */
B.jg = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.id = "jsgantt-host";
  host.style.cssText = "position:absolute;inset:0;overflow:auto";
  ctx.el.appendChild(host);

  var g = new JSGantt.GanttChart(host, "week");
  g.setOptions({
    vCaptionType: "Complete",
    vQuarterColWidth: 36,
    vDateTaskDisplayFormat: "day dd month yyyy",
    vDayMajorDateDisplayFormat: "mon yyyy - Week ww",
    vWeekMinorDateDisplayFormat: "dd mon",
    vShowRes: 1, vShowCost: 0, vShowComp: 1, vShowDur: 1,
    vShowStartDate: 1, vShowEndDate: 1,
    vShowTaskInfoLink: 0,
    vUseSingleCell: 10000,
    vFormatArr: ["Day", "Week", "Month", "Quarter"],
    vEventClickRow: function (task) {
      out("clicked <b>" + task.getName() + "</b> · " + task.getCompVal() + "% complete · owner " + task.getResourceName());
    }
  });

  var owners = ["Ana", "Ben", "Cleo", "Dev", "Eli"];
  g.AddTaskItemObject({ pID: 100, pName: "Release 4.2", pStart: "", pEnd: "",
                        pClass: "ggroupblack", pGroup: 1, pOpen: 1, pRes: "team" });
  TASKS.forEach(function (t, i) {
    g.AddTaskItemObject({
      pID: 100 + Number(t.id), pName: t.name,
      pStart: iso(T0 + t.start * DAY), pEnd: iso(T0 + (t.start + t.days) * DAY),
      pClass: t.progress === 100 ? "gtaskgreen" : t.progress > 0 ? "gtaskblue" : "gtaskyellow",
      pLink: "", pMile: t.days <= 3 ? 1 : 0, pRes: owners[i % owners.length],
      pComp: t.progress, pGroup: 0, pParent: 100, pOpen: 1,
      pDepend: t.deps ? t.deps.split(",").map(function (d) { return 100 + Number(d); }).join(",") : "",
      pCaption: "", pNotes: ""
    });
  });
  g.Draw();

  var out = ctx.readout("click a row for its details · collapse the group with the arrow on the left");
  ctx.select("zoom", ["day", "week", "month", "quarter"], function (v) {
    g.setFormat(v); g.Draw();
  }, "week");
  ctx.check("show duration", true, function (v) { g.setShowDur(v ? 1 : 0); g.Draw(); });
  ctx.check("show owner", true, function (v) { g.setShowRes(v ? 1 : 0); g.Draw(); });
};

/* ------------------------------------------------------------ Mind Elixir */
B.me = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var data = {
    nodeData: {
      id: "root", topic: "Front-end stack", root: true,
      children: [
        { id: "r", topic: "Rendering", direction: 0, expanded: true, children: [
          { id: "r1", topic: "Canvas" }, { id: "r2", topic: "SVG" }, { id: "r3", topic: "WebGL" }
        ] },
        { id: "s", topic: "State", direction: 0, expanded: true, children: [
          { id: "s1", topic: "Signals" }, { id: "s2", topic: "Stores" }
        ] },
        { id: "b", topic: "Build", direction: 1, expanded: true, children: [
          { id: "b1", topic: "Vite" }, { id: "b2", topic: "esbuild" }, { id: "b3", topic: "Rollup" }
        ] },
        { id: "q", topic: "Quality", direction: 1, expanded: true, children: [
          { id: "q1", topic: "Types" }, { id: "q2", topic: "Tests" }, { id: "q3", topic: "Lint" }
        ] }
      ]
    }
  };

  var me = new MindElixir({
    el: host,
    direction: MindElixir.SIDE,
    draggable: true,
    contextMenu: true,
    toolBar: true,
    keypress: true,
    theme: ctx.dark ? MindElixir.DARK_THEME : MindElixir.THEME
  });
  me.init(data);

  var out = ctx.readout("double-click a node to rename · Tab adds a child · Enter adds a sibling");
  me.bus.addListener("operation", function (op) {
    out("operation <b>" + op.name + "</b> — undo and redo are built in");
  });
  me.bus.addListener("selectNode", function (node) {
    out("selected <b>" + node.topic + "</b>");
  });

  ctx.btn("Expand all", function () {
    (function walk(n) { n.expanded = true; (n.children || []).forEach(walk); })(me.nodeData);
    me.refresh();
  });
  ctx.btn("Export JSON", function () {
    var d = me.getData();
    out("<b>" + JSON.stringify(d).length + " bytes</b> of JSON describe the whole map");
  });
  ctx.select("layout", [
    { v: String(MindElixir.SIDE), t: "both sides" },
    { v: String(MindElixir.LEFT), t: "left" },
    { v: String(MindElixir.RIGHT), t: "right" }
  ], function (v) { me.initSide ? me.initSide() : null; me.direction = Number(v); me.refresh(); },
     String(MindElixir.SIDE));

  ctx.onDestroy(function () { host.innerHTML = ""; });
};

/* ----------------------------------------------------------------- jsMind */
B.jm = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.id = "jsmind-host";
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var mind = {
    meta: { name: "front-end", author: "frontdemo", version: "1.0" },
    format: "node_tree",
    data: {
      id: "root", topic: "Rendering paths", expanded: true,
      children: [
        { id: "dom", topic: "DOM", direction: "left", expanded: true, children: [
          { id: "dom1", topic: "cheap to style" },
          { id: "dom2", topic: "expensive past ~5k nodes" }
        ] },
        { id: "svg", topic: "SVG", direction: "left", expanded: true, children: [
          { id: "svg1", topic: "vector, printable" },
          { id: "svg2", topic: "still one node each" }
        ] },
        { id: "cv", topic: "Canvas", direction: "right", expanded: true, children: [
          { id: "cv1", topic: "one node total" },
          { id: "cv2", topic: "hit testing is yours" }
        ] },
        { id: "gl", topic: "WebGL", direction: "right", expanded: true, children: [
          { id: "gl1", topic: "100k+ elements" },
          { id: "gl2", topic: "shaders to write" }
        ] }
      ]
    }
  };

  var jm = new jsMind({
    container: "jsmind-host",
    editable: true,
    theme: ctx.dark ? "primary" : "greensea",
    view: { engine: "svg", line_width: 1.6, line_color: ctx.series(0) }
  });
  jm.show(mind);

  var out = ctx.readout("click a node to select it, then add or remove nodes");
  var n = 0;
  ctx.btn("Add child", function () {
    var sel = jm.get_selected_node();
    if (!sel) { out("select a node first"); return; }
    n++;
    jm.add_node(sel, "new" + n, "idea " + n);
    out("added a child under <b>" + sel.topic + "</b>");
  }, true);
  ctx.btn("Remove node", function () {
    var sel = jm.get_selected_node();
    if (!sel || sel.isroot) { out("select a non-root node"); return; }
    jm.remove_node(sel);
    out("removed");
  });
  ctx.select("theme", ["primary", "greensea", "danger", "warning", "success", "info"],
             function (v) { jm.set_theme(v); }, ctx.dark ? "primary" : "greensea");
  ctx.btn("Export", function () {
    out("<b>" + JSON.stringify(jm.get_data("node_tree")).length + " bytes</b> of JSON");
  });

  ctx.onDestroy(function () { host.innerHTML = ""; });
};

})();
