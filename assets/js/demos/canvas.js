/* 2D canvas and SVG engines. */
(function () {
"use strict";
var B = window.B;

/* ------------------------------------------------------------------ Konva */
B.kv = async function (ctx) {
  var T = ctx.T;
  var stage = new Konva.Stage({ container: ctx.el, width: ctx.el.clientWidth, height: ctx.el.clientHeight });
  var layer = new Konva.Layer();
  stage.add(layer);

  function shadow(node) {
    node.on("dragstart", function () {
      node.moveToTop(); tr.moveToTop();
      node.shadowColor("#000"); node.shadowBlur(18); node.shadowOpacity(.4); node.shadowOffset({ x: 0, y: 6 });
    });
    node.on("dragend", function () { node.shadowBlur(0); node.shadowOpacity(0); });
    return node;
  }

  var shapes = [
    new Konva.Rect({ x: 70, y: 60, width: 140, height: 92, fill: ctx.series(0), cornerRadius: 10, draggable: true }),
    new Konva.Circle({ x: 330, y: 120, radius: 56, fill: ctx.series(1), draggable: true }),
    new Konva.RegularPolygon({ x: 520, y: 120, sides: 6, radius: 60, fill: ctx.series(4), draggable: true }),
    new Konva.Star({ x: 190, y: 290, numPoints: 5, innerRadius: 28, outerRadius: 60,
                     fill: ctx.series(3), draggable: true }),
    new Konva.Text({ x: 330, y: 280, text: "drag me\nthen click to transform", fontSize: 15,
                     fontFamily: T.sans, fill: T.ink2, draggable: true, lineHeight: 1.4 })
  ];
  shapes.forEach(function (s) { layer.add(shadow(s)); });

  /* The Transformer is stock Konva — rotate and scale handles for free. */
  var tr = new Konva.Transformer({
    rotateAnchorOffset: 26, anchorSize: 9,
    anchorFill: T.stage, anchorStroke: T.accent, borderStroke: T.accent, borderDash: [4, 4]
  });
  layer.add(tr);

  stage.on("click tap", function (e) {
    if (e.target === stage) { tr.nodes([]); return; }
    if (e.target === tr) return;
    tr.nodes([e.target]);
  });

  var out = ctx.readout("drag any shape · click one for rotate and scale handles");
  ctx.check("snap to 15°", true, function (on) {
    tr.rotationSnaps(on ? [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180,
                           195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345] : []);
  });
  tr.rotationSnaps([0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180,
                    195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345]);
  ctx.btn("Add shape", function () {
    var s = new Konva.Rect({
      x: 60 + Math.random() * 400, y: 340 + Math.random() * 60,
      width: 70 + Math.random() * 80, height: 50, cornerRadius: 8,
      fill: ctx.series(Math.floor(Math.random() * 8)), draggable: true
    });
    layer.add(shadow(s)); tr.moveToTop();
    out("<b>" + (layer.getChildren().length - 1) + "</b> shapes on one canvas layer");
  });

  function fit() { stage.width(ctx.el.clientWidth); stage.height(ctx.el.clientHeight); }
  ctx.onResize(fit);
  ctx.onDestroy(function () { stage.destroy(); });
};

/* -------------------------------------------------------------- Fabric.js */
B.fb = async function (ctx) {
  var T = ctx.T;
  /* Fabric needs a real, explicitly sized canvas element. */
  var cv = ctx.mk("canvas");
  cv.width = ctx.el.clientWidth;
  cv.height = ctx.el.clientHeight;
  ctx.el.appendChild(cv);

  var F = window.fabric;
  var canvas = new F.Canvas(cv, {
    backgroundColor: T.stage,
    selection: true,
    preserveObjectStacking: true
  });
  F.InteractiveFabricObject && F.InteractiveFabricObject.ownDefaults &&
    Object.assign(F.InteractiveFabricObject.ownDefaults, {
      cornerStyle: "circle", cornerColor: T.stage, cornerStrokeColor: T.accent,
      borderColor: T.accent, cornerSize: 9, transparentCorners: false, borderDashArray: [4, 4]
    });

  function add(o) { canvas.add(o); return o; }
  add(new F.Rect({ left: 60, top: 60, width: 150, height: 100, fill: ctx.series(0), rx: 10, ry: 10 }));
  add(new F.Circle({ left: 260, top: 60, radius: 55, fill: ctx.series(1) }));
  add(new F.Triangle({ left: 400, top: 60, width: 120, height: 110, fill: ctx.series(4) }));
  add(new F.Textbox("Select several objects\nand transform them as a group", {
    left: 60, top: 240, width: 300, fontSize: 17, fill: T.ink2, fontFamily: T.sans, lineHeight: 1.3
  }));
  canvas.renderAll();

  var out = ctx.readout("drag a selection box across several objects, then rotate the group");
  canvas.on("selection:created", report);
  canvas.on("selection:updated", report);
  canvas.on("selection:cleared", function () { out("drag a selection box across several objects"); });
  function report() {
    var a = canvas.getActiveObjects();
    out("<b>" + a.length + "</b> object" + (a.length === 1 ? "" : "s") + " selected");
  }

  ctx.btn("Add shape", function () {
    var kinds = [
      function () { return new F.Rect({ width: 90, height: 70, rx: 8, ry: 8 }); },
      function () { return new F.Circle({ radius: 40 }); },
      function () { return new F.Triangle({ width: 80, height: 80 }); }
    ];
    var o = kinds[Math.floor(Math.random() * 3)]();
    o.set({ left: 40 + Math.random() * 500, top: 320 + Math.random() * 80,
            fill: ctx.series(Math.floor(Math.random() * 8)), angle: Math.random() * 40 - 20 });
    canvas.add(o); canvas.setActiveObject(o); canvas.renderAll();
  });

  /* Serialisation is one of the reasons people choose Fabric. */
  var pre = null;
  ctx.btn("Export JSON", function () {
    var json = JSON.stringify(canvas.toJSON(), null, 1);
    if (!pre) {
      pre = ctx.mk("pre", "demo-pre");
      pre.style.cssText = "position:absolute;right:10px;top:10px;bottom:10px;width:330px;z-index:4";
      ctx.el.appendChild(pre);
    }
    pre.textContent = json.slice(0, 4000);
    out("<b>" + (json.length / 1024).toFixed(1) + " KB</b> of JSON — enough to rebuild the canvas exactly");
  }, true);
  ctx.btn("Delete selected", function () {
    canvas.getActiveObjects().forEach(function (o) { canvas.remove(o); });
    canvas.discardActiveObject(); canvas.renderAll();
  });

  ctx.onResize(function () {
    canvas.setDimensions({ width: ctx.el.clientWidth, height: ctx.el.clientHeight });
  });
  ctx.onDestroy(function () { canvas.dispose(); });
};

/* ----------------------------------------------------------------- PixiJS */
B.px = async function (ctx) {
  var T = ctx.T;
  var app = new PIXI.Application();
  await app.init({
    background: T.stage, resizeTo: ctx.el, antialias: true,
    preference: "webgl", autoDensity: true, resolution: Math.min(devicePixelRatio || 1, 2)
  });
  if (ctx.dead()) { app.destroy(true); return; }
  ctx.el.appendChild(app.canvas);

  /* One texture, thousands of sprites — the classic Pixi throughput demo. */
  var g = new PIXI.Graphics().circle(0, 0, 9).fill(0xffffff);
  var texture = app.renderer.generateTexture(g);

  var container = new PIXI.Container();
  app.stage.addChild(container);

  var sprites = [];
  function build(n) {
    container.removeChildren();
    sprites = [];
    for (var i = 0; i < n; i++) {
      var s = new PIXI.Sprite(texture);
      s.anchor.set(.5);
      s.tint = parseInt(ctx.series(i % 8).slice(1), 16);
      s.scale.set(.35 + Math.random() * .75);
      s.alpha = .55 + Math.random() * .45;
      s._r = 40 + Math.random() * (Math.min(app.screen.width, app.screen.height) / 2 - 40);
      s._a = Math.random() * Math.PI * 2;
      s._v = (.2 + Math.random() * .8) * (Math.random() < .5 ? -1 : 1);
      container.addChild(s);
      sprites.push(s);
    }
  }
  build(2000);

  var speed = 1, frames = 0, last = performance.now();
  var out = ctx.readout("");
  app.ticker.add(function (t) {
    var cx = app.screen.width / 2, cy = app.screen.height / 2;
    for (var i = 0; i < sprites.length; i++) {
      var s = sprites[i];
      s._a += s._v * .006 * speed * t.deltaTime;
      s.x = cx + Math.cos(s._a) * s._r;
      s.y = cy + Math.sin(s._a) * s._r * .62;
    }
    frames++;
    var now = performance.now();
    if (now - last > 500) {
      out("<b>" + sprites.length.toLocaleString() + "</b> sprites · <b>" +
          Math.round(frames * 1000 / (now - last)) + " fps</b> · renderer " + app.renderer.type);
      frames = 0; last = now;
    }
  });

  ctx.select("sprites", ["500", "2000", "10000", "40000"], function (v) { build(+v); }, "2000");
  ctx.range("speed", { min: 0, max: 40, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { speed = v / 10; });

  ctx.onDestroy(function () { app.destroy(true, { children: true, texture: true }); });
};

/* --------------------------------------------------------------- Paper.js */
B.paper = async function (ctx) {
  var T = ctx.T;
  var cv = ctx.mk("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block";
  ctx.el.appendChild(cv);

  var scope = new paper.PaperScope();
  scope.setup(cv);
  var P = scope;

  var W = function () { return P.view.size.width; }, H = function () { return P.view.size.height; };

  var square = new P.Path.Rectangle({
    point: [W() / 2 - 190, H() / 2 - 90], size: [200, 180], radius: 8
  });
  var circle = new P.Path.Circle({ center: [W() / 2 + 20, H() / 2], radius: 95 });

  square.strokeColor = T.line2; square.strokeWidth = 1.2; square.dashArray = [4, 4];
  circle.strokeColor = T.line2; circle.strokeWidth = 1.2; circle.dashArray = [4, 4];

  var op = "unite", result = null;
  function compute() {
    if (result) { result.remove(); result = null; }
    /* Real boolean geometry on curves, not pixel compositing. */
    result = square[op](circle);
    result.fillColor = new P.Color(ctx.series(0));
    result.fillColor.alpha = .82;
    result.strokeColor = ctx.series(0);
    result.strokeWidth = 2;
    result.sendToBack();
    out("<b>" + op + "</b> → the result path has <b>" +
        (result.children ? result.children.reduce(function (a, c) { return a + c.segments.length; }, 0)
                         : result.segments.length) + "</b> segments");
  }
  var out = ctx.readout("");
  compute();

  circle.onMouseDrag = function (e) { circle.position = circle.position.add(e.delta); compute(); };
  square.onMouseDrag = function (e) { square.position = square.position.add(e.delta); compute(); };

  var hint = new P.PointText({
    point: [16, 26], content: "drag either outline", fillColor: T.muted,
    fontFamily: T.mono, fontSize: 11
  });

  ctx.select("operation", ["unite", "subtract", "intersect", "exclude", "divide"],
             function (v) { op = v; compute(); }, "unite");

  ctx.onResize(function () { P.view.viewSize = new P.Size(ctx.el.clientWidth, ctx.el.clientHeight); });
  ctx.onDestroy(function () { P.project.clear(); P.view.remove(); });
};

/* ----------------------------------------------------------------- SVG.js */
B.sv = async function (ctx) {
  var T = ctx.T;
  var draw = SVG().addTo(ctx.el).size("100%", "100%");
  var W = ctx.el.clientWidth, H = ctx.el.clientHeight;

  /* Everything below is one chained expression per shape — the SVG.js pitch. */
  var rect = draw.rect(150, 100).fill(ctx.series(0)).radius(10).move(70, 70).opacity(.9);
  var circle = draw.circle(120).fill(ctx.series(1)).move(280, 60).opacity(.9);
  var poly = draw.polygon("100,0 200,60 165,180 35,180 0,60")
    .fill(ctx.series(4)).move(450, 60).scale(.75).opacity(.9);
  var path = draw.path("M0 0 C 60 -70, 160 -70, 220 0 S 380 70, 440 0")
    .fill("none").stroke({ color: ctx.series(3), width: 4, linecap: "round" })
    .move(80, 300);
  var text = draw.text("chained, like jQuery for SVG")
    .font({ family: T.mono, size: 14, anchor: "start" }).fill(T.ink2).move(80, 380);

  var group = draw.group().add(rect).add(circle).add(poly);

  ctx.btn("Animate", function () {
    rect.animate(900).rotate(360).loop(1, true);
    circle.animate(900).dmove(0, 60).loop(1, true);
    poly.animate(900).scale(1.25).loop(1, true);
    path.animate(1400).plot("M0 0 C 60 70, 160 70, 220 0 S 380 -70, 440 0").loop(1, true);
    text.animate(900).fill(ctx.series(1)).loop(1, true);
  }, true);
  ctx.btn("Recolour", function () {
    [rect, circle, poly].forEach(function (s, i) {
      s.animate(420).fill(ctx.series(Math.floor(Math.random() * 8)));
    });
  });
  ctx.check("show outlines", false, function (on) {
    [rect, circle, poly].forEach(function (s) {
      s.stroke(on ? { color: T.ink, width: 2 } : { width: 0 });
    });
  });
  ctx.readout("<b>" + draw.node.querySelectorAll("*").length + "</b> SVG nodes, all created through the chained API");

  ctx.onDestroy(function () { draw.remove(); });
};

/* ----------------------------------------------------------------- Two.js */
B.tw = async function (ctx) {
  var T = ctx.T;
  var two = null, shapes = [], spin = 0;

  function build(type) {
    if (two) { two.pause(); two.clear(); ctx.el.innerHTML = ""; }
    two = new Two({ type: Two.Types[type], width: ctx.el.clientWidth, height: ctx.el.clientHeight,
                    autostart: true }).appendTo(ctx.el);
    shapes = [];
    var cx = two.width / 2, cy = two.height / 2;
    for (var i = 0; i < 9; i++) {
      var r = 34 + i * 15;
      var poly = two.makePolygon(cx, cy, r, 3 + i);
      poly.noFill();
      poly.stroke = ctx.series(i % 8);
      poly.linewidth = 2.2;
      shapes.push(poly);
    }
    var dot = two.makeCircle(cx, cy, 8);
    dot.fill = T.ink; dot.noStroke();
    two.bind("update", function () {
      spin += .006;
      for (var i = 0; i < shapes.length; i++) shapes[i].rotation = spin * (i % 2 ? 1 : -1) * (1 + i * .16);
    });
    out("renderer: <b>" + type + "</b> — same scene code, different backend");
  }
  var out = ctx.readout("");
  build("Svg");

  ctx.select("renderer", [
    { v: "Svg", t: "SVG" }, { v: "Canvas", t: "Canvas 2D" }, { v: "WebGL", t: "WebGL" }
  ], build, "Svg");

  ctx.onResize(function () { if (two) two.fit(); });
  ctx.onDestroy(function () { if (two) { two.pause(); two.clear(); } });
};

/* ---------------------------------------------------------------- ZRender */
B.zr = async function (ctx) {
  var T = ctx.T;
  var zr = zrender.init(ctx.el);
  zr.setBackgroundColor(T.stage);

  var out = ctx.readout("hover any shape — hit testing and the animation module are both ZRender");

  var items = [];
  function build() {
    zr.clear();
    items = [];
    var W = zr.getWidth(), H = zr.getHeight();
    var n = 26;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2;
      var R = Math.min(W, H) * .32;
      var shape = new zrender.Circle({
        shape: { cx: W / 2 + Math.cos(a) * R, cy: H / 2 + Math.sin(a) * R, r: 6 },
        style: { fill: ctx.series(i % 8), opacity: .9 },
        cursor: "pointer", z: 2
      });
      shape.on("mouseover", function () {
        this.animateTo({ shape: { r: 26 }, style: { opacity: 1 } }, { duration: 240, easing: "elasticOut" });
        out("hover → <b>animateTo</b> with an elasticOut easing, driven by ZRender");
      });
      shape.on("mouseout", function () {
        this.animateTo({ shape: { r: 6 }, style: { opacity: .9 } }, { duration: 320 });
      });
      zr.add(shape);
      items.push(shape);
    }
    var label = new zrender.Text({
      style: { text: "the rendering kernel ECharts is built on", x: W / 2, y: H / 2,
               fill: T.muted, fontFamily: T.mono, fontSize: 12, align: "center", verticalAlign: "middle" }
    });
    zr.add(label);
  }
  build();

  ctx.btn("Pulse all", function () {
    items.forEach(function (s, i) {
      s.animateTo({ shape: { r: 20 } }, { duration: 300, delay: i * 26, easing: "cubicOut" });
      s.animateTo({ shape: { r: 6 } }, { duration: 400, delay: 300 + i * 26, easing: "bounceOut" });
    });
  }, true);

  ctx.onResize(function () { zr.resize(); build(); });
  ctx.onDestroy(function () { zr.dispose(); });
};

})();
