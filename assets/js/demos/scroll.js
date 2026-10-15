/* Scrolling, layout and gesture-driven surfaces. */
(function () {
"use strict";
var B = window.B;

/* A full-height column: a fixed intro on top, a flexible area below.
   Every demo in this file needs one, because they all own their own
   scroll container rather than borrowing the page's. */
function column(ctx, title, blurb) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "height:100%;display:flex;flex-direction:column;min-height:0";
  var head = ctx.mk("div");
  head.style.cssText = "flex:0 0 auto;margin-bottom:12px";
  head.innerHTML = '<p class="demo-h">' + ctx.esc(title) + "</p>" +
    '<p class="demo-p" style="margin-bottom:0">' + blurb + "</p>";
  var body = ctx.mk("div");
  body.style.cssText = "flex:1 1 auto;min-height:0;position:relative";
  wrap.appendChild(head);
  wrap.appendChild(body);
  ctx.el.appendChild(wrap);
  return body;
}

/* ------------------------------------------------------------------ Lenis */
B.lenis = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var body = column(ctx, "Smooth scrolling without hijacking the page",
    "The panel below is a normal element with <code>overflow:auto</code>. Lenis intercepts the wheel " +
    "and animates <code>scrollTop</code> towards the target — the scrollbar, keyboard keys and anchor " +
    "links all keep working, because nothing was replaced.");

  var wrapper = ctx.mk("div");
  wrapper.style.cssText = "position:absolute;inset:0;overflow:auto;border:1px solid " + T.line +
    ";border-radius:12px;background:" + T.sunk;
  var content = ctx.mk("div");
  content.style.cssText = "padding:22px 26px";
  wrapper.appendChild(content);
  body.appendChild(wrapper);

  var SECTIONS = [
    ["01", "Why smooth scroll at all", "Native wheel scrolling is stepwise: the browser jumps a fixed number of pixels per notch. Interpolating between those steps is the whole trick."],
    ["02", "What Lenis does not do", "It does not create a transformed viewport. The document keeps its real height, so <code>position:sticky</code>, anchors and find-in-page behave."],
    ["03", "The RAF contract", "Lenis exposes <code>raf(time)</code> and expects you to drive it. That means it composes with GSAP's ticker or your own loop instead of fighting it."],
    ["04", "Lerp versus duration", "Two easing models: a per-frame <code>lerp</code> factor, or a <code>duration</code> plus easing function. The select above switches between them."],
    ["05", "Anchor links still work", "Because scroll position is real, <code>scrollIntoView</code> and hash links land where you expect — Lenis just animates the trip."],
    ["06", "Touch is left alone", "By default <code>smoothTouch</code> is off. Mobile browsers already do momentum well, and overriding it feels wrong immediately."],
    ["07", "Reading the state", "Every frame emits scroll offset, limit, velocity and progress. The readout above is wired straight to that event."],
    ["08", "The end", "Scroll back up — the velocity readout goes negative, which is the sign you get momentum for free."]
  ];
  SECTIONS.forEach(function (s, i) {
    var card = ctx.mk("div");
    card.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
      ";border-left:3px solid " + ctx.series(i) + ";border-radius:10px;padding:16px 18px;margin-bottom:14px";
    card.innerHTML = '<div style="font:700 10px ' + T.mono + ";letter-spacing:.14em;color:" +
      ctx.series(i) + ';margin-bottom:6px">SECTION ' + s[0] + "</div>" +
      '<div style="font:600 15px ' + T.sans + ";color:" + T.ink + ';margin-bottom:6px">' + s[1] + "</div>" +
      '<p style="margin:0;font-size:13px;line-height:1.75;color:' + T.ink2 + '">' + s[2] + "</p>";
    content.appendChild(card);
  });

  var out = ctx.readout("scroll the panel");
  var lenis = null, smooth = true, mode = "duration 1.2s";

  var EASINGS = {
    "duration 1.2s": { duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } },
    "duration 2.4s": { duration: 2.4, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } },
    "ease-out cubic": { duration: 1.4, easing: function (t) { return 1 - Math.pow(1 - t, 3); } },
    "lerp 0.06 (slow)": { lerp: 0.06 },
    "lerp 0.2 (snappy)": { lerp: 0.2 }
  };

  function build() {
    if (lenis) { lenis.destroy(); lenis = null; }
    if (!smooth) { out("Lenis <b style='color:" + T.bad + "'>off</b> — native stepwise wheel"); return; }
    var opt = EASINGS[mode];
    lenis = new Lenis(Object.assign({
      wrapper: wrapper, content: content, smoothWheel: true, syncTouch: false
    }, opt));
    lenis.on("scroll", function (e) {
      out("scroll <b>" + Math.round(e.scroll) + "</b> / " + Math.round(e.limit) +
        " &nbsp; progress <b>" + (e.progress * 100).toFixed(0) + "%</b>" +
        " &nbsp; velocity <b style='color:" + (e.velocity < 0 ? T.part : T.yes) + "'>" +
        e.velocity.toFixed(1) + "</b>");
    });
  }
  build();
  ctx.raf(function (dt, now) { if (lenis) lenis.raf(now); });
  ctx.onDestroy(function () { if (lenis) lenis.destroy(); });

  ctx.check("smooth", true, function (v) { smooth = v; build(); });
  ctx.select("easing", Object.keys(EASINGS), function (v) { mode = v; build(); }, mode);
  ctx.btn("Scroll to section 06", function () {
    var target = content.children[5];
    if (lenis) lenis.scrollTo(target, { offset: -20 });
    else wrapper.scrollTo({ top: target.offsetTop - 20, behavior: "smooth" });
  }, true);
  ctx.btn("Top", function () {
    if (lenis) lenis.scrollTo(0); else wrapper.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* -------------------------------------------------------------------- AOS */
B.aos = async function (ctx) {
  var T = ctx.T;
  await ctx.css("aos");
  ctx.mount("pad");
  ctx.tall();

  var body = column(ctx, "Animations declared in markup, not in code",
    "Every card below carries a <code>data-aos</code> attribute and nothing else. AOS adds one class " +
    "when the element crosses the trigger line and removes it when it leaves — the animation itself is " +
    "plain CSS.");

  var wrapper = ctx.mk("div");
  wrapper.style.cssText = "position:absolute;inset:0;overflow:auto;border:1px solid " + T.line +
    ";border-radius:12px;background:" + T.sunk + ";padding:20px 24px";
  body.appendChild(wrapper);

  var lead = ctx.mk("p", "demo-note", "↓ scroll — the first row is already past the line");
  lead.style.cssText = "margin:0 0 16px;text-align:center;font:600 11px " + T.mono + ";color:" + T.muted;
  wrapper.appendChild(lead);

  var ANIMS = [
    "fade-up", "fade-down", "fade-right", "fade-left",
    "fade-up-right", "fade-up-left", "fade-down-right", "fade-down-left",
    "flip-up", "flip-down", "flip-left", "flip-right",
    "zoom-in", "zoom-in-up", "zoom-in-left", "zoom-out",
    "zoom-out-up", "zoom-out-right", "slide-up", "slide-right",
    "slide-down", "slide-left", "zoom-in-right", "zoom-out-left"
  ];
  var grid = ctx.mk("div");
  grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px";
  wrapper.appendChild(grid);

  ANIMS.forEach(function (a, i) {
    var card = ctx.mk("div");
    card.setAttribute("data-aos", a);
    card.setAttribute("data-aos-duration", String(500 + (i % 4) * 200));
    card.setAttribute("data-aos-delay", String((i % 3) * 90));
    card.setAttribute("data-aos-easing", "ease-out-cubic");
    card.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
      ";border-top:3px solid " + ctx.series(i) + ";border-radius:10px;padding:16px";
    card.innerHTML = '<div style="font:700 12.5px ' + T.mono + ";color:" + T.ink + '">' + a + "</div>" +
      '<div style="margin-top:6px;font:500 10.5px ' + T.mono + ";color:" + T.muted + '">' +
      "duration " + (500 + (i % 4) * 200) + "ms · delay " + ((i % 3) * 90) + "ms</div>";
    grid.appendChild(card);
  });

  var tail = ctx.mk("div");
  tail.style.cssText = "height:120px;display:flex;align-items:center;justify-content:center;font:600 11px " +
    T.mono + ";color:" + T.muted;
  tail.textContent = "↑ scroll back up — once:false removes the class again, so it replays";
  wrapper.appendChild(tail);

  /* AOS triggers off window scroll, and this panel is its own scroller.
     Its position maths walks offsetParents and subtracts their scrollTop,
     so calling refresh() on scroll gives it live coordinates; the global
     offset moves the trigger line from the viewport bottom to the panel's. */
  function trigger() {
    var r = wrapper.getBoundingClientRect();
    return Math.max(0, Math.round(window.innerHeight - r.bottom + 40));
  }
  var duration = 700;
  function boot() {
    AOS.init({
      offset: trigger(), once: false, duration: duration,
      easing: "ease-out-cubic", disableMutationObserver: true, startEvent: "fd-aos"
    });
    /* AOS stays dormant until its start event fires; firing it ourselves is
       the documented hook for content that arrives after page load. */
    document.dispatchEvent(new Event("fd-aos"));
    AOS.refresh();
  }
  boot();
  ctx.on(wrapper, "scroll", function () { AOS.refresh(); });
  ctx.onResize(boot);
  ctx.after(60, function () { AOS.refresh(); });
  ctx.onDestroy(function () {
    grid.querySelectorAll("[data-aos]").forEach(function (n) { n.removeAttribute("data-aos"); });
    try { AOS.refreshHard(); } catch (e) {}
  });

  ctx.select("global duration", ["400", "700", "1200", "2000"], function (v) {
    duration = +v;
    boot();
  }, "700");
  ctx.btn("Replay from the top", function () {
    wrapper.scrollTop = wrapper.scrollHeight;
    ctx.after(240, function () { wrapper.scrollTop = 0; AOS.refresh(); });
  }, true);
};

/* --------------------------------------------------------------- Split.js */
B.split = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var body = column(ctx, "Resizable panes in 2 KB",
    "Split.js writes <code>flex-basis</code> on elements you already have and inserts one gutter " +
    "between each pair. There is no wrapper component and no layout engine — drag a gutter and read " +
    "the percentages update.");

  var style = ctx.mk("style");
  style.textContent =
    ".fd-split{display:flex;position:absolute;inset:0}" +
    ".fd-split-v{display:flex;flex-direction:column;height:100%}" +
    ".fd-pane{background:" + T.panel + ";border:1px solid " + T.line + ";border-radius:10px;" +
      "overflow:auto;padding:14px 16px;min-width:0;min-height:0}" +
    ".gutter{background:" + T.sunk + ";border-radius:6px;position:relative;flex:0 0 auto}" +
    ".gutter:hover{background:" + T.accent + "}" +
    ".gutter.gutter-horizontal{cursor:col-resize;margin:0 4px}" +
    ".gutter.gutter-vertical{cursor:row-resize;margin:4px 0}" +
    ".gutter::after{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" +
      "background:" + T.line2 + ";border-radius:2px}" +
    ".gutter.gutter-horizontal::after{width:2px;height:26px}" +
    ".gutter.gutter-vertical::after{width:26px;height:2px}";
  ctx.el.appendChild(style);

  function pane(parent, title, colour, text, body) {
    var p = ctx.mk("div", "fd-pane");
    p.innerHTML = '<div style="font:700 10px ' + T.mono + ";letter-spacing:.14em;color:" + colour +
      ';margin-bottom:8px">' + ctx.esc(title) + "</div>" +
      '<p style="margin:0 0 12px;font-size:12.5px;line-height:1.7;color:' + T.ink2 + '">' + text + "</p>" +
      (body || "");
    parent.appendChild(p);
    return p;
  }

  /* Enough real content that a resize visibly reflows something. */
  var TREE = [["📁", "src", 0], ["📄", "index.html", 1], ["📁", "assets", 1], ["📁", "js", 2],
    ["📄", "app.js", 3], ["📄", "data.js", 3], ["📁", "demos", 3], ["📄", "scroll.js", 4],
    ["📄", "chart.js", 4], ["📁", "css", 2], ["📄", "app.css", 3], ["📁", "vendor", 0],
    ["📄", "split.js", 1], ["📄", "lenis.js", 1], ["📁", "scripts", 0], ["📄", "check.mjs", 1],
    ["📄", "verify.mjs", 1], ["📄", "README.md", 0]];
  var tree = TREE.map(function (r) {
    return '<div style="display:flex;gap:7px;padding:3px 0;padding-left:' + (r[2] * 14) +
      "px;font:500 11.5px " + T.mono + ";color:" + (r[0] === "📁" ? T.ink : T.ink2) + '">' +
      '<span style="opacity:.7">' + r[0] + "</span><span>" + r[1] + "</span></div>";
  }).join("");

  var CODE = [
    ["const", " split = ", "Split", "([left, right], {"],
    ["", "  sizes: ", "[32, 68]", ","],
    ["", "  minSize: ", "90", ","],
    ["", "  gutterSize: ", "10", ","],
    ["", "  onDrag: ", "report", ""],
    ["", "})", "", ""],
    ["", "", "", ""],
    ["const", " nested = ", "Split", "([top, bottom], {"],
    ["", "  direction: ", "'vertical'", ","],
    ["", "  sizes: ", "[58, 42]", ""],
    ["", "})", "", ""]
  ];
  var code = '<pre style="margin:0;font:500 11.5px ' + T.mono + ";line-height:1.85;color:" + T.ink2 +
    ';white-space:pre-wrap">' + CODE.map(function (r, i) {
      return '<span style="color:' + T.muted + ';user-select:none">' +
        String(i + 1).padStart(2, " ") + "  </span>" +
        '<span style="color:' + ctx.series(4) + '">' + r[0] + "</span>" + ctx.esc(r[1]) +
        '<span style="color:' + ctx.series(1) + '">' + ctx.esc(r[2]) + "</span>" + ctx.esc(r[3]);
    }).join("\n") + "</pre>";

  var outer = ctx.mk("div", "fd-split");
  body.appendChild(outer);

  var left = pane(outer, "FILES", ctx.series(0),
    "Drag the gutter on my right. Split.js only ever touches <code>flex-basis</code> on these two elements.",
    tree);
  var rightCol = ctx.mk("div", "fd-split-v");
  rightCol.style.minWidth = "0";
  outer.appendChild(rightCol);

  var top = pane(rightCol, "EDITOR", ctx.series(1),
    "This column is a second, vertical Split instance nested inside the first. Nesting is two calls — " +
    "there is no parent/child relationship to declare.", code);
  var bottom = pane(rightCol, "OUTPUT", ctx.series(3),
    "<code>minSize</code> stops a pane collapsing; <code>snapOffset</code> lets it snap to zero if you " +
    "drag past the minimum.", "");
  var log = ctx.mk("div");
  log.style.cssText = "font:500 11.5px " + T.mono + ";line-height:1.9;color:" + T.ink2;
  bottom.appendChild(log);

  var out = ctx.readout("");
  var sh = null, sv = null;

  function report() {
    if (!sh || !sv) return;
    var h = sh.getSizes(), v = sv.getSizes();
    var line = "horizontal " + h.map(function (x) { return x.toFixed(1) + "%"; }).join(" / ") +
      "  ·  vertical " + v.map(function (x) { return x.toFixed(1) + "%"; }).join(" / ");
    out(line.replace(/([\d.]+%)/g, "<b>$1</b>"));
    var row = ctx.mk("div");
    row.innerHTML = '<span style="color:' + T.muted + '">→ </span>' + ctx.esc(line);
    log.insertBefore(row, log.firstChild);
    while (log.children.length > 14) log.removeChild(log.lastChild);
  }

  function build(gutter, snap) {
    if (sh) sh.destroy();
    if (sv) sv.destroy();
    sh = Split([left, rightCol], {
      sizes: [32, 68], minSize: 90, gutterSize: gutter, snapOffset: snap, onDrag: report
    });
    sv = Split([top, bottom], {
      direction: "vertical", sizes: [58, 42], minSize: 60, gutterSize: gutter,
      snapOffset: snap, onDrag: report
    });
    report();
  }
  build(10, 0);
  ctx.onDestroy(function () { if (sh) sh.destroy(); if (sv) sv.destroy(); });

  ctx.range("gutter", { min: 4, max: 18, value: 10, fmt: function (v) { return v + "px"; } },
    function (v) { build(v, 0); });
  ctx.btn("Reset to 32 / 68", function () { build(10, 0); }, true);
  ctx.btn("Collapse the sidebar", function () { sh.collapse(0); report(); });
};

/* -------------------------------------------------------------- SimpleBar */
B.simplebar = async function (ctx) {
  var T = ctx.T;
  await ctx.css("simplebar");
  ctx.mount("pad");
  ctx.tall();

  var body = column(ctx, "A styled scrollbar over native scrolling",
    "The overlay bar on the right is a div SimpleBar positions from real scroll metrics. Momentum, " +
    "wheel acceleration, keyboard paging and touch all stay with the browser — compare the two panels.");

  var style = ctx.mk("style");
  style.textContent =
    ".simplebar-scrollbar::before{background:" + T.accent + ";opacity:.55}" +
    ".simplebar-scrollbar.simplebar-visible::before{opacity:.9}" +
    ".simplebar-track.simplebar-vertical{width:10px;background:" + T.sunk + ";border-radius:6px}" +
    ".fd-sb-pane{position:absolute;top:0;bottom:0;border:1px solid " + T.line +
      ";border-radius:12px;background:" + T.sunk + ";overflow:hidden}" +
    ".fd-sb-body{padding:16px 20px}" +
    ".fd-native{overflow:auto}";
  ctx.el.appendChild(style);

  function fill(host, label, note) {
    var inner = ctx.mk("div", "fd-sb-body");
    inner.innerHTML = '<div style="font:700 10px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
      ';margin-bottom:10px">' + label + "</div>" +
      '<p class="demo-note" style="margin:0 0 14px">' + note + "</p>";
    for (var i = 0; i < 26; i++) {
      var row = ctx.mk("div");
      row.style.cssText = "display:flex;align-items:center;gap:10px;padding:9px 11px;margin-bottom:7px;" +
        "background:" + T.panel + ";border:1px solid " + T.line + ";border-radius:8px;font:500 12.5px " + T.sans +
        ";color:" + T.ink2;
      row.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:' + ctx.series(i) +
        '"></span><span style="flex:1">Row ' + (i + 1) + "</span>" +
        '<span style="font:600 10.5px ' + T.mono + ";color:" + T.muted + '">' +
        String(1000 + i * 37) + "</span>";
      inner.appendChild(row);
    }
    host.appendChild(inner);
    return inner;
  }

  var a = ctx.mk("div", "fd-sb-pane");
  a.style.cssText += ";left:0;width:calc(50% - 8px)";
  body.appendChild(a);
  fill(a, "SIMPLEBAR", "Overlay bar, drawn by the library. It only appears while you scroll or hover.");
  var sb = new SimpleBar(a, { autoHide: false });

  var b = ctx.mk("div", "fd-sb-pane fd-native");
  b.style.cssText += ";right:0;width:calc(50% - 8px)";
  body.appendChild(b);
  fill(b, "NATIVE SCROLLBAR", "The same markup with the browser's own bar, for comparison.");

  ctx.onDestroy(function () { try { sb.unMount(); } catch (e) {} });

  var out = ctx.readout("");
  var scroller = sb.getScrollElement();
  ctx.on(scroller, "scroll", function () {
    var p = scroller.scrollTop / Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    out("scrollTop <b>" + Math.round(scroller.scrollTop) + "</b> — " + Math.round(p * 100) + "% — " +
      "<span style='color:" + T.muted + "'>native event, not synthesised</span>");
  });
  ctx.check("auto-hide the bar", false, function (v) {
    a.setAttribute("data-simplebar-auto-hide", String(v));
    sb.options.autoHide = v;
    sb.recalculate();
  });
  ctx.btn("Scroll both to the bottom", function () {
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
    b.scrollTo({ top: b.scrollHeight, behavior: "smooth" });
  }, true);
};

/* ------------------------------------------------------------------ Muuri */
B.muuri = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var body = column(ctx, "A grid you can drag, filter and sort",
    "Drag any tile to rearrange it, then filter by colour or sort by value. Muuri animates every tile " +
    "to its new slot with a real layout pass — nothing here is a CSS transition on a fixed grid.");

  var style = ctx.mk("style");
  style.textContent =
    ".fd-muuri{position:absolute;inset:0;overflow:auto;border:1px solid " + T.line +
      ";border-radius:12px;background:" + T.sunk + ";padding:10px}" +
    ".fd-mi{position:absolute;margin:6px;z-index:1}" +
    ".fd-mi.muuri-item-dragging{z-index:3}" +
    ".fd-mi.muuri-item-releasing{z-index:2}" +
    ".fd-mi.muuri-item-hidden{z-index:0}" +
    ".fd-mc{position:relative;width:100%;height:100%;border-radius:10px;cursor:grab;" +
      "display:flex;flex-direction:column;justify-content:space-between;padding:11px 13px;" +
      "border:1px solid " + T.line + ";background:" + T.panel + ";user-select:none}" +
    ".fd-mc:active{cursor:grabbing}";
  ctx.el.appendChild(style);

  var host = ctx.mk("div", "fd-muuri");
  body.appendChild(host);

  /* Names line up with the shared series palette: blue, green, amber, red, violet. */
  var NAMES = ["blue", "green", "amber", "red", "violet"];
  var rnd = ctx.rng(7);
  var items = [];
  for (var i = 0; i < 28; i++) {
    var ci = i % 5;
    var wide = rnd() > 0.72, tall = rnd() > 0.8;
    var val = Math.round(20 + rnd() * 980);
    var it = ctx.mk("div", "fd-mi");
    it.style.width = wide ? "204px" : "96px";
    it.style.height = tall ? "132px" : "96px";
    it.dataset.colour = NAMES[ci];
    it.dataset.value = String(val);
    it.dataset.title = "tile-" + (i + 1);
    var c = ctx.mk("div", "fd-mc");
    c.style.borderTop = "3px solid " + ctx.series(ci);
    c.innerHTML = '<div style="font:700 11px ' + T.mono + ";color:" + ctx.series(ci) + '">' +
      NAMES[ci] + "</div>" +
      '<div><div style="font:700 17px ' + T.sans + ";color:" + T.ink + '">' + val + "</div>" +
      '<div style="font:500 9.5px ' + T.mono + ";color:" + T.muted + '">tile-' + (i + 1) + "</div></div>";
    it.appendChild(c);
    host.appendChild(it);
    items.push(it);
  }

  var grid = new Muuri(host, {
    items: ".fd-mi",
    dragEnabled: true,
    layout: { fillGaps: true, horizontal: false, rounding: true },
    layoutDuration: 380,
    layoutEasing: "cubic-bezier(.22,1,.36,1)",
    dragRelease: { duration: 320, easing: "cubic-bezier(.22,1,.36,1)" },
    dragPlaceholder: { enabled: true, createElement: function (item) {
      var d = document.createElement("div");
      d.style.cssText = "width:100%;height:100%;border-radius:10px;border:1px dashed " + T.accent +
        ";background:" + T.sunk;
      return d;
    } },
    sortData: {
      value: function (item, el) { return parseInt(el.dataset.value, 10); },
      colour: function (item, el) { return el.dataset.colour; }
    }
  });

  var out = ctx.readout("28 of 28 shown");
  function report() {
    out("<b>" + grid.getItems().filter(function (it) { return it.isVisible(); }).length +
      "</b> of 28 shown");
  }
  grid.on("dragEnd", function (item) {
    out("dropped <b>" + item.getElement().dataset.title + "</b> at index <b>" +
      grid.getItems().indexOf(item) + "</b>");
  });

  ctx.onDestroy(function () { grid.destroy(); });
  ctx.onResize(function () { grid.refreshItems().layout(); });

  var opts = ["all"].concat(NAMES);
  ctx.select("filter", opts, function (v) {
    grid.filter(v === "all" ? function () { return true; }
      : function (item) { return item.getElement().dataset.colour === v; });
    ctx.after(30, report);
  }, "all");
  ctx.select("sort", ["as dropped", "value ↑", "value ↓", "colour"], function (v) {
    if (v === "as dropped") return;
    if (v === "colour") grid.sort("colour value");
    else grid.sort("value", { descending: v.indexOf("↓") > 0 });
  }, "as dropped");
  ctx.btn("Shuffle", function () { grid.sort(function () { return rnd() - 0.5; }); }, true);
};

})();
