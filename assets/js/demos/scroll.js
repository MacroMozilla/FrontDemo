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

})();
