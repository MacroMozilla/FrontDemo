/* Networking, async and headless UI logic. */
(function () {
"use strict";
var B = window.B;

/* A tiny same-origin endpoint every demo here can hit without the network:
   the site's own fragment files, plus a deliberately flaky wrapper. */
var ENDPOINT = "assets/fragments/stats.html";

/* ------------------------------------------------------------------ Axios */
B.axios = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Interceptors are the reason people keep Axios</p>' +
    '<p class="demo-p">One place to attach auth, normalise errors, and retry. The log below is emitted ' +
    "by the interceptor chain, not by the call sites.</p>" +
    '<div class="demo-log" id="ax-log"></div>' +
    '<p class="demo-h" style="margin-top:18px">The chain</p>' +
    '<pre class="demo-pre">' + ctx.esc([
      "api.interceptors.request.use(cfg => {",
      "  cfg.headers.Authorization = `Bearer ${token}`;",
      "  cfg.meta = { start: performance.now() };",
      "  return cfg;",
      "});",
      "",
      "api.interceptors.response.use(",
      "  res => { res.duration = performance.now() - res.config.meta.start; return res; },",
      "  async err => {",
      "    const cfg = err.config;",
      "    if (cfg && !cfg.__retried) { cfg.__retried = true; return api(cfg); }",
      "    throw err;",
      "  }",
      ");"
    ].join("\n")) + "</pre>";
  ctx.el.appendChild(host);

  var logEl = host.querySelector("#ax-log");
  function log(msg) {
    var d = ctx.mk("div", null, '<span class="t">' + new Date().toLocaleTimeString() + "</span> " + msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 12) logEl.removeChild(logEl.lastChild);
  }

  var api = axios.create({ baseURL: location.href.split("#")[0] });
  var token = "demo-" + Math.random().toString(36).slice(2, 8);

  api.interceptors.request.use(function (cfg) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = "Bearer " + token;
    cfg.meta = { start: performance.now() };
    log('<span class="m">→ ' + cfg.method.toUpperCase() + "</span> " + cfg.url +
        '  <span class="t">auth attached</span>');
    return cfg;
  });

  api.interceptors.response.use(function (res) {
    var ms = (performance.now() - res.config.meta.start).toFixed(0);
    log('<span style="color:' + T.yes + '">← ' + res.status + "</span> " + res.config.url +
        "  " + ms + " ms · " + String(res.data).length + " bytes");
    return res;
  }, function (err) {
    var cfg = err.config || {};
    if (!cfg.__retried) {
      cfg.__retried = true;
      log('<span style="color:' + T.part + '">← failed</span> ' + (cfg.url || "?") +
          "  interceptor is retrying once");
      return api(cfg);
    }
    log('<span style="color:' + T.bad + '">← gave up</span> ' + (cfg.url || "?"));
    return Promise.reject(err);
  });

  var out = ctx.readout("press a button — every line below comes from an interceptor");
  ctx.btn("GET (succeeds)", function () {
    api.get(ENDPOINT).then(function (r) { out("200 · " + String(r.data).length + " bytes"); });
  }, true);
  ctx.btn("GET (404, retried once)", function () {
    api.get("assets/fragments/does-not-exist.html")
      .catch(function () { out("failed after the interceptor's retry"); });
  });
  ctx.btn("Three in parallel", function () {
    Promise.all([api.get(ENDPOINT), api.get(ENDPOINT), api.get(ENDPOINT)])
      .then(function (rs) { out("<b>" + rs.length + "</b> responses — note each was intercepted separately"); });
  });
  ctx.btn("Cancel mid-flight", function () {
    var c = new AbortController();
    api.get(ENDPOINT, { signal: c.signal }).catch(function () { log('<span class="t">request aborted</span>'); });
    c.abort();
  });
};

