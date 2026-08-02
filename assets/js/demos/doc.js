/* Documents, codes and export. */
(function () {
"use strict";
var B = window.B;

/* -------------------------------------------------------------- JsBarcode */
B.bar = async function (ctx) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;" +
                       "justify-content:center;gap:18px;padding:24px";
  ctx.el.appendChild(wrap);

  var card = ctx.mk("div");
  card.style.cssText = "background:#ffffff;border-radius:10px;padding:20px 26px;box-shadow:0 8px 30px rgba(0,0,0,.3)";
  wrap.appendChild(card);
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  card.appendChild(svg);

  var note = ctx.mk("div", "demo-note");
  note.style.textAlign = "center";
  wrap.appendChild(note);

  var VALID = {
    CODE128: "FRONTDEMO-2026", CODE39: "FRONTDEMO", EAN13: "5901234123457",
    EAN8: "96385074", UPC: "123456789999", ITF14: "10012345678902",
    MSI: "1234567", pharmacode: "1234", codabar: "A12345B"
  };
  var format = "CODE128", value = VALID.CODE128, out = ctx.readout("");

  function draw() {
    try {
      JsBarcode(svg, value, {
        format: format, width: 2.4, height: 110, displayValue: true,
        fontSize: 15, margin: 8, background: "#ffffff", lineColor: "#111111"
      });
      out('<span style="color:' + T.yes + '">valid</span> ' + format + " · " + value.length + " characters encoded");
      note.innerHTML = "The check digit and the symbology rules are enforced by the library — " +
                       "type something invalid for the format and it refuses.";
    } catch (e) {
      out('<span style="color:' + T.bad + '">' + String(e.message || e).slice(0, 80) + "</span>");
    }
  }
  draw();

  ctx.select("symbology", Object.keys(VALID), function (v) {
    format = v; value = VALID[v]; input.value = value; draw();
  }, "CODE128");
  var input = ctx.text("value", value, function (v) { value = v; draw(); }, "180px");
};

/* ----------------------------------------------------------------- QRCode */
B.qr = async function (ctx) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:36px;padding:26px;flex-wrap:wrap";
  ctx.el.appendChild(wrap);

  var card = ctx.mk("div");
  card.style.cssText = "background:#ffffff;padding:16px;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.3)";
  wrap.appendChild(card);
  var cv = ctx.mk("canvas");
  card.appendChild(cv);

  var info = ctx.mk("div");
  info.style.cssText = "max-width:320px";
  wrap.appendChild(info);

  var QR = window.QRCodeLib;
  var text = "https://github.com/MacroMozilla/FrontDemo";
  var ec = "M", out = ctx.readout("");

  function draw() {
    QR.toCanvas(cv, text, { errorCorrectionLevel: ec, margin: 2, width: 260,
                            color: { dark: "#111111", light: "#ffffff" } }, function (err) {
      if (err) { out('<span style="color:' + T.bad + '">' + err.message + "</span>"); return; }
      /* The same package can hand back the raw bit matrix — that is what
         makes it usable outside a browser. */
      var qr = QR.default.create(text, { errorCorrectionLevel: ec });
      var size = qr.modules.size;
      info.innerHTML =
        '<p class="demo-h">what the encoder decided</p>' +
        '<dl class="kv">' +
        "<dt>version</dt><dd><b>" + qr.version + "</b></dd>" +
        "<dt>modules</dt><dd><b>" + size + " × " + size + "</b></dd>" +
        "<dt>correction</dt><dd><b>" + ec + "</b> (" + ({ L: "7%", M: "15%", Q: "25%", H: "30%" }[ec]) + " recoverable)</dd>" +
        "<dt>payload</dt><dd>" + text.length + " characters</dd>" +
        "</dl>" +
        '<p class="demo-note">Higher correction packs in more redundancy, so the code gets denser ' +
        "but survives more damage. <code>QRCode.create()</code> returns this matrix with no DOM involved, " +
        "which is exactly how the React Native wrapper uses it.</p>";
      out("version <b>" + qr.version + "</b> · <b>" + size + "×" + size + "</b> modules");
    });
  }
  draw();

  ctx.text("payload", text, function (v) { text = v || " "; draw(); }, "240px");
  ctx.select("error correction", [
    { v: "L", t: "L — 7%" }, { v: "M", t: "M — 15%" }, { v: "Q", t: "Q — 25%" }, { v: "H", t: "H — 30%" }
  ], function (v) { ec = v; draw(); }, "M");
};

