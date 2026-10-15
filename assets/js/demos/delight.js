/* Micro-interactions: the small motions that make a page feel finished. */
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
function button(ctx, parent, label, fn, primary) {
  var T = ctx.T;
  var b = ctx.mk("button", null, ctx.esc(label));
  b.type = "button";
  b.style.cssText = "background:" + (primary ? T.accent : T.sunk) + ";border:1px solid " +
    (primary ? T.accent : T.line) + ";border-radius:8px;padding:8px 14px;font:600 12.5px " +
    T.sans + ";color:" + (primary ? (T.dark ? "#0b0e14" : "#fff") : T.ink2) + ";cursor:pointer";
  b.addEventListener("click", fn);
  parent.appendChild(b);
  return b;
}

/* -------------------------------------------------------- canvas-confetti */
B.confetti = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var wrap = ctx.mk("div");
  wrap.style.cssText = "height:100%;display:flex;flex-direction:column;min-height:0";
  wrap.innerHTML = '<p class="demo-h" style="flex:0 0 auto">Every preset from the docs, on one canvas</p>' +
    '<p class="demo-p" style="flex:0 0 auto">The confetti is bound to its own canvas, so it stays inside ' +
    "this panel instead of covering the page. Each button is a different combination of particle count, " +
    "spread, origin, gravity and shape — the physics is the same in all of them.</p>";
  ctx.el.appendChild(wrap);

  var stageBox = ctx.mk("div");
  stageBox.style.cssText = "flex:1 1 auto;min-height:0;position:relative;border:1px solid " + T.line +
    ";border-radius:12px;overflow:hidden;background:" + T.sunk;
  wrap.appendChild(stageBox);

  var cv = ctx.mk("canvas");
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%";
  stageBox.appendChild(cv);

  var centre = ctx.mk("div");
  centre.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;" +
    "pointer-events:none;font:700 34px " + T.sans + ";color:" + T.ink + ";opacity:.16;letter-spacing:.02em";
  centre.textContent = "🎉";
  stageBox.appendChild(centre);

  var fire = confetti.create(cv, { resize: true, useWorker: false });
  ctx.onDestroy(function () { fire.reset(); });

  var COLOURS = T.series.slice(0, 6);
  var out = ctx.readout("pick a preset");
  var running = [];
  function stopAll() {
    running.forEach(clearInterval);
    running = [];
    fire.reset();
  }
  ctx.onDestroy(stopAll);

  var PRESETS = {
    "basic burst": function () {
      fire({ particleCount: 140, spread: 70, origin: { y: 0.62 }, colors: COLOURS });
    },
    "random direction": function () {
      for (var i = 0; i < 3; i++) {
        fire({
          particleCount: 60, angle: 60 + i * 60, spread: 55,
          origin: { x: 0.2 + i * 0.3, y: 0.7 }, colors: COLOURS
        });
      }
    },
    "realistic": function () {
      var count = 200, defaults = { origin: { y: 0.7 }, colors: COLOURS };
      function shot(ratio, opts) {
        fire(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * ratio)
        }));
      }
      shot(0.25, { spread: 26, startVelocity: 55 });
      shot(0.2, { spread: 60 });
      shot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      shot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      shot(0.1, { spread: 120, startVelocity: 45 });
    },
    "fireworks (5 s)": function () {
      var end = Date.now() + 5000;
      var id = setInterval(function () {
        if (Date.now() > end) { clearInterval(id); return; }
        fire({
          particleCount: 55, startVelocity: 30, spread: 360, ticks: 60,
          origin: { x: 0.15 + Math.random() * 0.7, y: Math.random() * 0.5 },
          colors: COLOURS
        });
      }, 260);
      running.push(id);
    },
    "school pride (5 s)": function () {
      var end = Date.now() + 5000;
      var id = setInterval(function () {
        if (Date.now() > end) { clearInterval(id); return; }
        fire({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: COLOURS.slice(0, 3) });
        fire({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: COLOURS.slice(3) });
      }, 26);
      running.push(id);
    },
    "snow (8 s)": function () {
      var end = Date.now() + 8000, skew = 1;
      (function frame() {
        if (Date.now() > end) return;
        skew = Math.max(0.8, skew - 0.001);
        fire({
          particleCount: 1, startVelocity: 0, ticks: 300, gravity: 0.35,
          origin: { x: Math.random(), y: Math.random() * skew - 0.2 },
          colors: [T.ink], shapes: ["circle"], scalar: 0.5 + Math.random()
        });
        requestAnimationFrame(frame);
      })();
    },
    "stars": function () {
      var defaults = {
        spread: 360, ticks: 60, gravity: 0, decay: 0.94, startVelocity: 26,
        colors: COLOURS, shapes: ["star"]
      };
      function shoot() {
        fire(Object.assign({}, defaults, { particleCount: 40, scalar: 1.2 }));
        fire(Object.assign({}, defaults, { particleCount: 10, scalar: 0.75, shapes: ["circle"] }));
      }
      shoot();
      ctx.after(100, shoot);
      ctx.after(200, shoot);
    },
    "custom shapes": function () {
      var heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
      var bolt = confetti.shapeFromText({ text: "⚡", scalar: 2 });
      var tri = confetti.shapeFromPath({ path: "M0 10 L5 0 L10 10 Z" });
      fire({
        particleCount: 90, spread: 90, origin: { y: 0.65 },
        shapes: [heart, bolt, tri], scalar: 2, colors: COLOURS
      });
    },
    "emoji rain (5 s)": function () {
      var shapes = ["🚀", "✨", "💡", "📦"].map(function (t) {
        return confetti.shapeFromText({ text: t, scalar: 2.4 });
      });
      var end = Date.now() + 5000;
      var id = setInterval(function () {
        if (Date.now() > end) { clearInterval(id); return; }
        fire({
          particleCount: 2, startVelocity: 0, gravity: 0.5, ticks: 220,
          origin: { x: Math.random(), y: -0.1 }, shapes: shapes, scalar: 2.4, flat: true
        });
      }, 120);
      running.push(id);
    }
  };

  var names = Object.keys(PRESETS);
  var row = ctx.mk("div");
  row.style.cssText = "position:absolute;left:12px;right:12px;bottom:12px;display:flex;gap:8px;flex-wrap:wrap";
  stageBox.appendChild(row);
  names.forEach(function (n, i) {
    button(ctx, row, n, function () {
      stopAll();
      PRESETS[n]();
      out("running <b>" + ctx.esc(n) + "</b>");
    }, i === 0);
  });

  ctx.btn("Stop everything", function () { stopAll(); out("stopped"); });
  ctx.select("preset", names, function (v) { stopAll(); PRESETS[v](); out("running <b>" + ctx.esc(v) + "</b>"); }, names[0]);

  PRESETS["realistic"]();
  out("running <b>realistic</b>");
};

