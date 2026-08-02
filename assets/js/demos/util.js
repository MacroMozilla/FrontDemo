/* Utility and computation. */
(function () {
"use strict";
var B = window.B;

/* ---------------------------------------------------------------- Lodash */
B.lodash = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var people = [
    { name: "Ada",   team: "Platform", level: 5, active: true,  joined: "2021-04-02", skills: ["rust", "wasm"] },
    { name: "Bo",    team: "Growth",   level: 3, active: true,  joined: "2023-11-14", skills: ["react"] },
    { name: "Cleo",  team: "Platform", level: 4, active: false, joined: "2020-01-30", skills: ["go", "sql"] },
    { name: "Dev",   team: "Payments", level: 5, active: true,  joined: "2019-08-21", skills: ["java"] },
    { name: "Eli",   team: "Growth",   level: 2, active: true,  joined: "2025-02-10", skills: ["css", "react"] },
    { name: "Fay",   team: "Payments", level: 4, active: false, joined: "2022-06-05", skills: ["kotlin"] },
    { name: "Gus",   team: "Platform", level: 3, active: true,  joined: "2024-09-19", skills: ["rust"] }
  ];

  var box = ctx.mk("div");
  ctx.el.appendChild(box);

  function show(label, code, value) {
    return '<div style="margin-bottom:14px">' +
      '<div style="font-family:' + T.mono + ';font-size:11.5px;color:' + T.accent + '">' +
        ctx.esc(code) + "</div>" +
      '<div class="demo-note" style="margin:2px 0 4px">' + label + "</div>" +
      '<pre class="demo-pre">' + ctx.esc(JSON.stringify(value, null, 1)) + "</pre></div>";
  }

  var out = ctx.readout("");
  function render() {
    var html = '<p class="demo-h">Live against the seven records below</p>';

    html += show("group records by a key",
      '_.groupBy(people, "team")',
      _.mapValues(_.groupBy(people, "team"), function (g) { return _.map(g, "name"); }));

    html += show("deep clone, then mutate the copy only",
      "_.cloneDeep(people[0]) — mutate .skills on the clone",
      (function () {
        var clone = _.cloneDeep(people[0]);
        clone.skills.push("MUTATED");
        return { original: people[0].skills, clone: clone.skills };
      })());

    html += show("sort by several keys with mixed direction",
      '_.orderBy(people, ["level", "name"], ["desc", "asc"])',
      _.orderBy(people, ["level", "name"], ["desc", "asc"]).map(function (p) { return p.level + " " + p.name; }));

    html += show("a lazy chain — nothing runs until .value()",
      '_.chain(people).filter("active").sortBy("joined").take(3).map("name").value()',
      _.chain(people).filter("active").sortBy("joined").take(3).map("name").value());

    html += show("set a nested path that does not exist yet",
      '_.set({}, "a.b.c[0].d", 42)',
      _.set({}, "a.b.c[0].d", 42));

    html += show("difference, union, intersection on the flattened skills",
      '_.intersection(...) / _.xor(...)',
      (function () {
        var all = _.map(people, "skills");
        return {
          everyone: _.union.apply(_, all),
          "platform ∩ growth": _.intersection(
            _.union.apply(_, _.map(_.filter(people, { team: "Platform" }), "skills")),
            _.union.apply(_, _.map(_.filter(people, { team: "Growth" }), "skills"))),
          counts: _.countBy(_.flatten(all))
        };
      })());

    html += '<p class="demo-note">Most of this is now in the language — <code>Object.groupBy</code>, ' +
            "<code>structuredClone</code>, <code>Array.prototype.at</code>. What keeps Lodash installed is " +
            "the long tail: <code>_.set</code> on a missing path, lazy chains, and <code>_.debounce</code> " +
            "with the leading/trailing edge cases already handled.</p>";

    box.innerHTML = html;
    out("<b>" + Object.keys(_).length + "</b> functions in the full build (71 KB) — import per function in real code");
  }
  render();

  /* A live debounce, because it is the function people actually reach for. */
  var hits = 0, fires = 0;
  var log = ctx.readout("");
  var debounced = _.debounce(function () { fires++; update(); }, 400);
  function update() { log("keystrokes <b>" + hits + "</b> → debounced calls <b>" + fires + "</b>"); }
  update();
  ctx.text("type fast", "", function () { hits++; update(); debounced(); }, "130px");
};

/* -------------------------------------------------------------- chroma.js */
B.chroma = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var box = ctx.mk("div");
  ctx.el.appendChild(box);

  var from = "#2b6cf0", to = "#f0c419", steps = 11;
  var out = ctx.readout("");

  function ramp(mode) {
    return chroma.scale([from, to]).mode(mode).colors(steps);
  }
  function swatches(colors) {
    return '<div class="swatches">' + colors.map(function (c) {
      return '<i style="background:' + c + '" title="' + c + '"></i>';
    }).join("") + "</div>";
  }

  function render() {
    var modes = ["rgb", "lab", "lch", "hsl"];
    var html = '<p class="demo-h">The same two endpoints, interpolated four ways</p>' +
      '<p class="demo-p">Look at the middle of each strip. RGB interpolation goes muddy; Lab and LCH ' +
      "keep the lightness even. That is the entire argument for using a perceptual space.</p>";

    modes.forEach(function (m) {
      html += '<div style="margin-bottom:12px">' +
        '<div class="demo-note" style="margin-bottom:4px">mode <b style="color:' + T.accent + '">' + m +
        "</b> — <code>chroma.scale([a,b]).mode('" + m + "').colors(" + steps + ")</code></div>" +
        swatches(ramp(m)) + "</div>";
    });

    /* Contrast is the other thing chroma is used for every day. */
    var samples = [from, to, "#ffffff", "#111111", T.accent, T.panel];
    html += '<p class="demo-h" style="margin-top:18px">WCAG contrast against white and black</p><table class="demo-tbl">' +
      "<thead><tr><th>colour</th><th>vs white</th><th>vs black</th><th>luminance</th><th>readable on</th></tr></thead><tbody>";
    samples.forEach(function (c) {
      var w = chroma.contrast(c, "white"), b = chroma.contrast(c, "black");
      html += "<tr>" +
        '<td><span style="display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:-3px;background:' +
          c + '"></span> <code>' + c + "</code></td>" +
        '<td class="num" style="color:' + (w >= 4.5 ? T.yes : T.bad) + '">' + w.toFixed(2) + "</td>" +
        '<td class="num" style="color:' + (b >= 4.5 ? T.yes : T.bad) + '">' + b.toFixed(2) + "</td>" +
        '<td class="num">' + chroma(c).luminance().toFixed(3) + "</td>" +
        "<td>" + (w >= 4.5 && b >= 4.5 ? "both" : w >= 4.5 ? "white" : b >= 4.5 ? "black" : "neither at AA") + "</td>" +
        "</tr>";
    });
    html += "</tbody></table>";

    html += '<p class="demo-h" style="margin-top:18px">Colour-blind safe categorical set</p>' +
      swatches(chroma.brewer.Set2) +
      '<p class="demo-note">All of ColorBrewer ships with the library as <code>chroma.brewer</code>.</p>';

    box.innerHTML = html;
    out("bezier vs linear, Lab vs RGB — <b>" + steps + "</b> steps each");
  }
  render();

  ctx.text("from", from, function (v) { if (chroma.valid(v)) { from = v; render(); } }, "90px");
  ctx.text("to", to, function (v) { if (chroma.valid(v)) { to = v; render(); } }, "90px");
  ctx.range("steps", { min: 3, max: 24, value: 11 }, function (v) { steps = v; render(); });
};

