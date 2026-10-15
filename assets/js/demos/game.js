/* Games and audio. Nothing here loads an asset — every sprite is drawn
   into a texture and every sound is synthesised into a WAV in the page. */
(function () {
"use strict";
var B = window.B;

function hex(css) { return parseInt(String(css).replace("#", ""), 16); }

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

/* ----------------------------------------------------------------- Phaser */
B.phaser = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var wrap = ctx.mk("div");
  wrap.style.cssText = "height:100%;display:flex;flex-direction:column;min-height:0";
  var intro = ctx.mk("div");
  intro.style.cssText = "flex:0 0 auto;margin-bottom:10px";
  intro.innerHTML = '<p class="demo-h">A whole game loop, no assets</p>' +
    '<p class="demo-p" style="margin-bottom:0">Move the mouse over the board to steer, or leave ' +
    "autopilot on and watch. Arcade physics does the collisions; every sprite here was drawn with " +
    "<code>Graphics.generateTexture()</code> at boot, so the page loads nothing.</p>";
  var boardHost = ctx.mk("div");
  boardHost.style.cssText = "flex:1 1 auto;min-height:0;position:relative;border:1px solid " + T.line +
    ";border-radius:12px;overflow:hidden;background:" + T.stage;
  wrap.appendChild(intro);
  wrap.appendChild(boardHost);
  ctx.el.appendChild(wrap);

  var out = ctx.readout("");
  var W = 900, H = 520;
  var state = { score: 0, lives: 3, level: 1, autopilot: true, speed: 380, rows: 5 };
  var scene = null;

  function report() {
    out("score <b>" + state.score + "</b> · lives <b>" + state.lives + "</b> · level <b>" +
      state.level + "</b> · bricks left <b>" +
      (scene && scene.bricks ? scene.bricks.countActive() : 0) + "</b>");
  }

  var Scene = {
    create: function () {
      var s = this;
      scene = s;

      /* --- textures, drawn once --- */
      function rect(name, w, h, colour, radius) {
        var g = s.add.graphics();
        g.fillStyle(hex(colour), 1);
        g.fillRoundedRect(0, 0, w, h, radius);
        g.generateTexture(name, w, h);
        g.destroy();
      }
      function circle(name, r, colour) {
        var g = s.add.graphics();
        g.fillStyle(hex(colour), 1);
        g.fillCircle(r, r, r);
        g.generateTexture(name, r * 2, r * 2);
        g.destroy();
      }
      rect("paddle", 120, 16, T.accent, 8);
      circle("ball", 9, T.ink);
      for (var i = 0; i < 8; i++) rect("brick" + i, 78, 24, ctx.series(i), 5);
      circle("spark", 4, T.ink);

      /* --- bricks --- */
      s.bricks = s.physics.add.staticGroup();
      s.buildLevel = function (rows) {
        s.bricks.clear(true, true);
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < 10; c++) {
            var b = s.bricks.create(70 + c * 84, 70 + r * 34, "brick" + (r % 8));
            b.setData("points", (rows - r) * 10);
          }
        }
      };
      s.buildLevel(state.rows);

      /* --- paddle --- */
      s.paddle = s.physics.add.image(W / 2, H - 40, "paddle").setImmovable(true);
      s.paddle.body.allowGravity = false;
      s.paddle.setCollideWorldBounds(true);

      /* --- ball --- */
      s.ball = s.physics.add.image(W / 2, H - 70, "ball");
      s.ball.setCollideWorldBounds(true).setBounce(1).setCircle(9);
      s.launch = function () {
        var angle = Phaser.Math.Between(-55, 55) - 90;
        s.physics.velocityFromAngle(angle, state.speed, s.ball.body.velocity);
      };
      s.launch();

      /* --- particles for a bit of feedback --- */
      s.burst = s.add.particles(0, 0, "spark", {
        speed: { min: 40, max: 190 }, lifespan: 420, quantity: 10,
        scale: { start: 1, end: 0 }, emitting: false
      });

      /* --- HUD, drawn by Phaser so it scales with the canvas --- */
      s.hud = s.add.text(16, 12, "", {
        fontFamily: T.mono.replace(/"/g, ""), fontSize: "15px", color: T.ink2
      }).setDepth(5);

      /* --- collisions --- */
      s.physics.add.collider(s.ball, s.paddle, function (ball, paddle) {
        /* Steer off the contact point rather than reflecting straight, so the
           player has some control over the angle. */
        var diff = ball.x - paddle.x;
        ball.setVelocityX(diff * 6);
        var v = ball.body.velocity;
        var mag = Math.sqrt(v.x * v.x + v.y * v.y) || 1;
        ball.setVelocity(v.x / mag * state.speed, v.y / mag * state.speed);
      });
      s.physics.add.collider(s.ball, s.bricks, function (ball, brick) {
        s.burst.emitParticleAt(brick.x, brick.y, 10);
        brick.destroy();
        state.score += brick.getData("points") || 10;
        if (s.bricks.countActive() === 0) {
          state.level++;
          state.speed = Math.min(680, state.speed + 40);
          s.buildLevel(state.rows);
          s.ball.setPosition(W / 2, H - 70);
          s.launch();
        }
        report();
      });

      s.input.on("pointermove", function (p) {
        if (state.autopilot) return;
        s.paddle.x = Phaser.Math.Clamp(p.worldX, 60, W - 60);
      });

      s.reset = function () {
        state.score = 0; state.lives = 3; state.level = 1;
        s.buildLevel(state.rows);
        s.ball.setPosition(W / 2, H - 70);
        s.launch();
        report();
      };
      report();
    },

    update: function () {
      var s = this;
      if (!s.ball) return;
      if (state.autopilot) {
        var target = Phaser.Math.Clamp(s.ball.x, 60, W - 60);
        s.paddle.x += (target - s.paddle.x) * 0.16;
      }
      if (s.ball.y > H - 8) {
        state.lives--;
        if (state.lives <= 0) { s.reset(); return; }
        s.ball.setPosition(W / 2, H - 70);
        s.launch();
        report();
      }
      s.hud.setText("SCORE " + String(state.score).padStart(5, "0") +
        "    LIVES " + state.lives + "    LEVEL " + state.level);
    }
  };

  var game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: boardHost,
    backgroundColor: T.stage,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: W, height: H },
    physics: { default: "arcade", arcade: { gravity: { y: 0 }, debug: false } },
    scene: Scene,
    banner: false
  });
  ctx.onDestroy(function () { game.destroy(true); });

  ctx.check("autopilot", true, function (v) { state.autopilot = v; });
  ctx.range("ball speed", { min: 180, max: 700, value: 380 }, function (v) {
    state.speed = v;
    if (scene && scene.ball) {
      var vel = scene.ball.body.velocity;
      var mag = Math.sqrt(vel.x * vel.x + vel.y * vel.y) || 1;
      scene.ball.setVelocity(vel.x / mag * v, vel.y / mag * v);
    }
  });
  ctx.select("brick rows", ["3", "5", "7"], function (v) {
    state.rows = +v;
    if (scene) { scene.buildLevel(state.rows); report(); }
  }, "5");
  ctx.btn("Restart", function () { if (scene) scene.reset(); }, true);
  ctx.btn("Show physics bodies", function () {
    if (!scene) return;
    var d = scene.physics.world.drawDebug = !scene.physics.world.drawDebug;
    if (d && !scene.physics.world.debugGraphic) scene.physics.world.createDebugGraphic();
    if (scene.physics.world.debugGraphic) scene.physics.world.debugGraphic.setVisible(d);
  });
};