/* --------------------------------------------------------------- Typed.js */
B.typed = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Three very different uses of one library</p>' +
    '<p class="demo-p">A marketing headline, a terminal session and a search box that types its own ' +
    "suggestions. Same 12 KB in all three — what changes is the strings, the speeds and whether it " +
    "backspaces or starts a fresh line.</p>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".typed-cursor{color:" + T.accent + ";font-weight:400;opacity:1;animation:fd-blink .7s infinite}" +
    "@keyframes fd-blink{0%,100%{opacity:1}50%{opacity:0}}";
  ctx.el.appendChild(style);

  var instances = [];
  ctx.onDestroy(function () { instances.forEach(function (t) { t.destroy(); }); });

  /* 1 — hero headline */
  var heroCard = card(ctx, ctx.el, "HERO HEADLINE",
    "<code>smartBackspace</code> keeps the shared prefix and only retypes what changed.");
  var hero = ctx.mk("div");
  hero.style.cssText = "font:600 27px " + T.sans + ";color:" + T.ink + ";line-height:1.5;min-height:84px";
  hero.innerHTML = 'Build <span id="fd-typed-hero"></span>';
  heroCard.appendChild(hero);

  /* 2 — terminal */
  var termCard = card(ctx, ctx.el, "TERMINAL SESSION",
    "Strings may contain HTML, so a fake prompt and coloured output cost nothing extra.");
  var term = ctx.mk("div");
  term.style.cssText = "font:500 13px " + T.mono + ";line-height:1.9;color:" + T.ink2 +
    ";background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:10px;padding:14px 16px;" +
    "min-height:150px;white-space:pre-wrap";
  term.innerHTML = '<span id="fd-typed-term"></span>';
  termCard.appendChild(term);

  /* 3 — search suggestions */
  var searchCard = card(ctx, ctx.el, "SEARCH PLACEHOLDER",
    "Typing into a real input via <code>attr: 'placeholder'</code> — the field stays usable.");
  var searchWrap = ctx.mk("div");
  searchWrap.style.cssText = "position:relative;max-width:460px";
  var search = ctx.mk("input");
  search.type = "text";
  search.id = "fd-typed-search";
  search.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line2 +
    ";border-radius:10px;padding:11px 15px 11px 38px;color:" + T.ink + ";font:500 14px " + T.sans +
    ";outline:none";
  var ico = ctx.mk("span");
  ico.textContent = "⌕";
  ico.style.cssText = "position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;color:" + T.muted;
  searchWrap.appendChild(search); searchWrap.appendChild(ico);
  searchCard.appendChild(searchWrap);

  var out = ctx.readout("");
  var typeSpeed = 55, backSpeed = 28;

  function build() {
    instances.forEach(function (t) { t.destroy(); });
    instances = [];

    instances.push(new Typed("#fd-typed-hero", {
      strings: [
        "<b style='color:" + ctx.series(0) + "'>dashboards</b>.",
        "<b style='color:" + ctx.series(1) + "'>data tables</b>.",
        "<b style='color:" + ctx.series(2) + "'>data pipelines</b>.",
        "<b style='color:" + ctx.series(3) + "'>anything you like</b>."
      ],
      typeSpeed: typeSpeed, backSpeed: backSpeed, backDelay: 1400,
      smartBackspace: true, loop: true
    }));

    instances.push(new Typed("#fd-typed-term", {
      strings: [
        "$ npm install typed.js\n" +
        "<span style='color:" + T.muted + "'>added 1 package in 0.9s</span>\n" +
        "$ node build.mjs\n" +
        "<span style='color:" + T.yes + "'>✓</span> bundled 162 demos\n" +
        "<span style='color:" + T.yes + "'>✓</span> 0 errors\n" +
        "$ <span style='color:" + T.accent + "'>deploy</span>",
        "$ git push origin main\n" +
        "<span style='color:" + T.muted + "'>Enumerating objects: 41, done.</span>\n" +
        "<span style='color:" + T.part + "'>→</span> workflow queued\n" +
        "<span style='color:" + T.yes + "'>✓</span> published to Pages\n" +
        "$ <span style='color:" + T.accent + "'>open https://…</span>"
      ],
      typeSpeed: Math.max(6, typeSpeed / 3), backSpeed: 4, backDelay: 2600,
      loop: true, contentType: "html"
    }));

    instances.push(new Typed("#fd-typed-search", {
      strings: ["charting libraries…", "webgl renderers…", "state management…", "date pickers…"],
      typeSpeed: typeSpeed, backSpeed: backSpeed, backDelay: 1300, loop: true,
      attr: "placeholder", bindInputFocusEvents: true
    }));

    out("<b>3</b> instances · type " + typeSpeed + " ms/char · backspace " + backSpeed + " ms/char");
  }
  build();

  ctx.range("type speed", { min: 10, max: 140, value: 55, fmt: function (v) { return v + " ms"; } },
    function (v) { typeSpeed = v; build(); });
  ctx.range("backspace speed", { min: 5, max: 120, value: 28, fmt: function (v) { return v + " ms"; } },
    function (v) { backSpeed = v; build(); });
  ctx.btn("Pause all", function () { instances.forEach(function (t) { t.stop(); }); out("paused"); });
  ctx.btn("Resume", function () { instances.forEach(function (t) { t.start(); }); out("running"); }, true);
  ctx.btn("Restart", build);
};

