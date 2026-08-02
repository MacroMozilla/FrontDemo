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
        ctx.esc(math.format(result, { precision: precision, notation: notation })) + "</code></div>";
    });
    document.getElementById("mj-out").innerHTML = html;
    out("<b>" + evaluated + "</b> expressions evaluated" +
        (errors ? ' · <span style="color:' + T.bad + '">' + errors + " failed</span>" : "") +
        " · precision <b>" + precision + "</b>");
  }

  var precision = 8, notation = "auto";
  var editor = ctx.editor(p.a, SOURCE, run);
  run(SOURCE);

  /* Extra sheets, so the demo covers more of the library than one screen
     of arithmetic — each one replaces the editor's contents. */
  var SHEETS = {
    "the tour": SOURCE,
    "units and physics": [
      "# units are first-class values",
      "5.4 kg + 300 g",
      "(12 cm * 3) to inch",
      "90 km/h to m/s",
      "0.5 kWh to J",
      "40 degC to degF",
      "",
      "# they survive algebra",
      "v = 90 km/h",
      "t = 12 s",
      "v * t to m",
      "",
      "# and they refuse nonsense",
      "2 kg + 3 m"
    ].join("\n"),
    "matrices": [
      "# construction",
      "A = [[2, 1, -1], [-3, -1, 2], [-2, 1, 2]]",
      "b = [8, -11, -3]",
      "",
      "# solve Ax = b",
      "x = lusolve(A, b)",
      "",
      "# the usual operations",
      "det(A)",
      "inv(A)",
      "transpose(A)",
      "A * inv(A)",
      "",
      "# element-wise vs matrix",
      "A .* A",
      "A ^ 2"
    ].join("\n"),
    "symbolic algebra": [
      "# simplify",
      "simplify('2x + 3x + x^2 - x')",
      "simplify('(x + 1)^2')",
      "",
      "# differentiate",
      "derivative('x^3 + 2x^2 - 5x', 'x')",
      "derivative('sin(x) * e^x', 'x')",
      "derivative('log(x^2)', 'x')",
      "",
      "# rationalise, then read the tree",
      "rationalize('2x/(x^2 - 1) + 1')",
      "parse('a * b + c').toString()"
    ].join("\n"),
    "precision and floats": [
      "# the classic",
      "0.1 + 0.2",
      "0.1 + 0.2 == 0.3",
      "",
      "# BigNumber, arbitrary precision",
      "bignumber(0.1) + bignumber(0.2)",
      "bignumber(1) / bignumber(3)",
      "",
      "# Fraction, exact",
      "fraction(1, 3) + fraction(1, 6)",
      "fraction(0.1) + fraction(0.2)",
      "",
      "# complex numbers",
      "sqrt(-4)",
      "(2 + 3i) * (1 - i)",
      "arg(1 + i) / pi"
    ].join("\n")
  };

  ctx.select("sheet", Object.keys(SHEETS), function (v) {
    editor.value = SHEETS[v];
    run(SHEETS[v]);
  }, "the tour");
  ctx.range("precision", { min: 3, max: 20, value: 8 }, function (v) {
    precision = v; run(editor.value);
  });
  ctx.select("notation", ["auto", "fixed", "exponential", "engineering"], function (v) {
    notation = v; run(editor.value);
  }, "auto");
  ctx.label("# lines are headings · everything else shares one scope");
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