/* --------------------------------------------------------------------- ky */
B.ky = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  var ky = KyNS.default || KyNS.ky;

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">fetch, with the missing parts filled in</p>' +
    '<p class="demo-p">Retries with backoff, a timeout, hooks at each stage, and a non-2xx response ' +
    "throws instead of quietly succeeding. 14 KB against Axios's 53.</p>" +
    '<div class="demo-log" id="ky-log"></div>' +
    '<p class="demo-h" style="margin-top:18px">The instance</p>' +
    '<pre class="demo-pre">' + ctx.esc([
      "const api = ky.create({",
      "  timeout: 5000,",
      "  retry: { limit: 3, methods: ['get'], backoffLimit: 2000 },",
      "  hooks: {",
      "    beforeRequest:  [req  => log(`→ ${req.method} ${req.url}`)],",
      "    beforeRetry:    [({retryCount}) => log(`retry #${retryCount}`)],",
      "    afterResponse:  [(_, __, res) => log(`← ${res.status}`)],",
      "  }",
      "});"
    ].join("\n")) + "</pre>";
  ctx.el.appendChild(host);

  var logEl = host.querySelector("#ky-log");
  function log(msg) {
    var d = ctx.mk("div", null, '<span class="t">' + new Date().toLocaleTimeString() + "</span> " + msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 12) logEl.removeChild(logEl.lastChild);
  }

  var api = ky.create({
    timeout: 5000,
    retry: { limit: 3, methods: ["get"], statusCodes: [404, 408, 500, 502, 503], backoffLimit: 1200 },
    hooks: {
      beforeRequest: [function (req) { log('<span class="m">→ ' + req.method + "</span> " + req.url.split("/").pop()); }],
      beforeRetry: [function (o) { log('<span style="color:' + T.part + '">retry #' + o.retryCount + "</span> backing off"); }],
      afterResponse: [function (req, opts, res) {
        log((res.ok ? '<span style="color:' + T.yes + '">← ' : '<span style="color:' + T.bad + '">← ') +
            res.status + "</span> " + req.url.split("/").pop());
        return res;
      }]
    }
  });

  var out = ctx.readout("");
  ctx.btn("GET (succeeds)", function () {
    api.get(ENDPOINT).text().then(function (t) { out("ok · <b>" + t.length + "</b> bytes"); });
  }, true);
  ctx.btn("GET (404 → retries, then throws)", function () {
    out("watch the backoff…");
    api.get("assets/fragments/nope.html").text()
      .then(function () { out("unexpectedly succeeded"); })
      .catch(function (e) { out('<span style="color:' + T.bad + '">threw <b>' + e.name + "</b> after exhausting retries</span>"); });
  });
  ctx.btn("Timeout after 300ms", function () {
    ky.get(ENDPOINT, { timeout: 1 }).text()
      .catch(function (e) { log('<span style="color:' + T.bad + '">' + e.name + "</span>"); out("timed out — fetch alone would hang"); });
  });
};