/* ---------------------------------------------------------------- math.js */
B.mathjs = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var right = ctx.mk("div");
  right.style.cssText = "padding:18px;min-height:100%";
  right.innerHTML = '<div id="mj-out"></div>';
  p.b.appendChild(right);

  var SOURCE = [
    "# units are first class",
    "12.7 cm to inch",
    "90 km/h to m/s",
    "(3 W + 200 mW) to W",
    "",
    "# matrices",
    "A = [[2, 1], [1, 3]]",
    "det(A)",
    "inv(A)",
    "A * [1; 2]",
    "",
    "# complex numbers",
    "sqrt(-4)",
    "(2 + 3i) * (1 - i)",
    "",
    "# symbolic differentiation",
    "derivative('x^3 + 2x^2 - 5x', 'x')",
    "simplify('2x + 3x + x^2')",
    "",
    "# statistics",
    "std([2, 4, 6, 8, 10])",
    "median([7, 1, 9, 3])",
    "",
    "# big numbers, exactly",
    "bignumber(1) / bignumber(3)"
  ].join("\n");

  var out = ctx.readout("");
  function run(text) {
    var scope = {};
    var html = "";
    var errors = 0, evaluated = 0;
    text.split("\n").forEach(function (line) {
      var t = line.trim();
      if (!t) { html += '<div style="height:8px"></div>'; return; }
      if (t[0] === "#") {
        html += '<p class="demo-h" style="margin:12px 0 6px">' + ctx.esc(t.slice(1).trim()) + "</p>";
        return;
      }
      var result, bad = false;
      try { result = math.evaluate(t, scope); evaluated++; }
      catch (e) { result = e.message; bad = true; errors++; }
      html += '<div style="display:flex;gap:10px;align-items:baseline;padding:3px 0;border-bottom:1px solid ' +
        T.line + '">' +
        '<code style="flex:1 1 50%;color:' + T.ink2 + '">' + ctx.esc(t) + "</code>" +
        '<code style="flex:1 1 50%;color:' + (bad ? T.bad : T.accent) + ';text-align:right;overflow-wrap:anywhere">' +
        ctx.esc(math.format(result, { precision: 8 })) + "</code></div>";
    });
    document.getElementById("mj-out").innerHTML = html;
    out("<b>" + evaluated + "</b> expressions evaluated" +
        (errors ? ' · <span style="color:' + T.bad + '">' + errors + " failed</span>" : ""));
  }

  var editor = ctx.editor(p.a, SOURCE, run);
  run(SOURCE);
  ctx.label("lines beginning with # are headings · everything else is evaluated in one shared scope");
};