/* ----------------------------------------------------------------- Ramda */
B.ramda = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">A pipeline you can take apart</p>' +
    '<p class="demo-p">Every function below is curried and takes its data last, which is why they ' +
    "compose into one <code>R.pipe</code> with no lambdas in between. Switch stages off and watch " +
    "the intermediate output at each step — the pipeline is data, not a method chain.</p>";
  ctx.el.appendChild(host);

  var RAW = [
    { name: "Northwind", region: "emea", amount: 1290, tags: ["gold", "renewal"], open: true },
    { name: "Contoso", region: "amer", amount: 640, tags: ["silver"], open: false },
    { name: "Fabrikam", region: "emea", amount: 1808, tags: ["gold"], open: true },
    { name: "Adventure Works", region: "apac", amount: 450, tags: ["bronze", "trial"], open: true },
    { name: "Tailspin", region: "amer", amount: 2210, tags: ["gold", "renewal"], open: true },
    { name: "Wingtip", region: "apac", amount: 310, tags: ["trial"], open: false },
    { name: "Litware", region: "emea", amount: 980, tags: ["silver", "renewal"], open: true },
    { name: "Proseware", region: "amer", amount: 1520, tags: ["gold"], open: true }
  ];

  var STAGES = [
    { on: true, label: "R.filter(R.propEq(true, 'open'))",
      note: "keep the open ones", fn: R.filter(R.propEq(true, "open")) },
    { on: true, label: "R.map(R.evolve({ amount: R.multiply(1.2) }))",
      note: "add 20% tax, leaving every other key alone",
      fn: R.map(R.evolve({ amount: R.multiply(1.2) })) },
    { on: true, label: "R.sortWith([R.descend(R.prop('amount'))])",
      note: "largest first", fn: R.sortWith([R.descend(R.prop("amount"))]) },
    { on: true, label: "R.groupBy(R.prop('region'))",
      note: "one key per region", fn: R.groupBy(R.prop("region")) },
    { on: true, label: "R.map(R.pluck('amount'))",
      note: "collapse each group to its amounts", fn: R.map(R.pluck("amount")) },
    { on: true, label: "R.map(R.sum)", note: "and total them", fn: R.map(R.sum) }
  ];

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  function panel(parent, title, note) {
    var c = ctx.mk("div");
    c.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
      ";border-radius:12px;padding:14px 16px;margin-bottom:14px";
    c.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
      ';margin:0 0 9px">' + title + "</div>" +
      (note ? '<p class="demo-note" style="margin:0 0 10px">' + note + "</p>" : "");
    parent.appendChild(c);
    return c;
  }

  var pipeCard = panel(colA, "THE PIPELINE", "Click a stage to switch it off.");
  var pipeHost = ctx.mk("div");
  pipeCard.appendChild(pipeHost);

  var stepCard = panel(colB, "OUTPUT AFTER EACH STAGE", "");
  var stepHost = ctx.mk("div");
  stepCard.appendChild(stepHost);

  var curryCard = panel(ctx.el, "CURRYING AND LENSES",
    "Currying is what makes point-free composition possible; lenses are how you update nested data " +
    "without mutating it.");
  var curryHost = ctx.mk("div");
  curryCard.appendChild(curryHost);

  var out = ctx.readout("");

  function short(v) {
    var s = JSON.stringify(v, null, 1).replace(/\n\s*/g, " ");
    return s.length > 260 ? s.slice(0, 260) + " …" : s;
  }

  function run() {
    var active = STAGES.filter(function (s2) { return s2.on; });
    var value = RAW;
    var steps = [["input", RAW]];
    active.forEach(function (s2) {
      try { value = s2.fn(value); } catch (e) { value = { error: e.message }; }
      steps.push([s2.label, value]);
    });

    pipeHost.innerHTML = STAGES.map(function (s2, i) {
      return '<div data-i="' + i + '" style="cursor:pointer;padding:9px 11px;border-radius:8px;' +
        "margin-bottom:7px;border:1px solid " + (s2.on ? ctx.series(i) : T.line) + ";background:" +
        T.sunk + ";opacity:" + (s2.on ? "1" : ".45") + '">' +
        '<code style="font-size:11.5px;color:' + (s2.on ? T.ink : T.muted) + '">' +
        ctx.esc(s2.label) + "</code>" +
        '<div style="font-size:11px;color:' + T.muted + ';margin-top:3px">' + s2.note + "</div></div>";
    }).join("");
    pipeHost.querySelectorAll("[data-i]").forEach(function (el) {
      el.addEventListener("click", function () {
        STAGES[+el.dataset.i].on = !STAGES[+el.dataset.i].on;
        run();
      });
    });

    stepHost.innerHTML = steps.map(function (st, i) {
      return '<div style="margin-bottom:10px">' +
        '<div style="font:600 10px ' + T.mono + ";color:" + (i ? ctx.series(i - 1) : T.muted) +
        ';margin-bottom:4px">' + ctx.esc(i ? "→ " + st[0] : st[0]) + "</div>" +
        '<pre class="demo-pre" style="max-height:112px;font-size:11px">' +
        ctx.esc(short(st[1])) + "</pre></div>";
    }).join("");

    out("<b>" + active.length + "</b> of " + STAGES.length + " stages active");
  }

  /* Currying and lenses, computed live so the numbers are real. */
  var lensAmount = R.lensProp("amount");
  var lensFirstTag = R.lensPath([0, "tags", 0]);
  var discount = R.curry(function (pct, order) { return R.over(lensAmount, R.multiply(1 - pct), order); });
  var half = discount(0.5);
  curryHost.innerHTML = '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
    '<colgroup><col style="width:300px"><col></colgroup><tbody>' + [
      ["R.add(2)(3)", R.add(2)(3)],
      ["R.map(R.add(10), [1,2,3])", short(R.map(R.add(10), [1, 2, 3]))],
      ["const half = discount(0.5)", "a new function, waiting for an order"],
      ["half(RAW[0]).amount", half(RAW[0]).amount],
      ["RAW[0].amount  (unchanged)", RAW[0].amount],
      ["R.view(lensPath([0,'tags',0]), RAW)", R.view(lensFirstTag, RAW)],
      ["R.set(lensPath([0,'tags',0]), 'platinum', RAW)[0].tags", short(R.set(lensFirstTag, "platinum", RAW)[0].tags)],
      ["RAW[0].tags  (still)", short(RAW[0].tags)],
      ["R.equals({a:[1,2]}, {a:[1,2]})", String(R.equals({ a: [1, 2] }, { a: [1, 2] }))],
      ["{a:[1,2]} === {a:[1,2]}", "false"],
      ["R.countBy(R.prop('region'), RAW)", short(R.countBy(R.prop("region"), RAW))],
      ["R.mean(R.pluck('amount', RAW))", R.mean(R.pluck("amount", RAW)).toFixed(1)]
    ].map(function (r) {
      return "<tr><td><code>" + ctx.esc(r[0]) + '</code></td><td style="font-family:' + T.mono +
        ';font-size:11.5px;word-break:break-all">' + ctx.esc(String(r[1])) + "</td></tr>";
    }).join("") + "</tbody></table>";

  run();

  ctx.btn("All stages on", function () {
    STAGES.forEach(function (s2) { s2.on = true; }); run();
  }, true);
  ctx.btn("Only the filter", function () {
    STAGES.forEach(function (s2, i) { s2.on = i === 0; }); run();
  });
  ctx.btn("Nothing (raw data)", function () {
    STAGES.forEach(function (s2) { s2.on = false; }); run();
  });
};