/* -------------------------------------------------------- TanStack Query */
B.tanquery = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  var Q = TanQuery;

  var fetches = 0;
  var client = new Q.QueryClient({
    defaultOptions: { queries: { staleTime: 4000, gcTime: 15000, retry: 0 } }
  });

  async function fetchStats() {
    fetches++;
    log('<span class="m">network fetch #' + fetches + "</span>");
    var res = await fetch(ENDPOINT + "?t=" + Date.now());
    var text = await res.text();
    await new Promise(function (r) { setTimeout(r, 400); });
    return { bytes: text.length, at: new Date().toLocaleTimeString() };
  }

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">A cache, not a fetching library</p>' +
    '<p class="demo-p">Mount the same query twice — it is fetched once and both observers get the data. ' +
    "Let it go stale and the next mount serves the cached value immediately, then refetches behind it.</p>" +
    '<div class="demo-cols" id="tq-obs"></div>' +
    '<dl class="kv" style="margin-top:16px" id="tq-cache"></dl>' +
    '<p class="demo-h" style="margin-top:18px">Log</p><div class="demo-log" id="tq-log"></div>';
  ctx.el.appendChild(host);

  var logEl = host.querySelector("#tq-log");
  function log(msg) {
    var d = ctx.mk("div", null, '<span class="t">' + new Date().toLocaleTimeString() + "</span> " + msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 10) logEl.removeChild(logEl.lastChild);
  }

  var observers = [];
  function mountObserver(i) {
    var box = ctx.mk("div", "demo-colbox");
    box.innerHTML = "<h5>observer " + (i + 1) + '</h5><div id="tq-o-' + i + '" class="demo-note">…</div>';
    box.style.borderLeft = "3px solid " + ctx.series(i);
    host.querySelector("#tq-obs").appendChild(box);

    var obs = new Q.QueryObserver(client, { queryKey: ["stats"], queryFn: fetchStats });
    var un = obs.subscribe(function (r) {
      document.getElementById("tq-o-" + i).innerHTML =
        "status <b>" + r.status + "</b>" +
        (r.isFetching ? ' <span style="color:' + T.part + '">fetching</span>' : "") +
        (r.data ? "<br>" + r.data.bytes + " bytes at " + r.data.at : "") +
        (r.isStale ? '<br><span style="color:' + T.muted + '">stale</span>' : '<br><span style="color:' + T.yes + '">fresh</span>');
      refreshCache();
    });
    observers.push({ obs: obs, un: un, box: box });
    log("observer " + (i + 1) + " mounted");
  }

  function refreshCache() {
    var q = client.getQueryCache().findAll()[0];
    host.querySelector("#tq-cache").innerHTML = q
      ? "<dt>query key</dt><dd>" + JSON.stringify(q.queryKey) + "</dd>" +
        "<dt>observers</dt><dd><b>" + q.observers.length + "</b></dd>" +
        "<dt>network fetches</dt><dd><b>" + fetches + "</b></dd>" +
        "<dt>state</dt><dd>" + q.state.status + "</dd>" +
        "<dt>updated</dt><dd>" + new Date(q.state.dataUpdatedAt).toLocaleTimeString() + "</dd>"
      : "<dt>cache</dt><dd>empty</dd>";
  }

  mountObserver(0);
  ctx.onDestroy(function () { observers.forEach(function (o) { o.un(); }); client.clear(); });

  var out = ctx.readout("");
  ctx.btn("Mount another observer", function () {
    if (observers.length >= 4) { out("four is plenty"); return; }
    mountObserver(observers.length);
    out("<b>" + observers.length + "</b> observers, still <b>" + fetches + "</b> network fetches");
  }, true);
  ctx.btn("Invalidate", function () {
    client.invalidateQueries({ queryKey: ["stats"] });
    log("invalidated — a refetch will run for the mounted observers");
  });
  ctx.btn("Unmount last", function () {
    var o = observers.pop();
    if (!o) return;
    o.un(); o.box.remove();
    log("observer unmounted — the cache entry survives for gcTime");
    refreshCache();
  });
};