/* -------------------------------------------------------------- CountUp.js */
B.countup = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Numbers that arrive rather than appear</p>' +
    '<p class="demo-p">Each tile counts from its previous value to its new one. Press "New figures" ' +
    "and they animate from wherever they were — that is <code>update()</code>, and it is the reason " +
    "this beats a CSS transition on a number.</p>";
  ctx.el.appendChild(host);

  var grid = ctx.mk("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px;margin-bottom:16px";
  ctx.el.appendChild(grid);

  var TILES = [
    { label: "Monthly revenue", prefix: "$", suffix: "", decimals: 0, base: 1284000, spread: 0.25 },
    { label: "Active users", prefix: "", suffix: "", decimals: 0, base: 48219, spread: 0.3 },
    { label: "Conversion rate", prefix: "", suffix: "%", decimals: 2, base: 3.84, spread: 0.4 },
    { label: "Avg. response", prefix: "", suffix: " ms", decimals: 1, base: 148.6, spread: 0.5 },
    { label: "Uptime", prefix: "", suffix: "%", decimals: 3, base: 99.982, spread: 0.0002 },
    { label: "Open incidents", prefix: "", suffix: "", decimals: 0, base: 7, spread: 1 }
  ];

  var counters = [], values = [];
  var out = ctx.readout("");
  var duration = 2, easing = true, separator = ",", useGrouping = true;

  function build() {
    grid.innerHTML = "";
    counters = [];
    TILES.forEach(function (t, i) {
      var tile = ctx.mk("div");
      tile.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
        ";border-top:3px solid " + ctx.series(i) + ";border-radius:12px;padding:16px 18px";
      var num = ctx.mk("div");
      num.id = "fd-cu-" + i;
      num.style.cssText = "font:700 30px " + T.mono + ";color:" + T.ink + ";letter-spacing:-.01em";
      num.textContent = "0";
      var lab = ctx.mk("div");
      lab.style.cssText = "font:600 11px " + T.mono + ";letter-spacing:.1em;text-transform:uppercase;color:" +
        T.muted + ";margin-top:7px";
      lab.textContent = t.label;
      tile.appendChild(num); tile.appendChild(lab);
      grid.appendChild(tile);

      var target = values[i] != null ? values[i] : t.base;
      values[i] = target;
      var c = new countUp.CountUp(num, target, {
        startVal: 0, duration: duration, decimalPlaces: t.decimals,
        prefix: t.prefix, suffix: t.suffix, separator: separator,
        useGrouping: useGrouping, useEasing: easing, smartEasingThreshold: 999999999
      });
      if (!c.error) c.start(); else num.textContent = c.error;
      counters.push(c);
    });
    out("<b>" + counters.length + "</b> counters · duration <b>" + duration + " s</b> · easing <b>" +
      (easing ? "on" : "off") + "</b>");
  }
  build();

  var optCard = card(ctx, ctx.el, "THE SAME NUMBER, DIFFERENT OPTIONS",
    "One value rendered by six differently configured instances.");
  var optGrid = ctx.mk("div");
  optGrid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px";
  optCard.appendChild(optGrid);

  var VARIANTS = [
    { t: "plain", o: {} },
    { t: "separator: ' '", o: { separator: " " } },
    { t: "decimal: ',' separator: '.'", o: { separator: ".", decimal: ",", decimalPlaces: 2 } },
    { t: "prefix + suffix", o: { prefix: "€", suffix: " /mo" } },
    { t: "no grouping", o: { useGrouping: false } },
    { t: "no easing, 4 s", o: { useEasing: false, duration: 4 } }
  ];
  var variantCounters = [];
  function buildVariants() {
    optGrid.innerHTML = "";
    variantCounters = [];
    VARIANTS.forEach(function (v, i) {
      var box = ctx.mk("div");
      box.style.cssText = "background:" + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:10px;padding:12px 14px";
      var n = ctx.mk("div");
      n.style.cssText = "font:700 21px " + T.mono + ";color:" + ctx.series(i);
      n.textContent = "0";
      var l = ctx.mk("div");
      l.style.cssText = "font:500 10.5px " + T.mono + ";color:" + T.muted + ";margin-top:5px";
      l.textContent = v.t;
      box.appendChild(n); box.appendChild(l);
      optGrid.appendChild(box);
      var c = new countUp.CountUp(n, 1234567.89, Object.assign({
        duration: 2.6, decimalPlaces: 0, smartEasingThreshold: 999999999
      }, v.o));
      if (!c.error) c.start();
      variantCounters.push(c);
    });
  }
  buildVariants();

  ctx.range("duration", { min: 0.5, max: 6, step: 0.5, value: 2, fmt: function (v) { return v + " s"; } },
    function (v) { duration = v; build(); });
  ctx.check("easing", true, function (v) { easing = v; build(); });
  ctx.check("group thousands", true, function (v) { useGrouping = v; build(); });
  ctx.btn("New figures", function () {
    TILES.forEach(function (t, i) {
      var delta = (Math.random() - 0.4) * t.spread;
      values[i] = Math.max(0, t.base * (1 + delta));
      if (t.decimals === 0) values[i] = Math.round(values[i]);
      counters[i].update(values[i]);
    });
    out("updated in place — each tile animates from its previous value");
  }, true);
  ctx.btn("Reset to zero", function () {
    counters.forEach(function (c) { c.reset(); });
    variantCounters.forEach(function (c) { c.reset(); });
  });
  ctx.btn("Replay all", function () {
    counters.forEach(function (c) { c.reset(); c.start(); });
    buildVariants();
  });
};

