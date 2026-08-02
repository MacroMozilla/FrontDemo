/* State & reactivity. */
(function () {
"use strict";
var B = window.B;

/* ---------------------------------------------------------------- Zustand */
B.zustand = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  /* One store, three slices. The point is that a subscriber only wakes up
     when the slice it selected actually changed. */
  var store = Zustand.createStore(Zustand.subscribeWithSelector(function (set) {
    return {
      count: 0,
      user: { name: "Ada", role: "admin" },
      theme: "dark",
      inc: function () { set(function (s) { return { count: s.count + 1 }; }); },
      rename: function (n) { set(function (s) { return { user: { name: n, role: s.user.role } }; }); },
      flip: function () { set(function (s) { return { theme: s.theme === "dark" ? "light" : "dark" }; }); }
    };
  }));

  var wakes = { count: 0, user: 0, theme: 0 };
  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Three subscribers, three slices</p>' +
    '<p class="demo-p">Each panel below subscribes to one slice with a selector. Press any button and ' +
    "watch which wake counters move — the untouched slices never re-run.</p>" +
    '<div class="demo-cols" id="zs-cols"></div>' +
    '<p class="demo-h" style="margin-top:18px">Store snapshot</p><pre class="demo-pre" id="zs-state"></pre>' +
    '<p class="demo-note">The whole store is the code in the source panel below — no provider, ' +
    "no reducer, no context. <code>createStore</code> is the vanilla entry point; " +
    "<code>create</code> is the same thing with a React hook attached.</p>";
  ctx.el.appendChild(host);

  var cols = host.querySelector("#zs-cols");
  ["count", "user", "theme"].forEach(function (slice, i) {
    var box = ctx.mk("div", "demo-colbox");
    box.innerHTML = "<h5>" + slice + '</h5><div style="font-size:22px;font-weight:700" id="zs-v-' + slice +
                    '"></div><div class="demo-note">woke <b id="zs-w-' + slice + '">0</b> times</div>';
    box.style.borderLeft = "3px solid " + ctx.series(i);
    cols.appendChild(box);
  });

  function render(slice, value) {
    document.getElementById("zs-v-" + slice).textContent =
      typeof value === "object" ? value.name + " · " + value.role : String(value);
    document.getElementById("zs-w-" + slice).textContent = ++wakes[slice];
    document.getElementById("zs-state").textContent =
      JSON.stringify(store.getState(), function (k, v) {
        return typeof v === "function" ? undefined : v;
      }, 2);
  }

  ["count", "user", "theme"].forEach(function (slice) {
    render(slice, store.getState()[slice]);
    var un = store.subscribe(function (s) { return s[slice]; }, function (v) { render(slice, v); });
    ctx.onDestroy(un);
  });

  ctx.btn("count++", function () { store.getState().inc(); }, true);
  ctx.btn("rename user", function () {
    var names = ["Ada", "Grace", "Alan", "Linus", "Barbara"];
    store.getState().rename(names[Math.floor(Math.random() * names.length)]);
  });
  ctx.btn("flip theme", function () { store.getState().flip(); });
  ctx.readout("selector subscriptions — only the changed slice wakes");
};

/* ----------------------------------------------------------------- XState */
B.xstate = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var machine = XState.createMachine({
    id: "checkout",
    initial: "cart",
    context: { attempts: 0 },
    states: {
      cart:      { on: { CHECKOUT: "address" } },
      address:   { on: { NEXT: "payment", BACK: "cart" } },
      payment:   { on: { PAY: "processing", BACK: "address" } },
      processing:{ on: { SUCCESS: "done", FAILURE: "failed" } },
      failed:    { on: { RETRY: "payment", CANCEL: "cart" } },
      done:      { type: "final" }
    }
  });

  var actor = XState.createActor(machine);
  var ORDER = ["cart", "address", "payment", "processing", "failed", "done"];

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">A checkout, as a statechart</p>' +
    '<p class="demo-p">Only the transitions the current state declares are offered. There is no way to ' +
    "reach <code>processing</code> without going through <code>payment</code> — not by discipline, but " +
    "because the machine has no such edge.</p>" +
    '<div id="xs-states" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px"></div>' +
    '<p class="demo-h">Events available right now</p><div id="xs-events" style="display:flex;gap:8px;flex-wrap:wrap"></div>' +
    '<p class="demo-h" style="margin-top:18px">Transition log</p><div class="demo-log" id="xs-log"></div>';
  ctx.el.appendChild(host);

  var logEl = host.querySelector("#xs-log");
  function log(msg) {
    var d = ctx.mk("div", null, msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 8) logEl.removeChild(logEl.lastChild);
  }

  function render(state) {
    var sEl = host.querySelector("#xs-states");
    sEl.innerHTML = ORDER.map(function (n, i) {
      var on = state.value === n;
      return '<span style="padding:6px 13px;border-radius:8px;font:600 12.5px ' + T.sans +
        ";background:" + (on ? ctx.series(i % 8) : T.sunk) +
        ";color:" + (on ? "#0b0e14" : T.muted) +
        ";border:1px solid " + (on ? ctx.series(i % 8) : T.line) + '">' + n + "</span>";
    }).join("");

    var events = ["CHECKOUT", "NEXT", "BACK", "PAY", "SUCCESS", "FAILURE", "RETRY", "CANCEL"];
    var eEl = host.querySelector("#xs-events");
    eEl.innerHTML = "";
    events.forEach(function (ev) {
      var can = state.can({ type: ev });
      var b = ctx.mk("button");
      b.type = "button";
      b.textContent = ev;
      b.disabled = !can;
      b.style.cssText = "background:" + (can ? T.accent : T.sunk) + ";border:1px solid " +
        (can ? T.accent : T.line) + ";border-radius:7px;padding:5px 13px;font:600 12px " + T.sans +
        ";color:" + (can ? (T.dark ? "#0b0e14" : "#fff") : T.no) +
        ";cursor:" + (can ? "pointer" : "not-allowed");
      b.addEventListener("click", function () { actor.send({ type: ev }); });
      eEl.appendChild(b);
    });
    out("state <b>" + state.value + "</b> · " +
        events.filter(function (e) { return state.can({ type: e }); }).length + " legal events");
  }

  var out = ctx.readout("");
  var prev = null;
  actor.subscribe(function (state) {
    if (prev && prev !== state.value) log('<span class="t">' + prev + "</span> → <span class=\"m\">" + state.value + "</span>");
    prev = state.value;
    render(state);
  });
  actor.start();
  ctx.onDestroy(function () { actor.stop(); });

  ctx.btn("Reset", function () { actor.stop(); actor.start(); });
};

