/* Animation. */
(function () {
"use strict";
var B = window.B;

/* ------------------------------------------------------------------- GSAP */
B.gsap = async function (ctx) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;overflow:hidden";
  ctx.el.appendChild(wrap);

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.cssText = "position:absolute;inset:0";
  wrap.appendChild(svg);

  var W = ctx.el.clientWidth, H = ctx.el.clientHeight;
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var d = "M " + (W * .1) + " " + (H * .74) +
          " C " + (W * .3) + " " + (H * .2) + ", " + (W * .6) + " " + (H * 1.1) + ", " + (W * .9) + " " + (H * .32);
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", T.line2);
  path.setAttribute("stroke-width", "1.5");
  path.setAttribute("stroke-dasharray", "5 5");
  svg.appendChild(path);

  var tiles = [];
  for (var i = 0; i < 12; i++) {
    var el = ctx.mk("div");
    el.textContent = String(i + 1);
    el.style.cssText =
      "position:absolute;width:52px;height:52px;border-radius:12px;display:grid;place-items:center;" +
      "font:600 15px " + T.sans + ";color:#0b0e14;background:" + ctx.series(i % 8) + ";" +
      "left:" + (34 + (i % 6) * 66) + "px;top:" + (H - 150 + Math.floor(i / 6) * 66) + "px;opacity:0";
    wrap.appendChild(el);
    tiles.push(el);
  }

  var ball = ctx.mk("div");
  ball.style.cssText = "position:absolute;width:34px;height:34px;border-radius:50%;background:" +
    ctx.series(0) + ";box-shadow:0 0 26px " + ctx.series(0) + "88;left:0;top:0;opacity:0";
  wrap.appendChild(ball);

  var caption = ctx.mk("div");
  caption.style.cssText = "position:absolute;left:26px;top:24px;font:600 22px " + T.sans +
    ";color:" + T.ink + ";opacity:0";
  caption.textContent = "one timeline, three overlapping phases";
  wrap.appendChild(caption);

  var len = path.getTotalLength();
  var tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: .7 });

  /* Sequencing with staggers and relative offsets — the reason people pay
     attention to GSAP. */
  tl.fromTo(caption, { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: .5, ease: "power2.out" })
    .fromTo(tiles,
      { opacity: 0, scale: .3, y: 40, rotation: -25 },
      { opacity: 1, scale: 1, y: 0, rotation: 0, duration: .7, ease: "back.out(1.8)",
        stagger: { each: .06, from: "center" } }, "-=0.2")
    .fromTo(ball, { opacity: 0 }, { opacity: 1, duration: .2 }, "-=0.4")
    .to(ball, {
      duration: 2.1, ease: "power1.inOut",
      motionPath: undefined,           /* MotionPathPlugin is a separate file */
      onUpdate: function () {
        var p = path.getPointAtLength(this.progress() * len);
        gsap.set(ball, { x: p.x - 17, y: p.y - 17 });
      }
    }, "-=0.2")
    .to(tiles, { backgroundColor: T.accent, duration: .35,
                 stagger: { each: .04, from: "edges" } }, "-=1.5")
    .to(tiles, { opacity: 0, scale: .4, y: -30, duration: .5, ease: "power2.in",
                 stagger: { each: .04, from: "end" } })
    .to([ball, caption], { opacity: 0, duration: .35 }, "-=0.4");

  tl.play();

  var scrub = null, out = ctx.readout("");
  ctx.btn("Play", function () { tl.play(); }, true);
  ctx.btn("Pause", function () { tl.pause(); });
  ctx.btn("Restart", function () { tl.restart(); });
  scrub = ctx.range("scrub", { min: 0, max: 1000, value: 0,
                               fmt: function (v) { return (v / 10).toFixed(0) + "%"; } },
                    function (v) { tl.pause(); tl.progress(v / 1000); });
  ctx.range("timeScale", { min: 2, max: 30, value: 10,
                           fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { tl.timeScale(v / 10); });

  ctx.raf(function () {
    if (tl.paused()) return;
    scrub.value = Math.round(tl.progress() * 1000);
    out("timeline <b>" + tl.time().toFixed(2) + "s</b> / " + tl.duration().toFixed(2) + "s");
  });

  ctx.onDestroy(function () { tl.kill(); gsap.killTweensOf(tiles.concat([ball, caption])); });
};