/* -------------------------------------------------------- TanStack Table */
B.tantable = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var TEAMS = ["Platform", "Growth", "Payments", "Mobile", "Data"];
  var s = 7;
  var rnd = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var data = [];
  for (var i = 0; i < 120; i++) {
    data.push({
      ticket: "FE-" + (1000 + i),
      title: ["Refactor", "Fix", "Add", "Document"][Math.floor(rnd() * 4)] + " " +
             ["router", "cache", "chart", "auth", "queue"][Math.floor(rnd() * 5)],
      team: TEAMS[Math.floor(rnd() * TEAMS.length)],
      points: 1 + Math.floor(rnd() * 13),
      cost: Math.round(rnd() * 9000) + 500
    });
  }

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">The library computed which rows to show. This demo wrote every tag.</p>' +
    '<p class="demo-p">There is no <code>&lt;Table&gt;</code> component anywhere. TanStack Table holds ' +
    "sorting, filtering and pagination as state and hands back row models; the markup below is ordinary " +
    "<code>document.createElement</code>.</p>" +
    '<input id="tt-filter" placeholder="filter all columns…" ' +
    'style="width:100%;max-width:320px;background:' + T.sunk + ';border:1px solid ' + T.line +
    ';border-radius:8px;padding:8px 12px;color:' + T.ink + ';font:inherit;margin-bottom:12px">' +
    '<div id="tt-table"></div><div id="tt-pager" style="display:flex;gap:8px;align-items:center;margin-top:12px"></div>';
  ctx.el.appendChild(host);

  var columns = [
    { accessorKey: "ticket", header: "Ticket" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "team", header: "Team" },
    { accessorKey: "points", header: "Points" },
    { accessorKey: "cost", header: "Cost", cell: function (i) { return "$" + i.getValue().toLocaleString(); } }
  ];

  /* The vanilla adapter wants the full state object, so seed it from the
     table's own initialState rather than hand-writing every slice. */
  var tableState = {};
  var table = TanTable.createTable({
    data: data,
    columns: columns,
    state: tableState,
    getCoreRowModel: TanTable.getCoreRowModel(),
    getSortedRowModel: TanTable.getSortedRowModel(),
    getFilteredRowModel: TanTable.getFilteredRowModel(),
    getPaginationRowModel: TanTable.getPaginationRowModel(),
    onStateChange: function (updater) {
      tableState = typeof updater === "function" ? updater(tableState) : updater;
      table.setOptions(function (prev) {
        return Object.assign({}, prev, { state: tableState });
      });
      render();
    },
    renderFallbackValue: null
  });
  tableState = Object.assign({}, table.initialState, { pagination: { pageIndex: 0, pageSize: 10 } });
  table.setOptions(function (prev) { return Object.assign({}, prev, { state: tableState }); });

  var out = ctx.readout("");

  function render() {
    var head = table.getHeaderGroups()[0].headers.map(function (h) {
      var dir = h.column.getIsSorted();
      return '<th data-col="' + h.column.id + '" style="cursor:pointer;user-select:none">' +
        h.column.columnDef.header + (dir ? (dir === "asc" ? " ▲" : " ▼") : '<span style="opacity:.3"> ⇅</span>') +
        "</th>";
    }).join("");

    var rows = table.getRowModel().rows.map(function (r) {
      return "<tr>" + r.getVisibleCells().map(function (c) {
        var v = c.column.columnDef.cell ? c.column.columnDef.cell(c) : c.getValue();
        var num = c.column.id === "points" || c.column.id === "cost";
        return '<td class="' + (num ? "num" : "") + '">' + ctx.esc(String(v)) + "</td>";
      }).join("") + "</tr>";
    }).join("");

    host.querySelector("#tt-table").innerHTML =
      '<table class="demo-tbl"><thead><tr>' + head + "</tr></thead><tbody>" + rows + "</tbody></table>";
    host.querySelectorAll("#tt-table th").forEach(function (th) {
      th.addEventListener("click", function () { table.getColumn(th.dataset.col).toggleSorting(); });
    });

    var p = table.getState().pagination;
    host.querySelector("#tt-pager").innerHTML =
      '<button id="tt-prev">‹ prev</button><span class="demo-note">page <b>' + (p.pageIndex + 1) +
      "</b> of " + table.getPageCount() + '</span><button id="tt-next">next ›</button>';
    host.querySelectorAll("#tt-pager button").forEach(function (b) {
      b.style.cssText = "background:" + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:6px;padding:4px 12px;color:" + T.ink2 + ";cursor:pointer;font:inherit;font-size:12px";
    });
    host.querySelector("#tt-prev").addEventListener("click", function () { table.previousPage(); });
    host.querySelector("#tt-next").addEventListener("click", function () { table.nextPage(); });

    out("<b>" + table.getFilteredRowModel().rows.length + "</b> of " + data.length +
        " rows after filtering · <b>" + table.getRowModel().rows.length + "</b> rendered");
  }
  render();

  var filterInput = host.querySelector("#tt-filter");
  filterInput.addEventListener("input", function () {
    table.setGlobalFilter(this.value);
  });

  /* Everything below is a state change on the headless instance. There is
     no table widget to configure — the render() above is the entire view. */
  ctx.select("page size", ["5", "10", "25", "50"], function (v) {
    table.setPageSize(+v);
  }, "10");
  ctx.select("sort", [
    { v: "", t: "none" },
    { v: "points:desc", t: "points ↓" },
    { v: "points:asc", t: "points ↑" },
    { v: "cost:desc", t: "cost ↓" },
    { v: "name:asc", t: "name A→Z" }
  ], function (v) {
    if (!v) { table.resetSorting(); return; }
    var parts = v.split(":");
    table.setSorting([{ id: parts[0], desc: parts[1] === "desc" }]);
  }, "");
  ctx.select("hide a column", [{ v: "", t: "none" }].concat(
    table.getAllLeafColumns().map(function (c) { return { v: c.id, t: c.id }; })
  ), function (v) {
    var vis = {};
    table.getAllLeafColumns().forEach(function (c) { vis[c.id] = c.id !== v; });
    table.setColumnVisibility(vis);
  }, "");
  ctx.btn("Jump to the last page", function () {
    table.setPageIndex(table.getPageCount() - 1);
  }, true);
  ctx.btn("Reset everything", function () {
    filterInput.value = "";
    table.resetSorting();
    table.resetGlobalFilter();
    table.setColumnVisibility({});
    table.setPageIndex(0);
    table.setPageSize(10);
  });
};