/* ------------------------------------------------------------------ MobX */
B.mobx = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var cart = mobx.observable({
    items: [
      { name: "Keyboard", price: 89, qty: 1 },
      { name: "Monitor",  price: 240, qty: 2 },
      { name: "Cable",    price: 12, qty: 3 }
    ],
    taxRate: 0.2,
    get subtotal() {
      return this.items.reduce(function (a, i) { return a + i.price * i.qty; }, 0);
    },
    get tax() { return Math.round(this.subtotal * this.taxRate * 100) / 100; },
    get total() { return Math.round((this.subtotal + this.tax) * 100) / 100; },
    get itemCount() { return this.items.reduce(function (a, i) { return a + i.qty; }, 0); }
  });

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Mutate a plain object; everything that read it re-runs</p>' +
    '<p class="demo-p">Nothing below subscribes to anything by name. The derived values are ordinary ' +
    "getters, and MobX worked out what depends on what by watching which fields were read.</p>" +
    '<div id="mx-items"></div>' +
    '<dl class="kv" id="mx-totals" style="margin-top:14px"></dl>' +
    '<p class="demo-h" style="margin-top:18px">Reaction log</p><div class="demo-log" id="mx-log"></div>';
  ctx.el.appendChild(host);

  function renderItems() {
    host.querySelector("#mx-items").innerHTML =
      '<table class="demo-tbl"><thead><tr><th>Item</th><th class="num">Price</th>' +
      '<th class="num">Qty</th><th class="num">Line</th></tr></thead><tbody>' +
      cart.items.map(function (i, idx) {
        return "<tr><td>" + i.name + '</td><td class="num">$' + i.price + "</td>" +
          '<td class="num"><button data-i="' + idx + '" data-d="-1">−</button> ' + i.qty +
          ' <button data-i="' + idx + '" data-d="1">+</button></td>' +
          '<td class="num">$' + (i.price * i.qty) + "</td></tr>";
      }).join("") + "</tbody></table>";
    host.querySelectorAll("#mx-items button").forEach(function (b) {
      b.style.cssText = "background:" + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:5px;width:22px;color:" + T.ink2 + ";cursor:pointer;font:inherit";
      b.addEventListener("click", function () {
        var i = cart.items[+b.dataset.i];
        i.qty = Math.max(0, i.qty + Number(b.dataset.d));
      });
    });
  }

  var logEl = host.querySelector("#mx-log"), n = 0;
  function log(msg) {
    var d = ctx.mk("div", null, '<span class="t">#' + (++n) + "</span> " + msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 6) logEl.removeChild(logEl.lastChild);
  }

  /* autorun re-runs whenever anything it read changes. */
  var d1 = mobx.autorun(function () {
    renderItems();
    host.querySelector("#mx-totals").innerHTML =
      "<dt>items</dt><dd>" + cart.itemCount + "</dd>" +
      "<dt>subtotal</dt><dd>$" + cart.subtotal.toFixed(2) + "</dd>" +
      "<dt>tax (" + Math.round(cart.taxRate * 100) + "%)</dt><dd>$" + cart.tax.toFixed(2) + "</dd>" +
      "<dt>total</dt><dd><b>$" + cart.total.toFixed(2) + "</b></dd>";
  });
  var d2 = mobx.reaction(function () { return cart.total; }, function (v, old) {
    log("total changed <span class=\"t\">$" + old.toFixed(2) + "</span> → <b>$" + v.toFixed(2) + "</b>");
  });
  var d3 = mobx.reaction(function () { return cart.itemCount; }, function (v) {
    log("itemCount is now <b>" + v + "</b>");
  });
  ctx.onDestroy(function () { d1(); d2(); d3(); });

  ctx.range("tax rate", { min: 0, max: 30, value: 20, fmt: function (v) { return v + "%"; } },
            function (v) { cart.taxRate = v / 100; });
  ctx.btn("Add item", function () {
    cart.items.push({ name: "Item " + (cart.items.length + 1),
                      price: 10 + Math.floor(Math.random() * 90), qty: 1 });
  }, true);
  ctx.readout("no selectors, no dependency arrays — the getters are tracked automatically");
};