/* ---------------------------------------------------------------- anime.js */
B.anime = async function (ctx) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:44px;flex-wrap:wrap";
  ctx.el.appendChild(wrap);

  /* Left: a grid staggered from its centre. */
  var gridBox = ctx.mk("div");
  var COLS = 11, ROWS = 7;
  gridBox.style.cssText = "display:grid;grid-template-columns:repeat(" + COLS + ",18px);gap:6px";
  wrap.appendChild(gridBox);
  var cells = [];
  for (var i = 0; i < COLS * ROWS; i++) {
    var c = ctx.mk("div");
    c.style.cssText = "width:18px;height:18px;border-radius:5px;background:" + ctx.series(0) + ";opacity:.35";
    gridBox.appendChild(c);
    cells.push(c);
  }

  /* Right: an SVG signature drawn by animating stroke-dashoffset. */
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 260 150");
  svg.setAttribute("width", "300");
  var p = document.createElementNS(svgNS, "path");
  p.setAttribute("d", "M12,110 C40,20 78,20 96,86 C110,136 138,138 152,86 C168,26 208,22 248,58");
  p.setAttribute("fill", "none");
  p.setAttribute("stroke", ctx.series(1));
  p.setAttribute("stroke-width", "5");
  p.setAttribute("stroke-linecap", "round");
  svg.appendChild(p);
  var dot = document.createElementNS(svgNS, "circle");
  dot.setAttribute("r", "7");
  dot.setAttribute("fill", ctx.series(3));
  svg.appendChild(dot);
  wrap.appendChild(svg);

  var gridAnim = null, lineAnim = null;
  function runGrid() {
    if (gridAnim) gridAnim.pause();
    gridAnim = anime({
      targets: cells,
      scale: [{ value: .25, easing: "easeOutSine", duration: 420 },
              { value: 1, easing: "easeInOutQuad", duration: 620 }],
      opacity: [{ value: 1, duration: 420 }, { value: .35, duration: 620 }],
      backgroundColor: [{ value: ctx.series(4), duration: 420 },
                        { value: ctx.series(0), duration: 620 }],
      borderRadius: [{ value: "50%", duration: 420 }, { value: "5px", duration: 620 }],
      delay: anime.stagger(60, { grid: [COLS, ROWS], from: "center" }),
      loop: true
    });
  }
  function runLine() {
    if (lineAnim) lineAnim.pause();
    var len = p.getTotalLength();
    p.setAttribute("stroke-dasharray", len);
    lineAnim = anime({
      targets: p,
      strokeDashoffset: [len, 0],
      easing: "easeInOutSine",
      duration: 2600,
      direction: "alternate",
      loop: true,
      update: function (a) {
        var pt = p.getPointAtLength((a.progress / 100) * len);
        dot.setAttribute("cx", pt.x);
        dot.setAttribute("cy", pt.y);
      }
    });
  }
  runGrid(); runLine();

  ctx.btn("Replay", function () { runGrid(); runLine(); }, true);
  ctx.range("speed", { min: 2, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) {
              if (gridAnim) gridAnim.speed = v / 10;
              if (lineAnim) lineAnim.speed = v / 10;
            });
  ctx.select("stagger from", ["center", "first", "last"], function (v) {
    if (gridAnim) gridAnim.pause();
    gridAnim = anime({
      targets: cells,
      scale: [{ value: .25, duration: 420 }, { value: 1, duration: 620 }],
      opacity: [{ value: 1, duration: 420 }, { value: .35, duration: 620 }],
      backgroundColor: [{ value: ctx.series(4), duration: 420 }, { value: ctx.series(0), duration: 620 }],
      delay: anime.stagger(60, { grid: [COLS, ROWS], from: v }),
      loop: true
    });
  }, "center");
  ctx.readout("left: <b>anime.stagger</b> across a grid · right: <b>stroke-dashoffset</b> on an SVG path");

  ctx.onDestroy(function () {
    if (gridAnim) gridAnim.pause();
    if (lineAnim) lineAnim.pause();
  });
};

