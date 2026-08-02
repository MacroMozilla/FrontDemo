/* Icon sets. Both of these are SVG-in-JS, so an icon is data you can
   restyle rather than a glyph in a font you cannot. */
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
function searchBox(ctx, parent, placeholder, onInput) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:relative;margin-bottom:12px";
  var i = ctx.mk("input");
  i.type = "search";
  i.placeholder = placeholder;
  i.spellcheck = false;
  i.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line2 +
    ";border-radius:10px;padding:11px 15px 11px 38px;color:" + T.ink + ";font:500 14px " + T.sans +
    ";outline:none";
  i.addEventListener("focus", function () { i.style.borderColor = T.accent; });
  i.addEventListener("blur", function () { i.style.borderColor = T.line2; });
  i.addEventListener("input", function () { onInput(i.value); });
  var ico = ctx.mk("span");
  ico.textContent = "⌕";
  ico.style.cssText = "position:absolute;left:14px;top:50%;transform:translateY(-50%);font-size:16px;color:" + T.muted;
  wrap.appendChild(i); wrap.appendChild(ico);
  parent.appendChild(wrap);
  return i;
}

/* Turn PascalCase into the kebab-case name people actually type. */
function kebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}

/* ----------------------------------------------------------------- Lucide */
B.lucide = async function (ctx) {
  var T = ctx.T;
  ctx.mount("pad");
  ctx.tall();

  var names = Object.keys(lucide.icons).filter(function (k) {
    return Array.isArray(lucide.icons[k]);
  });

  var wrap = ctx.mk("div");
  wrap.style.cssText = "height:100%;display:flex;flex-direction:column;min-height:0";
  var top = ctx.mk("div");
  top.style.cssText = "flex:0 0 auto";
  top.innerHTML = '<p class="demo-h">' + names.length + " icons, and every one is just an array of paths</p>" +
    '<p class="demo-p">Search, then click any icon to see the markup it produces. Stroke width and size ' +
    "are attributes on the SVG, not separate files — which is why one icon set covers hairline and bold " +
    "without shipping twice.</p>";
  wrap.appendChild(top);
  var searchHost = ctx.mk("div");
  searchHost.style.cssText = "flex:0 0 auto";
  wrap.appendChild(searchHost);

  var body = ctx.mk("div");
  body.style.cssText = "flex:1 1 auto;min-height:0;display:flex;gap:14px";
  wrap.appendChild(body);
  ctx.el.appendChild(wrap);

  var gridBox = ctx.mk("div");
  gridBox.style.cssText = "flex:1 1 auto;min-width:0;overflow:auto;border:1px solid " + T.line +
    ";border-radius:12px;background:" + T.sunk + ";padding:12px";
  var side = ctx.mk("div");
  side.style.cssText = "flex:0 0 300px;overflow:auto";
  body.appendChild(gridBox);
  body.appendChild(side);

  var detailCard = card(ctx, side, "SELECTED", "");
  var detailHost = ctx.mk("div");
  detailCard.appendChild(detailHost);

  var usageCard = card(ctx, side, "HOW IT IS USED", "");
  usageCard.insertAdjacentHTML("beforeend",
    '<pre class="demo-pre" style="max-height:none">' + ctx.esc(
      "<!-- markup -->\n" +
      '<i data-lucide="camera"></i>\n\n' +
      "// once, after render\n" +
      "lucide.createIcons()\n\n" +
      "// or build a node directly\n" +
      "const el = lucide.createElement(\n" +
      "  lucide.icons.Camera,\n" +
      "  { 'stroke-width': 1.5 }\n" +
      ")") + "</pre>");

  var out = ctx.readout("");
  var size = 24, stroke = 2, colour = "accent", query = "", selected = "Activity";

  var input = searchBox(ctx, searchHost, "Search " + names.length + " icons…", function (v) {
    query = v.trim().toLowerCase();
    drawGrid();
  });

  function colourOf(i) {
    return colour === "accent" ? T.accent : colour === "ink" ? T.ink : ctx.series(i % 8);
  }

  function drawGrid() {
    var list = query
      ? names.filter(function (n) { return kebab(n).indexOf(query) >= 0; })
      : names;
    var shown = list.slice(0, 420);
    gridBox.innerHTML = "";
    var grid = ctx.mk("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(" +
      Math.max(64, size * 2.6) + "px,1fr));gap:8px";
    shown.forEach(function (n, i) {
      var cell = ctx.mk("button");
      cell.type = "button";
      cell.title = kebab(n);
      cell.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;" +
        "border-radius:9px;border:1px solid " + (n === selected ? T.accent : "transparent") +
        ";background:" + (n === selected ? T.panel : "transparent") + ";cursor:pointer;color:" +
        colourOf(i) + ";overflow:hidden";
      var svg = lucide.createElement(lucide.icons[n], {
        width: size, height: size, "stroke-width": stroke
      });
      cell.appendChild(svg);
      var lab = ctx.mk("div");
      lab.style.cssText = "font:500 9px " + T.mono + ";color:" + T.muted +
        ";max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
      lab.textContent = kebab(n);
      cell.appendChild(lab);
      cell.addEventListener("click", function () { selected = n; drawGrid(); drawDetail(); });
      grid.appendChild(cell);
    });
    gridBox.appendChild(grid);
    if (list.length > shown.length) {
      var more = ctx.mk("p", "demo-note", "…and " + (list.length - shown.length) +
        " more. Narrow the search to see them.");
      more.style.textAlign = "center";
      gridBox.appendChild(more);
    }
    if (!list.length) gridBox.innerHTML = '<p class="demo-note">Nothing matches that.</p>';
    out("<b>" + list.length + "</b> of " + names.length + " icons match");
  }

  function drawDetail() {
    var svg = lucide.createElement(lucide.icons[selected], {
      width: 88, height: 88, "stroke-width": stroke
    });
    detailHost.innerHTML = "";
    var box = ctx.mk("div");
    box.style.cssText = "display:flex;align-items:center;gap:16px;margin-bottom:12px;color:" + T.accent;
    box.appendChild(svg);
    var meta = ctx.mk("div");
    meta.innerHTML = '<div style="font:600 15px ' + T.sans + ";color:" + T.ink + '">' +
      ctx.esc(kebab(selected)) + "</div>" +
      '<div style="font:500 11px ' + T.mono + ";color:" + T.muted + ';margin-top:4px">' +
      lucide.icons[selected].length + " path element" +
      (lucide.icons[selected].length === 1 ? "" : "s") + " · 24×24 grid</div>";
    box.appendChild(meta);
    detailHost.appendChild(box);
    var pre = ctx.mk("pre", "demo-pre");
    pre.style.maxHeight = "none";
    pre.textContent = lucide.createElement(lucide.icons[selected], {
      width: size, height: size, "stroke-width": stroke
    }).outerHTML.replace(/></g, ">\n<");
    detailHost.appendChild(pre);
  }

  drawGrid();
  drawDetail();

  ctx.range("size", { min: 14, max: 48, value: 24, fmt: function (v) { return v + "px"; } },
    function (v) { size = v; drawGrid(); drawDetail(); });
  ctx.range("stroke", { min: 0.5, max: 3, step: 0.25, value: 2 },
    function (v) { stroke = v; drawGrid(); drawDetail(); });
  ctx.select("colour", ["accent", "ink", "rainbow"], function (v) { colour = v; drawGrid(); }, "accent");
  ctx.btn("Show only arrows", function () { input.value = "arrow"; query = "arrow"; drawGrid(); }, true);
  ctx.btn("Clear", function () { input.value = ""; query = ""; drawGrid(); });
};

/* ---------------------------------------------------------------- Feather */
B.feather = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var names = Object.keys(feather.icons);

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">' + names.length + " icons on a 24×24 grid, and the set Lucide forked</p>" +
    '<p class="demo-p">Feather is deliberately small and finished. The panel at the bottom is the ' +
    "honest comparison: which names exist in both sets, and which ones only Lucide has — that is the " +
    "trade you are making between a fixed vocabulary and a growing one.</p>";
  ctx.el.appendChild(host);

  var toolCard = card(ctx, ctx.el, "THE WHOLE SET", "Click an icon for its markup. Every one is inlined SVG.");
  var input = searchBox(ctx, toolCard, "Search " + names.length + " icons…", function (v) {
    query = v.trim().toLowerCase(); drawGrid();
  });
  var gridHost = ctx.mk("div");
  gridHost.style.cssText = "max-height:330px;overflow:auto";
  toolCard.appendChild(gridHost);

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  var detailCard = card(ctx, colA, "SELECTED", "");
  var detailHost = ctx.mk("div");
  detailCard.appendChild(detailHost);

  var replaceCard = card(ctx, colA, "feather.replace()",
    "The other API: put <code>data-feather</code> on any element and swap them all in one pass.");
  var replaceHost = ctx.mk("div");
  replaceHost.style.cssText = "display:flex;gap:10px;flex-wrap:wrap;align-items:center;color:" + T.accent;
  replaceCard.appendChild(replaceHost);

  var cmpCard = card(ctx, colB, "FEATHER VERSUS LUCIDE",
    "Lucide started as a fork of Feather. Loaded here from the two vendored bundles, counted live.");
  var cmpHost = ctx.mk("div");
  cmpCard.appendChild(cmpHost);

  var out = ctx.readout("");
  var size = 24, stroke = 2, query = "", selected = "activity";

  function drawGrid() {
    var list = query ? names.filter(function (n) { return n.indexOf(query) >= 0; }) : names;
    gridHost.innerHTML = "";
    var grid = ctx.mk("div");
    grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(" +
      Math.max(66, size * 2.6) + "px,1fr));gap:8px";
    list.forEach(function (n) {
      var cell = ctx.mk("button");
      cell.type = "button";
      cell.title = n;
      cell.style.cssText = "display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px;" +
        "border-radius:9px;border:1px solid " + (n === selected ? T.accent : "transparent") +
        ";background:" + (n === selected ? T.panel : "transparent") + ";cursor:pointer;color:" +
        T.accent + ";overflow:hidden";
      cell.innerHTML = feather.toSvg(n, { width: size, height: size, "stroke-width": stroke }) +
        '<div style="font:500 9px ' + T.mono + ";color:" + T.muted +
        ';max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + n + "</div>";
      cell.addEventListener("click", function () { selected = n; drawGrid(); drawDetail(); });
      grid.appendChild(cell);
    });
    gridHost.appendChild(grid);
    if (!list.length) gridHost.innerHTML = '<p class="demo-note">Nothing matches that.</p>';
    out("<b>" + list.length + "</b> of " + names.length + " icons match");
  }

  function drawDetail() {
    detailHost.innerHTML =
      '<div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;color:' + T.accent + '">' +
      feather.toSvg(selected, { width: 88, height: 88, "stroke-width": stroke }) +
      '<div><div style="font:600 15px ' + T.sans + ";color:" + T.ink + '">' + ctx.esc(selected) + "</div>" +
      '<div style="font:500 11px ' + T.mono + ";color:" + T.muted + ';margin-top:4px">tags: ' +
      ctx.esc((feather.icons[selected].tags || []).join(", ") || "none") + "</div></div></div>" +
      '<pre class="demo-pre" style="max-height:none">' +
      ctx.esc(feather.toSvg(selected, { width: size, height: size, "stroke-width": stroke })
        .replace(/></g, ">\n<")) + "</pre>";
  }

  function drawReplace() {
    replaceHost.innerHTML = ["home", "search", "settings", "bell", "user", "download", "git-branch", "zap"]
      .map(function (n) {
        return '<i data-feather="' + n + '"></i>';
      }).join("");
    feather.replace({ width: 26, height: 26, "stroke-width": stroke });
  }

  function drawCompare() {
    var lucideNames = Object.keys(lucide.icons)
      .filter(function (k) { return Array.isArray(lucide.icons[k]); })
      .map(kebab);
    var lucideSet = {};
    lucideNames.forEach(function (n) { lucideSet[n] = 1; });
    var shared = names.filter(function (n) { return lucideSet[n]; });
    var onlyFeather = names.filter(function (n) { return !lucideSet[n]; });

    var rows = [
      ["Feather icons", names.length, ctx.series(0)],
      ["Lucide icons", lucideNames.length, ctx.series(1)],
      ["names in both", shared.length, ctx.series(2)],
      ["Feather-only names", onlyFeather.length, ctx.series(3)]
    ];
    var max = Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    cmpHost.innerHTML = rows.map(function (r) {
      return '<div style="margin-bottom:11px">' +
        '<div style="display:flex;justify-content:space-between;font:600 11.5px ' + T.mono +
          ";color:" + T.ink2 + ';margin-bottom:4px"><span>' + r[0] + "</span><span>" + r[1] + "</span></div>" +
        '<div style="height:9px;border-radius:5px;background:' + T.sunk + '">' +
        '<div style="height:100%;border-radius:5px;width:' + (r[1] / max * 100).toFixed(1) +
          "%;background:" + r[2] + '"></div></div></div>';
    }).join("") +
      '<p class="demo-note" style="margin:10px 0 0">Feather-only names: <code>' +
      ctx.esc(onlyFeather.slice(0, 14).join(", ") || "none") + "</code>" +
      (onlyFeather.length > 14 ? " …" : "") + "</p>";
  }

  /* The comparison needs Lucide's bundle too — it is the honest way to
     count, rather than quoting a number from a README. */
  await ctx.need("lucide");

  drawGrid();
  drawDetail();
  drawReplace();
  drawCompare();

  ctx.range("size", { min: 14, max: 48, value: 24, fmt: function (v) { return v + "px"; } },
    function (v) { size = v; drawGrid(); drawDetail(); });
  ctx.range("stroke", { min: 0.5, max: 3, step: 0.25, value: 2 },
    function (v) { stroke = v; drawGrid(); drawDetail(); drawReplace(); });
  ctx.btn("Only 'arrow'", function () { input.value = "arrow"; query = "arrow"; drawGrid(); });
  ctx.btn("Clear", function () { input.value = ""; query = ""; drawGrid(); }, true);
};

})();
