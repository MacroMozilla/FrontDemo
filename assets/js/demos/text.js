/* Text in, laid-out diagram out. */
(function () {
"use strict";
var B = window.B;

/* Shared shape: source on the left, rendered diagram on the right. */
function split(ctx, source, render, hint) {
  var p = ctx.panes("42%");
  ctx.tall();
  var out = ctx.mk("div");
  out.style.cssText = "min-height:100%;display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto";
  p.b.appendChild(out);

  var status = ctx.readout(hint || "edit the source — it re-renders as you type");
  var timer = null;
  function run(text) {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (ctx.dead()) return;
      Promise.resolve()
        .then(function () { return render(text, out); })
        .then(function () { status(hint || "rendered · " + text.split("\n").length + " lines of source"); })
        .catch(function (e) {
          status('<span style="color:' + ctx.T.bad + '">' + String((e && e.message) || e).slice(0, 90) + "</span>");
        });
    }, 240);
  }
  var ed = ctx.editor(p.a, source, run);
  run(source);
  return { editor: ed, out: out, status: status, run: run };
}

/* ---------------------------------------------------------------- Mermaid */
B.mer = async function (ctx) {
  var T = ctx.T;
  var M = window.MermaidLib.default || window.MermaidLib;

  var samples = {
    flowchart: [
      "flowchart TD",
      "    A[Pull request opened] --> B{CI green?}",
      "    B -- no --> C[Push a fix]",
      "    C --> B",
      "    B -- yes --> D{Approved?}",
      "    D -- no --> E[Address review]",
      "    E --> D",
      "    D -- yes --> F[Squash and merge]",
      "    F --> G([Deploy])"
    ].join("\n"),
    sequence: [
      "sequenceDiagram",
      "    autonumber",
      "    participant U as Browser",
      "    participant E as Edge",
      "    participant O as Origin",
      "    U->>E: GET /report",
      "    E->>E: check cache",
      "    alt cache hit",
      "        E-->>U: 200 (cached)",
      "    else miss",
      "        E->>O: GET /report",
      "        O-->>E: 200 + Cache-Control",
      "        E-->>U: 200 (fresh)",
      "    end"
    ].join("\n"),
    state: [
      "stateDiagram-v2",
      "    [*] --> Idle",
      "    Idle --> Loading: fetch()",
      "    Loading --> Ready: 200",
      "    Loading --> Failed: 5xx",
      "    Failed --> Loading: retry",
      "    Ready --> [*]"
    ].join("\n"),
    er: [
      "erDiagram",
      "    CUSTOMER ||--o{ ORDER : places",
      "    ORDER ||--|{ LINE_ITEM : contains",
      "    PRODUCT ||--o{ LINE_ITEM : appears_in",
      "    CUSTOMER {",
      "        string email",
      "        string country",
      "    }"
    ].join("\n")
  };

  M.initialize({
    startOnLoad: false,
    theme: ctx.dark ? "dark" : "default",
    fontFamily: T.sans,
    themeVariables: { background: T.stage, primaryColor: T.panel, lineColor: T.edge,
                      primaryTextColor: T.ink, primaryBorderColor: T.line2 }
  });

  var n = 0;
  var s = split(ctx, samples.flowchart, function (text, out) {
    return M.render("mmd" + (n++), text).then(function (r) { out.innerHTML = r.svg; });
  });

  ctx.select("sample", Object.keys(samples), function (v) {
    s.editor.value = samples[v];
    s.run(samples[v]);
  }, "flowchart");
};

/* ---------------------------------------------------------- Viz.js / DOT */
B.viz = async function (ctx) {
  var T = ctx.T;
  var viz = await Viz.instance();
  if (ctx.dead()) return;

  var samples = {
    "dependency graph": [
      "digraph deps {",
      '  bgcolor="transparent";',
      '  rankdir=LR;',
      '  node [shape=box style="rounded,filled" fontname="Helvetica" fontsize=11',
      '        fillcolor="' + T.nodeFill + '" color="' + T.nodeLine + '" fontcolor="' + T.ink + '"];',
      '  edge [color="' + T.edge + '" arrowsize=0.7];',
      '  app -> router; app -> store; app -> ui;',
      '  router -> history; store -> immer; ui -> icons; ui -> tokens;',
      '  icons -> tokens;',
      '  app [fillcolor="' + T.accent + '" fontcolor="#0b0e14"];',
      "}"
    ].join("\n"),
    "clusters": [
      "digraph pipeline {",
      '  bgcolor="transparent"; compound=true; rankdir=LR;',
      '  node [shape=box style="rounded,filled" fontname="Helvetica" fontsize=11',
      '        fillcolor="' + T.nodeFill + '" color="' + T.nodeLine + '" fontcolor="' + T.ink + '"];',
      '  edge [color="' + T.edge + '"];',
      '  subgraph cluster_ci { label="CI"; fontcolor="' + T.muted + '"; color="' + T.line2 + '";',
      "    lint -> test -> build; }",
      '  subgraph cluster_cd { label="CD"; fontcolor="' + T.muted + '"; color="' + T.line2 + '";',
      "    stage -> canary -> prod; }",
      "  build -> stage;",
      "}"
    ].join("\n"),
    "state machine": [
      "digraph fsm {",
      '  bgcolor="transparent"; rankdir=LR;',
      '  node [shape=circle fontname="Helvetica" fontsize=11 color="' + T.nodeLine +
        '" fontcolor="' + T.ink + '"];',
      '  edge [color="' + T.edge + '" fontcolor="' + T.muted + '" fontsize=9];',
      '  start [shape=point]; start -> idle;',
      '  idle -> busy [label="start"]; busy -> idle [label="done"];',
      '  busy -> error [label="fail"]; error -> idle [label="reset"];',
      '  error [color="' + T.bad + '"];',
      "}"
    ].join("\n")
  };

  var s = split(ctx, samples["dependency graph"], function (text, out) {
    var svg = viz.renderSVGElement(text);
    svg.setAttribute("class", "fit");
    out.innerHTML = "";
    out.appendChild(svg);
  }, "layout computed by the real Graphviz <b>dot</b> engine, compiled to WebAssembly");

  ctx.select("sample", Object.keys(samples), function (v) {
    s.editor.value = samples[v];
    s.run(samples[v]);
  }, "dependency graph");
};