/* ----------------------------------------------------------------- Lottie */
B.lottie = async function (ctx) {
  var T = ctx.T;

  /* A Lottie file is just JSON. This one is assembled here so it can use
     the page palette — a real one comes out of After Effects unchanged. */
  function shapeLayer(index, colour, radius, orbit, delay, size) {
    var rgb = [parseInt(colour.slice(1, 3), 16) / 255,
               parseInt(colour.slice(3, 5), 16) / 255,
               parseInt(colour.slice(5, 7), 16) / 255, 1];
    return {
      ddd: 0, ind: index, ty: 4, nm: "dot" + index, sr: 1, ao: 0, bm: 0,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 1, k: [
          { t: delay, s: [0], i: { x: [.4], y: [1] }, o: { x: [.6], y: [0] } },
          { t: delay + 150, s: [360] }
        ] },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 1, k: [
          { t: delay, s: [70, 70, 100], i: { x: [.4], y: [1] }, o: { x: [.6], y: [0] } },
          { t: delay + 75, s: [110, 110, 100], i: { x: [.4], y: [1] }, o: { x: [.6], y: [0] } },
          { t: delay + 150, s: [70, 70, 100] }
        ] }
      },
      shapes: [{
        ty: "gr", nm: "g", np: 3,
        it: [
          { ty: "el", p: { a: 0, k: [0, -orbit] }, s: { a: 0, k: [size, size] }, nm: "ellipse" },
          { ty: "fl", c: { a: 0, k: rgb }, o: { a: 0, k: 82 }, r: 1, nm: "fill" },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
        ]
      }],
      ip: 0, op: 150, st: 0
    };
  }

  var layers = [];
  for (var i = 0; i < 6; i++) {
    layers.push(shapeLayer(i + 1, ctx.series(i), 0, 62 + i * 9, i * 12, 46 - i * 4));
  }
  var data = { v: "5.7.4", fr: 30, ip: 0, op: 150, w: 400, h: 400, nm: "orbit", ddd: 0,
               assets: [], layers: layers };

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center";
  ctx.el.appendChild(host);
  var box = ctx.mk("div");
  box.style.cssText = "width:min(78%,420px);aspect-ratio:1";
  host.appendChild(box);

  var anim = lottie.loadAnimation({
    container: box, renderer: "svg", loop: true, autoplay: true, animationData: data
  });
  ctx.onDestroy(function () { anim.destroy(); });

  var out = ctx.readout("");
  var scrub = ctx.range("frame", { min: 0, max: 149, value: 0,
                                   fmt: function (v) { return v + " / 149"; } },
                        function (v) { anim.goToAndStop(v, true); });

  anim.addEventListener("enterFrame", function (e) {
    scrub.value = Math.round(e.currentTime);
    out("frame <b>" + Math.round(e.currentTime) + "</b> of " + Math.round(anim.totalFrames) +
        " · rendered as <b>SVG</b> at any size");
  });

  ctx.btn("Play", function () { anim.play(); }, true);
  ctx.btn("Pause", function () { anim.pause(); });
  ctx.select("renderer", ["svg", "canvas"], function (v) {
    anim.destroy();
    box.innerHTML = "";
    anim = lottie.loadAnimation({ container: box, renderer: v, loop: true, autoplay: true, animationData: data });
  }, "svg");
  ctx.range("speed", { min: 2, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { anim.setSpeed(v / 10); });
  ctx.select("direction", [{ v: "1", t: "forward" }, { v: "-1", t: "reverse" }],
             function (v) { anim.setDirection(+v); }, "1");
};

