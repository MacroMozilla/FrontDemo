/* Grammar of graphics and low-level toolkits. */
(function () {
"use strict";
var B = window.B;

/* ------------------------------------------------------------------ D3.js */
B.d3 = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var raw = [
    { name: "bundler",  value: 34, group: "build" },
    { name: "compiler", value: 21, group: "build" },
    { name: "linter",   value: 12, group: "build" },
    { name: "router",   value: 28, group: "runtime" },
    { name: "state",    value: 19, group: "runtime" },
    { name: "forms",    value: 14, group: "runtime" },
    { name: "charts",   value: 25, group: "view" },
    { name: "icons",    value: 9,  group: "view" },
    { name: "styling",  value: 31, group: "view" },
    { name: "testing",  value: 17, group: "quality" },
    { name: "types",    value: 23, group: "quality" }
  ];

  var svg = d3.select(ctx.el).append("svg")
    .attr("width", "100%").attr("height", "100%")
    .style("display", "block");
  var g = svg.append("g");
  var W = 0, H = 0;

  function size() {
    W = ctx.el.clientWidth; H = ctx.el.clientHeight;
    svg.attr("viewBox", [0, 0, W, H]);
  }
  size();

  var colour = d3.scaleOrdinal()
    .domain(["build", "runtime", "view", "quality"])
    .range([ctx.series(0), ctx.series(1), ctx.series(2), ctx.series(4)]);

  var current = "bars";
  var TR = function () { return d3.transition().duration(820).ease(d3.easeCubicInOut); };

  /* --- bars: d3-scale + d3-axis, the classic pairing --- */
  function bars() {
    var m = { top: 26, right: 20, bottom: 34, left: 92 };
    var iw = W - m.left - m.right, ih = H - m.top - m.bottom;
    var data = raw.slice().sort(function (a, b) { return b.value - a.value; });
    var x = d3.scaleLinear().domain([0, d3.max(data, function (d) { return d.value; })]).range([0, iw]);
    var y = d3.scaleBand().domain(data.map(function (d) { return d.name; })).range([0, ih]).padding(.22);

    g.attr("transform", "translate(" + m.left + "," + m.top + ")");
    g.selectAll(".arc, .cell").remove();

    var bar = g.selectAll(".bar").data(data, function (d) { return d.name; });
    bar.enter().append("rect").attr("class", "bar")
        .attr("x", 0).attr("height", y.bandwidth()).attr("rx", 4)
        .attr("y", function (d) { return y(d.name); })
        .attr("width", 0)
      .merge(bar)
      .transition(TR())
        .attr("y", function (d) { return y(d.name); })
        .attr("height", y.bandwidth())
        .attr("width", function (d) { return x(d.value); })
        .attr("fill", function (d) { return colour(d.group); })
        .attr("opacity", 1);
    bar.exit().transition(TR()).attr("width", 0).remove();

    var lab = g.selectAll(".val").data(data, function (d) { return d.name; });
    lab.enter().append("text").attr("class", "val")
        .attr("fill", T.ink2).attr("font-family", T.mono).attr("font-size", 11)
        .attr("dy", "0.35em")
      .merge(lab)
      .transition(TR())
        .attr("x", function (d) { return x(d.value) + 7; })
        .attr("y", function (d) { return y(d.name) + y.bandwidth() / 2; })
        .attr("opacity", 1)
        .tween("text", function (d) {
          var self = d3.select(this);
          var i = d3.interpolateNumber(+self.text() || 0, d.value);
          return function (t) { self.text(Math.round(i(t))); };
        });
    lab.exit().remove();

    var ax = g.selectAll(".axis-y").data([0]);
    ax.enter().append("g").attr("class", "axis-y").merge(ax)
      .transition(TR())
      .call(d3.axisLeft(y).tickSize(0))
      .call(function (s) {
        s.selection().select(".domain").attr("stroke", T.line2);
        s.selection().selectAll("text").attr("fill", T.ink2).attr("font-size", 11).attr("font-family", T.sans);
      });

    var ax2 = g.selectAll(".axis-x").data([0]);
    ax2.enter().append("g").attr("class", "axis-x").merge(ax2)
      .attr("transform", "translate(0," + ih + ")")
      .transition(TR())
      .call(d3.axisBottom(x).ticks(6).tickSize(-ih))
      .call(function (s) {
        s.selection().select(".domain").attr("stroke", T.line2);
        s.selection().selectAll("line").attr("stroke", T.grid);
        s.selection().selectAll("text").attr("fill", T.muted).attr("font-size", 10).attr("font-family", T.mono);
      });
  }

  /* --- donut: d3-shape arcs, interpolated through the transition --- */
  function donut() {
    g.selectAll(".bar, .val, .axis-x, .axis-y, .cell").remove();
    g.attr("transform", "translate(" + W / 2 + "," + H / 2 + ")");
    var r = Math.min(W, H) / 2 - 34;
    var pie = d3.pie().value(function (d) { return d.value; }).sort(null);
    var arc = d3.arc().innerRadius(r * .55).outerRadius(r).padAngle(.012).cornerRadius(3);

    var arcs = g.selectAll(".arc").data(pie(raw), function (d) { return d.data.name; });
    var enter = arcs.enter().append("g").attr("class", "arc");
    enter.append("path")
      .attr("fill", function (d) { return colour(d.data.group); })
      .each(function (d) { this._c = { startAngle: d.startAngle, endAngle: d.startAngle }; });
    enter.append("text")
      .attr("fill", T.ink).attr("font-size", 10).attr("font-family", T.sans)
      .attr("text-anchor", "middle").attr("dy", "0.35em");

    var all = enter.merge(arcs);
    all.select("path").transition(TR())
      .attrTween("d", function (d) {
        var i = d3.interpolate(this._c, d);
        this._c = i(1);
        return function (t) { return arc(i(t)); };
      });
    all.select("text").transition(TR())
      .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
      .text(function (d) { return d.data.value >= 14 ? d.data.name : ""; });
    arcs.exit().remove();
  }

  /* --- treemap and pack: d3-hierarchy on the same numbers --- */
  function hierarchy(kind) {
    g.selectAll(".bar, .val, .axis-x, .axis-y, .arc").remove();
    g.attr("transform", "translate(0,0)");
    var groups = d3.group(raw, function (d) { return d.group; });
    var root = d3.hierarchy({ children: Array.from(groups, function (kv) {
        return { name: kv[0], children: kv[1] };
      }) }).sum(function (d) { return d.value; }).sort(function (a, b) { return b.value - a.value; });

    if (kind === "treemap") d3.treemap().size([W, H]).padding(3).round(true)(root);
    else d3.pack().size([W - 8, H - 8]).padding(4)(root);

    var leaves = root.leaves();
    var cell = g.selectAll(".cell").data(leaves, function (d) { return d.data.name; });
    var enter = cell.enter().append("g").attr("class", "cell");
    enter.append(kind === "treemap" ? "rect" : "circle");
    enter.append("text")
      .attr("fill", T.ink).attr("font-size", 10).attr("font-family", T.sans).attr("text-anchor", "middle");

    var all = enter.merge(cell);
    if (kind === "treemap") {
      all.select("rect").transition(TR())
        .attr("x", function (d) { return d.x0; }).attr("y", function (d) { return d.y0; })
        .attr("width", function (d) { return d.x1 - d.x0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("rx", 4).attr("fill", function (d) { return colour(d.data.group); });
      all.select("text").transition(TR())
        .attr("x", function (d) { return (d.x0 + d.x1) / 2; })
        .attr("y", function (d) { return (d.y0 + d.y1) / 2; })
        .text(function (d) { return (d.x1 - d.x0) > 54 ? d.data.name : ""; });
    } else {
      all.select("circle").transition(TR())
        .attr("cx", function (d) { return d.x + 4; }).attr("cy", function (d) { return d.y + 4; })
        .attr("r", function (d) { return d.r; })
        .attr("fill", function (d) { return colour(d.data.group); });
      all.select("text").transition(TR())
        .attr("x", function (d) { return d.x + 4; }).attr("y", function (d) { return d.y + 4; })
        .text(function (d) { return d.r > 26 ? d.data.name : ""; });
    }
    cell.exit().remove();
  }

  var render = { bars: bars, donut: donut, treemap: function () { hierarchy("treemap"); },
                 pack: function () { hierarchy("pack"); } };
  render.bars();

  ctx.select("layout", ["bars", "donut", "treemap", "pack"], function (v) {
    current = v; render[v]();
  }, "bars");
  ctx.btn("New numbers", function () {
    raw.forEach(function (d) { d.value = 6 + Math.round(Math.random() * 34); });
    render[current]();
  }, true);
  ctx.readout("scales, axes, arcs, hierarchy layouts and the tweening — all d3, no chart library");

  ctx.onResize(function () { size(); render[current](); });
};

/* ------------------------------------------------------------- Vega-Lite */
B.vl = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("34%");
  var host = ctx.mk("div");
  host.style.cssText = "padding:12px;min-height:100%";
  p.b.appendChild(host);

  var spec = {
    $schema: "https://vega.github.io/schema/vega-lite/v6.json",
    data: { values: (function () {
      var s = 5, out = [], v = 60;
      for (var i = 0; i < 120; i++) {
        s = (s * 1664525 + 1013904223) % 4294967296;
        v += (s / 4294967296 - .48) * 9;
        out.push({ day: i, value: Math.max(4, Math.round(v * 10) / 10),
                   channel: ["organic", "paid", "referral"][i % 3] });
      }
      return out;
    })() },
    vconcat: [
      {
        width: 430, height: 190,
        params: [{ name: "brush", select: { type: "interval", encodings: ["x"] } }],
        mark: { type: "line", strokeWidth: 1.6 },
        encoding: {
          x: { field: "day", type: "quantitative", title: null },
          y: { field: "value", type: "quantitative", title: "sessions" },
          color: { field: "channel", type: "nominal" }
        }
      },
      {
        width: 430, height: 150,
        transform: [{ filter: { param: "brush" } }],
        mark: { type: "bar", cornerRadiusEnd: 3 },
        encoding: {
          x: { field: "channel", type: "nominal", title: null },
          y: { aggregate: "mean", field: "value", type: "quantitative", title: "mean in selection" },
          color: { field: "channel", type: "nominal", legend: null }
        }
      }
    ]
  };

  var editor = ctx.editor(p.a, JSON.stringify(spec, null, 2), function (text) {
    try { render(JSON.parse(text)); out("spec applied"); }
    catch (e) { out('<span style="color:' + T.bad + '">' + e.message.slice(0, 60) + "</span>"); }
  });
  var out = ctx.readout("brush the top chart — the bars below follow");

  var view = null;
  function render(s) {
    if (view) { view.finalize(); view = null; }
    vegaEmbed(host, s, {
      actions: false, renderer: "canvas",
      theme: ctx.dark ? "dark" : undefined,
      config: {
        background: "transparent",
        range: { category: T.series },
        axis: { labelColor: T.muted, titleColor: T.muted, gridColor: T.grid, domainColor: T.line2 },
        legend: { labelColor: T.ink2, titleColor: T.muted }
      }
    }).then(function (r) { view = r.view; }).catch(function (e) {
      out('<span style="color:' + T.bad + '">' + String(e.message || e).slice(0, 70) + "</span>");
    });
  }
  render(spec);
  ctx.onDestroy(function () { if (view) view.finalize(); });

  /* Swapping the whole spec is the point of a grammar: the same 120 rows
     become a different chart because the description changed, not the code. */
  var DATA = spec.data;
  var PRESETS = {
    "line + linked bars": spec,
    "scatter with regression": {
      $schema: spec.$schema, data: DATA, width: 430, height: 320,
      layer: [
        { mark: { type: "point", filled: true, size: 46, opacity: 0.7 },
          encoding: {
            x: { field: "day", type: "quantitative" },
            y: { field: "value", type: "quantitative" },
            color: { field: "channel", type: "nominal" } } },
        { transform: [{ regression: "value", on: "day", groupby: ["channel"] }],
          mark: { type: "line", strokeWidth: 2.4 },
          encoding: {
            x: { field: "day", type: "quantitative" },
            y: { field: "value", type: "quantitative" },
            color: { field: "channel", type: "nominal" } } }
      ]
    },
    "binned heatmap": {
      $schema: spec.$schema, data: DATA, width: 430, height: 300,
      mark: "rect",
      encoding: {
        x: { field: "day", type: "quantitative", bin: { maxbins: 20 } },
        y: { field: "channel", type: "nominal", title: null },
        color: { aggregate: "mean", field: "value", type: "quantitative",
                 scale: { scheme: "viridis" }, title: "mean" }
      }
    },
    "histogram, faceted": {
      $schema: spec.$schema, data: DATA, width: 130, height: 220,
      mark: { type: "bar", cornerRadiusEnd: 3 },
      encoding: {
        x: { field: "value", type: "quantitative", bin: { maxbins: 12 } },
        y: { aggregate: "count", type: "quantitative" },
        color: { field: "channel", type: "nominal", legend: null },
        column: { field: "channel", type: "nominal", title: null }
      }
    },
    "box plot": {
      $schema: spec.$schema, data: DATA, width: 430, height: 280,
      mark: { type: "boxplot", extent: "min-max" },
      encoding: {
        x: { field: "channel", type: "nominal", title: null },
        y: { field: "value", type: "quantitative" },
        color: { field: "channel", type: "nominal", legend: null }
      }
    },
    "cumulative area": {
      $schema: spec.$schema, data: DATA, width: 430, height: 300,
      transform: [{ sort: [{ field: "day" }], window: [{ op: "sum", field: "value", as: "total" }],
                    groupby: ["channel"] }],
      mark: { type: "area", line: true, opacity: 0.55 },
      encoding: {
        x: { field: "day", type: "quantitative", title: null },
        y: { field: "total", type: "quantitative", stack: "zero", title: "cumulative" },
        color: { field: "channel", type: "nominal" }
      }
    }
  };

  ctx.select("spec", Object.keys(PRESETS), function (v) {
    var next = PRESETS[v];
    editor.value = JSON.stringify(next, null, 2);
    render(next);
    out("rendering <b>" + ctx.esc(v) + "</b> — " + JSON.stringify(next).length + " characters of JSON");
  }, "line + linked bars");
  ctx.btn("Reset", function () {
    editor.value = JSON.stringify(spec, null, 2);
    render(spec);
    out("brush the top chart — the bars below follow");
  }, true);
  ctx.btn("Count the spec", function () {
    var txt = editor.value;
    out("<b>" + txt.split("\n").length + "</b> lines of JSON · <b>" +
      (txt.match(/"mark"|"layer"|"transform"|"encoding"/g) || []).length +
      "</b> grammar keys · zero lines of drawing code");
  });
};

/* ------------------------------------------------------------------ Vega */
B.vg = async function (ctx) {
  var T = ctx.T;
  var p = ctx.panes("46%");
  var host = ctx.mk("div");
  host.style.cssText = "padding:12px;min-height:100%";
  p.b.appendChild(host);

  var spec = {
    $schema: "https://vega.github.io/schema/vega/v6.json",
    width: 420, height: 300, padding: 5, background: "transparent",
    autosize: { type: "fit", resize: true },
    data: [{
      name: "table",
      values: [
        { c: "npm",  v: 62 }, { c: "pnpm", v: 44 }, { c: "yarn", v: 31 },
        { c: "bun",  v: 27 }, { c: "deno", v: 12 }
      ]
    }],
    signals: [
      { name: "tooltip", value: {},
        on: [{ events: "rect:pointerover", update: "datum" },
             { events: "rect:pointerout", update: "{}" }] }
    ],
    scales: [
      { name: "x", type: "band", domain: { data: "table", field: "c" }, range: "width", padding: .18 },
      { name: "y", type: "linear", domain: { data: "table", field: "v" }, nice: true, range: "height" },
      { name: "col", type: "ordinal", domain: { data: "table", field: "c" }, range: T.series }
    ],
    axes: [
      { orient: "bottom", scale: "x", labelColor: T.muted, domainColor: T.line2, tickColor: T.line2 },
      { orient: "left", scale: "y", labelColor: T.muted, domainColor: T.line2,
        tickColor: T.line2, grid: true, gridColor: T.grid }
    ],
    marks: [
      { type: "rect", from: { data: "table" },
        encode: {
          enter: { x: { scale: "x", field: "c" }, width: { scale: "x", band: 1 },
                   y: { scale: "y", field: "v" }, y2: { scale: "y", value: 0 },
                   cornerRadiusTopLeft: { value: 4 }, cornerRadiusTopRight: { value: 4 } },
          update: { fill: { scale: "col", field: "c" }, fillOpacity: { value: .85 } },
          hover: { fillOpacity: { value: 1 } }
        } },
      { type: "text", encode: {
          enter: { align: { value: "center" }, baseline: { value: "bottom" }, fill: { value: T.ink } },
          update: {
            x: { scale: "x", signal: "tooltip.c", band: .5 },
            y: { scale: "y", signal: "tooltip.v", offset: -4 },
            text: { signal: "tooltip.v" },
            fillOpacity: [{ test: "datum.v == null && !tooltip.c", value: 0 }, { value: 1 }]
          } } }
    ]
  };

  var view = null;
  function render(s) {
    if (view) view.finalize();
    view = new vega.View(vega.parse(s), { renderer: "canvas", container: host, hover: true });
    view.runAsync();
  }
  render(spec);

  var editor = ctx.editor(p.a, JSON.stringify(spec, null, 2), function (text) {
    try { render(JSON.parse(text)); out("spec applied"); }
    catch (e) { out('<span style="color:' + T.bad + '">' + e.message.slice(0, 60) + "</span>"); }
  });
  var out = ctx.readout("the whole chart — scales, marks, the hover signal — is that one JSON document");
  ctx.onDestroy(function () { if (view) view.finalize(); });

  /* Every control below edits the spec and re-parses it. Nothing reaches
     into the rendered view, because in Vega the spec is the program. */
  function edit(fn) {
    var next = JSON.parse(JSON.stringify(spec));
    fn(next);
    editor.value = JSON.stringify(next, null, 2);
    render(next);
    return next;
  }

  ctx.select("mark", ["rect", "symbol", "line", "area"], function (v) {
    edit(function (s2) {
      s2.marks[0].type = v;
      var enc = s2.marks[0].encode.enter;
      if (v === "rect") {
        s2.marks[0].encode.enter = {
          x: { scale: "x", field: "c" }, width: { scale: "x", band: 1 },
          y: { scale: "y", field: "v" }, y2: { scale: "y", value: 0 },
          cornerRadiusTopLeft: { value: 4 }, cornerRadiusTopRight: { value: 4 }
        };
      } else {
        s2.marks[0].encode.enter = {
          x: { scale: "x", field: "c", band: 0.5 },
          y: { scale: "y", field: "v" },
          size: { value: 220 }, strokeWidth: { value: 2.5 },
          stroke: { scale: "col", field: "c" }
        };
        if (v === "area") s2.marks[0].encode.enter.y2 = { scale: "y", value: 0 };
      }
    });
    out("mark type is now <code>" + v + "</code> — one property in the spec");
  }, "rect");

  ctx.select("y scale", ["linear", "sqrt", "log", "pow"], function (v) {
    edit(function (s2) {
      s2.scales[1].type = v;
      if (v === "log") s2.scales[1].domain = { data: "table", field: "v" };
      if (v === "pow") s2.scales[1].exponent = 0.5;
    });
    out("y scale is <code>" + v + "</code>");
  }, "linear");

  ctx.select("palette", ["theme series", "blues", "warm", "greys"], function (v) {
    var RANGES = {
      "theme series": T.series,
      blues: ["#0d4a8f", "#1d69c0", "#3d8ae0", "#69a9ee", "#a3c9f5"],
      warm: ["#8c2d04", "#cc4c02", "#ec7014", "#fe9929", "#fec44f"],
      greys: ["#3b4252", "#55606f", "#71808f", "#93a1af", "#b8c2cd"]
    };
    edit(function (s2) { s2.scales[2].range = RANGES[v]; });
    out("ordinal colour range swapped");
  }, "theme series");

  ctx.btn("New numbers", function () {
    edit(function (s2) {
      s2.data[0].values.forEach(function (d) { d.v = Math.round(8 + Math.random() * 60); });
    });
    out("the data array changed — the same spec redrew itself");
  }, true);
  ctx.btn("Reset", function () {
    editor.value = JSON.stringify(spec, null, 2);
    render(spec);
    out("the whole chart — scales, marks, the hover signal — is that one JSON document");
  });
};

/* ------------------------------------------------------- Observable Plot */
B.plot = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var s = 13;
  var rnd = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var data = [];
  for (var i = 0; i < 260; i++) {
    var team = ["core", "web", "mobile"][i % 3];
    var x = rnd() * 100;
    data.push({ prs: x, reviewTime: 4 + x * .28 + (rnd() - .5) * 22, team: team });
  }

  var kind = "regression";
  function draw() {
    ctx.el.innerHTML = "";
    var opts = {
      width: Math.max(360, ctx.el.clientWidth - 40),
      height: Math.max(280, ctx.el.clientHeight - 40),
      color: { legend: true, range: T.series, type: "categorical" },
      style: { background: "transparent", color: T.ink2, fontFamily: T.sans, fontSize: "11px" },
      x: { label: "pull requests per week", grid: true },
      y: { label: "median review time (h)", grid: true },
      marks: []
    };
    if (kind === "regression") {
      opts.marks = [
        Plot.dot(data, { x: "prs", y: "reviewTime", stroke: "team", r: 3, opacity: .7 }),
        Plot.linearRegressionY(data, { x: "prs", y: "reviewTime", stroke: "team", ci: .95, fillOpacity: .1 }),
        Plot.frame({ stroke: T.line })
      ];
    } else if (kind === "hexbin") {
      opts.marks = [
        Plot.hexgrid({ stroke: T.grid }),
        Plot.dot(data, Plot.hexbin({ r: "count" }, { x: "prs", y: "reviewTime", fill: "team" })),
        Plot.frame({ stroke: T.line })
      ];
    } else {
      opts.marks = [
        Plot.rectY(data, Plot.binX({ y: "count" }, { x: "prs", fill: "team", thresholds: 16 })),
        Plot.ruleY([0], { stroke: T.line2 })
      ];
      opts.y.label = "count";
    }
    ctx.el.appendChild(Plot.plot(opts));
  }
  draw();

  ctx.select("mark set", [
    { v: "regression", t: "dot + linearRegressionY" },
    { v: "hexbin", t: "hexbin transform" },
    { v: "histogram", t: "binX transform" }
  ], function (v) { kind = v; draw(); }, "regression");
  ctx.readout("the trend line and the bins are <b>transforms</b> — no data was pre-aggregated");

  ctx.onResize(draw);
};

})();