/* ------------------------------------------------------------ AutoAnimate */
B.autoanimate = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">One function call, on the parent</p>' +
    '<p class="demo-p">Both lists below run exactly the same add, remove, sort and filter code. The ' +
    "only difference is that <code>autoAnimate()</code> has been called on the left container. There " +
    "are no transitions in the CSS and no animation code in the handlers.</p>";
  ctx.el.appendChild(host);

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  var aCard = card(ctx, colA, "WITH autoAnimate()", "Same markup, same handlers, one extra line.");
  var listA = ctx.mk("div");
  aCard.appendChild(listA);

  var bCard = card(ctx, colB, "WITHOUT", "For comparison — items just appear and disappear.");
  var listB = ctx.mk("div");
  bCard.appendChild(listB);

  var codeCard = card(ctx, ctx.el, "THE ENTIRE INTEGRATION", "");
  codeCard.insertAdjacentHTML("beforeend",
    '<pre class="demo-pre" style="max-height:none">' + ctx.esc(
      "import autoAnimate from '@formkit/auto-animate'\n\n" +
      "const controller = autoAnimate(listEl, { duration: 260, easing: 'ease-in-out' })\n\n" +
      "// later, if you need to turn it off for a bulk update:\n" +
      "controller.disable()\n" +
      "controller.enable()") + "</pre>");

  var NAMES = ["Deploy pipeline", "Search index", "Billing export", "Session cache",
    "Image resizer", "Webhook relay", "Audit log", "Rate limiter", "Feature flags", "Email queue"];
  var STATES = ["healthy", "degraded", "down"];
  var rnd = ctx.rng(23);
  var items = NAMES.slice(0, 6).map(function (n, i) {
    return { id: i + 1, name: n, state: STATES[i % 3], load: Math.round(rnd() * 100) };
  });
  var nextId = 7, filter = "all";

  function row(it) {
    var colour = it.state === "healthy" ? T.yes : it.state === "degraded" ? T.part : T.bad;
    var el = ctx.mk("div");
    el.style.cssText = "display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:7px;" +
      "background:" + T.panel + ";border:1px solid " + T.line + ";border-left:3px solid " + colour +
      ";border-radius:9px;font:500 12.5px " + T.sans + ";color:" + T.ink2;
    el.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:' + colour + '"></span>' +
      '<span style="flex:1 1 auto">' + ctx.esc(it.name) + "</span>" +
      '<span style="font:600 10.5px ' + T.mono + ";color:" + T.muted + '">' + it.load + "%</span>" +
      '<button data-id="' + it.id + '" type="button" style="background:none;border:0;color:' + T.muted +
      ';cursor:pointer;font-size:15px;line-height:1">×</button>';
    el.querySelector("button").addEventListener("click", function () {
      items = items.filter(function (x) { return x.id !== it.id; });
      draw();
    });
    return el;
  }

  function visible() {
    return items.filter(function (it) { return filter === "all" || it.state === filter; });
  }

  function draw() {
    [listA, listB].forEach(function (l) {
      l.innerHTML = "";
      var vis = visible();
      if (!vis.length) {
        l.innerHTML = '<p class="demo-note">nothing matches that filter</p>';
        return;
      }
      vis.forEach(function (it) { l.appendChild(row(it)); });
    });
    out("<b>" + visible().length + "</b> of <b>" + items.length + "</b> shown");
  }

  var out = ctx.readout("");
  var controller = autoAnimate(listA, { duration: 300, easing: "ease-in-out" });
  draw();

  ctx.select("filter", ["all"].concat(STATES), function (v) { filter = v; draw(); }, "all");
  ctx.range("duration", { min: 80, max: 900, step: 20, value: 300, fmt: function (v) { return v + " ms"; } },
    function (v) {
      controller.disable();
      controller = autoAnimate(listA, { duration: v, easing: "ease-in-out" });
      out("duration now <b>" + v + " ms</b>");
    });
  ctx.check("enabled", true, function (v) { v ? controller.enable() : controller.disable(); });
  ctx.btn("Add a service", function () {
    var n = NAMES[items.length % NAMES.length] + " " + nextId;
    items.splice(Math.floor(Math.random() * (items.length + 1)), 0, {
      id: nextId++, name: n, state: STATES[Math.floor(Math.random() * 3)],
      load: Math.round(Math.random() * 100)
    });
    draw();
  }, true);
  ctx.btn("Shuffle", function () {
    items = items.slice().sort(function () { return Math.random() - 0.5; });
    draw();
  });
  ctx.btn("Sort by load", function () {
    items = items.slice().sort(function (a, b) { return b.load - a.load; });
    draw();
  });
  ctx.btn("Remove the first", function () { items = items.slice(1); draw(); });
};

})();
