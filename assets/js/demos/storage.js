/* Client-side storage, workers and file handling. */
(function () {
"use strict";
var B = window.B;

function head(ctx, label) {
  return '<div style="font:700 9.5px ' + ctx.T.mono + ";letter-spacing:.14em;color:" + ctx.T.muted +
    ';margin:0 0 9px">' + label + "</div>";
}
function card(ctx, parent, title, note) {
  var T = ctx.T;
  var c = ctx.mk("div");
  c.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
    ";border-radius:12px;padding:14px 16px;margin-bottom:14px";
  c.innerHTML = head(ctx, title) + (note ? '<p class="demo-note" style="margin:0 0 10px">' + note + "</p>" : "");
  parent.appendChild(c);
  return c;
}
function log(ctx, parent, height) {
  var T = ctx.T;
  var l = ctx.mk("div");
  l.style.cssText = "font:500 11.5px " + T.mono + ";line-height:1.9;color:" + T.ink2 +
    ";background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;padding:9px 12px;" +
    "height:" + (height || 150) + "px;overflow:auto";
  parent.appendChild(l);
  return function (html, colour) {
    var row = ctx.mk("div");
    row.innerHTML = '<span style="color:' + T.muted + '">› </span><span style="color:' +
      (colour || T.ink2) + '">' + html + "</span>";
    l.insertBefore(row, l.firstChild);
    while (l.children.length > 60) l.removeChild(l.lastChild);
  };
}

/* --------------------------------------------------------------- Dexie.js */
B.dexie = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">IndexedDB with a query language</p>' +
    '<p class="demo-p">This is a real IndexedDB database in your browser, not an array. ' +
    "Add rows, query them by index, then <b>reload the page</b> — the rows are still here.</p>";
  ctx.el.appendChild(host);

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  var qCard = card(ctx, colA, "SCHEMA & QUERY",
    "Indexes are declared once; every query below runs against them.");
  qCard.insertAdjacentHTML("beforeend",
    '<pre class="demo-pre" style="max-height:none;margin-bottom:12px">' + ctx.esc(
      'db.version(1).stores({\n' +
      '  orders: "++id, customer, region, amount, created"\n' +
      "})") + "</pre>");
  var logBox = card(ctx, colA, "QUERY LOG", "");
  var say = log(ctx, logBox, 190);

  var tblCard = card(ctx, colB, "RESULTS", "Whatever the current query returned.");
  var tblHost = ctx.mk("div");
  tblHost.style.cssText = "max-height:340px;overflow:auto";
  tblCard.appendChild(tblHost);

  var db = new Dexie("fd-orders");
  db.version(1).stores({ orders: "++id, customer, region, amount, created" });
  ctx.onDestroy(function () { db.close(); });

  var REGIONS = ["emea", "amer", "apac"];
  var NAMES = ["Northwind", "Contoso", "Fabrikam", "Adventure Works", "Tailspin",
    "Wingtip", "Litware", "Proseware", "Fourth Coffee", "Lucerne"];
  var rnd = ctx.rng(11);

  function makeRow() {
    return {
      customer: NAMES[Math.floor(rnd() * NAMES.length)],
      region: REGIONS[Math.floor(rnd() * REGIONS.length)],
      amount: Math.round(50 + rnd() * 4950),
      created: Date.now() - Math.floor(rnd() * 86400000 * 60)
    };
  }

  function render(rows, label, ms) {
    if (!rows.length) {
      tblHost.innerHTML = '<p class="demo-note">no rows</p>';
    } else {
      tblHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>id</th><th>customer</th>' +
        "<th>region</th><th>amount</th><th>created</th></tr></thead><tbody>" +
        rows.map(function (r) {
          return "<tr><td>" + r.id + "</td><td>" + ctx.esc(r.customer) + "</td><td><code>" +
            r.region + "</code></td><td>$" + r.amount.toLocaleString("en-US") + "</td><td>" +
            new Date(r.created).toISOString().slice(0, 10) + "</td></tr>";
        }).join("") + "</tbody></table>";
    }
    say(ctx.esc(label) + " → <b>" + rows.length + "</b> rows in <b>" + ms.toFixed(1) + " ms</b>");
  }

  async function runQuery(label, fn) {
    var t0 = performance.now();
    var rows = await fn();
    render(rows, label, performance.now() - t0);
    await refreshCount();
  }

  var out = ctx.readout("");
  async function refreshCount() {
    var n = await db.orders.count();
    var sum = 0;
    await db.orders.each(function (r) { sum += r.amount; });
    out("<b>" + n + "</b> rows in IndexedDB · total <b>$" + sum.toLocaleString("en-US") + "</b>");
  }

  var QUERIES = {
    "all, newest first": function () { return db.orders.orderBy("created").reverse().limit(40).toArray(); },
    "region = apac": function () { return db.orders.where("region").equals("apac").toArray(); },
    "amount > 3000": function () { return db.orders.where("amount").above(3000).reverse().toArray(); },
    "amount between 1k–2k": function () { return db.orders.where("amount").between(1000, 2000).toArray(); },
    "customer starts with 'F'": function () { return db.orders.where("customer").startsWithIgnoreCase("f").toArray(); },
    "top 10 by amount": function () { return db.orders.orderBy("amount").reverse().limit(10).toArray(); }
  };
  var current = "all, newest first";

  if ((await db.orders.count()) === 0) {
    var seed = [];
    for (var i = 0; i < 40; i++) seed.push(makeRow());
    await db.orders.bulkAdd(seed);
    say("seeded <b>40</b> rows with bulkAdd()", T.yes);
  } else {
    say("opened the existing database — data survived the reload", T.yes);
  }
  await runQuery(current, QUERIES[current]);

  ctx.select("query", Object.keys(QUERIES), function (v) {
    current = v; runQuery(v, QUERIES[v]);
  }, current);
  ctx.btn("Add one row", async function () {
    var r = makeRow();
    var id = await db.orders.add(r);
    say("add() → id <b>" + id + "</b> (" + ctx.esc(r.customer) + ", $" + r.amount + ")", T.yes);
    runQuery(current, QUERIES[current]);
  }, true);
  ctx.btn("bulkAdd 500", async function () {
    var many = [];
    for (var i = 0; i < 500; i++) many.push(makeRow());
    var t0 = performance.now();
    await db.orders.bulkAdd(many);
    say("bulkAdd(500) in <b>" + (performance.now() - t0).toFixed(0) + " ms</b>", T.yes);
    runQuery(current, QUERIES[current]);
  });
  ctx.btn("Bump apac by 10%", async function () {
    var t0 = performance.now();
    var n = await db.orders.where("region").equals("apac")
      .modify(function (r) { r.amount = Math.round(r.amount * 1.1); });
    say("modify() updated <b>" + n + "</b> rows in <b>" + (performance.now() - t0).toFixed(0) +
      " ms</b>", T.part);
    runQuery(current, QUERIES[current]);
  });
  ctx.btn("Delete everything", async function () {
    await db.orders.clear();
    say("clear() — table emptied", T.bad);
    runQuery(current, QUERIES[current]);
  });
};

/* ------------------------------------------------------------ localForage */
B.localforage = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">One async API over whichever engine is available</p>' +
    '<p class="demo-p">Same four lines of code, two different backends — and the surprise is that ' +
    "they behave almost identically. localStorage can only hold strings, but localForage serialises " +
    "Blobs and typed arrays into one before writing and reconstructs them on the way out, so only " +
    "<code>Date</code> loses its type. What you actually trade is speed and capacity, measured on " +
    "the right.</p>";
  ctx.el.appendChild(host);

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  var resCard = card(ctx, colA, "ROUND-TRIP FIDELITY",
    "Write a value, read it back, compare what came out.");
  var resHost = ctx.mk("div");
  resCard.appendChild(resHost);

  var benchCard = card(ctx, colB, "WRITE THROUGHPUT",
    "200 sequential setItem calls per driver, on this machine, right now. localStorage is " +
    "synchronous and wins on small values; IndexedDB is the one that survives a 40 MB blob.");
  var benchHost = ctx.mk("div");
  benchCard.appendChild(benchHost);

  var logCard = card(ctx, colB, "LOG", "");
  var say = log(ctx, logCard, 130);

  var DRIVERS = [
    { id: localforage.INDEXEDDB, name: "IndexedDB" },
    { id: localforage.LOCALSTORAGE, name: "localStorage" }
  ];

  var VALUES = [
    { name: "string", make: function () { return "hello"; } },
    { name: "number", make: function () { return 42.5; } },
    { name: "array", make: function () { return [1, 2, 3]; } },
    { name: "object", make: function () { return { a: 1, b: { c: 2 } }; } },
    { name: "Uint8Array", make: function () { return new Uint8Array([1, 2, 3, 250]); } },
    { name: "Blob", make: function () { return new Blob(["binary"], { type: "text/plain" }); } },
    { name: "Date", make: function () { return new Date(0); } }
  ];

  function describe(v) {
    if (v instanceof Blob) return "Blob(" + v.size + " bytes)";
    if (v instanceof Uint8Array) return "Uint8Array[" + Array.from(v).join(",") + "]";
    if (v instanceof ArrayBuffer) return "ArrayBuffer(" + v.byteLength + ")";
    if (v instanceof Date) return "Date(" + v.toISOString().slice(0, 10) + ")";
    if (v === null) return "null";
    if (typeof v === "object") return JSON.stringify(v);
    return typeof v === "string" ? '"' + v + '"' : String(v);
  }
  function sameShape(a, b) {
    if (a instanceof Blob) return b instanceof Blob && a.size === b.size;
    if (a instanceof Uint8Array) return (b instanceof Uint8Array || b instanceof ArrayBuffer);
    if (a instanceof Date) return b instanceof Date;
    if (typeof a === "object") return JSON.stringify(a) === JSON.stringify(b);
    return a === b;
  }

  var out = ctx.readout("");

  async function fidelity() {
    var rows = [];
    for (var d = 0; d < DRIVERS.length; d++) {
      var store = localforage.createInstance({
        name: "fd-demo", storeName: "probe" + d, driver: DRIVERS[d].id
      });
      await store.ready();
      var active = store.driver();
      for (var i = 0; i < VALUES.length; i++) {
        var v = VALUES[i].make();
        var back;
        try { await store.setItem("k" + i, v); back = await store.getItem("k" + i); }
        catch (e) { back = "ERROR: " + e.message; }
        var ok = sameShape(v, back);
        rows.push("<tr><td><code>" + DRIVERS[d].name + "</code></td><td>" + VALUES[i].name +
          '</td><td style="color:' + T.muted + '">' + ctx.esc(describe(back)) + "</td>" +
          '<td style="color:' + (ok ? T.yes : T.bad) + ';font-weight:700">' +
          (ok ? "intact" : "changed") + "</td></tr>");
      }
      say("driver in use: <b>" + ctx.esc(String(active)) + "</b>");
    }
    resHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>driver</th><th>value</th>' +
      "<th>read back as</th><th></th></tr></thead><tbody>" + rows.join("") + "</tbody></table>";
  }

  async function bench(n) {
    benchHost.innerHTML = '<p class="demo-note">running…</p>';
    var results = [];
    for (var d = 0; d < DRIVERS.length; d++) {
      var store = localforage.createInstance({
        name: "fd-demo", storeName: "bench" + d, driver: DRIVERS[d].id
      });
      await store.clear();
      var t0 = performance.now();
      for (var i = 0; i < n; i++) await store.setItem("row" + i, { i: i, s: "payload-" + i });
      var ms = performance.now() - t0;
      results.push({ name: DRIVERS[d].name, ms: ms });
      say(DRIVERS[d].name + ": <b>" + ms.toFixed(0) + " ms</b> for " + n + " writes");
    }
    var max = Math.max.apply(null, results.map(function (r) { return r.ms; }));
    benchHost.innerHTML = results.map(function (r, i) {
      return '<div style="margin-bottom:11px">' +
        '<div style="display:flex;justify-content:space-between;font:600 11.5px ' + T.mono +
          ";color:" + T.ink2 + ';margin-bottom:4px"><span>' + r.name + "</span><span>" +
          r.ms.toFixed(0) + " ms · " + (n / r.ms * 1000).toFixed(0) + "/s</span></div>" +
        '<div style="height:9px;border-radius:5px;background:' + T.sunk + '">' +
        '<div style="height:100%;border-radius:5px;width:' + (r.ms / max * 100).toFixed(1) +
          "%;background:" + ctx.series(i) + '"></div></div></div>';
    }).join("");
    out("fastest: <b>" + results.slice().sort(function (a, b) { return a.ms - b.ms; })[0].name + "</b>");
  }

  await fidelity();
  await bench(200);

  ctx.btn("Re-run the fidelity table", fidelity);
  ctx.select("benchmark size", ["100", "200", "500"], function (v) { bench(+v); }, "200");
  ctx.btn("Drop the whole store", async function () {
    await localforage.dropInstance({ name: "fd-demo" });
    say("dropInstance() — every store removed", T.bad);
    out("store dropped");
  });
};