/* ---------------------------------------------------------- validator.js */
B.validator = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">The edge cases are the whole library</p>' +
    '<p class="demo-p">Anyone can write an email regex. The value here is the accumulated set of ' +
    "cases it gets right — the table underneath runs each validator against inputs that usually break " +
    "a hand-rolled one. Type in the form to check your own.</p>";
  ctx.el.appendChild(host);

  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var colA = ctx.mk("div", "demo-colbox"), colB = ctx.mk("div", "demo-colbox");
  p.appendChild(colA); p.appendChild(colB);

  function panel(parent, title, note) {
    var c = ctx.mk("div");
    c.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
      ";border-radius:12px;padding:14px 16px;margin-bottom:14px";
    c.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
      ';margin:0 0 9px">' + title + "</div>" +
      (note ? '<p class="demo-note" style="margin:0 0 10px">' + note + "</p>" : "");
    parent.appendChild(c);
    return c;
  }

  var formCard = panel(colA, "LIVE FORM", "Each field runs one validator on every keystroke.");
  var FIELDS = [
    { label: "Email", value: "ada@example.co.uk", fn: "isEmail", args: [{}] },
    { label: "URL", value: "https://example.com/a?b=1", fn: "isURL", args: [{ require_protocol: true }] },
    { label: "IBAN", value: "GB33BUKB20201555555555", fn: "isIBAN", args: [] },
    { label: "Credit card", value: "4111111111111111", fn: "isCreditCard", args: [] },
    { label: "IPv6", value: "2001:db8::8a2e:370:7334", fn: "isIP", args: [6] },
    { label: "Strong password", value: "correct-horse-9!", fn: "isStrongPassword",
      args: [{ minLength: 12, minSymbols: 1 }] },
    { label: "ISO 8601 date", value: "2026-08-02T14:30:00Z", fn: "isISO8601", args: [{ strict: true }] },
    { label: "Semver", value: "2.1.0-rc.1+build.7", fn: "isSemVer", args: [] }
  ];
  var out = ctx.readout("");
  var inputs = [];

  FIELDS.forEach(function (f) {
    var row = ctx.mk("div");
    row.style.cssText = "margin-bottom:12px";
    var lab = ctx.mk("div");
    lab.style.cssText = "font:600 11px " + T.mono + ";color:" + T.muted + ";margin-bottom:5px";
    lab.innerHTML = f.label + " &nbsp;<code style='font-size:10.5px'>validator." + f.fn + "()</code>";
    var i = ctx.mk("input");
    i.type = "text";
    i.value = f.value;
    i.spellcheck = false;
    i.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line +
      ";border-radius:8px;padding:9px 12px;color:" + T.ink + ";font:500 12.5px " + T.mono + ";outline:none";
    var msg = ctx.mk("div");
    msg.style.cssText = "font:600 11px " + T.mono + ";margin-top:5px";
    row.appendChild(lab); row.appendChild(i); row.appendChild(msg);
    formCard.appendChild(row);
    inputs.push({ f: f, i: i, msg: msg });
    i.addEventListener("input", check);
  });

  function check() {
    var passing = 0;
    inputs.forEach(function (rec) {
      var ok = false;
      try { ok = validator[rec.f.fn].apply(validator, [rec.i.value].concat(rec.f.args)); }
      catch (e) { ok = false; }
      if (ok) passing++;
      rec.i.style.borderColor = rec.i.value === "" ? T.line : ok ? T.yes : T.bad;
      rec.msg.style.color = ok ? T.yes : T.bad;
      rec.msg.textContent = rec.i.value === "" ? "" : ok ? "valid" : "rejected";
    });
    out("<b>" + passing + "</b> of " + inputs.length + " fields valid");
  }
  check();

  var edgeCard = panel(colB, "THE CASES THAT CATCH PEOPLE OUT",
    "Expected result on the left, what validator.js actually returns on the right.");
  var CASES = [
    ["isEmail", '"a@b.c"', "a@b.c", true],
    ["isEmail", '"user+tag@sub.example.co.uk"', "user+tag@sub.example.co.uk", true],
    ["isEmail", '"user@localhost"', "user@localhost", false],
    ["isEmail", '"a..b@example.com"', "a..b@example.com", false],
    ["isEmail", '"\\"quoted local\\"@example.com"', '"quoted local"@example.com', true],
    ["isURL", '"example.com"', "example.com", true],
    ["isURL", '"http://localhost:3000"', "http://localhost:3000", false],
    ["isURL", '"javascript:alert(1)"', "javascript:alert(1)", false],
    ["isNumeric", '"1e3"', "1e3", false],
    ["isNumeric", '"-0.5"', "-0.5", true],
    ["isInt", '"007"', "007", true],
    ["isCreditCard", '"4111 1111 1111 1111"', "4111 1111 1111 1111", true],
    ["isCreditCard", '"4111111111111112"', "4111111111111112", false],
    ["isUUID", '"not-a-uuid"', "not-a-uuid", false]
  ];
  edgeCard.insertAdjacentHTML("beforeend",
    '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
    '<colgroup><col style="width:96px"><col><col style="width:66px"></colgroup>' +
    "<thead><tr><th>validator</th><th>input</th><th>result</th></tr></thead><tbody>" +
    CASES.map(function (c) {
      var got = false;
      try { got = validator[c[0]](c[2]); } catch (e) { got = false; }
      return "<tr><td><code>" + c[0] + '</code></td><td style="word-break:break-all;font-family:' +
        T.mono + ';font-size:11px">' + ctx.esc(c[1]) + '</td><td style="color:' +
        (got ? T.yes : T.bad) + ';font-weight:700">' + (got ? "true" : "false") + "</td></tr>";
    }).join("") + "</tbody></table>");

  var sanCard = panel(ctx.el, "SANITISERS",
    "The other half of the library: coerce input into the shape you wanted before you validate it.");
  var sanIn = ctx.mk("input");
  sanIn.type = "text";
  sanIn.value = "  Ada.Lovelace+news@GoogleMail.com  ";
  sanIn.spellcheck = false;
  sanIn.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line +
    ";border-radius:8px;padding:10px 13px;color:" + T.ink + ";font:500 13px " + T.mono +
    ";outline:none;margin-bottom:12px";
  sanCard.appendChild(sanIn);
  var sanHost = ctx.mk("div");
  sanCard.appendChild(sanHost);

  function sanitise() {
    var v = sanIn.value;
    var rows = [
      ["trim(v)", JSON.stringify(validator.trim(v))],
      ["normalizeEmail(trim(v))", JSON.stringify(validator.normalizeEmail(validator.trim(v)))],
      ["escape(v)", JSON.stringify(validator.escape(v))],
      ["blacklist(v, '@.')", JSON.stringify(validator.blacklist(v, "@."))],
      ["toBoolean(v)", String(validator.toBoolean(v))],
      ["toInt(v)", String(validator.toInt(v))],
      ["isEmail(trim(v))", String(validator.isEmail(validator.trim(v)))]
    ];
    sanHost.innerHTML = '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
      '<colgroup><col style="width:230px"><col></colgroup><tbody>' + rows.map(function (r) {
        return "<tr><td><code>" + ctx.esc(r[0]) + '</code></td><td style="font-family:' + T.mono +
          ';font-size:11.5px;word-break:break-all">' + ctx.esc(r[1]) + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  sanIn.addEventListener("input", sanitise);
  sanitise();

  ctx.btn("Break every field", function () {
    inputs.forEach(function (rec) { rec.i.value = rec.i.value.slice(0, -2) + "??"; });
    check();
  });
  ctx.btn("Reset the form", function () {
    inputs.forEach(function (rec) { rec.i.value = rec.f.value; });
    check();
  }, true);
  ctx.label("validator " + validator.version);
};

})();
