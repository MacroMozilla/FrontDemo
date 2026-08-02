/* Media, audio and devices. */
(function () {
"use strict";
var B = window.B;

/* Encode PCM samples into a WAV blob, so the audio demos never touch
   the network and never depend on an asset file. */
function wavBlob(channelData, sampleRate) {
  var n = channelData.length;
  var buf = new ArrayBuffer(44 + n * 2);
  var v = new DataView(buf);
  function str(off, s) { for (var i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); }
  str(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); str(8, "WAVE");
  str(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, 1, true); v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, n * 2, true);
  for (var i = 0; i < n; i++) {
    var s = Math.max(-1, Math.min(1, channelData[i]));
    v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buf], { type: "audio/wav" });
}

/* ------------------------------------------------------------ WaveSurfer */
B.ws = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;padding:26px;display:flex;flex-direction:column;justify-content:center;gap:14px";
  ctx.el.appendChild(host);
  var wave = ctx.mk("div");
  host.appendChild(wave);
  var note = ctx.mk("p", "demo-note");
  note.innerHTML = "The audio is synthesised in this tab and encoded to a WAV blob — no file is fetched. " +
                   "Click anywhere on the waveform to seek.";
  host.appendChild(note);

  /* Four bars of a plucked arpeggio with an envelope, so the waveform
     has visible structure rather than being a solid block. */
  var RATE = 22050, SECONDS = 8;
  var data = new Float32Array(RATE * SECONDS);
  var notes = [220, 277.2, 329.6, 440, 329.6, 277.2, 493.9, 440];
  for (var i = 0; i < data.length; i++) {
    var t = i / RATE;
    var step = Math.floor(t * 2) % notes.length;
    var local = (t * 2) % 1;
    var env = Math.exp(-local * 4.2) * (1 - Math.exp(-local * 90));
    var f = notes[step];
    data[i] = env * .55 * (Math.sin(2 * Math.PI * f * t) +
                           .38 * Math.sin(4 * Math.PI * f * t) +
                           .18 * Math.sin(6 * Math.PI * f * t));
  }
  var url = URL.createObjectURL(wavBlob(data, RATE));
  ctx.onDestroy(function () { URL.revokeObjectURL(url); });

  var ws = WaveSurfer.create({
    container: wave,
    waveColor: ctx.series(0),
    progressColor: ctx.series(1),
    cursorColor: T.ink,
    cursorWidth: 2,
    height: 150,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    normalize: true,
    url: url
  });

  var out = ctx.readout("decoding…");
  ws.on("ready", function () {
    out("<b>" + ws.getDuration().toFixed(2) + "s</b> decoded · click to seek, or press Play");
  });
  ws.on("timeupdate", function (t) {
    out("<b>" + t.toFixed(2) + "</b> / " + ws.getDuration().toFixed(2) + " s");
  });
  ws.on("error", function (e) {
    out('<span style="color:' + T.bad + '">' + String(e).slice(0, 80) + "</span>");
  });

  ctx.btn("Play / pause", function () { ws.playPause(); }, true);
  ctx.btn("Stop", function () { ws.stop(); });
  ctx.range("zoom", { min: 0, max: 200, value: 0,
                      fmt: function (v) { return v + " px/s"; } },
            function (v) { try { ws.zoom(v); } catch (e) {} });
  ctx.range("speed", { min: 5, max: 25, value: 10,
                       fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { ws.setPlaybackRate(v / 10, true); });

  ctx.onDestroy(function () { ws.destroy(); });
};