/* ---------------------------------------------------------------- Comlink */
B.comlink = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">A worker that looks like an object</p>' +
    '<p class="demo-p">No <code>postMessage</code>, no message-type switch. Comlink puts a proxy in ' +
    "front of the worker so <code>await api.countPrimes(n)</code> reads like a normal call — including " +
    "passing a callback back the other way. The bar keeps moving while the worker is busy; run the same " +
    "work on the main thread and it freezes.</p>";
  ctx.el.appendChild(host);

  /* The worker is built here so the demo stays a single file — it pulls the
     same vendored Comlink the page uses. */
  var WORKER_SRC =
    "importScripts(" + JSON.stringify(new URL("vendor/comlink.js", location.href).href) + ");\n" +
    "function isPrime(n){ if(n<2) return false; for(var i=2;i*i<=n;i++) if(n%i===0) return false; return true; }\n" +
    "var api = {\n" +
    "  countPrimes: function (limit, onProgress) {\n" +
    "    var count = 0, step = Math.max(1, Math.floor(limit / 40));\n" +
    "    for (var i = 0; i < limit; i++) {\n" +
    "      if (isPrime(i)) count++;\n" +
    "      if (onProgress && i % step === 0) onProgress(i / limit, count);\n" +
    "    }\n" +
    "    if (onProgress) onProgress(1, count);\n" +
    "    return count;\n" +
    "  },\n" +
    "  hash: function (buf) {\n" +
    "    var v = new Uint8Array(buf), h = 2166136261;\n" +
    "    for (var i = 0; i < v.length; i++) { h ^= v[i]; h = Math.imul(h, 16777619); }\n" +
    "    return { bytes: v.length, hash: (h >>> 0).toString(16) };\n" +
    "  },\n" +
    "  counter: { value: 0, bump: function (by) { this.value += by; return this.value; } }\n" +
    "};\n" +
    "Comlink.expose(api);\n";

  var url = URL.createObjectURL(new Blob([WORKER_SRC], { type: "text/javascript" }));
  var worker = new Worker(url);
  var api = Comlink.wrap(worker);
  ctx.onDestroy(function () { worker.terminate(); URL.revokeObjectURL(url); });

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  var uiCard = card(ctx, colA, "IS THE UI STILL ALIVE?",
    "A requestAnimationFrame loop. If the main thread blocks, this stops dead.");
  var track = ctx.mk("div");
  track.style.cssText = "height:14px;border-radius:7px;background:" + T.sunk + ";position:relative;" +
    "overflow:hidden;margin-bottom:12px";
  var dot = ctx.mk("div");
  dot.style.cssText = "position:absolute;top:0;bottom:0;width:56px;border-radius:7px;background:" +
    ctx.series(0);
  track.appendChild(dot);
  uiCard.appendChild(track);
  var fps = ctx.mk("div");
  fps.style.cssText = "font:600 11.5px " + T.mono + ";color:" + T.muted;
  uiCard.appendChild(fps);

  var t = 0, frames = 0, lastT = performance.now();
  ctx.raf(function (dt, now) {
    t += dt / 1000;
    var w = track.clientWidth - 56;
    dot.style.transform = "translateX(" + ((Math.sin(t * 1.1) * 0.5 + 0.5) * w).toFixed(1) + "px)";
    frames++;
    if (now - lastT > 500) {
      fps.textContent = (frames / (now - lastT) * 1000).toFixed(0) + " fps";
      frames = 0; lastT = now;
    }
  });

  var progCard = card(ctx, colA, "WORKER PROGRESS",
    "The worker calls a function that lives on this page, wrapped in <code>Comlink.proxy()</code>.");
  var barOuter = ctx.mk("div");
  barOuter.style.cssText = "height:10px;border-radius:5px;background:" + T.sunk + ";overflow:hidden";
  var bar = ctx.mk("div");
  bar.style.cssText = "height:100%;width:0;background:" + ctx.series(1) + ";transition:width .08s linear";
  barOuter.appendChild(bar);
  progCard.appendChild(barOuter);
  var progText = ctx.mk("div");
  progText.style.cssText = "font:600 11.5px " + T.mono + ";color:" + T.ink2 + ";margin-top:8px";
  progText.textContent = "idle";
  progCard.appendChild(progText);

  var srcCard = card(ctx, colB, "THE WHOLE WORKER",
    "This is the entire worker file. <code>Comlink.expose</code> is the only line that is not plain logic.");
  srcCard.insertAdjacentHTML("beforeend",
    '<pre class="demo-pre" style="max-height:none">' + ctx.esc(
      "var api = {\n" +
      "  countPrimes(limit, onProgress) { … },\n" +
      "  hash(arrayBuffer)              { … },\n" +
      "  counter: { value: 0, bump(by) { … } }\n" +
      "}\n" +
      "Comlink.expose(api)\n" +
      "\n" +
      "// on this page:\n" +
      "const api = Comlink.wrap(new Worker(url))\n" +
      "await api.countPrimes(4e6, Comlink.proxy(onProgress))") + "</pre>");

  var logCard = card(ctx, colB, "CALL LOG", "");
  var say = log(ctx, logCard, 170);

  var out = ctx.readout("worker ready");
  var limit = 4000000;
  var busy = false;

  function isPrimeMain(n) {
    if (n < 2) return false;
    for (var i = 2; i * i <= n; i++) if (n % i === 0) return false;
    return true;
  }

  ctx.select("workload", [
    { v: "1000000", t: "1 M numbers" },
    { v: "4000000", t: "4 M numbers" },
    { v: "9000000", t: "9 M numbers" }
  ], function (v) { limit = +v; }, "4000000");

  ctx.btn("Run in the worker", async function () {
    if (busy) return;
    busy = true;
    say("api.countPrimes(" + limit.toLocaleString("en-US") + ") — off-thread", T.yes);
    var t0 = performance.now();
    var n = await api.countPrimes(limit, Comlink.proxy(function (frac, count) {
      bar.style.width = (frac * 100).toFixed(1) + "%";
      progText.textContent = (frac * 100).toFixed(0) + "% · " + count.toLocaleString("en-US") + " primes so far";
    }));
    var ms = performance.now() - t0;
    say("→ <b>" + n.toLocaleString("en-US") + "</b> primes in <b>" + ms.toFixed(0) + " ms</b>", T.yes);
    out("worker: <b>" + ms.toFixed(0) + " ms</b>, UI never dropped a frame");
    busy = false;
  }, true);

  ctx.btn("Run on the main thread", function () {
    if (busy) return;
    say("same loop, no worker — watch the bar freeze", T.bad);
    ctx.after(60, function () {
      var t0 = performance.now(), count = 0;
      for (var i = 0; i < limit; i++) if (isPrimeMain(i)) count++;
      var ms = performance.now() - t0;
      say("→ <b>" + count.toLocaleString("en-US") + "</b> primes in <b>" + ms.toFixed(0) +
        " ms</b>, with the page frozen throughout", T.bad);
      out("main thread: <b>" + ms.toFixed(0) + " ms</b> of dropped frames");
    });
  });

  ctx.btn("Transfer 8 MB (zero-copy)", async function () {
    var buf = new ArrayBuffer(8 * 1024 * 1024);
    new Uint8Array(buf).fill(7);
    var t0 = performance.now();
    var r = await api.hash(Comlink.transfer(buf, [buf]));
    say("hash of " + (r.bytes / 1048576) + " MB → <b>0x" + r.hash + "</b> in <b>" +
      (performance.now() - t0).toFixed(0) + " ms</b>; buffer is now " + buf.byteLength +
      " bytes here — ownership moved", T.part);
  });

  ctx.btn("api.counter.bump(5)", async function () {
    var v = await api.counter.bump(5);
    say("nested property call → counter.value = <b>" + v + "</b>");
  });

  /* Warm the proxy so the log is not empty on arrival. */
  say("Comlink.wrap() — the worker is now an object", T.part);
  api.countPrimes(400000, Comlink.proxy(function (frac, count) {
    bar.style.width = (frac * 100).toFixed(1) + "%";
    progText.textContent = (frac * 100).toFixed(0) + "% · " + count.toLocaleString("en-US") + " primes so far";
  })).then(function (n) {
    say("warm-up: <b>" + n.toLocaleString("en-US") + "</b> primes under 400,000", T.yes);
  });
};

