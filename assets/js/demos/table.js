/* Data grids and pivot tables. */
(function () {
"use strict";
var B = window.B;

var TEAMS = ["Platform", "Growth", "Payments", "Mobile", "Data", "Infra"];
var REGIONS = ["EMEA", "AMER", "APAC"];
var STATUS = ["shipped", "in review", "blocked", "planned"];

function rows(n, seed) {
  var s = seed || 5;
  var r = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var out = [];
  for (var i = 0; i < n; i++) {
    var team = TEAMS[Math.floor(r() * TEAMS.length)];
    var region = REGIONS[Math.floor(r() * REGIONS.length)];
    out.push({
      id: i + 1,
      ticket: "FE-" + (1000 + i),
      title: ["Refactor", "Fix", "Add", "Remove", "Document", "Optimise"][Math.floor(r() * 6)] + " " +
             ["router", "cache", "form", "chart", "auth", "queue", "worker"][Math.floor(r() * 7)],
      team: team,
      region: region,
      status: STATUS[Math.floor(r() * STATUS.length)],
      points: 1 + Math.floor(r() * 13),
      hours: Math.round(r() * 400) / 10,
      cost: Math.round(r() * 9000) + 500,
      done: r() > .45
    });
  }
  return out;
}

/* ---------------------------------------------------------------- AG Grid */
B.ag = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var data = rows(5000, 11);
  var grid = null;

  /* Row grouping and the aggregation panel are Enterprise features, so this
     demo stays inside what ag-grid-community actually ships. */
  function build(count) {
    if (grid) { grid.destroy(); host.innerHTML = ""; }
    var theme = agGrid.themeQuartz
      ? agGrid.themeQuartz.withParams({
          backgroundColor: T.stage, foregroundColor: T.ink2,
          headerBackgroundColor: T.panel2, headerTextColor: T.muted,
          borderColor: T.line, oddRowBackgroundColor: T.panel,
          accentColor: T.accent, fontFamily: T.sans, fontSize: 12.5,
          rowHoverColor: T.panel2, browserColorScheme: ctx.dark ? "dark" : "light"
        })
      : undefined;

    grid = agGrid.createGrid(host, {
      theme: theme,
      rowData: data.slice(0, count),
      defaultColDef: { sortable: true, filter: true, resizable: true, flex: 1, minWidth: 96 },
      columnDefs: [
        { field: "ticket", width: 104, flex: 0, pinned: "left" },
        { field: "title", minWidth: 190 },
        { field: "team", width: 118 },
        { field: "region", width: 96 },
        { field: "status", width: 110, cellRenderer: function (p) {
            var c = { shipped: T.yes, "in review": T.accent, blocked: T.bad, planned: T.muted }[p.value];
            return '<span style="color:' + c + '">● </span>' + p.value;
          } },
        { field: "points", width: 84, type: "numericColumn" },
        { field: "hours", width: 92, type: "numericColumn",
          valueFormatter: function (p) { return p.value.toFixed(1); } },
        { field: "cost", width: 104, type: "numericColumn",
          valueFormatter: function (p) { return "$" + p.value.toLocaleString(); } }
      ],
      rowSelection: { mode: "multiRow" },
      quickFilterText: filter,
      onSelectionChanged: function (e) {
        var sel = e.api.getSelectedRows();
        if (!sel.length) { out(count.toLocaleString() + " rows · scroll fast, click a header to sort"); return; }
        var total = sel.reduce(function (a, r) { return a + r.cost; }, 0);
        out("<b>" + sel.length + "</b> rows selected · total cost <b>$" + total.toLocaleString() + "</b>");
      }
    });
    out(count.toLocaleString() + " rows · scroll fast, click a header to sort, drag a column to reorder");
  }

  var out = ctx.readout("");
  var count = 5000, filter = "";
  build(count);

  ctx.select("rows", ["500", "5000", "50000"], function (v) {
    count = +v;
    if (count > data.length) data = rows(count, 11);
    build(count);
  }, "5000");
  ctx.text("quick filter", "", function (v) {
    filter = v;
    if (grid) grid.setGridOption("quickFilterText", v);
  }, "120px");
  ctx.btn("Auto-size columns", function () { if (grid) grid.autoSizeAllColumns(); });
  ctx.btn("Clear filters", function () { if (grid) grid.setFilterModel(null); });

  ctx.onDestroy(function () { if (grid) grid.destroy(); });
};

/* -------------------------------------------------------------- Tabulator */
B.tb = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var data = rows(400, 23);
  var out = ctx.readout("double-click a cell to edit it in place · drag a column header to reorder");

  var table = new Tabulator(host, {
    data: data,
    height: "100%",
    layout: "fitColumns",
    movableColumns: true,
    pagination: true,
    paginationSize: 18,
    columns: [
      { title: "Ticket", field: "ticket", width: 104, headerFilter: "input" },
      { title: "Title", field: "title", editor: "input", headerFilter: "input" },
      { title: "Team", field: "team", width: 120, editor: "list",
        editorParams: { values: TEAMS }, headerFilter: "list", headerFilterParams: { values: TEAMS } },
      { title: "Status", field: "status", width: 120, editor: "list",
        editorParams: { values: STATUS },
        formatter: function (cell) {
          var v = cell.getValue();
          var c = { shipped: T.yes, "in review": T.accent, blocked: T.bad, planned: T.muted }[v];
          return '<span style="color:' + c + '">●</span> ' + v;
        } },
      { title: "Points", field: "points", width: 92, hozAlign: "right", editor: "number",
        bottomCalc: "sum" },
      { title: "Hours", field: "hours", width: 92, hozAlign: "right", editor: "number",
        formatter: "money", formatterParams: { precision: 1, symbol: "" }, bottomCalc: "sum" },
      { title: "Done", field: "done", width: 78, hozAlign: "center",
        formatter: "tickCross", editor: "tickCross" }
    ]
  });

  table.on("cellEdited", function (cell) {
    out("edited <b>" + cell.getField() + "</b> on " + cell.getRow().getData().ticket +
        " → " + cell.getValue());
  });

  ctx.btn("Download CSV", function () { table.download("csv", "tickets.csv"); }, true);
  ctx.btn("Download JSON", function () { table.download("json", "tickets.json"); });
  ctx.select("group by", [{ v: "", t: "none" }, { v: "team", t: "team" },
                          { v: "status", t: "status" }, { v: "region", t: "region" }],
             function (v) { table.setGroupBy(v || false); }, "");
  ctx.btn("Clear filters", function () { table.clearHeaderFilter(); });

  ctx.onDestroy(function () { table.destroy(); });
};