/* ------------------------------------------------------------- PDF.js */
B.pdfjs = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs.worker.js";

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;overflow:auto;padding:20px;display:flex;" +
                       "justify-content:center;align-items:flex-start";
  ctx.el.appendChild(host);
  var cv = ctx.mk("canvas");
  cv.style.cssText = "box-shadow:0 8px 30px rgba(0,0,0,.35);border-radius:4px;background:#fff";
  host.appendChild(cv);

  /* Build a multi-page PDF in the browser, then parse it back with PDF.js. */
  var jsPDF = window.jspdf.jsPDF;
  var doc = new jsPDF({ unit: "pt", format: "a4" });
  var W = doc.internal.pageSize.getWidth();

  function page(title, body, n) {
    doc.setFillColor(38, 70, 140);
    doc.rect(0, 0, W, 84, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text(title, 48, 52);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(body, W - 96), 48, 128);
    doc.setDrawColor(200);
    doc.line(48, 300, W - 48, 300);
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("page " + n + " · generated in your browser by jsPDF, then parsed by PDF.js", 48, 320);
  }
  page("Front-end libraries", "This document did not exist a moment ago. jsPDF wrote it in this tab, " +
       "and PDF.js is now parsing the bytes and rasterising them onto the canvas beside you. " +
       "No server was involved in either direction.", 1);
  doc.addPage();
  page("Page two", "PDF.js is the renderer built into Firefox. It implements the PDF specification " +
       "in JavaScript, which is why it can open essentially any file without a plugin.", 2);
  doc.addPage();
  page("Page three", "Rendering happens through a worker, which is why the worker file has to be " +
       "shipped alongside the library.", 3);

  var bytes = doc.output("arraybuffer");
  var pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
  if (ctx.dead()) return;

  var pageNo = 1, scale = 1.25, out = ctx.readout("");

  async function render() {
    var p = await pdf.getPage(pageNo);
    var vp = p.getViewport({ scale: scale * Math.min(devicePixelRatio || 1, 2) });
    cv.width = vp.width; cv.height = vp.height;
    cv.style.width = (vp.width / Math.min(devicePixelRatio || 1, 2)) + "px";
    cv.style.height = (vp.height / Math.min(devicePixelRatio || 1, 2)) + "px";
    await p.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
    var text = await p.getTextContent();
    out("page <b>" + pageNo + "</b> / " + pdf.numPages + " · " +
        Math.round(bytes.byteLength / 1024) + " KB of PDF · <b>" +
        text.items.length + "</b> text runs extracted");
  }
  await render();

  ctx.btn("◀ Prev", function () { if (pageNo > 1) { pageNo--; render(); } });
  ctx.btn("Next ▶", function () { if (pageNo < pdf.numPages) { pageNo++; render(); } });
  ctx.range("zoom", { min: 60, max: 220, step: 10, value: 125,
                      fmt: function (v) { return v + "%"; } },
            function (v) { scale = v / 100; render(); });
};