/* --------------------------------------------------------------- FilePond */
B.filepond = async function (ctx) {
  var T = ctx.T;
  await ctx.css("filepond");
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Drag files in — or let the demo add some</p>' +
    '<p class="demo-p">There is no server behind this page, so the upload is a stubbed ' +
    "<code>server.process</code> that reports progress and can be told to fail. Everything else — " +
    "drag and drop, reordering, per-file cancel, retry, validation — is the real library.</p>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".filepond--root{font-family:" + T.sans + ";margin-bottom:0}" +
    ".filepond--panel-root{background:" + T.sunk + ";border:1px dashed " + T.line2 + ";border-radius:12px}" +
    ".filepond--drop-label{color:" + T.ink2 + "}" +
    ".filepond--label-action{color:" + T.accent + ";text-decoration-color:" + T.accent + "}" +
    ".filepond--item-panel{background:" + T.panel2 + ";border-radius:9px}" +
    ".filepond--file{color:" + T.ink + "}" +
    ".filepond--file-action-button{background:" + T.line2 + ";color:" + T.ink + "}" +
    ".filepond--file-action-button:hover{background:" + T.accent + "}" +
    ".filepond--file-status{color:" + T.muted + "}" +
    ".filepond--file-info-sub{color:" + T.muted + "}" +
    ".filepond--drip{background:" + T.accent + ";opacity:.06}";
  ctx.el.appendChild(style);

  var mountEl = ctx.mk("input");
  mountEl.type = "file";
  mountEl.multiple = true;
  ctx.el.appendChild(mountEl);

  var logCard = card(ctx, ctx.el, "EVENT STREAM",
    "FilePond emits a callback for every stage of a file's life.");
  var say = log(ctx, logCard, 190);

  var out = ctx.readout("0 files");
  var failNext = false, speed = 1;

  var pond = FilePond.create(mountEl, {
    allowMultiple: true,
    allowReorder: true,
    instantUpload: false,
    maxFiles: 8,
    maxFileSize: "3MB",
    labelIdle: 'Drag files here or <span class="filepond--label-action">browse</span>' +
      " &nbsp;·&nbsp; max 8 files, 3 MB each",
    labelMaxFileSizeExceeded: "That file is over the 3 MB limit",
    credits: false,
    server: {
      /* A stub transport: FilePond only cares that you call progress(), then
         load() or error(). Swapping in a real endpoint is one object. */
      process: function (fieldName, file, metadata, load, error, progress, abort) {
        var sent = 0, total = file.size || 200000;
        var chunk = Math.max(2048, total / (28 / speed));
        var id = setInterval(function () {
          sent = Math.min(total, sent + chunk);
          progress(true, sent, total);
          if (sent >= total) {
            clearInterval(id);
            if (failNext) {
              say("upload of <b>" + ctx.esc(file.name) + "</b> rejected by the server", T.bad);
              error("the server said no");
            } else {
              say("uploaded <b>" + ctx.esc(file.name) + "</b> (" + (total / 1024).toFixed(0) +
                " KB) — server returned an id", T.yes);
              load("srv-" + Math.random().toString(36).slice(2, 9));
            }
          }
        }, 60);
        return { abort: function () { clearInterval(id); say("upload aborted", T.part); abort(); } };
      },
      revert: function (id, load) { say("revert(" + ctx.esc(id) + ") — server copy deleted", T.part); load(); }
    },
    onaddfile: function (err, item) {
      if (err) { say("rejected: " + ctx.esc(err.body || err.main || "invalid"), T.bad); return; }
      say("added <b>" + ctx.esc(item.filename) + "</b> · " + ctx.esc(item.fileType || "unknown") +
        " · " + (item.fileSize / 1024).toFixed(1) + " KB");
      count();
    },
    onremovefile: function () { say("removed"); count(); },
    onreorderfiles: function (files) {
      say("reordered → " + files.map(function (f) { return ctx.esc(f.filename); }).join(", "));
    }
  });
  ctx.onDestroy(function () { pond.destroy(); });

  function count() {
    var files = pond.getFiles();
    var bytes = files.reduce(function (a, f) { return a + f.fileSize; }, 0);
    out("<b>" + files.length + "</b> file" + (files.length === 1 ? "" : "s") + " · " +
      (bytes / 1024).toFixed(0) + " KB queued");
  }

  /* Files generated in the page, so the demo has something to show
     without anybody dragging anything in. */
  function fakeCsv(rows) {
    var lines = ["id,customer,region,amount"];
    for (var i = 0; i < rows; i++) lines.push([i, "customer-" + i, "emea", 100 + i].join(","));
    return new File([lines.join("\n")], "orders-" + rows + ".csv", { type: "text/csv" });
  }
  function fakePng(size) {
    var cv = document.createElement("canvas");
    cv.width = cv.height = size;
    var g = cv.getContext("2d");
    var grd = g.createLinearGradient(0, 0, size, size);
    grd.addColorStop(0, ctx.series(0)); grd.addColorStop(1, ctx.series(4));
    g.fillStyle = grd; g.fillRect(0, 0, size, size);
    g.fillStyle = "rgba(255,255,255,.85)";
    g.font = "bold " + (size / 6) + "px " + T.mono;
    g.textAlign = "center";
    g.fillText(size + "px", size / 2, size / 2);
    return new Promise(function (res) {
      cv.toBlob(function (b) { res(new File([b], "swatch-" + size + ".png", { type: "image/png" })); });
    });
  }

  pond.addFile(fakeCsv(400));
  pond.addFile(await fakePng(320));
  ctx.after(400, function () { pond.processFiles(); });

  ctx.btn("Add a generated PNG", async function () { pond.addFile(await fakePng(160 + Math.floor(Math.random() * 400))); }, true);
  ctx.btn("Add a CSV", function () { pond.addFile(fakeCsv(2000)); });
  ctx.btn("Add an oversized file", function () {
    var big = new Uint8Array(4 * 1024 * 1024);
    pond.addFile(new File([big], "too-big.bin", { type: "application/octet-stream" }));
  });
  ctx.btn("Upload all", function () { failNext = false; pond.processFiles(); });
  ctx.btn("Upload and fail", function () {
    failNext = true;
    pond.processFiles().then(function () { failNext = false; });
  });
  ctx.select("upload speed", [{ v: "0.4", t: "slow" }, { v: "1", t: "normal" }, { v: "3", t: "fast" }],
    function (v) { speed = +v; }, "1");
  ctx.btn("Clear", function () { pond.removeFiles(); });
};

})();