/* --------------------------------------------------------------- AntV S2 */
B.s2 = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var data = [];
  var quarters = ["Q1", "Q2", "Q3", "Q4"];
  var s = 17;
  var r = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  TEAMS.forEach(function (team) {
    REGIONS.forEach(function (region) {
      quarters.forEach(function (q) {
        ["revenue", "cost"].forEach(function (metric) {
          data.push({ team: team, region: region, quarter: q, metric: metric,
                      value: Math.round(r() * 900) + 60 });
        });
      });
    });
  });

  var dataCfg = {
    fields: {
      rows: ["team", "region"],
      columns: ["quarter", "metric"],
      values: ["value"]
    },
    meta: [
      { field: "team", name: "Team" }, { field: "region", name: "Region" },
      { field: "quarter", name: "Quarter" }, { field: "metric", name: "Metric" },
      { field: "value", name: "Value",
        formatter: function (v) { return v == null ? "" : "$" + Number(v).toLocaleString(); } }
    ],
    data: data
  };

  var options = {
    width: ctx.el.clientWidth,
    height: ctx.el.clientHeight,
    hierarchyType: "grid",
    interaction: { hoverHighlight: true, selectedCellsSpotlight: true },
    tooltip: { showTooltip: true },
    totals: {
      row: { showGrand: true, showSubTotals: true, reverseLayout: true, subTotalsDimensions: ["team"] },
      col: { showGrand: true, showSubTotals: true, subTotalsDimensions: ["quarter"] }
    },
    style: { layoutWidthType: "compact" }
  };

  var sheet = new S2.PivotSheet(host, dataCfg, options);
  sheet.setThemeCfg({ name: ctx.dark ? "dark" : "default" });
  await sheet.render();

  var out = ctx.readout("<b>" + data.length + "</b> records pivoted on canvas · rows and columns are both two levels deep");
  sheet.on(S2.S2Event.DATA_CELL_CLICK, function (ev) {
    var meta = sheet.getCell(ev.target) && sheet.getCell(ev.target).getMeta();
    if (meta && meta.fieldValue != null) out("cell value <b>$" + Number(meta.fieldValue).toLocaleString() + "</b>");
  });

  ctx.select("layout", [{ v: "grid", t: "grid" }, { v: "tree", t: "tree rows" }], function (v) {
    sheet.setOptions({ hierarchyType: v });
    sheet.render(false);
  }, "grid");
  ctx.check("totals", true, function (v) {
    sheet.setOptions({ totals: v ? options.totals : { row: {}, col: {} } });
    sheet.render(true);
  });

  ctx.onResize(function () {
    sheet.changeSheetSize(ctx.el.clientWidth, ctx.el.clientHeight);
    sheet.render(false);
  });
  ctx.onDestroy(function () { sheet.destroy(); });
};

})();