/* -------------------------------------------------------------- WaveDrom */
B.wd = async function (ctx) {
  var T = ctx.T;

  var samples = {
    "SPI transfer": {
      signal: [
        { name: "clk",  wave: "p.......|..." },
        { name: "cs",   wave: "10......|..1" },
        { name: "mosi", wave: "x=.=.=.=|=.x", data: ["cmd", "a0", "a1", "a2", "d0"] },
        { name: "miso", wave: "x.......|=.x", data: ["ack"] },
        {},
        { name: "busy", wave: "0.1.....|0.." }
      ],
      config: { hscale: 1 }
    },
    "handshake": {
      signal: [
        { name: "clk",   wave: "p........" },
        { name: "req",   wave: "01..0.1.0" },
        { name: "ack",   wave: "0.1..0..0" },
        { name: "data",  wave: "x=..x.=.x", data: ["A", "B"] }
      ]
    },
    "bus + gaps": {
      signal: [
        { name: "clk",     wave: "p......|..." },
        { name: "addr",    wave: "x3.x4..|.x.", data: ["0x40", "0x44"] },
        { name: "wdata",   wave: "x5.x...|.x.", data: ["0xdead"] },
        { name: "rdata",   wave: "x....6.|.x.", data: ["0xbeef"] },
        { name: "valid",   wave: "01.0.1.|0.." }
      ]
    }
  };

  var n = 0;
  var s = split(ctx, JSON.stringify(samples["SPI transfer"], null, 2), function (text, out) {
    var obj = JSON.parse(text);
    out.innerHTML = '<div id="wd-host-' + (++n) + '"></div>';
    WaveDrom.renderWaveForm(0, obj, "wd-host-" + n);
  }, "digital timing diagrams — that JSON is the entire input");

  ctx.select("sample", Object.keys(samples), function (v) {
    var t = JSON.stringify(samples[v], null, 2);
    s.editor.value = t;
    s.run(t);
  }, "SPI transfer");
};

/* ---------------------------------------------------------------- Pintora */
B.pin = async function (ctx) {
  var T = ctx.T;

  var samples = {
    "activity": [
      "activityDiagram",
      "  start",
      "  :read config;",
      "  if (cache warm?) then (yes)",
      "    :serve from cache;",
      "  else (no)",
      "    :query database;",
      "    :fill cache;",
      "  endif",
      "  :write access log;",
      "  end"
    ].join("\n"),
    "sequence": [
      "sequenceDiagram",
      "  Client->>Gateway: POST /orders",
      "  Gateway->>Auth: verify token",
      "  Auth-->>Gateway: ok",
      "  Gateway->>Orders: create()",
      "  Orders-->>Gateway: 201",
      "  Gateway-->>Client: 201 Created"
    ].join("\n"),
    "component": [
      "componentDiagram",
      "  [Browser] as web",
      "  [API gateway] as gw",
      "  [Order service] as orders",
      "  database \"Postgres\" as db",
      "  web --> gw",
      "  gw --> orders",
      "  orders --> db"
    ].join("\n"),
    "mind map": [
      "mindmap",
      "  + front-end",
      "  ++ rendering",
      "  +++ canvas",
      "  +++ svg",
      "  ++ state",
      "  ++ build",
      "  +++ bundlers"
    ].join("\n")
  };

  pintora.default.setConfig({
    themeConfig: { theme: ctx.dark ? "dark" : "default" },
    core: { defaultRenderer: "svg" }
  });

  var s = split(ctx, samples.activity, function (text, out) {
    return new Promise(function (res, rej) {
      out.innerHTML = "";
      pintora.default.renderTo(text, {
        container: out,
        onRender: function () { res(); },
        onError: function (e) { rej(e); }
      });
    });
  }, "a sixth of Mermaid's size, and it lays out CJK text properly");

  ctx.select("sample", Object.keys(samples), function (v) {
    s.editor.value = samples[v];
    s.run(samples[v]);
  }, "activity");
};

})();
