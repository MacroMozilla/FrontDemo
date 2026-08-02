/* Creative coding, physics, whiteboards and freehand. */
(function () {
"use strict";
var B = window.B;

/* ------------------------------------------------------------------ p5.js */
B.p5 = async function (ctx) {
  var T = ctx.T;
  var particles = [], COUNT = 900, zoff = 0, speed = 1, trails = true;

  /* Instance mode — global mode would scribble all over window. */
  var sketch = function (s) {
    var cols, rows, scl = 22, field = [];

    s.setup = function () {
      var c = s.createCanvas(ctx.el.clientWidth, ctx.el.clientHeight);
      c.parent(ctx.el);
      s.background(T.stage);
      cols = Math.floor(s.width / scl) + 1;
      rows = Math.floor(s.height / scl) + 1;
      reset();
    };

    function reset() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({ x: s.random(s.width), y: s.random(s.height), vx: 0, vy: 0, c: i % 8 });
      }
      s.background(T.stage);
    }
    s._reset = reset;

    s.draw = function () {
      if (trails) { s.noStroke(); s.fill(T.stage + "12"); s.rect(0, 0, s.width, s.height); }
      else s.background(T.stage);

      /* A Perlin-noise flow field: the canonical p5 sketch. */
      var yoff = 0;
      for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
          field[x + y * cols] = s.noise(xoff, yoff, zoff) * Math.PI * 4;
          xoff += .09;
        }
        yoff += .09;
      }
      zoff += .0028 * speed;

      var mx = s.mouseX, my = s.mouseY;
      var pulling = mx > 0 && my > 0 && mx < s.width && my < s.height;

      s.strokeWeight(1.35);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var gx = Math.floor(p.x / scl), gy = Math.floor(p.y / scl);
        var a = field[Math.max(0, Math.min(cols - 1, gx)) + Math.max(0, Math.min(rows - 1, gy)) * cols] || 0;
        p.vx += Math.cos(a) * .11 * speed;
        p.vy += Math.sin(a) * .11 * speed;
        if (pulling) {
          var dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy) || 1;
          if (d < 220) { p.vx += (dx / d) * .34; p.vy += (dy / d) * .34; }
        }
        p.vx *= .93; p.vy *= .93;
        var px = p.x, py = p.y;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) { p.x = s.width; px = p.x; }
        if (p.x > s.width) { p.x = 0; px = p.x; }
        if (p.y < 0) { p.y = s.height; py = p.y; }
        if (p.y > s.height) { p.y = 0; py = p.y; }
        s.stroke(ctx.series(p.c) + "AA");
        s.line(px, py, p.x, p.y);
      }
    };

    s.windowResized = function () {
      s.resizeCanvas(ctx.el.clientWidth, ctx.el.clientHeight);
      cols = Math.floor(s.width / scl) + 1;
      rows = Math.floor(s.height / scl) + 1;
      reset();
    };
  };

  var inst = new p5(sketch);
  ctx.onDestroy(function () { inst.remove(); });

  ctx.range("particles", { min: 200, max: 3000, step: 100, value: 900 }, function (v) {
    COUNT = v; if (inst._reset) inst._reset();
  });
  ctx.range("speed", { min: 2, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { speed = v / 10; });
  ctx.check("trails", true, function (v) { trails = v; });
  ctx.btn("Reset", function () { if (inst._reset) inst._reset(); });
  ctx.readout("a Perlin-noise flow field redrawn in <b>draw()</b> every frame — move the pointer to pull it");

  ctx.onResize(function () { if (inst.windowResized) inst.windowResized(); });
};