/* ------------------------------------------------------------- DOMPurify */
B.purify = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  ctx.mount("scroll pad");

  var PAYLOADS = [
    ['<img src=x onerror="alert(1)">', "the classic broken-image handler"],
    ['<a href="javascript:alert(1)">click me</a>', "javascript: URL"],
    ['<svg><script>alert(1)</script></svg>', "script smuggled inside SVG"],
    ['<iframe src="https://evil.example"></iframe>', "framed third-party content"],
    ['<div style="background:url(javascript:alert(1))">styled</div>', "expression in a style attribute"],
    ['<form action="/x"><button formaction="javascript:alert(1)">go</button></form>', "formaction override"],
    ['<p onmouseover="alert(1)">hover me</p>', "inline event handler"],
    ['<math><mtext><table><mglyph><style><!--</style><img src=1 onerror=alert(1)>',
      "mXSS through mutation — the reason regex filters fail"],
    ['<b>Legitimate <i>markup</i></b> with a <a href="https://example.com">real link</a>.',
      "safe content, kept intact"]
  ];

  var strict = false;
  var box = ctx.mk("div");
  ctx.el.appendChild(box);
  var out = ctx.readout("");

  function render() {
    var config = strict
      ? { ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"], ALLOWED_ATTR: [] }
      : {};
    var stripped = 0;
    var html = '<p class="demo-h">Every payload below is a real XSS attempt</p>' +
      '<p class="demo-p">The middle column is what the browser would execute if you assigned it to ' +
      "<code>innerHTML</code>. The right column is what DOMPurify leaves behind — and that is what is " +
      "actually rendered underneath it.</p>" +
      '<table class="demo-tbl"><thead><tr><th style="width:34%">input</th><th style="width:34%">after sanitising</th>' +
      "<th>rendered</th></tr></thead><tbody>";

    PAYLOADS.forEach(function (pair) {
      var clean = DOMPurify.sanitize(pair[0], config);
      if (clean !== pair[0]) stripped++;
      html += "<tr>" +
        '<td><code style="color:' + T.bad + ';font-size:11px">' + ctx.esc(pair[0]) + "</code>" +
          '<div class="demo-note">' + pair[1] + "</div></td>" +
        '<td><code style="color:' + (clean ? T.yes : T.muted) + ';font-size:11px">' +
          (clean ? ctx.esc(clean) : "(removed entirely)") + "</code></td>" +
        '<td style="color:' + T.ink2 + '">' + clean + "</td>" +
        "</tr>";
    });
    html += "</tbody></table>" +
      '<p class="demo-note">Note the last row: safe markup survives untouched. A sanitiser that ' +
      "deletes everything is easy; keeping the legitimate parts is the hard bit.</p>";
    box.innerHTML = html;
    out("<b>" + stripped + "</b> of " + PAYLOADS.length + " payloads altered" +
        (strict ? " · strict allow-list active" : ""));
  }
  render();

  ctx.check("strict allow-list (b, i, em, strong, p, br only)", false, function (v) { strict = v; render(); });
  ctx.label("DOMPurify.sanitize(dirty, config)");
};

})();