/* ------------------------------------------------------------------ jsPDF */
B.jspdf = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs.worker.js";

  var p = ctx.panes("38%");
  var form = ctx.mk("div");
  form.className = "demo-pad";
  p.a.appendChild(form);

  var preview = ctx.mk("div");
  preview.style.cssText = "min-height:100%;display:flex;justify-content:center;align-items:flex-start;padding:20px;overflow:auto";
  p.b.appendChild(preview);
  var cv = ctx.mk("canvas");
  cv.style.cssText = "box-shadow:0 8px 30px rgba(0,0,0,.35);border-radius:4px;background:#fff;max-width:100%";
  preview.appendChild(cv);

  var state = { title: "Invoice 2026-0042", customer: "Acme Corp", format: "a4",
                orientation: "portrait", rows: 6 };

  form.innerHTML =
    '<p class="demo-h">Document</p>' +
    '<p class="demo-p">Everything on the right is composed by jsPDF at millimetre level, then handed ' +
    "to PDF.js so you can see it. Nothing is uploaded.</p>" +
    '<dl class="kv" id="jspdf-stats"></dl>';

  var out = ctx.readout("");

  async function build() {
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF({ unit: "pt", format: state.format, orientation: state.orientation });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();

    doc.setFillColor(38, 70, 140);
    doc.rect(0, 0, W, 96, "F");
    doc.setTextColor(255);
    doc.setFontSize(24);
    doc.text(state.title, 44, 56);
    doc.setFontSize(11);
    doc.text(state.customer, 44, 78);

    doc.setTextColor(40);
    doc.setFontSize(10);
    var y = 140;
    doc.setFillColor(238, 241, 246);
    doc.rect(44, y - 16, W - 88, 22, "F");
    ["Item", "Qty", "Unit", "Total"].forEach(function (h, i) {
      doc.text(h, 52 + i * ((W - 110) / 4), y);
    });
    y += 26;
    var total = 0;
    for (var i = 0; i < state.rows; i++) {
      var qty = 1 + (i % 4), unit = 120 + i * 35;
      total += qty * unit;
      var cells = ["Library licence " + (i + 1), String(qty), "$" + unit, "$" + (qty * unit)];
      cells.forEach(function (c, j) { doc.text(c, 52 + j * ((W - 110) / 4), y); });
      doc.setDrawColor(225);
      doc.line(44, y + 7, W - 44, y + 7);
      y += 24;
    }
    doc.setFontSize(13);
    doc.text("Total  $" + total.toLocaleString(), W - 190, y + 24);

    /* Vector drawing, not an image. */
    doc.setDrawColor(38, 70, 140);
    doc.setLineWidth(2);
    var bx = 44, by = H - 190, bw = W - 88, bh = 110;
    doc.rect(bx, by, bw, bh);
    var pts = [0.2, 0.55, 0.35, 0.8, 0.6, 0.95, 0.75];
    for (var k = 0; k < pts.length - 1; k++) {
      doc.line(bx + (k / (pts.length - 1)) * bw, by + bh - pts[k] * bh,
               bx + ((k + 1) / (pts.length - 1)) * bw, by + bh - pts[k + 1] * bh);
    }
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("vector chart drawn with doc.line()", bx + 6, by + bh - 8);

    var bytes = doc.output("arraybuffer");
    var pdf = await pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
    var pg = await pdf.getPage(1);
    var dpr = Math.min(devicePixelRatio || 1, 2);
    var vp = pg.getViewport({ scale: (preview.clientWidth - 40) / pg.getViewport({ scale: 1 }).width * dpr });
    cv.width = vp.width; cv.height = vp.height;
    cv.style.width = (vp.width / dpr) + "px";
    await pg.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;

    document.getElementById("jspdf-stats").innerHTML =
      "<dt>format</dt><dd>" + state.format.toUpperCase() + " " + state.orientation + "</dd>" +
      "<dt>page size</dt><dd>" + Math.round(W) + " × " + Math.round(H) + " pt</dd>" +
      "<dt>line items</dt><dd>" + state.rows + "</dd>" +
      "<dt>total</dt><dd><b>$" + total.toLocaleString() + "</b></dd>" +
      "<dt>file size</dt><dd>" + (bytes.byteLength / 1024).toFixed(1) + " KB</dd>";
    out("built a <b>" + (bytes.byteLength / 1024).toFixed(1) + " KB</b> PDF entirely client-side");
    return doc;
  }
  await build();

  ctx.select("format", ["a4", "letter", "a5"], function (v) { state.format = v; build(); }, "a4");
  ctx.select("orientation", ["portrait", "landscape"], function (v) { state.orientation = v; build(); }, "portrait");
  ctx.range("line items", { min: 1, max: 14, value: 6 }, function (v) { state.rows = v; build(); });
  ctx.btn("Download", async function () {
    var doc = await build();
    doc.save("frontdemo-invoice.pdf");
  }, true);

  ctx.onResize(build);
};