/* ------------------------------------------------------------------ RxJS */
B.rxjs = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  var R = rxjs, op = rxjs.operators || rxjs;

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Typeahead, the way RxJS wants you to write it</p>' +
    '<p class="demo-p">Type quickly. <code>debounceTime</code> waits for a pause, ' +
    "<code>distinctUntilChanged</code> drops repeats, and <code>switchMap</code> cancels the in-flight " +
    "request when a newer one starts — that last one is the race condition you would otherwise hand-roll.</p>" +
    '<input id="rx-in" placeholder="search…" autocomplete="off" ' +
    'style="width:100%;max-width:380px;background:' + T.sunk + ';border:1px solid ' + T.line +
    ';border-radius:8px;padding:9px 13px;color:' + T.ink + ';font:inherit">' +
    '<div class="demo-cols" style="margin-top:16px">' +
      '<div class="demo-colbox"><h5>keystrokes</h5><div class="demo-log" id="rx-raw"></div></div>' +
      '<div class="demo-colbox"><h5>after debounce + distinct</h5><div class="demo-log" id="rx-deb"></div></div>' +
      '<div class="demo-colbox"><h5>requests (switchMap)</h5><div class="demo-log" id="rx-req"></div></div>' +
    "</div>";
  ctx.el.appendChild(host);

  function logger(id, max) {
    var el = host.querySelector(id);
    return function (msg) {
      var d = ctx.mk("div", null, msg);
      el.insertBefore(d, el.firstChild);
      while (el.children.length > (max || 7)) el.removeChild(el.lastChild);
    };
  }
  var raw = logger("#rx-raw"), deb = logger("#rx-deb"), req = logger("#rx-req");

  var counts = { raw: 0, deb: 0, req: 0, cancelled: 0 };
  var out = ctx.readout("");
  function stats() {
    out("keystrokes <b>" + counts.raw + "</b> · debounced <b>" + counts.deb +
        "</b> · requests <b>" + counts.req + "</b> · cancelled <b>" + counts.cancelled + "</b>");
  }
  stats();

  var input = host.querySelector("#rx-in");
  var debounceMs = 350;

  var sub = R.fromEvent(input, "input").pipe(
    op.map(function (e) { return e.target.value.trim(); }),
    op.tap(function (v) { counts.raw++; raw('<span class="t">' + Date.now() % 100000 + "</span> " + (v || "∅")); stats(); }),
    op.debounceTime(debounceMs),
    op.distinctUntilChanged(),
    op.filter(function (v) { return v.length > 0; }),
    op.tap(function (v) { counts.deb++; deb('<span class="m">' + v + "</span>"); stats(); }),
    op.switchMap(function (v) {
      counts.req++;
      req("→ " + v);
      stats();
      /* A fake request that takes a moment, so cancellation is visible. */
      return R.timer(650).pipe(
        op.map(function () { return v + " → " + (3 + v.length) + " results"; }),
        op.finalize(function () {
          if (!done[v]) { counts.cancelled++; req('<span style="color:' + T.bad + '">✕ ' + v + " cancelled</span>"); stats(); }
        })
      );
    })
  ).subscribe(function (result) {
    done[result.split(" →")[0]] = true;
    req('<span style="color:' + T.yes + '">✓ ' + result + "</span>");
    stats();
  });
  var done = {};
  ctx.onDestroy(function () { sub.unsubscribe(); });

  ctx.range("debounce", { min: 0, max: 900, step: 50, value: 350,
                          fmt: function (v) { return v + " ms"; } },
            function (v) { debounceMs = v; out("reload the page to apply — the pipe is built once"); });
  ctx.btn("Type for me", function () {
    var text = "rxjs", i = 0;
    input.value = "";
    var id = setInterval(function () {
      if (i >= text.length) { clearInterval(id); return; }
      input.value += text[i++];
      input.dispatchEvent(new Event("input"));
    }, 90);
  }, true);
};