/* ---------------------------------------------------------------- Tone.js */
B.tone = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var NOTES = ["C5", "A4", "G4", "E4", "D4", "C4", "A3", "G3"];
  var STEPS = 16;
  var grid = [];
  for (var r = 0; r < NOTES.length; r++) {
    grid.push([]);
    for (var c = 0; c < STEPS; c++) grid[r].push(false);
  }
  /* A starting pattern so there is something to hear immediately. */
  [[0, 0], [5, 2], [2, 4], [4, 6], [0, 8], [3, 10], [1, 12], [6, 14],
   [7, 0], [7, 8], [5, 5], [3, 13]].forEach(function (p) { grid[p[0]][p[1]] = true; });

  var wrap = ctx.mk("div");
  wrap.innerHTML =
    '<p class="demo-h">A step sequencer, synthesised live</p>' +
    '<p class="demo-p">Nothing here is an audio file. Tone.js schedules a polyphonic synth through ' +
    "a delay and reverb on its own transport clock, which is what keeps the timing musically accurate " +
    "rather than <code>setInterval</code>-accurate.</p><div id=\"tone-grid\"></div>";
  ctx.el.appendChild(wrap);

  var cells = [];
  var gridEl = wrap.querySelector("#tone-grid");
  gridEl.style.cssText = "display:inline-grid;grid-template-columns:44px repeat(" + STEPS +
                         ",1fr);gap:4px;width:100%;max-width:760px";
  for (var row = 0; row < NOTES.length; row++) {
    var lab = ctx.mk("div");
    lab.textContent = NOTES[row];
    lab.style.cssText = "font:11px " + T.mono + ";color:" + T.muted + ";display:grid;place-items:center";
    gridEl.appendChild(lab);
    cells.push([]);
    for (var col = 0; col < STEPS; col++) {
      var cell = ctx.mk("div");
      cell.dataset.r = row; cell.dataset.c = col;
      cell.style.cssText = "aspect-ratio:1;border-radius:6px;cursor:pointer;transition:background .08s;" +
        "background:" + (grid[row][col] ? ctx.series(row % 8) : T.sunk) +
        ";border:1px solid " + T.line;
      cell.addEventListener("click", function () {
        var rr = +this.dataset.r, cc = +this.dataset.c;
        grid[rr][cc] = !grid[rr][cc];
        this.style.background = grid[rr][cc] ? ctx.series(rr % 8) : T.sunk;
      });
      gridEl.appendChild(cell);
      cells[row].push(cell);
    }
  }

  var synth = null, seq = null, reverb = null, delay = null;
  var out = ctx.readout("press Play — browsers require a click before any audio can start");

  async function start() {
    if (Tone.getContext().state !== "running") await Tone.start();
    if (!synth) {
      reverb = new Tone.Reverb({ decay: 2.4, wet: .28 }).toDestination();
      delay = new Tone.FeedbackDelay("8n", .24).connect(reverb);
      synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: .005, decay: .22, sustain: .12, release: .8 }
      }).connect(delay);
      synth.volume.value = -12;

      seq = new Tone.Sequence(function (time, step) {
        var pitches = [];
        for (var r = 0; r < NOTES.length; r++) if (grid[r][step]) pitches.push(NOTES[r]);
        if (pitches.length) synth.triggerAttackRelease(pitches, "16n", time);
        Tone.Draw.schedule(function () {
          cells.forEach(function (rowCells, r) {
            rowCells.forEach(function (cell, c) {
              cell.style.outline = c === step ? "2px solid " + T.ink : "none";
            });
          });
          out("step <b>" + (step + 1) + "</b> / " + STEPS + " · " + pitches.length + " voice(s)");
        }, time);
      }, Array.from({ length: STEPS }, function (_, i) { return i; }), "16n");

      seq.start(0);
    }
    Tone.getTransport().start();
    out("playing · click cells to change the pattern while it runs");
  }

  ctx.btn("Play", function () { start(); }, true);
  ctx.btn("Stop", function () {
    Tone.getTransport().stop();
    cells.forEach(function (rc) { rc.forEach(function (c) { c.style.outline = "none"; }); });
    out("stopped");
  });
  ctx.range("tempo", { min: 60, max: 200, value: 118, fmt: function (v) { return v + " bpm"; } },
            function (v) { Tone.getTransport().bpm.rampTo(v, .1); });
  ctx.range("reverb", { min: 0, max: 100, value: 28, fmt: function (v) { return v + "%"; } },
            function (v) { if (reverb) reverb.wet.value = v / 100; });
  ctx.btn("Clear", function () {
    grid.forEach(function (row, r) {
      row.forEach(function (_, c) { grid[r][c] = false; cells[r][c].style.background = T.sunk; });
    });
  });

  Tone.getTransport().bpm.value = 118;
  ctx.onDestroy(function () {
    try {
      Tone.getTransport().stop();
      if (seq) seq.dispose();
      if (synth) synth.dispose();
      if (delay) delay.dispose();
      if (reverb) reverb.dispose();
    } catch (e) {}
  });
};