/* --------------------------------------------------------------- Howler.js */
B.howler = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">One file, many sounds — audio sprites</p>' +
    '<p class="demo-p">The drum kit below is a single WAV with four sounds laid out at known offsets. ' +
    "Howler plays a slice by name, so a whole kit costs one request and one decode. Nothing was " +
    "downloaded: the samples are synthesised in the page and encoded to WAV in a few lines.</p>" +
    '<p class="demo-note" style="margin-top:-4px">Browsers keep audio muted until you interact with ' +
    "the page — press a pad or hit play and Howler's <code>autoUnlock</code> takes care of the rest.</p>";
  ctx.el.appendChild(host);

  /* ---------- synthesis ---------- */
  var RATE = 22050;
  function encodeWav(samples, rate) {
    var buf = new ArrayBuffer(44 + samples.length * 2);
    var v = new DataView(buf);
    function str(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE");
    str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true);
    v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    str(36, "data"); v.setUint32(40, samples.length * 2, true);
    for (var i = 0; i < samples.length; i++) {
      var s = Math.max(-1, Math.min(1, samples[i]));
      v.setInt16(44 + i * 2, s * 0x7fff, true);
    }
    return new Blob([buf], { type: "audio/wav" });
  }
  function silence(ms) { return new Float32Array(Math.round(RATE * ms / 1000)); }
  function render(ms, fn) {
    var n = Math.round(RATE * ms / 1000);
    var a = new Float32Array(n);
    for (var i = 0; i < n; i++) a[i] = fn(i / RATE, i / n);
    return a;
  }
  function concat(parts) {
    var n = parts.reduce(function (a, p) { return a + p.length; }, 0);
    var out2 = new Float32Array(n), o = 0;
    parts.forEach(function (p) { out2.set(p, o); o += p.length; });
    return out2;
  }

  var noiseSeed = 1;
  function noise() { noiseSeed = (noiseSeed * 1103515245 + 12345) & 0x7fffffff; return noiseSeed / 0x3fffffff - 1; }

  var KIT = [
    { name: "kick", colour: 0, make: function () {
      return render(320, function (t, p) {
        var f = 130 * Math.exp(-t * 28) + 42;
        return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 9) * 0.9;
      });
    } },
    { name: "snare", colour: 3, make: function () {
      var prev = 0;
      return render(300, function (t) {
        var n = noise();
        var hp = n - prev; prev = n;
        return (hp * 0.8 + Math.sin(2 * Math.PI * 190 * t) * 0.35) * Math.exp(-t * 17);
      });
    } },
    { name: "hat", colour: 2, make: function () {
      var prev = 0;
      return render(150, function (t) {
        var n = noise();
        var hp = n - prev; prev = n;
        return hp * Math.exp(-t * 60) * 0.6;
      });
    } },
    { name: "blip", colour: 1, make: function () {
      return render(260, function (t) {
        return (Math.sin(2 * Math.PI * 880 * t) * 0.6 + Math.sin(2 * Math.PI * 1320 * t) * 0.3) *
          Math.exp(-t * 12);
      });
    } }
  ];

  var SLOT = 400; /* ms per sprite slot — generous, so the offsets stay round numbers */
  var parts = [], spriteMap = {};
  KIT.forEach(function (k, i) {
    var a = k.make();
    parts.push(a);
    var used = a.length / RATE * 1000;
    parts.push(silence(SLOT - used));
    spriteMap[k.name] = [i * SLOT, used];
  });
  var kitUrl = URL.createObjectURL(encodeWav(concat(parts), RATE));

  /* A longer generated pad, for the transport controls. */
  var padUrl = URL.createObjectURL(encodeWav(render(8000, function (t, p) {
    var chord = [220, 277.18, 329.63, 440];
    var v = 0;
    for (var i = 0; i < chord.length; i++) {
      v += Math.sin(2 * Math.PI * chord[i] * t + Math.sin(t * (0.3 + i * 0.11)) * 2) / chord.length;
    }
    var env = Math.min(1, t * 2) * Math.min(1, (8 - t) * 0.8);
    return v * env * 0.5;
  }), RATE));

  ctx.onDestroy(function () { URL.revokeObjectURL(kitUrl); URL.revokeObjectURL(padUrl); });

  var kit = new Howl({ src: [kitUrl], format: ["wav"], sprite: spriteMap, pool: 12 });
  var pad = new Howl({ src: [padUrl], format: ["wav"], loop: true, volume: 0.5 });
  ctx.onDestroy(function () { kit.unload(); pad.unload(); Howler.stop(); });

  /* ---------- sequencer ---------- */
  var seqCard = card(ctx, ctx.el, "STEP SEQUENCER",
    "16 steps, four tracks. Click any cell. The playhead runs whether or not the browser has " +
    "unlocked audio yet.");
  var grid = ctx.mk("div");
  seqCard.appendChild(grid);

  var STEPS = 16;
  var pattern = [
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]
  ];
  var cells = [];

  function buildGrid() {
    grid.innerHTML = "";
    grid.style.cssText = "display:grid;grid-template-columns:64px repeat(" + STEPS +
      ",1fr);gap:5px;align-items:center";
    KIT.forEach(function (k, r) {
      var lab = ctx.mk("div");
      lab.style.cssText = "font:700 10.5px " + T.mono + ";color:" + ctx.series(k.colour);
      lab.textContent = k.name;
      grid.appendChild(lab);
      cells[r] = [];
      for (var c = 0; c < STEPS; c++) {
        (function (r2, c2) {
          var cell = ctx.mk("button");
          cell.type = "button";
          cell.style.cssText = "height:30px;border-radius:7px;cursor:pointer;border:1px solid " +
            T.line + ";background:" + T.sunk;
          cell.addEventListener("click", function () {
            pattern[r2][c2] = pattern[r2][c2] ? 0 : 1;
            paint();
            if (pattern[r2][c2]) kit.play(KIT[r2].name);
          });
          grid.appendChild(cell);
          cells[r2][c2] = cell;
        })(r, c);
      }
    });
    paint();
  }
  var step = 0;
  function paint() {
    KIT.forEach(function (k, r) {
      for (var c = 0; c < STEPS; c++) {
        var on = pattern[r][c];
        var here = c === step;
        cells[r][c].style.background = on ? ctx.series(k.colour) : here ? T.line : T.sunk;
        cells[r][c].style.borderColor = here ? T.ink2 : on ? ctx.series(k.colour) : T.line;
        cells[r][c].style.opacity = on || here ? "1" : (c % 4 === 0 ? ".9" : ".55");
      }
    });
  }
  buildGrid();

  var out = ctx.readout("");
  var bpm = 116, playing = true, timer = null;

  function tick() {
    step = (step + 1) % STEPS;
    KIT.forEach(function (k, r) { if (pattern[r][step]) kit.play(k.name); });
    paint();
    out("step <b>" + (step + 1) + "</b>/16 · <b>" + bpm + "</b> bpm · " +
      Howler._howls.length + " Howl instances · " +
      (Howler.ctx && Howler.ctx.state === "running" ? "audio unlocked" :
        "<span style='color:" + T.part + "'>waiting for a click to unlock audio</span>"));
  }
  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(function () { if (playing) tick(); }, 60000 / bpm / 4);
    ctx.onDestroy(function () { clearInterval(timer); });
  }
  restart();

  /* ---------- transport ---------- */
  var padCard = card(ctx, ctx.el, "TRANSPORT ON A LONGER SOUND",
    "An 8-second generated pad. Rate, stereo position, fades and seeking are all Howler calls.");
  var padRow = ctx.mk("div");
  padRow.style.cssText = "display:flex;align-items:center;gap:12px;flex-wrap:wrap";
  padCard.appendChild(padRow);

  function button(label, fn, primary) {
    var b = ctx.mk("button", null, ctx.esc(label));
    b.type = "button";
    b.style.cssText = "background:" + (primary ? T.accent : T.sunk) + ";border:1px solid " +
      (primary ? T.accent : T.line) + ";border-radius:8px;padding:8px 14px;font:600 12.5px " +
      T.sans + ";color:" + (primary ? (T.dark ? "#0b0e14" : "#fff") : T.ink2) + ";cursor:pointer";
    b.addEventListener("click", fn);
    padRow.appendChild(b);
    return b;
  }

  var seekWrap = ctx.mk("div");
  seekWrap.style.cssText = "flex:1 1 220px;min-width:200px";
  var seekTrack = ctx.mk("div");
  seekTrack.style.cssText = "height:10px;border-radius:5px;background:" + T.sunk + ";overflow:hidden";
  var seekFill = ctx.mk("div");
  seekFill.style.cssText = "height:100%;width:0;background:" + ctx.series(4);
  seekTrack.appendChild(seekFill);
  seekWrap.appendChild(seekTrack);
  var seekText = ctx.mk("div");
  seekText.style.cssText = "font:600 11px " + T.mono + ";color:" + T.muted + ";margin-top:6px";
  seekText.textContent = "stopped";
  seekWrap.appendChild(seekText);
  padRow.appendChild(seekWrap);

  var padId = null;
  button("Play pad", function () { if (padId === null || !pad.playing(padId)) padId = pad.play(); }, true);
  button("Pause", function () { pad.pause(); });
  button("Fade out over 2 s", function () { pad.fade(pad.volume(), 0, 2000); });
  button("Fade in over 2 s", function () {
    if (padId === null || !pad.playing(padId)) padId = pad.play();
    pad.fade(0, 0.5, 2000);
  });
  button("Seek to 4 s", function () { pad.seek(4); });

  ctx.every(100, function () {
    if (pad.playing()) {
      var s = pad.seek() || 0, d = pad.duration() || 1;
      seekFill.style.width = (s / d * 100).toFixed(1) + "%";
      seekText.textContent = s.toFixed(1) + " / " + d.toFixed(1) + " s · volume " +
        pad.volume().toFixed(2) + " · rate " + (pad.rate() || 1).toFixed(2);
    } else {
      seekText.textContent = "stopped";
    }
  });

  /* ---------- pads ---------- */
  var padsCard = card(ctx, ctx.el, "THE SPRITE MAP",
    "Each pad calls <code>kit.play(name)</code> — one Howl, four sounds, no extra requests.");
  var padsHost = ctx.mk("div");
  padsHost.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:11px";
  padsCard.appendChild(padsHost);
  KIT.forEach(function (k) {
    var b = ctx.mk("button");
    b.type = "button";
    b.style.cssText = "padding:16px;border-radius:11px;border:1px solid " + ctx.series(k.colour) +
      ";background:" + T.sunk + ";color:" + T.ink + ";font:700 14px " + T.mono + ";cursor:pointer";
    b.innerHTML = k.name + '<div style="font:500 10px ' + T.mono + ";color:" + T.muted +
      ';margin-top:5px">offset ' + spriteMap[k.name][0] + " ms · " +
      spriteMap[k.name][1].toFixed(0) + " ms long</div>";
    b.addEventListener("click", function () {
      var id = kit.play(k.name);
      kit.stereo((Math.random() * 2 - 1) * 0.6, id);
      b.style.background = ctx.series(k.colour);
      ctx.after(120, function () { b.style.background = T.sunk; });
    });
    padsHost.appendChild(b);
  });

  ctx.check("running", true, function (v) { playing = v; });
  ctx.range("bpm", { min: 60, max: 180, value: 116 }, function (v) { bpm = v; restart(); });
  ctx.range("master volume", { min: 0, max: 1, step: 0.05, value: 0.8, fmt: function (v) { return v.toFixed(2); } },
    function (v) { Howler.volume(v); });
  ctx.range("pad rate", { min: 0.5, max: 2, step: 0.05, value: 1, fmt: function (v) { return v.toFixed(2) + "×"; } },
    function (v) { pad.rate(v); });
  ctx.btn("Clear the pattern", function () {
    pattern = pattern.map(function (row) { return row.map(function () { return 0; }); });
    paint();
  });
  ctx.btn("Randomise", function () {
    var rnd = ctx.rng(Date.now() % 100000);
    pattern = pattern.map(function (row, r) {
      return row.map(function (_, c) { return rnd() < (r === 2 ? 0.6 : 0.22) ? 1 : 0; });
    });
    paint();
  }, true);

  Howler.volume(0.8);
};

})();