/* -------------------------------------------------------------- Matter.js */
B.matter = async function (ctx) {
  var T = ctx.T;
  var M = Matter;
  var W = ctx.el.clientWidth, H = ctx.el.clientHeight;

  var engine = M.Engine.create();
  var render = M.Render.create({
    element: ctx.el, engine: engine,
    options: { width: W, height: H, wireframes: false, background: T.stage, pixelRatio: Math.min(devicePixelRatio || 1, 2) }
  });

  function wall(x, y, w, h) {
    return M.Bodies.rectangle(x, y, w, h, { isStatic: true, render: { fillStyle: T.line } });
  }
  M.Composite.add(engine.world, [
    wall(W / 2, H + 24, W * 2, 50),
    wall(-24, H / 2, 50, H * 2),
    wall(W + 24, H / 2, 50, H * 2),
    M.Bodies.rectangle(W * .32, H * .58, W * .38, 16, {
      isStatic: true, angle: .13, render: { fillStyle: T.line2 } })
  ]);

  function spawn(n) {
    var bodies = [];
    for (var i = 0; i < n; i++) {
      var x = 60 + Math.random() * (W - 120), y = -Math.random() * 400;
      var col = ctx.series(i % 8);
      var kind = i % 3;
      var body = kind === 0 ? M.Bodies.circle(x, y, 12 + Math.random() * 14)
               : kind === 1 ? M.Bodies.rectangle(x, y, 26 + Math.random() * 26, 26 + Math.random() * 26)
               : M.Bodies.polygon(x, y, 5, 18 + Math.random() * 12);
      body.restitution = .55;
      body.friction = .18;
      body.render.fillStyle = col;
      body.render.strokeStyle = T.stage;
      body.render.lineWidth = 1.5;
      bodies.push(body);
    }
    M.Composite.add(engine.world, bodies);
    out("<b>" + M.Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; }).length +
        "</b> rigid bodies being simulated");
  }

  /* The mouse constraint is why this is playable in three lines. */
  var mouse = M.Mouse.create(render.canvas);
  var mc = M.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { stiffness: .16, render: { strokeStyle: ctx.series(0), lineWidth: 2 } }
  });
  M.Composite.add(engine.world, mc);
  render.mouse = mouse;

  var runner = M.Runner.create();
  M.Runner.run(runner, engine);
  M.Render.run(render);

  var out = ctx.readout("");
  spawn(48);

  ctx.range("gravity", { min: -10, max: 20, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "g"; } },
            function (v) { engine.gravity.y = v / 10; });
  ctx.btn("Drop 25 more", function () { spawn(25); });
  ctx.btn("Clear", function () {
    M.Composite.allBodies(engine.world).forEach(function (b) {
      if (!b.isStatic) M.Composite.remove(engine.world, b);
    });
    out("<b>0</b> rigid bodies being simulated");
  });

  ctx.onDestroy(function () {
    M.Render.stop(render);
    M.Runner.stop(runner);
    M.Engine.clear(engine);
    render.canvas.remove();
  });
};