/* ----------------------------------------------------------------- Immer */
B.immer = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  var produce = Immer.produce;

  var base = {
    user: { name: "Ada", prefs: { theme: "dark", density: "compact" } },
    todos: [{ id: 1, text: "Ship it", done: false }, { id: 2, text: "Write tests", done: true }],
    meta: { version: 3 }
  };

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">The same update, two ways</p>' +
    '<div class="demo-cols">' +
      '<div class="demo-colbox"><h5>by hand</h5><pre class="demo-pre" style="font-size:11px">' +
        ctx.esc([
          "const next = {",
          "  ...state,",
          "  user: {",
          "    ...state.user,",
          "    prefs: { ...state.user.prefs,",
          "             theme: 'light' }",
          "  },",
          "  todos: state.todos.map(t =>",
          "    t.id === 1 ? {...t, done: true} : t)",
          "};"
        ].join("\n")) + "</pre></div>" +
      '<div class="demo-colbox"><h5>with produce()</h5><pre class="demo-pre" style="font-size:11px">' +
        ctx.esc([
          "const next = produce(state, d => {",
          "  d.user.prefs.theme = 'light';",
          "  d.todos[0].done = true;",
          "});"
        ].join("\n")) + "</pre></div>" +
    "</div>" +
    '<p class="demo-h" style="margin-top:18px">Structural sharing</p>' +
    '<p class="demo-p">Immer only copies what you touched. Everything else is the same object as before, ' +
    "which is exactly what makes reference equality checks work.</p>" +
    '<table class="demo-tbl" id="im-share"></table>' +
    '<p class="demo-h" style="margin-top:18px">Patches</p>' +
    '<p class="demo-note">produceWithPatches records the change as a JSON-Patch-like list — enough to ' +
    "replay it on a server or drive an undo stack.</p>" +
    '<pre class="demo-pre" id="im-patches"></pre>';
  ctx.el.appendChild(host);

  function run() {
    var result = Immer.produceWithPatches(base, function (d) {
      d.user.prefs.theme = d.user.prefs.theme === "dark" ? "light" : "dark";
      d.todos[0].done = !d.todos[0].done;
    });
    var next = result[0], patches = result[1], inverse = result[2];

    var rows = [
      ["state", base !== next],
      ["state.user", base.user !== next.user],
      ["state.user.prefs", base.user.prefs !== next.user.prefs],
      ["state.todos", base.todos !== next.todos],
      ["state.todos[0]", base.todos[0] !== next.todos[0]],
      ["state.todos[1]", base.todos[1] !== next.todos[1]],
      ["state.meta", base.meta !== next.meta]
    ];
    host.querySelector("#im-share").innerHTML =
      "<thead><tr><th>path</th><th>new object?</th></tr></thead><tbody>" +
      rows.map(function (r) {
        return "<tr><td><code>" + r[0] + '</code></td><td style="color:' + (r[1] ? T.part : T.yes) + '">' +
          (r[1] ? "copied" : "same reference") + "</td></tr>";
      }).join("") + "</tbody>";

    host.querySelector("#im-patches").textContent =
      "patches:\n" + JSON.stringify(patches, null, 1) +
      "\n\ninverse (for undo):\n" + JSON.stringify(inverse, null, 1);

    out("<b>" + rows.filter(function (r) { return r[1]; }).length + "</b> of " + rows.length +
        " objects copied · the rest were reused");
    base = next;
  }
  var out = ctx.readout("");
  Immer.enablePatches && Immer.enablePatches();
  run();

  ctx.btn("Apply another update", run, true);
};