/* ----------------------------------------------------------------- Motion */
B.motion = async function (ctx) {
  var T = ctx.T;
  var M = window.Motion;

  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;padding:24px;display:flex;flex-direction:column;gap:18px";
  ctx.el.appendChild(wrap);

  var head = ctx.mk("p", "demo-h", "Layout animation — nothing below is told where to move");
  wrap.appendChild(head);

  var board = ctx.mk("div");
  board.style.cssText = "display:flex;flex-wrap:wrap;gap:12px;align-content:flex-start;flex:1 1 auto";
  wrap.appendChild(board);

  var LABELS = ["fetch", "parse", "validate", "enrich", "dedupe", "score", "rank",
                "cache", "render", "log", "flush", "retry"];
  var boxes = LABELS.map(function (label, i) {
    var b = ctx.mk("div");
    b.textContent = label;
    b.style.cssText =
      "padding:14px 18px;border-radius:12px;font:600 13px " + T.sans + ";color:#0b0e14;" +
      "background:" + ctx.series(i % 8) + ";cursor:pointer;user-select:none";
    board.appendChild(b);
    return b;
  });

  /* Measure → mutate → animate the delta. This is FLIP, done for you. */
  function reorder(next) {
    var before = boxes.map(function (b) { return b.getBoundingClientRect(); });
    next.forEach(function (b) { board.appendChild(b); });
    boxes.forEach(function (b, i) {
      var after = b.getBoundingClientRect();
      var dx = before[i].left - after.left, dy = before[i].top - after.top;
      if (!dx && !dy) return;
      M.animate(b, { x: [dx, 0], y: [dy, 0] },
                { type: "spring", stiffness: 320, damping: 30, mass: .9 });
    });
    out("<b>" + boxes.length + "</b> elements sprung to their new positions");
  }
  var out = ctx.readout("press Shuffle, or click a card to send it to the front");

  boxes.forEach(function (b) {
    b.addEventListener("click", function () {
      var rest = boxes.filter(function (x) { return x !== b; });
      reorder([b].concat(rest));
    });
    M.hover
      ? M.hover(b, function () { M.animate(b, { scale: 1.06 }, { duration: .2 });
                                 return function () { M.animate(b, { scale: 1 }, { duration: .2 }); }; })
      : null;
  });

  ctx.btn("Shuffle", function () {
    var next = boxes.slice().sort(function () { return Math.random() - .5; });
    reorder(next);
  }, true);
  ctx.btn("Sort by length", function () {
    reorder(boxes.slice().sort(function (a, b) { return a.textContent.length - b.textContent.length; }));
  });
  ctx.btn("Restore", function () {
    reorder(boxes.slice());
  });

  /* A separate row showing spring versus tween on the same move. */
  var row = ctx.mk("div");
  row.style.cssText = "display:flex;gap:26px;align-items:center;padding-top:6px;border-top:1px solid " + T.line;
  wrap.appendChild(row);
  ["spring", "tween"].forEach(function (kind, i) {
    var lane = ctx.mk("div");
    lane.style.cssText = "position:relative;flex:1 1 0;height:44px;border-radius:10px;background:" + T.sunk;
    var puck = ctx.mk("div");
    puck.style.cssText = "position:absolute;top:6px;left:6px;width:32px;height:32px;border-radius:9px;background:" +
                          ctx.series(i === 0 ? 1 : 3);
    var tag = ctx.mk("span");
    tag.textContent = kind;
    tag.style.cssText = "position:absolute;right:10px;top:12px;font:11px " + T.mono + ";color:" + T.muted;
    lane.appendChild(puck); lane.appendChild(tag);
    row.appendChild(lane);
    lane._go = function () {
      var far = lane.clientWidth - 44;
      M.animate(puck, { left: [6, far] },
        kind === "spring" ? { type: "spring", stiffness: 220, damping: 14 }
                          : { duration: .7, ease: "easeInOut" })
        .then(function () {
          M.animate(puck, { left: [far, 6] },
            kind === "spring" ? { type: "spring", stiffness: 220, damping: 14 }
                              : { duration: .7, ease: "easeInOut" });
        });
    };
  });
  ctx.btn("Spring vs tween", function () {
    Array.prototype.forEach.call(row.children, function (l) { l._go(); });
  });
};

})();