/* ------------------------------------------------------------------- Zdog */
B.zdog = async function (ctx) {
  var T = ctx.T;
  var cv = ctx.mk("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block";
  ctx.el.appendChild(cv);

  var dpr = Math.min(devicePixelRatio || 1, 2);
  function size() {
    cv.width = ctx.el.clientWidth * dpr;
    cv.height = ctx.el.clientHeight * dpr;
  }
  size();

  var illo = new Zdog.Illustration({
    element: cv, dragRotate: true, resize: false,
    zoom: dpr * Math.min(ctx.el.clientWidth, ctx.el.clientHeight) / 300
  });

  /* Real 3D maths, deliberately flat-shaded output. */
  var box = new Zdog.Box({
    addTo: illo, width: 80, height: 80, depth: 80, stroke: false,
    color: ctx.series(0),
    leftFace: ctx.series(1), rightFace: ctx.series(2),
    topFace: ctx.series(4), bottomFace: ctx.series(3)
  });
  new Zdog.Ellipse({ addTo: illo, diameter: 150, translate: { z: -10 },
                     stroke: 8, color: ctx.series(5) });
  var ring = new Zdog.Ellipse({ addTo: illo, diameter: 190, rotate: { x: Zdog.TAU / 4 },
                                stroke: 6, color: ctx.series(7) });
  for (var i = 0; i < 6; i++) {
    new Zdog.Shape({
      addTo: illo, stroke: 14, color: ctx.series(i % 8),
      translate: { x: Math.cos(i / 6 * Zdog.TAU) * 120, y: Math.sin(i / 6 * Zdog.TAU) * 120 }
    });
  }

  var spin = true, rate = 1;
  ctx.raf(function () {
    if (spin) illo.rotate.y += .014 * rate;
    ring.rotate.z += .01 * rate;
    illo.updateRenderGraph();
  });

  ctx.check("auto-spin", true, function (v) { spin = v; });
  ctx.range("speed", { min: 0, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { rate = v / 10; });
  ctx.readout("29 KB · drag to rotate — this is real 3D, just drawn without lighting");

  ctx.onResize(function () {
    size();
    illo.zoom = dpr * Math.min(ctx.el.clientWidth, ctx.el.clientHeight) / 300;
    illo.updateRenderGraph();
  });
};

/* ---------------------------------------------------------------- Rough.js */
B.rough = async function (ctx) {
  var T = ctx.T;
  var c = ctx.canvas(ctx.el, function () { draw(); });
  var rc = rough.canvas(c.cv);
  var roughness = 1.4, fillStyle = "hachure", seed = 1;

  function draw() {
    var W = c.w, H = c.h;
    c.g.clearRect(0, 0, W, H);
    var opt = function (i, extra) {
      return Object.assign({
        stroke: ctx.series(i % 8), strokeWidth: 2,
        fill: ctx.series(i % 8), fillStyle: fillStyle, fillWeight: 1.6,
        hachureGap: 6, roughness: roughness, seed: seed + i
      }, extra || {});
    };
    var cw = W / 4, ch = H / 2;
    rc.rectangle(cw * .25, ch * .2, cw * .55, ch * .55, opt(0));
    rc.circle(cw * 1.5, ch * .48, Math.min(cw, ch) * .55, opt(1));
    rc.polygon([[cw * 2.2, ch * .8], [cw * 2.55, ch * .18], [cw * 2.9, ch * .8]], opt(4));
    rc.ellipse(cw * 3.5, ch * .48, cw * .6, ch * .48, opt(3));
    rc.linearPath([[cw * .3, ch * 1.5], [cw * .9, ch * 1.15], [cw * 1.5, ch * 1.7],
                   [cw * 2.1, ch * 1.2], [cw * 2.7, ch * 1.55]],
                  opt(5, { strokeWidth: 3, fill: undefined }));
    rc.arc(cw * 3.4, ch * 1.45, cw * .8, ch * .7, Math.PI, Math.PI * 1.85, true, opt(6));

    c.g.fillStyle = T.muted;
    c.g.font = "12px " + T.mono;
    c.g.fillText("roughness " + roughness.toFixed(1) + " · fill “" + fillStyle + "” · seed " + seed, 14, H - 14);
  }
  draw();

  ctx.range("roughness", { min: 0, max: 40, value: 14, fmt: function (v) { return (v / 10).toFixed(1); } },
            function (v) { roughness = v / 10; draw(); });
  ctx.select("fill", ["hachure", "solid", "zigzag", "cross-hatch", "dots", "dashed", "zigzag-line"],
             function (v) { fillStyle = v; draw(); }, "hachure");
  ctx.btn("Redraw", function () { seed = Math.floor(Math.random() * 9999); draw(); }, true);
  ctx.readout("every stroke is regenerated from a seed — press Redraw and nothing repeats");
};

/* ------------------------------------------------------------- Excalidraw */
B.exc = async function (ctx) {
  var Ex = window.ExcalidrawLib;
  var h = React.createElement;
  var root = ReactDOM.createRoot(ctx.el);
  ctx.tall();

  var api = null;
  root.render(h("div", { style: { width: "100%", height: "100%" } },
    h(Ex.Excalidraw, {
      theme: ctx.dark ? "dark" : "light",
      excalidrawAPI: function (a) { api = a; },
      initialData: {
        appState: { viewBackgroundColor: ctx.T.stage, currentItemStrokeColor: ctx.series(0) },
        scrollToContent: true
      },
      UIOptions: { canvasActions: { loadScene: false, saveToActiveFile: false, export: false } }
    })));
  ctx.onDestroy(function () { root.unmount(); });

  var out = ctx.readout("pick a tool on the left and draw — the wobble is Rough.js running live");
  ctx.btn("Count elements", function () {
    if (!api) return;
    var els = api.getSceneElements();
    out("<b>" + els.length + "</b> elements in the scene · " +
        "types: " + Array.from(new Set(els.map(function (e) { return e.type; }))).join(", "));
  });
  ctx.btn("Clear canvas", function () { if (api) api.resetScene(); });
};

/* -------------------------------------------------------- perfect-freehand */
B.pf = async function (ctx) {
  var T = ctx.T;
  var getStroke = Freehand.getStroke || Freehand.default || Freehand;

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.style.cssText = "display:block;touch-action:none;cursor:crosshair";
  ctx.el.appendChild(svg);

  var opts = { size: 18, thinning: .62, smoothing: .5, streamline: .5, simulatePressure: true };
  var strokes = [], points = null, path = null, colour = 0;

  /* perfect-freehand hands back an outline polygon; turning that into a
     path is your job, and it is about six lines. */
  function toPath(stroke) {
    if (!stroke.length) return "";
    var d = stroke.reduce(function (acc, p0, i, arr) {
      var p1 = arr[(i + 1) % arr.length];
      acc.push(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
      return acc;
    }, ["M", stroke[0][0], stroke[0][1], "Q"]);
    d.push("Z");
    return d.join(" ");
  }

  function render(el, pts) {
    el.setAttribute("d", toPath(getStroke(pts, opts)));
  }

  function pt(e) {
    var r = svg.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top, e.pressure === 0 ? .5 : (e.pressure || .5)];
  }

  ctx.on(svg, "pointerdown", function (e) {
    svg.setPointerCapture(e.pointerId);
    points = [pt(e)];
    path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", ctx.series(colour++ % 8));
    svg.appendChild(path);
    render(path, points);
  });
  ctx.on(svg, "pointermove", function (e) {
    if (!points) return;
    points.push(pt(e));
    render(path, points);
    out("<b>" + points.length + "</b> input points → <b>" +
        getStroke(points, opts).length + "</b> outline points");
  });
  ctx.on(svg, "pointerup", function () {
    if (points) strokes.push({ pts: points, el: path });
    points = null; path = null;
  });

  /* Seed one stroke so the panel is never empty on arrival. */
  (function seed() {
    var pts = [];
    for (var i = 0; i <= 90; i++) {
      var t = i / 90;
      pts.push([70 + t * (ctx.el.clientWidth - 160),
                ctx.el.clientHeight / 2 + Math.sin(t * Math.PI * 2.4) * 70,
                .25 + Math.abs(Math.sin(t * Math.PI * 2)) * .75]);
    }
    var el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("fill", ctx.series(colour++ % 8));
    svg.appendChild(el);
    render(el, pts);
    strokes.push({ pts: pts, el: el });
  })();

  function reflow() { strokes.forEach(function (s) { render(s.el, s.pts); }); }

  var out = ctx.readout("draw in the panel — move fast and the stroke thins");
  ctx.range("size", { min: 4, max: 46, value: 18 }, function (v) { opts.size = v; reflow(); });
  ctx.range("thinning", { min: -100, max: 100, value: 62, fmt: function (v) { return (v / 100).toFixed(2); } },
            function (v) { opts.thinning = v / 100; reflow(); });
  ctx.range("streamline", { min: 0, max: 99, value: 50, fmt: function (v) { return (v / 100).toFixed(2); } },
            function (v) { opts.streamline = v / 100; reflow(); });
  ctx.btn("Clear", function () {
    strokes.forEach(function (s) { s.el.remove(); });
    strokes = [];
    out("draw in the panel — move fast and the stroke thins");
  });
};

})();
