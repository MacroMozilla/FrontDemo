/* Charts, and the high-performance end of charting. */
(function () {
"use strict";
var B = window.B;

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* Deterministic sample data so every reload looks the same. */
function seeded(seed) {
  var s = seed || 3;
  return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}
function series(n, base, amp, seed) {
  var r = seeded(seed), v = base, out = [];
  for (var i = 0; i < n; i++) {
    v += (r() - .48) * amp;
    out.push(Math.max(0, Math.round(v * 100) / 100));
  }
  return out;
}
function days(n, from) {
  var start = from || Date.UTC(2026, 0, 1), out = [];
  for (var i = 0; i < n; i++) out.push(start + i * 86400000);
  return out;
}

/* ---------------------------------------------------------------- ECharts */
B.ec = async function (ctx) {
  var T = ctx.T;
  var chart = echarts.init(ctx.el, null, { renderer: "canvas" });
  var x = MONTHS;
  var revenue = series(12, 120, 46, 5);
  var cost = revenue.map(function (v, i) { return Math.round(v * (.55 + (i % 3) * .05) * 100) / 100; });
  var margin = revenue.map(function (v, i) { return Math.round((1 - cost[i] / v) * 1000) / 10; });

  var axisCommon = {
    axisLine: { lineStyle: { color: T.line2 } },
    axisLabel: { color: T.muted, fontFamily: T.mono, fontSize: 10 },
    splitLine: { lineStyle: { color: T.grid } }
  };

  function combo() {
    return {
      backgroundColor: "transparent",
      grid: { left: 54, right: 56, top: 46, bottom: 74 },
      tooltip: { trigger: "axis", axisPointer: { type: "cross" },
                 backgroundColor: T.panel, borderColor: T.line, textStyle: { color: T.ink } },
      legend: { textStyle: { color: T.ink2 }, top: 6 },
      xAxis: Object.assign({ type: "category", data: x }, axisCommon),
      yAxis: [
        Object.assign({ type: "value", name: "$k" }, axisCommon),
        Object.assign({ type: "value", name: "margin %", max: 100, splitLine: { show: false } }, axisCommon)
      ],
      dataZoom: [
        { type: "inside" },
        { type: "slider", height: 20, bottom: 22, borderColor: T.line,
          fillerColor: T.accent + "33", handleStyle: { color: T.accent },
          textStyle: { color: T.muted, fontSize: 9 } }
      ],
      series: [
        { name: "Revenue", type: "bar", data: revenue, itemStyle: { color: ctx.series(0), borderRadius: [3, 3, 0, 0] } },
        { name: "Cost", type: "bar", data: cost, itemStyle: { color: ctx.series(4), borderRadius: [3, 3, 0, 0] } },
        { name: "Margin", type: "line", yAxisIndex: 1, data: margin, smooth: true,
          lineStyle: { color: ctx.series(1), width: 2.4 }, itemStyle: { color: ctx.series(1) },
          areaStyle: { color: ctx.series(1) + "1A" } }
      ]
    };
  }

  function heatmap() {
    var data = [];
    var r = seeded(9);
    for (var d = 0; d < 7; d++) for (var hh = 0; hh < 24; hh++) data.push([hh, d, Math.round(r() * 100)]);
    return {
      backgroundColor: "transparent",
      grid: { left: 58, right: 70, top: 30, bottom: 40 },
      tooltip: { backgroundColor: T.panel, borderColor: T.line, textStyle: { color: T.ink } },
      xAxis: Object.assign({ type: "category", data: Array.from({ length: 24 }, function (_, i) { return i + "h"; }) }, axisCommon),
      yAxis: Object.assign({ type: "category", data: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"] }, axisCommon),
      visualMap: { min: 0, max: 100, calculable: true, orient: "vertical", right: 6, top: "middle",
                   textStyle: { color: T.muted }, inRange: { color: [T.stage, ctx.series(0), ctx.series(3)] } },
      series: [{ type: "heatmap", data: data, itemStyle: { borderColor: T.stage, borderWidth: .5 } }]
    };
  }

  function radar() {
    return {
      backgroundColor: "transparent",
      legend: { textStyle: { color: T.ink2 }, top: 6 },
      tooltip: { backgroundColor: T.panel, borderColor: T.line, textStyle: { color: T.ink } },
      radar: {
        indicator: ["Speed","Bundle","API","Docs","Ecosystem","Types"].map(function (n) { return { name: n, max: 100 }; }),
        axisName: { color: T.ink2 }, splitLine: { lineStyle: { color: T.grid } },
        splitArea: { areaStyle: { color: [T.stage, T.panel] } }, axisLine: { lineStyle: { color: T.line2 } }
      },
      series: [{ type: "radar", data: [
        { value: [92, 40, 78, 88, 95, 90], name: "ECharts", itemStyle: { color: ctx.series(0) },
          areaStyle: { color: ctx.series(0) + "33" } },
        { value: [70, 92, 85, 80, 88, 85], name: "Chart.js", itemStyle: { color: ctx.series(1) },
          areaStyle: { color: ctx.series(1) + "33" } }
      ] }]
    };
  }

  var kinds = { "bar + line": combo, "heatmap": heatmap, "radar": radar };
  chart.setOption(combo());
  ctx.select("chart", Object.keys(kinds), function (v) {
    chart.clear();
    chart.setOption(kinds[v]());
  }, "bar + line");
  ctx.readout("hover for the crosshair · drag the slider to zoom the range");

  ctx.onResize(function () { chart.resize(); });
  ctx.onDestroy(function () { chart.dispose(); });
};

/* --------------------------------------------------------------- Chart.js */
B.cjs = async function (ctx) {
  var T = ctx.T;
  Chart.defaults.color = T.muted;
  Chart.defaults.borderColor = T.grid;
  Chart.defaults.font.family = T.sans;

  var cv = document.createElement("canvas");
  ctx.el.appendChild(cv);
  ctx.el.style.padding = "14px";

  var labels = MONTHS;
  var a = series(12, 60, 26, 2), b = series(12, 45, 20, 8);
  var chart = null;

  function build(type) {
    if (chart) chart.destroy();
    var mixed = type === "mixed";
    chart = new Chart(cv, {
      type: mixed ? "bar" : type,
      data: {
        labels: labels,
        datasets: [
          { label: "Sessions", data: a, type: mixed ? "bar" : undefined,
            backgroundColor: ctx.series(0) + (type === "line" ? "22" : "CC"),
            borderColor: ctx.series(0), borderWidth: 2, borderRadius: 4, fill: type === "line", tension: .35 },
          { label: "Conversions", data: b, type: mixed ? "line" : undefined,
            backgroundColor: ctx.series(1) + (type === "line" ? "22" : "CC"),
            borderColor: ctx.series(1), borderWidth: 2, borderRadius: 4, fill: type === "line", tension: .35 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { labels: { usePointStyle: true, boxWidth: 8, color: T.ink2 } },
          tooltip: { backgroundColor: T.panel, titleColor: T.ink, bodyColor: T.ink2,
                     borderColor: T.line, borderWidth: 1, padding: 10, cornerRadius: 6 }
        },
        scales: /doughnut|pie|polarArea|radar/.test(type) ? {} : {
          x: { grid: { color: T.grid }, ticks: { color: T.muted, font: { family: T.mono, size: 10 } } },
          y: { grid: { color: T.grid }, ticks: { color: T.muted, font: { family: T.mono, size: 10 } }, beginAtZero: true }
        },
        animation: { duration: 620 }
      }
    });
  }
  build("mixed");

  ctx.select("type", ["mixed", "bar", "line", "radar", "doughnut", "polarArea"], build, "mixed");
  ctx.btn("New data", function () {
    chart.data.datasets[0].data = series(12, 60, 26, Math.floor(Math.random() * 999));
    chart.data.datasets[1].data = series(12, 45, 20, Math.floor(Math.random() * 999));
    chart.update();
  });
  ctx.readout("click a legend entry to hide a series — the animation is the default one");

  ctx.onDestroy(function () { if (chart) chart.destroy(); });
};

/* ------------------------------------------------------------ ApexCharts */
B.apex = async function (ctx) {
  var T = ctx.T;
  var n = 180;
  var t = days(n);
  var v1 = series(n, 400, 22, 4), v2 = series(n, 260, 16, 21);

  function opts(type) {
    return {
      chart: {
        type: type, height: "100%", background: "transparent",
        foreColor: T.muted, fontFamily: T.sans,
        toolbar: { show: true, tools: { download: true, selection: true, zoom: true, pan: true, reset: true } },
        zoom: { enabled: true, type: "x", autoScaleYaxis: true },
        animations: { enabled: true, speed: 420 }
      },
      theme: { mode: ctx.dark ? "dark" : "light" },
      colors: [ctx.series(0), ctx.series(1)],
      series: [
        { name: "Requests", data: t.map(function (d, i) { return [d, v1[i]]; }) },
        { name: "Cache hits", data: t.map(function (d, i) { return [d, v2[i]]; }) }
      ],
      stroke: { width: type === "bar" ? 0 : 2, curve: "smooth" },
      fill: type === "area"
        ? { type: "gradient", gradient: { opacityFrom: .45, opacityTo: .03 } }
        : { opacity: .9 },
      dataLabels: { enabled: false },
      grid: { borderColor: T.grid, strokeDashArray: 3 },
      xaxis: { type: "datetime", labels: { style: { colors: T.muted, fontFamily: T.mono, fontSize: "10px" } } },
      yaxis: { labels: { style: { colors: T.muted, fontFamily: T.mono, fontSize: "10px" } } },
      tooltip: { theme: ctx.dark ? "dark" : "light", x: { format: "dd MMM yyyy" } },
      legend: { labels: { colors: T.ink2 } },
      annotations: {
        xaxis: [{
          x: t[Math.floor(n * .62)],
          borderColor: ctx.series(3), strokeDashArray: 4,
          label: { text: "cache rollout", style: { background: ctx.series(3), color: "#fff", fontSize: "10px" } }
        }]
      }
    };
  }

  var chart = new ApexCharts(ctx.el, opts("area"));
  await chart.render();

  ctx.select("type", ["area", "line", "bar"], function (v) {
    chart.updateOptions(opts(v), true, true);
  }, "area");
  ctx.readout("drag across the plot to zoom · the toolbar top-right is stock ApexCharts");

  ctx.onDestroy(function () { chart.destroy(); });
};

/* --------------------------------------------------------------- AntV G2 */
B.g2 = async function (ctx) {
  var T = ctx.T;
  var data = MONTHS.map(function (m, i) {
    var rev = series(12, 120, 46, 5)[i];
    return { month: m, revenue: rev, margin: Math.round((30 + (i % 5) * 6) * 10) / 10 };
  });

  var chart = new G2.Chart({ container: ctx.el, autoFit: true, theme: ctx.dark ? "dark" : "light" });
  var showLine = true, showPoints = true;

  function draw() {
    chart.clear();
    /* Marks are composed, not chosen from a list of chart types. */
    chart.interval()
      .data(data)
      .encode("x", "month").encode("y", "revenue")
      .style("fill", ctx.series(0)).style("radiusTopLeft", 4).style("radiusTopRight", 4)
      .axis("y", { title: "revenue ($k)", labelFill: T.muted, titleFill: T.muted })
      .axis("x", { labelFill: T.muted })
      .tooltip({ channel: "y" });

    if (showLine) {
      chart.line()
        .data(data)
        .encode("x", "month").encode("y", "margin")
        .scale("y", { independent: true, domain: [0, 80] })
        .style("stroke", ctx.series(1)).style("lineWidth", 2.4).style("shape", "smooth")
        .axis("y", { position: "right", title: "margin (%)", labelFill: T.muted, titleFill: T.muted });
    }
    if (showPoints) {
      chart.point()
        .data(data)
        .encode("x", "month").encode("y", "margin").encode("shape", "point")
        .scale("y", { independent: true, domain: [0, 80] })
        .style("fill", ctx.series(1)).style("stroke", T.stage).style("lineWidth", 1.5)
        .axis("y", false).tooltip(false);
    }
    chart.render();
  }
  draw();

  ctx.check("line mark", true, function (v) { showLine = v; draw(); });
  ctx.check("point mark", true, function (v) { showPoints = v; draw(); });
  ctx.readout("this is <b>interval + line + point</b> layered — not a “combo chart” preset");

  ctx.onDestroy(function () { chart.destroy(); });
};

/* ----------------------------------------------------------- billboard.js */
B.bb = async function (ctx) {
  var T = ctx.T;
  ctx.el.style.padding = "8px";
  var n = 60;
  var chart = bb.generate({
    bindto: ctx.el,
    size: { height: ctx.el.clientHeight - 16 },
    data: {
      columns: [
        ["p50"].concat(series(n, 40, 9, 12)),
        ["p95"].concat(series(n, 120, 26, 33)),
        ["p99"].concat(series(n, 260, 60, 55))
      ],
      types: { p50: "area-spline", p95: "spline", p99: "spline" },
      colors: { p50: ctx.series(1), p95: ctx.series(0), p99: ctx.series(3) }
    },
    zoom: { enabled: true, type: "drag" },
    point: { show: false, focus: { expand: { enabled: true } } },
    grid: { x: { show: false }, y: { show: true } },
    axis: {
      x: { tick: { count: 8, format: function (i) { return "t+" + i; } } },
      y: { label: { text: "latency (ms)", position: "outer-middle" } }
    },
    tooltip: { grouped: true },
    legend: { position: "inset", inset: { anchor: "top-right" } }
  });

  ctx.btn("Zoom to 20–40", function () { chart.zoom([20, 40]); });
  ctx.btn("Reset zoom", function () { chart.unzoom(); });
  ctx.btn("Toggle p99", function () { chart.toggle("p99"); });
  ctx.readout("drag across the plot to select a region — zoom is a config flag");

  ctx.onResize(function () { chart.resize({ height: ctx.el.clientHeight - 16 }); });
  ctx.onDestroy(function () { chart.destroy(); });
};

/* -------------------------------------------------------------- Plotly.js */
B.pl = async function (ctx) {
  var T = ctx.T;
  var r = seeded(17);
  var n = 420;
  var xs = [], ys = [], sz = [], col = [];
  for (var i = 0; i < n; i++) {
    var g = i % 3;
    xs.push(r() * 10 + g * 3);
    ys.push(r() * 6 + g * 2 + (r() - .5) * 3);
    sz.push(5 + r() * 14);
    col.push(ctx.series(g));
  }

  var layout = {
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { color: T.muted, family: T.sans, size: 11 },
    margin: { l: 48, r: 18, t: 34, b: 42 },
    title: { text: "Latency vs throughput, 420 samples", font: { size: 13, color: T.ink2 } },
    xaxis: { gridcolor: T.grid, zerolinecolor: T.line2, title: "throughput" },
    yaxis: { gridcolor: T.grid, zerolinecolor: T.line2, title: "latency" },
    dragmode: "select",
    showlegend: false
  };
  var config = { responsive: true, displaylogo: false, displayModeBar: true };

  await Plotly.newPlot(ctx.el, [{
    type: "scattergl", mode: "markers", x: xs, y: ys,
    marker: { size: sz, color: col, opacity: .78, line: { width: 0 } },
    hovertemplate: "%{x:.2f}, %{y:.2f}<extra></extra>"
  }], layout, config);

  var out = ctx.readout("box-select a region — Plotly reports the selection back to you");
  ctx.el.on("plotly_selected", function (ev) {
    if (!ev || !ev.points) { out("selection cleared"); return; }
    var mean = ev.points.reduce(function (s, p) { return s + p.y; }, 0) / (ev.points.length || 1);
    out("selected <b>" + ev.points.length + "</b> points · mean latency <b>" + mean.toFixed(2) + "</b>");
  });

  ctx.select("mode", [
    { v: "select", t: "box select" }, { v: "lasso", t: "lasso" },
    { v: "zoom", t: "zoom" }, { v: "pan", t: "pan" }
  ], function (v) { Plotly.relayout(ctx.el, { dragmode: v }); }, "select");

  ctx.onResize(function () { Plotly.Plots.resize(ctx.el); });
  ctx.onDestroy(function () { Plotly.purge(ctx.el); });
};

/* --------------------------------------------------------------- Recharts */
B.rc = async function (ctx) {
  var T = ctx.T;
  /* The bundle here carries its own React, so there is only ever one copy. */
  var React = Recharts.React, ReactDOM = Recharts.ReactDOM;
  var h = React.createElement, R = Recharts;

  var data = MONTHS.map(function (m, i) {
    var s = series(12, 60, 24, 6);
    return { month: m, plan: s[i], actual: Math.round(s[i] * (.8 + (i % 4) * .1) * 10) / 10 };
  });

  function App() {
    return h(R.ResponsiveContainer, { width: "100%", height: "100%" },
      h(R.ComposedChart, { data: data, margin: { top: 20, right: 24, left: 4, bottom: 8 } },
        h(R.CartesianGrid, { stroke: T.grid, strokeDasharray: "3 3" }),
        h(R.XAxis, { dataKey: "month", stroke: T.muted, tick: { fontSize: 11, fontFamily: T.mono } }),
        h(R.YAxis, { stroke: T.muted, tick: { fontSize: 11, fontFamily: T.mono } }),
        h(R.Tooltip, {
          contentStyle: { background: T.panel, border: "1px solid " + T.line, borderRadius: 8, fontSize: 12 },
          labelStyle: { color: T.ink }, itemStyle: { color: T.ink2 }
        }),
        h(R.Legend, { wrapperStyle: { fontSize: 12, color: T.ink2 } }),
        h(R.ReferenceLine, { y: 60, stroke: ctx.series(3), strokeDasharray: "4 4",
                             label: { value: "target", fill: ctx.series(3), fontSize: 10, position: "right" } }),
        h(R.Bar, { dataKey: "plan", fill: ctx.series(0), radius: [4, 4, 0, 0], barSize: 18 }),
        h(R.Line, { type: "monotone", dataKey: "actual", stroke: ctx.series(1), strokeWidth: 2.4,
                    dot: { r: 3, fill: ctx.series(1) } }),
        h(R.Brush, { dataKey: "month", height: 22, stroke: T.line2, fill: T.sunk, travellerWidth: 8 })
      ));
  }

  var root = ReactDOM.createRoot(ctx.el);
  root.render(h(App));
  ctx.onDestroy(function () { root.unmount(); });

  ctx.el.style.padding = "10px";
  ctx.readout("every axis, bar and the brush below are React components in one JSX tree");
};

/* -------------------------------------------------------------- Chartist */
B.cst = async function (ctx) {
  var T = ctx.T;
  var box = document.createElement("div");
  box.className = "ct-chart chartist-demo";
  box.style.cssText = "width:100%;height:100%;padding:16px";
  ctx.el.appendChild(box);

  /* Everything visual here is CSS — Chartist only emits SVG structure. */
  var style = document.createElement("style");
  ctx.el.appendChild(style);
  var presets = {
    "thin lines": ".chartist-demo .ct-line{stroke-width:1.5px}.chartist-demo .ct-point{stroke-width:6px}",
    "thick + dashed": ".chartist-demo .ct-line{stroke-width:4px;stroke-dasharray:8 5}.chartist-demo .ct-point{stroke-width:0}",
    "area fill": ".chartist-demo .ct-line{stroke-width:2px}.chartist-demo .ct-area{fill-opacity:.22}.chartist-demo .ct-point{stroke-width:0}"
  };
  function apply(name) {
    style.textContent =
      ".chartist-demo .ct-series-a .ct-line,.chartist-demo .ct-series-a .ct-point{stroke:" + ctx.series(0) + "}" +
      ".chartist-demo .ct-series-b .ct-line,.chartist-demo .ct-series-b .ct-point{stroke:" + ctx.series(1) + "}" +
      ".chartist-demo .ct-series-a .ct-area{fill:" + ctx.series(0) + "}" +
      ".chartist-demo .ct-series-b .ct-area{fill:" + ctx.series(1) + "}" +
      ".chartist-demo .ct-grid{stroke:" + T.grid + ";stroke-dasharray:2 3}" +
      ".chartist-demo .ct-label{fill:" + T.muted + ";font-size:10px;font-family:" + T.mono + "}" +
      presets[name];
  }
  apply("thin lines");

  var chart = new Chartist.LineChart(box, {
    labels: MONTHS,
    series: [series(12, 40, 16, 13), series(12, 26, 12, 44)]
  }, { showArea: true, fullWidth: true, chartPadding: { right: 24 }, height: "100%" });

  ctx.select("CSS preset", Object.keys(presets), apply, "thin lines");
  ctx.readout("37 KB · the stroke width, dashes and fill above are all plain CSS rules");

  ctx.onDestroy(function () { chart.detach(); });
};

/* ------------------------------------------------------------ chart.xkcd */
B.xk = async function (ctx) {
  var T = ctx.T;
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "fit");
  ctx.el.className = "mount center";
  ctx.el.style.padding = "14px";
  ctx.el.appendChild(svg);

  var kind = "line";
  function draw() {
    svg.innerHTML = "";
    var common = { title: "Time spent choosing a chart library",
                   xLabel: "week", yLabel: "hours",
                   options: { fontFamily: T.sans, dataColors: [ctx.series(0), ctx.series(1), ctx.series(3)],
                              backgroundColor: "transparent", strokeColor: T.ink2 } };
    if (kind === "line") {
      new chartXkcd.XY(svg, Object.assign({}, common, {
        data: { datasets: [
          { label: "reading docs", data: series(10, 4, 2.4, 3).map(function (v, i) { return { x: i + 1, y: v }; }) },
          { label: "actually building", data: series(10, 2, 1.6, 19).map(function (v, i) { return { x: i + 1, y: v }; }) }
        ] },
        options: Object.assign({ xTickCount: 5, yTickCount: 5, legendPosition: chartXkcd.config.positionType.upLeft },
                               common.options)
      }));
    } else if (kind === "bar") {
      new chartXkcd.Bar(svg, Object.assign({}, common, {
        data: { labels: ["docs", "stackoverflow", "source", "giving up"], datasets: [{ data: [7, 5, 9, 2] }] }
      }));
    } else {
      new chartXkcd.Pie(svg, Object.assign({}, common, {
        title: "Where the week went",
        data: { labels: ["docs", "bundler", "CSS", "the chart"], datasets: [{ data: [30, 25, 35, 10] }] },
        options: Object.assign({ innerRadius: .45, legendPosition: chartXkcd.config.positionType.upRight }, common.options)
      }));
    }
  }
  draw();

  ctx.select("chart", ["line", "bar", "pie"], function (v) { kind = v; draw(); }, "line");
  ctx.btn("Redraw", draw, true);
  ctx.readout("press Redraw — the hand-drawn wobble is generated fresh every time");
};

/* --------------------------------------------------- Lightweight Charts */
B.lw = async function (ctx) {
  var T = ctx.T;
  var LWC = LightweightCharts;
  var chart = LWC.createChart(ctx.el, {
    layout: { background: { color: "transparent" }, textColor: T.muted, fontFamily: T.mono, fontSize: 10 },
    grid: { vertLines: { color: T.grid }, horzLines: { color: T.grid } },
    rightPriceScale: { borderColor: T.line },
    timeScale: { borderColor: T.line, timeVisible: false },
    crosshair: {
      mode: LWC.CrosshairMode.Normal,
      vertLine: { color: T.accent, labelBackgroundColor: T.accent },
      horzLine: { color: T.accent, labelBackgroundColor: T.accent }
    },
    autoSize: true
  });

  /* Build a plausible OHLC series so the candles behave like real ones. */
  var r = seeded(29), price = 128, candles = [], volumes = [];
  for (var i = 0; i < 320; i++) {
    var open = price;
    var close = Math.max(5, open + (r() - .49) * 5);
    var high = Math.max(open, close) + r() * 2.2;
    var low = Math.min(open, close) - r() * 2.2;
    var t = Math.floor((Date.UTC(2025, 0, 1) + i * 86400000) / 1000);
    candles.push({ time: t, open: open, high: high, low: low, close: close });
    volumes.push({ time: t, value: Math.round(400 + r() * 900),
                   color: close >= open ? ctx.series(1) + "77" : ctx.series(3) + "77" });
    price = close;
  }

  var candleSeries = chart.addSeries
    ? chart.addSeries(LWC.CandlestickSeries, {
        upColor: ctx.series(1), downColor: ctx.series(3),
        borderUpColor: ctx.series(1), borderDownColor: ctx.series(3),
        wickUpColor: ctx.series(1), wickDownColor: ctx.series(3)
      })
    : chart.addCandlestickSeries({ upColor: ctx.series(1), downColor: ctx.series(3) });
  candleSeries.setData(candles);

  var volSeries = chart.addSeries
    ? chart.addSeries(LWC.HistogramSeries, { priceFormat: { type: "volume" }, priceScaleId: "vol" })
    : chart.addHistogramSeries({ priceFormat: { type: "volume" }, priceScaleId: "vol" });
  volSeries.setData(volumes);
  chart.priceScale("vol").applyOptions({ scaleMargins: { top: .78, bottom: 0 } });

  var out = ctx.readout("scroll to zoom the time axis · drag to pan");
  chart.subscribeCrosshairMove(function (p) {
    var d = p.seriesData && p.seriesData.get(candleSeries);
    if (!d) return;
    out("O <b>" + d.open.toFixed(2) + "</b> H <b>" + d.high.toFixed(2) +
        "</b> L <b>" + d.low.toFixed(2) + "</b> C <b>" + d.close.toFixed(2) + "</b>");
  });

  ctx.btn("Fit all", function () { chart.timeScale().fitContent(); });
  ctx.btn("Last 60", function () {
    chart.timeScale().setVisibleLogicalRange({ from: candles.length - 60, to: candles.length });
  });
  chart.timeScale().setVisibleLogicalRange({ from: candles.length - 90, to: candles.length });

  ctx.onDestroy(function () { chart.remove(); });
};

/* -------------------------------------------------------------- Dygraphs */
B.dy = async function (ctx) {
  var T = ctx.T;
  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:10px";
  ctx.el.appendChild(host);
  var N = 20000;
  var r = seeded(37), a = 50, b = 30;
  var rows = [];
  for (var i = 0; i < N; i++) {
    a += (r() - .5) * 1.4; b += (r() - .5) * 1.1;
    rows.push([new Date(Date.UTC(2026, 0, 1) + i * 60000), a, b]);
  }

  var g = new Dygraph(host, rows, {
    labels: ["time", "sensor A", "sensor B"],
    colors: [ctx.series(0), ctx.series(1)],
    strokeWidth: 1.2,
    axisLineColor: T.line2,
    gridLineColor: T.grid,
    axisLabelColor: T.muted,
    axisLabelFontSize: 10,
    legend: "follow",
    showRangeSelector: true,
    rangeSelectorHeight: 34,
    rangeSelectorPlotFillColor: ctx.series(0) + "33",
    rangeSelectorPlotStrokeColor: ctx.series(0),
    rangeSelectorBackgroundStrokeColor: T.line,
    highlightCircleSize: 3,
    highlightSeriesOpts: { strokeWidth: 2 }
  });

  ctx.btn("Zoom to 1 hour", function () {
    g.updateOptions({ dateWindow: [rows[0][0].getTime(), rows[60][0].getTime()] });
  });
  ctx.btn("Reset", function () { g.resetZoom(); });
  ctx.readout("<b>" + (N * 2).toLocaleString() + "</b> points plotted · drag horizontally to zoom, double-click to reset");

  ctx.onResize(function () { g.resize(); });
  ctx.onDestroy(function () { g.destroy(); });
};

/* ----------------------------------------------------------------- µPlot */
B.uplot = async function (ctx) {
  var T = ctx.T;
  ctx.el.style.padding = "10px";
  var chart = null, out = ctx.readout("");

  function build(N) {
    if (chart) { chart.destroy(); ctx.el.innerHTML = ""; }
    var r = seeded(61);
    var xs = new Float64Array(N), y1 = new Float64Array(N), y2 = new Float64Array(N);
    var a = 40, b = 90, t0 = Date.now() / 1000 - N;
    for (var i = 0; i < N; i++) {
      a += (r() - .5) * .8; b += (r() - .5) * 1.4;
      xs[i] = t0 + i; y1[i] = a; y2[i] = b;
    }

    var t = performance.now();
    chart = new uPlot({
      width: ctx.el.clientWidth - 20,
      height: ctx.el.clientHeight - 20,
      scales: { x: { time: true } },
      axes: [
        { stroke: T.muted, grid: { stroke: T.grid, width: 1 }, ticks: { stroke: T.line2 },
          font: "10px " + T.mono },
        { stroke: T.muted, grid: { stroke: T.grid, width: 1 }, ticks: { stroke: T.line2 },
          font: "10px " + T.mono }
      ],
      series: [
        {},
        { label: "temp",  stroke: ctx.series(0), width: 1, points: { show: false } },
        { label: "power", stroke: ctx.series(1), width: 1, points: { show: false } }
      ],
      cursor: { drag: { x: true, y: false } },
      legend: { live: true }
    }, [xs, y1, y2], ctx.el);
    var ms = performance.now() - t;

    out("<b>" + (N * 2).toLocaleString() + "</b> points drawn in <b>" + ms.toFixed(1) + " ms</b>");
  }

  ctx.select("points per series", [
    { v: "10000", t: "10 k" }, { v: "50000", t: "50 k" },
    { v: "150000", t: "150 k" }, { v: "500000", t: "500 k" }
  ], function (v) { build(+v); }, "150000");
  build(150000);

  ctx.onResize(function () {
    if (chart) chart.setSize({ width: ctx.el.clientWidth - 20, height: ctx.el.clientHeight - 20 });
  });
  ctx.onDestroy(function () { if (chart) chart.destroy(); });
};

/* ------------------------------------------------------------ webgl-plot */
B.wgl = async function (ctx) {
  var W = window.webglplot;

  /* A raw canvas: asking for a 2d context first would lock out WebGL2. */
  var cv = ctx.mk("canvas", "demo-canvas");
  ctx.el.appendChild(cv);
  var plot = null;
  function fit() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(ctx.el.clientWidth * dpr);
    cv.height = Math.round(ctx.el.clientHeight * dpr);
    if (plot && plot.gl) plot.gl.viewport(0, 0, cv.width, cv.height);
  }
  fit();
  plot = new W.WebglPlot(cv);
  var plotter = plot.newThinLinePlotter();
  fit();

  function rgb(hex) {
    return [parseInt(hex.slice(1, 3), 16) / 255,
            parseInt(hex.slice(3, 5), 16) / 255,
            parseInt(hex.slice(5, 7), 16) / 255];
  }

  var POINTS = 2000, count = 3, buffers = [];

  /* Lines are declared once as interleaved x/y buffers; each frame only
     the y values are pushed to the GPU. That is the whole trick. */
  function rebuild(n) {
    count = n;
    buffers = [];
    var configs = [];
    for (var i = 0; i < n; i++) {
      var pts = new Float32Array(POINTS * 2);
      for (var j = 0; j < POINTS; j++) {
        pts[j * 2] = -1 + 2 * j / (POINTS - 1);
        pts[j * 2 + 1] = 0;
      }
      configs.push({
        points: pts,
        color: rgb(ctx.series(i % 8)),
        offset: [0, n === 1 ? 0 : (i / (n - 1)) * 1.55 - .775],
        scale: [1, 1]
      });
      buffers.push(new Float32Array(POINTS));
    }
    plotter.initLines(configs);
  }
  rebuild(3);

  var freq = .008, amp = .3, phase = 0, frames = 0, last = performance.now();
  var out = ctx.readout("");

  ctx.raf(function () {
    phase += .045;
    for (var l = 0; l < count; l++) {
      var ys = buffers[l], k = 1 + l * .37, spread = count === 1 ? 2.4 : 1;
      for (var i = 0; i < POINTS; i++) {
        ys[i] = spread * amp * (Math.sin(i * freq * k + phase + l) +
                                .32 * Math.sin(i * freq * 3.1 * k - phase * 1.7));
      }
      plotter.updateLineY(l, ys);
    }
    plot.clear();
    plotter.draw();

    frames++;
    var now = performance.now();
    if (now - last > 500) {
      out("<b>" + (count * POINTS).toLocaleString() + "</b> vertices rewritten every frame · <b>" +
          Math.round(frames * 1000 / (now - last)) + " fps</b>");
      frames = 0; last = now;
    }
  });

  ctx.select("traces", ["1", "3", "8", "24"], function (v) { rebuild(+v); }, "3");
  ctx.range("frequency", { min: 1, max: 40, value: 8, fmt: function (v) { return (v / 1000).toFixed(3); } },
            function (v) { freq = v / 1000; });
  ctx.range("amplitude", { min: 5, max: 60, value: 30, fmt: function (v) { return (v / 100).toFixed(2); } },
            function (v) { amp = v / 100; });

  ctx.onResize(fit);
};

})();