/* ------------------------------------------------------ TanStack Virtual */
B.tanvirtual = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var COUNT = 100000;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column";
  ctx.el.appendChild(wrap);

  var note = ctx.mk("p", "demo-note");
  note.style.cssText = "margin:0;padding:12px 16px;border-bottom:1px solid " + T.line;
  note.innerHTML = "<b>" + COUNT.toLocaleString() + "</b> rows exist. Scroll as fast as you like — " +
                   "the DOM node count in the toolbar never grows.";
  wrap.appendChild(note);

  var scroller = ctx.mk("div");
  scroller.style.cssText = "flex:1 1 auto;overflow:auto;position:relative";
  wrap.appendChild(scroller);

  var inner = ctx.mk("div");
  inner.style.cssText = "position:relative;width:100%";
  scroller.appendChild(inner);

  /* Deliberately uneven heights, because that is where naive virtualisers break. */
  function heightOf(i) { return 34 + (i % 7) * 9; }

  var out = ctx.readout("");
  var virtualizer = new TanVirtual.Virtualizer({
    count: COUNT,
    getScrollElement: function () { return scroller; },
    estimateSize: heightOf,
    overscan: 6,
    observeElementRect: TanVirtual.observeElementRect,
    observeElementOffset: TanVirtual.observeElementOffset,
    scrollToFn: TanVirtual.elementScroll,
    onChange: render
  });
  var unmount = virtualizer._didMount();
  virtualizer._willUpdate();
  ctx.onDestroy(function () { if (typeof unmount === "function") unmount(); });

  function render() {
    if (!virtualizer) return;
    inner.style.height = virtualizer.getTotalSize() + "px";
    var items = virtualizer.getVirtualItems();
    inner.innerHTML = items.map(function (v) {
      return '<div style="position:absolute;top:0;left:0;width:100%;height:' + v.size +
        "px;transform:translateY(" + v.start + "px);display:flex;align-items:center;gap:14px;" +
        "padding:0 16px;box-sizing:border-box;border-bottom:1px solid " + T.line +
        ';font-size:12.5px;color:' + T.ink2 + '">' +
        '<span style="font-family:' + T.mono + ";color:" + T.muted + ';width:70px">#' + v.index + "</span>" +
        '<span style="width:9px;height:9px;border-radius:50%;background:' + ctx.series(v.index % 8) + '"></span>' +
        "<span>Row " + v.index.toLocaleString() + " — height " + v.size + "px</span></div>";
    }).join("");
    out("<b>" + items.length + "</b> DOM nodes rendered of <b>" + COUNT.toLocaleString() +
        "</b> rows · total height " + Math.round(virtualizer.getTotalSize()).toLocaleString() + "px");
  }
  render();

  ctx.btn("Jump to 50,000", function () { virtualizer.scrollToIndex(50000, { align: "center" }); }, true);
  ctx.btn("Jump to end", function () { virtualizer.scrollToIndex(COUNT - 1); });
  ctx.btn("Back to top", function () { virtualizer.scrollToIndex(0); });
};

})();