/* ------------------------------------------------------------ Nano Stores */
B.nanostores = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  var N = NanoStores;

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Lazy by design</p>' +
    '<p class="demo-p">A Nano Store with no listeners does no work at all. Mount and unmount the ' +
    "subscriber below and watch the lifecycle log — the computed store stops recomputing entirely.</p>" +
    '<div class="demo-cols">' +
      '<div class="demo-colbox"><h5>atom: $price</h5><div style="font-size:22px;font-weight:700" id="ns-price"></div></div>' +
      '<div class="demo-colbox"><h5>computed: $withTax</h5><div style="font-size:22px;font-weight:700" id="ns-tax">—</div>' +
        '<div class="demo-note" id="ns-status">not mounted</div></div>' +
    "</div>" +
    '<p class="demo-h" style="margin-top:18px">Lifecycle</p><div class="demo-log" id="ns-log"></div>';
  ctx.el.appendChild(host);

  var logEl = host.querySelector("#ns-log");
  function log(msg) {
    var d = ctx.mk("div", null, msg);
    logEl.insertBefore(d, logEl.firstChild);
    while (logEl.children.length > 8) logEl.removeChild(logEl.lastChild);
  }

  var $price = N.atom(100);
  var computes = 0;
  var $withTax = N.computed($price, function (p) {
    computes++;
    log('<span class="m">computed</span> ran (' + computes + " total)");
    return Math.round(p * 1.2 * 100) / 100;
  });

  N.onMount($withTax, function () {
    log("$withTax <b>mounted</b> — it will start tracking now");
    host.querySelector("#ns-status").textContent = "mounted";
    return function () {
      log("$withTax <b>unmounted</b> — it stops computing entirely");
      host.querySelector("#ns-status").textContent = "not mounted";
      host.querySelector("#ns-tax").textContent = "—";
    };
  });

  var unsub = null;
  function mount() {
    if (unsub) return;
    unsub = $withTax.subscribe(function (v) { host.querySelector("#ns-tax").textContent = "$" + v.toFixed(2); });
  }
  function unmount() { if (unsub) { unsub(); unsub = null; } }
  ctx.onDestroy(unmount);

  var un2 = $price.subscribe(function (v) { host.querySelector("#ns-price").textContent = "$" + v; });
  ctx.onDestroy(un2);
  mount();

  ctx.btn("Change price", function () { $price.set(50 + Math.floor(Math.random() * 200)); }, true);
  ctx.check("subscriber mounted", true, function (v) { v ? mount() : unmount(); });
  ctx.readout("change the price while unmounted — the computed store does not run");
};

})();