/* ------------------------------------------------------------- Cropper.js */
B.cropper = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("58%");

  /* Paint a source image so nothing is fetched. */
  var src = ctx.mk("canvas");
  src.width = 900; src.height = 600;
  var g = src.getContext("2d");
  var grad = g.createLinearGradient(0, 0, 900, 600);
  grad.addColorStop(0, ctx.series(0));
  grad.addColorStop(.5, ctx.series(4));
  grad.addColorStop(1, ctx.series(3));
  g.fillStyle = grad;
  g.fillRect(0, 0, 900, 600);
  for (var i = 0; i < 90; i++) {
    g.globalAlpha = .12 + Math.random() * .3;
    g.fillStyle = i % 2 ? "#ffffff" : "#000000";
    g.beginPath();
    g.arc(Math.random() * 900, Math.random() * 600, 12 + Math.random() * 90, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  g.fillStyle = "rgba(0,0,0,.55)";
  g.fillRect(0, 470, 900, 130);
  g.fillStyle = "#fff";
  g.font = "600 44px " + T.sans;
  g.fillText("drag the crop box", 42, 540);

  var img = ctx.mk("img");
  img.src = src.toDataURL("image/png");
  img.style.cssText = "max-width:100%;display:block";
  var holder = ctx.mk("div");
  holder.style.cssText = "padding:16px";
  holder.appendChild(img);
  p.a.appendChild(holder);

  var right = ctx.mk("div");
  right.style.cssText = "padding:18px;min-height:100%";
  right.innerHTML = '<p class="demo-h">Cropped output</p>' +
    '<div id="crop-out" style="margin-bottom:12px"></div><dl class="kv" id="crop-info"></dl>';
  p.b.appendChild(right);

  var out = ctx.readout("");
  var cropper = new Cropper(img, {
    viewMode: 1,
    autoCropArea: .6,
    background: false,
    responsive: true,
    crop: function (e) {
      var d = e.detail;
      document.getElementById("crop-info").innerHTML =
        "<dt>x</dt><dd>" + Math.round(d.x) + "</dt>" +
        "<dt>y</dt><dd>" + Math.round(d.y) + "</dd>" +
        "<dt>width</dt><dd><b>" + Math.round(d.width) + "</b> px</dd>" +
        "<dt>height</dt><dd><b>" + Math.round(d.height) + "</b> px</dd>" +
        "<dt>rotate</dt><dd>" + Math.round(d.rotate) + "°</dd>" +
        "<dt>scaleX</dt><dd>" + d.scaleX + "</dd>";
      out(Math.round(d.width) + " × " + Math.round(d.height) + " px selected");
    }
  });
  ctx.onDestroy(function () { cropper.destroy(); });

  function preview() {
    var canvas = cropper.getCroppedCanvas({ maxWidth: 520, maxHeight: 380 });
    if (!canvas) { out("the cropper is still measuring the image — try again in a moment"); return; }
    var box = document.getElementById("crop-out");
    box.innerHTML = "";
    canvas.style.cssText = "max-width:100%;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,.35)";
    box.appendChild(canvas);
    out("cropped to <b>" + canvas.width + " × " + canvas.height + "</b> px");
  }

  ctx.btn("Crop", preview, true);
  ctx.select("aspect ratio", [
    { v: "0", t: "free" }, { v: "1", t: "1:1" }, { v: "1.7777", t: "16:9" },
    { v: "0.75", t: "3:4" }, { v: "2.35", t: "2.35:1" }
  ], function (v) { cropper.setAspectRatio(+v || NaN); }, "0");
  ctx.btn("Rotate 90°", function () { cropper.rotate(90); });
  ctx.btn("Flip", function () { cropper.scaleX(-cropper.getData().scaleX || -1); });
  ctx.btn("Reset", function () { cropper.reset(); });
  /* getCroppedCanvas only works once the image has been measured. */
  img.addEventListener("ready", preview);
};

/* --------------------------------------------------------- Signature Pad */
B.sigpad = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("58%");

  var padWrap = ctx.mk("div");
  padWrap.style.cssText = "padding:20px;height:100%;display:flex;flex-direction:column;gap:10px";
  p.a.appendChild(padWrap);

  var card = ctx.mk("div");
  card.style.cssText = "flex:1 1 auto;background:#ffffff;border-radius:12px;position:relative;overflow:hidden;" +
                       "box-shadow:0 8px 26px rgba(0,0,0,.3)";
  padWrap.appendChild(card);
  var cv = ctx.mk("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block;touch-action:none";
  card.appendChild(cv);

  var line = ctx.mk("div");
  line.style.cssText = "position:absolute;left:8%;right:8%;bottom:26%;border-bottom:1px dashed #bbb;pointer-events:none";
  card.appendChild(line);
  var hint = ctx.mk("div");
  hint.textContent = "sign here";
  hint.style.cssText = "position:absolute;left:8%;bottom:20%;font:12px " + T.mono + ";color:#bbb;pointer-events:none";
  card.appendChild(hint);

  var right = ctx.mk("div");
  right.style.cssText = "padding:18px;min-height:100%";
  right.innerHTML = '<p class="demo-h">Export</p>' +
    '<p class="demo-p">The stroke is stored as variable-width Bézier segments, so the SVG export is ' +
    "vector paths — not a bitmap traced after the fact.</p>" +
    '<div id="sig-out"></div><pre class="demo-pre" id="sig-src" style="margin-top:12px;max-height:200px"></pre>';
  p.b.appendChild(right);

  function fit() {
    var ratio = Math.min(devicePixelRatio || 1, 2);
    cv.width = card.clientWidth * ratio;
    cv.height = card.clientHeight * ratio;
    cv.getContext("2d").scale(ratio, ratio);
    pad.clear();
  }

  var pad = new SignaturePad(cv, {
    penColor: "#16233a",
    backgroundColor: "rgba(255,255,255,0)",
    minWidth: .7, maxWidth: 3.2, velocityFilterWeight: .75
  });
  fit();
  ctx.onResize(fit);

  var out = ctx.readout("sign in the white area");
  pad.addEventListener("endStroke", function () {
    hint.style.display = "none";
    var pts = pad.toData();
    var total = pts.reduce(function (a, s) { return a + s.points.length; }, 0);
    out("<b>" + pts.length + "</b> stroke(s) · <b>" + total + "</b> captured points");
  });

  ctx.btn("Export SVG", function () {
    if (pad.isEmpty()) { out("nothing to export yet"); return; }
    var svg = pad.toDataURL("image/svg+xml");
    var decoded = decodeURIComponent(svg.split(",")[1] || "");
    var box = document.getElementById("sig-out");
    box.innerHTML = '<div style="background:#fff;border-radius:10px;padding:10px">' +
                    '<img src="' + svg + '" style="max-width:100%">' + "</div>";
    document.getElementById("sig-src").textContent =
      decoded.replace(/></g, ">\n<").slice(0, 1400);
    out("exported <b>" + (decoded.length / 1024).toFixed(1) + " KB</b> of SVG path data");
  }, true);
  ctx.btn("Export PNG", function () {
    if (pad.isEmpty()) { out("nothing to export yet"); return; }
    var url = pad.toDataURL("image/png");
    document.getElementById("sig-out").innerHTML =
      '<div style="background:#fff;border-radius:10px;padding:10px"><img src="' + url +
      '" style="max-width:100%"></div>';
    document.getElementById("sig-src").textContent = url.slice(0, 260) + "…";
    out("PNG data URL, <b>" + (url.length / 1024).toFixed(1) + " KB</b>");
  });
  ctx.btn("Undo last stroke", function () {
    var d = pad.toData();
    d.pop();
    pad.fromData(d);
    out("<b>" + d.length + "</b> stroke(s) left");
  });
  ctx.btn("Clear", function () { pad.clear(); hint.style.display = ""; out("cleared"); });
};

/* ---------------------------------------------------------------- xterm.js */
B.xterm = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;padding:12px;background:" + T.sunk;
  ctx.el.appendChild(host);

  var term = new Terminal({
    fontFamily: T.mono,
    fontSize: 13,
    cursorBlink: true,
    convertEol: true,
    theme: {
      background: T.sunk, foreground: T.ink2, cursor: T.accent,
      selectionBackground: T.accent + "44",
      black: T.sunk, red: T.bad, green: T.yes, yellow: T.part,
      blue: T.accent, magenta: ctx.series(4), cyan: ctx.series(5), white: T.ink
    }
  });
  var fit = new FitAddon.FitAddon();
  term.loadAddon(fit);
  term.open(host);
  fit.fit();
  ctx.onResize(function () { try { fit.fit(); } catch (e) {} });

  /* A tiny shell, so the emulator has something to emulate. */
  var FS = {
    "README.md": "# FrontDemo\nEvery library on this site runs for real.\n",
    "package.json": '{\n  "name": "frontdemo",\n  "private": true\n}\n',
    "notes.txt": "xterm.js is the terminal inside VS Code.\nIt speaks the full xterm escape sequence set.\n"
  };
  var line = "", history = [], hi = 0;
  var PROMPT = "\x1b[38;5;39mfrontdemo\x1b[0m:\x1b[38;5;35m~\x1b[0m$ ";

  function write(s) { term.write(s); }
  function prompt() { write("\r\n" + PROMPT); }

  var COMMANDS = {
    help: function () {
      write("\r\n\x1b[1mavailable\x1b[0m\r\n" +
        "  help      this text\r\n" +
        "  ls        list files\r\n" +
        "  cat FILE  print a file\r\n" +
        "  colors    the 256-colour palette\r\n" +
        "  progress  a redrawing progress bar\r\n" +
        "  neofetch  the obligatory banner\r\n" +
        "  clear     clear the screen\r\n");
    },
    ls: function () {
      write("\r\n" + Object.keys(FS).map(function (f) {
        return "\x1b[38;5;39m" + f + "\x1b[0m";
      }).join("  ") + "\r\n");
    },
    cat: function (arg) {
      if (!FS[arg]) { write("\r\n\x1b[31mcat: " + (arg || "") + ": no such file\x1b[0m\r\n"); return; }
      write("\r\n" + FS[arg].replace(/\n/g, "\r\n"));
    },
    colors: function () {
      write("\r\n");
      for (var i = 0; i < 256; i++) {
        write("\x1b[48;5;" + i + "m  \x1b[0m");
        if ((i + 1) % 32 === 0) write("\r\n");
      }
    },
    clear: function () { term.clear(); },
    neofetch: function () {
      write("\r\n" +
        "\x1b[38;5;39m   ▄▄▄▄▄   \x1b[0m  \x1b[1mfrontdemo\x1b[0m@browser\r\n" +
        "\x1b[38;5;39m  █     █  \x1b[0m  ---------------------\r\n" +
        "\x1b[38;5;39m  █  ███  \x1b[0m   Terminal: xterm.js\r\n" +
        "\x1b[38;5;39m  █     █  \x1b[0m  Renderer: DOM/canvas\r\n" +
        "\x1b[38;5;39m   ▀▀▀▀▀   \x1b[0m  Cols x Rows: " + term.cols + " x " + term.rows + "\r\n");
    },
    progress: function () {
      var pct = 0;
      write("\r\n");
      var id = setInterval(function () {
        pct += 4;
        var filled = Math.round(pct / 4);
        write("\r\x1b[38;5;35m[" + "█".repeat(filled) + " ".repeat(25 - filled) + "]\x1b[0m " + pct + "%");
        if (pct >= 100) {
          clearInterval(id);
          write("\r\n\x1b[38;5;35mdone\x1b[0m — that redraw used carriage returns, nothing was appended\r\n");
          prompt();
        }
      }, 55);
      return true;   /* handles its own prompt */
    }
  };

  function run(input) {
    var parts = input.trim().split(/\s+/);
    var cmd = parts[0];
    if (!cmd) return false;
    history.push(input); hi = history.length;
    if (COMMANDS[cmd]) return COMMANDS[cmd](parts[1]) === true;
    write("\r\n\x1b[31m" + cmd + ": command not found\x1b[0m — try \x1b[1mhelp\x1b[0m\r\n");
    return false;
  }

  term.onData(function (d) {
    if (d === "\r") {
      var async = run(line);
      line = "";
      if (!async) prompt();
    } else if (d === "\u007F") {
      if (line.length) { line = line.slice(0, -1); write("\b \b"); }
    } else if (d === "\u001b[A") {
      if (hi > 0) { hi--; write("\r\x1b[K" + PROMPT + history[hi]); line = history[hi]; }
    } else if (d === "\u001b[B") {
      if (hi < history.length - 1) { hi++; write("\r\x1b[K" + PROMPT + history[hi]); line = history[hi]; }
    } else if (d >= " ") {
      line += d; write(d);
    }
  });

  write("\x1b[1mxterm.js\x1b[0m — the terminal emulator inside VS Code.\r\n");
  write("Type \x1b[1mhelp\x1b[0m to see what this little shell understands.\r\n");
  write(PROMPT);

  var out = ctx.readout("<b>" + term.cols + " × " + term.rows + "</b> character cells · full ANSI colour and cursor control");
  term.onResize(function (s) { out("<b>" + s.cols + " × " + s.rows + "</b> character cells"); });

  ctx.btn("Run neofetch", function () { COMMANDS.neofetch(); prompt(); term.focus(); });
  ctx.btn("Show 256 colours", function () { COMMANDS.colors(); prompt(); term.focus(); });
  ctx.btn("Clear", function () { term.clear(); write(PROMPT); term.focus(); });

  ctx.onDestroy(function () { term.dispose(); });
};

})();