/* ------------------------------------------------------------ html2canvas */
B.h2c = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("50%");

  var source = ctx.mk("div");
  source.style.cssText = "padding:22px";
  source.innerHTML =
    '<div id="h2c-target" style="background:linear-gradient(140deg,' + ctx.series(0) + ',' + ctx.series(4) +
    ');border-radius:16px;padding:22px;color:#0b0e14;font-family:' + T.sans + '">' +
      '<div style="font:700 21px ' + T.sans + '">Quarterly summary</div>' +
      '<div style="font:12px ' + T.mono + ';opacity:.8;margin-bottom:14px">generated ' +
        new Date().toISOString().slice(0, 10) + "</div>" +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        ["Revenue $1.2m", "Churn 3.1%", "NPS 47", "Uptime 99.98%"].map(function (s) {
          return '<span style="background:rgba(255,255,255,.75);border-radius:8px;padding:6px 11px;' +
                 'font:600 12px ' + T.sans + '">' + s + "</span>";
        }).join("") +
      "</div>" +
      '<div style="margin-top:16px;display:flex;gap:5px;align-items:flex-end;height:80px">' +
        [34, 58, 41, 72, 66, 88, 79].map(function (v) {
          return '<div style="flex:1;height:' + v + '%;background:rgba(11,14,20,.55);border-radius:4px 4px 0 0"></div>';
        }).join("") +
      "</div>" +
    "</div>" +
    '<p class="demo-note">This panel is live DOM: gradients, flexbox, rounded corners, the lot.</p>';
  p.a.appendChild(source);

  var right = ctx.mk("div");
  right.style.cssText = "padding:22px;min-height:100%";
  right.innerHTML = '<p class="demo-h">Rasterised copy</p>' +
    '<p class="demo-p">Press Capture. html2canvas re-implements enough CSS layout to repaint that ' +
    "subtree onto a canvas — it is a re-render, not a copy of the pixels the browser already drew.</p>" +
    '<div id="h2c-out" style="min-height:120px"></div>';
  p.b.appendChild(right);

  var out = ctx.readout("press Capture");
  var scale = 2;

  ctx.btn("Capture", function () {
    var target = document.getElementById("h2c-target");
    var t0 = performance.now();
    html2canvas(target, { backgroundColor: null, scale: scale, logging: false }).then(function (canvas) {
      var box = document.getElementById("h2c-out");
      box.innerHTML = "";
      canvas.style.cssText = "max-width:100%;border-radius:12px;box-shadow:0 6px 24px rgba(0,0,0,.35)";
      box.appendChild(canvas);
      out("captured <b>" + canvas.width + "×" + canvas.height + "</b> px in <b>" +
          Math.round(performance.now() - t0) + " ms</b>");
    }).catch(function (e) {
      out('<span style="color:' + T.bad + '">' + String(e.message || e).slice(0, 80) + "</span>");
    });
  }, true);
  ctx.select("scale", [{ v: "1", t: "1×" }, { v: "2", t: "2× (retina)" }, { v: "3", t: "3×" }],
             function (v) { scale = +v; }, "2");
};

/* ------------------------------------------------------------------ KaTeX */
B.katex = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("42%");

  var out = ctx.mk("div");
  out.style.cssText = "padding:24px;min-height:100%;font-size:17px;line-height:2.4;color:" + T.ink;
  p.b.appendChild(out);

  var samples = {
    "calculus": [
      "\\int_{-\\infty}^{\\infty} e^{-x^2}\\,dx = \\sqrt{\\pi}",
      "\\frac{\\partial}{\\partial t}\\Psi = \\frac{i\\hbar}{2m}\\nabla^2\\Psi",
      "\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n = e"
    ].join("\n"),
    "linear algebra": [
      "A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}",
      "\\det(A) = ad - bc",
      "A^{-1} = \\frac{1}{\\det A}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}"
    ].join("\n"),
    "statistics": [
      "\\hat{\\beta} = (X^\\top X)^{-1} X^\\top y",
      "\\sigma^2 = \\frac{1}{N}\\sum_{i=1}^{N}(x_i-\\mu)^2",
      "P(A\\mid B) = \\frac{P(B\\mid A)\\,P(A)}{P(B)}"
    ].join("\n"),
    "typography": [
      "\\sum_{k=0}^{n} \\binom{n}{k} x^k y^{n-k} = (x+y)^n",
      "\\begin{aligned} f(x) &= (x+1)^2 \\\\ &= x^2 + 2x + 1 \\end{aligned}",
      "\\overbrace{a+b+c}^{\\text{three terms}} \\quad \\underbrace{d\\cdot e}_{\\text{product}}"
    ].join("\n")
  };

  var status = ctx.readout("rendering is synchronous, so it keeps up with every keystroke");
  var display = true;

  function render(text) {
    out.innerHTML = "";
    var t0 = performance.now();
    var bad = 0;
    text.split("\n").forEach(function (line) {
      if (!line.trim()) return;
      var d = ctx.mk("div");
      d.style.margin = "18px 0";
      try {
        katex.render(line, d, { displayMode: display, throwOnError: false, output: "html" });
      } catch (e) {
        bad++;
        d.innerHTML = '<span style="color:' + T.bad + ';font-family:' + T.mono + ';font-size:12px">' +
                      ctx.esc(e.message.slice(0, 90)) + "</span>";
      }
      out.appendChild(d);
    });
    status("rendered in <b>" + (performance.now() - t0).toFixed(1) + " ms</b>" +
           (bad ? " · " + bad + " line(s) failed" : ""));
  }

  var editor = ctx.editor(p.a, samples.calculus, render);
  render(samples.calculus);

  ctx.select("sample", Object.keys(samples), function (v) {
    editor.value = samples[v];
    render(samples[v]);
  }, "calculus");
  ctx.check("display mode", true, function (v) { display = v; render(editor.value); });
};

})();
