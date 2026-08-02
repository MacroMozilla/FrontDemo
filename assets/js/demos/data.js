/* Data, files and validation. */
(function () {
"use strict";
var B = window.B;

/* ---------------------------------------------------------------- Fuse.js */
B.fuse = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  /* Search this very site's library list — the most honest dataset to hand. */
  var docs = window.LIBS.map(function (l) {
    return { name: l.n, pkg: l.pkg, what: l.what, cat: l.cat, k: l.k };
  });

  var fuse = null;
  var opts = { threshold: .38, keys: [{ name: "name", weight: 3 }, { name: "pkg", weight: 2 },
                                      { name: "what", weight: 1 }],
               includeScore: true, includeMatches: true, ignoreLocation: true, minMatchCharLength: 2 };
  function rebuild() { fuse = new Fuse(docs, opts); }
  rebuild();

  var head = ctx.mk("div");
  head.innerHTML = '<p class="demo-h">Searching all ' + docs.length + " libraries on this site</p>" +
    '<p class="demo-p">Type with deliberate typos — <code>chatjs</code>, <code>lefalet</code>, ' +
    "<code>tree js</code>. Fuse scores every record; matched characters are underlined.</p>";
  ctx.el.appendChild(head);

  var results = ctx.mk("div");
  ctx.el.appendChild(results);

  var out = ctx.readout("");
  function highlight(text, indices) {
    if (!indices || !indices.length) return ctx.esc(text);
    var html = "", last = 0;
    indices.forEach(function (r) {
      html += ctx.esc(text.slice(last, r[0]));
      html += '<u style="text-decoration-color:' + T.accent + ';text-underline-offset:3px">' +
              ctx.esc(text.slice(r[0], r[1] + 1)) + "</u>";
      last = r[1] + 1;
    });
    return html + ctx.esc(text.slice(last));
  }

  function search(q) {
    var t0 = performance.now();
    if (!q) {
      results.innerHTML = '<p class="demo-note">Type something above.</p>';
      out("index holds <b>" + docs.length + "</b> records");
      return;
    }
    var hits = fuse.search(q).slice(0, 12);
    var ms = performance.now() - t0;
    results.innerHTML = hits.length ? hits.map(function (h) {
      var nameMatch = (h.matches || []).filter(function (m) { return m.key === "name"; })[0];
      var pkgMatch = (h.matches || []).filter(function (m) { return m.key === "pkg"; })[0];
      var score = (1 - h.score).toFixed(3);
      return '<div class="demo-card" style="cursor:default;margin-bottom:6px;border-left:3px solid ' +
        (h.score < .2 ? T.yes : h.score < .45 ? T.part : T.line2) + '">' +
        "<b>" + highlight(h.item.name, nameMatch && nameMatch.indices) + "</b> " +
        '<span class="sub" style="display:inline">' +
          highlight(h.item.pkg, pkgMatch && pkgMatch.indices) + " · score " + score + "</span>" +
        '<div class="demo-note" style="margin-top:3px">' + ctx.esc(h.item.what.slice(0, 110)) + "…</div>" +
        "</div>";
    }).join("") : '<p class="demo-note">No match even with fuzzy scoring — try loosening the threshold.</p>';
    out("<b>" + hits.length + "</b> hits in <b>" + ms.toFixed(2) + " ms</b> over " + docs.length + " records");
  }
  search("chatjs");

  var input = ctx.text("query", "chatjs", search, "170px");
  ctx.range("threshold", { min: 0, max: 100, value: 38,
                           fmt: function (v) { return (v / 100).toFixed(2); } },
            function (v) { opts.threshold = v / 100; rebuild(); search(input.value); });
  ctx.check("ignore position", true, function (v) {
    opts.ignoreLocation = v; rebuild(); search(input.value);
  });
};

/* ------------------------------------------------------------- Papa Parse */
B.papa = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("44%");

  var CSV = [
    'id,customer,note,amount,when',
    '1,Acme Corp,"Ships to ""dock 4"", not reception",1240.50,2026-03-02',
    '2,Globex,"Multi-line note:',
    'call before delivery",680,2026-03-04',
    '3,Initech,Simple note,3015.00,2026-03-05',
    '4,Umbrella,"Comma, inside a quoted field",92.25,2026-03-09',
    '5,Soylent,,410,2026-03-11'
  ].join("\n");

  var right = ctx.mk("div");
  right.style.cssText = "padding:16px;min-height:100%";
  right.innerHTML = '<p class="demo-h">Parsed result</p><div id="papa-out"></div>';
  p.b.appendChild(right);

  var out = ctx.readout("");
  var header = true, dynamic = true;

  function parse(text) {
    var t0 = performance.now();
    var r = Papa.parse(text.trim(), {
      header: header, dynamicTyping: dynamic, skipEmptyLines: true
    });
    var ms = performance.now() - t0;
    var box = document.getElementById("papa-out");

    if (!r.data.length) { box.innerHTML = '<p class="demo-note">nothing parsed</p>'; return; }
    var cols = header ? Object.keys(r.data[0]) : r.data[0].map(function (_, i) { return "col " + i; });
    var html = '<table class="demo-tbl"><thead><tr>' +
      cols.map(function (c) { return "<th>" + ctx.esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>";
    r.data.forEach(function (row) {
      var vals = header ? cols.map(function (c) { return row[c]; }) : row;
      html += "<tr>" + vals.map(function (v) {
        var t = typeof v;
        var colour = t === "number" ? T.part : v == null || v === "" ? T.muted : T.ink2;
        return '<td style="color:' + colour + '">' +
               ctx.esc(v == null || v === "" ? "∅" : String(v)) + "</td>";
      }).join("") + "</tr>";
    });
    html += "</tbody></table>";
    html += '<p class="demo-note">Row 2 contains an escaped quote, row 3 spans two physical lines, ' +
            "row 4 has a comma inside a quoted field. <code>text.split(&quot;,&quot;)</code> gets all three wrong.</p>";
    box.innerHTML = html;

    out("<b>" + r.data.length + "</b> rows · <b>" + cols.length + "</b> fields · parsed in <b>" +
        ms.toFixed(2) + " ms</b>" +
        (r.errors.length ? ' · <span style="color:' + T.bad + '">' + r.errors.length + " error(s)</span>" : ""));
  }

  var editor = ctx.editor(p.a, CSV, parse);
  parse(CSV);

  ctx.check("header row", true, function (v) { header = v; parse(editor.value); });
  ctx.check("infer types", true, function (v) { dynamic = v; parse(editor.value); });
  ctx.btn("Back to CSV", function () {
    var r = Papa.parse(editor.value.trim(), { header: header, dynamicTyping: dynamic, skipEmptyLines: true });
    document.getElementById("papa-out").innerHTML =
      '<p class="demo-h">Papa.unparse — round tripped</p><pre class="demo-pre">' +
      ctx.esc(Papa.unparse(r.data)) + "</pre>";
    out("re-serialised, quoting restored where it is needed");
  });
};

/* --------------------------------------------------------------- SheetJS */
B.xlsx = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  ctx.mount("scroll pad");

  var TEAMS = ["Platform", "Growth", "Payments", "Mobile", "Data"];
  var data = TEAMS.map(function (t, i) {
    return { Team: t, Headcount: 4 + i * 2, Budget: 120000 + i * 45000,
             Spent: 90000 + i * 38000, Region: ["EMEA", "AMER", "APAC"][i % 3] };
  });

  var wrap = ctx.mk("div");
  wrap.innerHTML =
    '<p class="demo-h">Editable sheet</p>' +
    '<p class="demo-p">Edit any cell, then export. What comes out is a real <code>.xlsx</code> ' +
    "workbook with a formula row — written entirely in this tab.</p>" +
    '<div id="xl-grid"></div>' +
    '<p class="demo-h" style="margin-top:20px">Round trip</p>' +
    '<div id="xl-round"><p class="demo-note">Press <b>Export and read back</b> to write a workbook to memory ' +
    "and immediately parse it again.</p></div>";
  ctx.el.appendChild(wrap);

  var out = ctx.readout("");
  function grid() {
    var cols = Object.keys(data[0]);
    var html = '<table class="demo-tbl"><thead><tr>' +
      cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead><tbody>";
    data.forEach(function (row, ri) {
      html += "<tr>" + cols.map(function (c) {
        var num = typeof row[c] === "number";
        return '<td class="' + (num ? "num" : "") + '" contenteditable="true" ' +
               'data-r="' + ri + '" data-c="' + c + '" style="outline:none">' + ctx.esc(row[c]) + "</td>";
      }).join("") + "</tr>";
    });
    document.getElementById("xl-grid").innerHTML = html + "</tbody></table>";
    document.getElementById("xl-grid").querySelectorAll("[contenteditable]").forEach(function (td) {
      td.addEventListener("blur", function () {
        var v = td.textContent.trim();
        var orig = data[+td.dataset.r][td.dataset.c];
        data[+td.dataset.r][td.dataset.c] = typeof orig === "number" ? (Number(v) || 0) : v;
        out("edited " + td.dataset.c + " on row " + (+td.dataset.r + 1));
      });
    });
  }
  grid();
  out("<b>" + data.length + "</b> rows ready to export");

  function makeWorkbook() {
    var ws = XLSX.utils.json_to_sheet(data);
    var n = data.length;
    /* A real formula, not a precomputed number. */
    XLSX.utils.sheet_add_aoa(ws, [["Total", { f: "SUM(B2:B" + (n + 1) + ")" },
                                            { f: "SUM(C2:C" + (n + 1) + ")" },
                                            { f: "SUM(D2:D" + (n + 1) + ")" }, ""]],
                             { origin: -1 });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Budgets");
    return wb;
  }

  ctx.btn("Download .xlsx", function () {
    XLSX.writeFile(makeWorkbook(), "frontdemo-budgets.xlsx");
    out("wrote a real workbook to your downloads folder");
  }, true);

  ctx.btn("Export and read back", function () {
    var wb = makeWorkbook();
    var buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    var again = XLSX.read(buf, { type: "array" });
    var sheet = again.Sheets[again.SheetNames[0]];
    var rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    document.getElementById("xl-round").innerHTML =
      '<p class="demo-note">Written to a ' + (buf.byteLength / 1024).toFixed(1) +
      " KB ArrayBuffer, then parsed back. Sheet <b>" + again.SheetNames[0] + "</b>, range <b>" +
      sheet["!ref"] + "</b>.</p><pre class=\"demo-pre\">" +
      ctx.esc(rows.map(function (r) { return r.join("\t"); }).join("\n")) + "</pre>";
    out("round trip: <b>" + (buf.byteLength / 1024).toFixed(1) + " KB</b> · " + rows.length + " rows recovered");
  });

  ctx.btn("Export CSV", function () {
    var csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(data));
    document.getElementById("xl-round").innerHTML =
      '<pre class="demo-pre">' + ctx.esc(csv) + "</pre>";
    out("same workbook, emitted as CSV");
  });
};

/* ----------------------------------------------------------------- Day.js */
B.dayjs = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  dayjs.extend(dayjs_plugin_relativeTime);
  dayjs.extend(dayjs_plugin_duration);
  dayjs.extend(dayjs_plugin_utc);
  dayjs.extend(dayjs_plugin_timezone);
  dayjs.extend(dayjs_plugin_advancedFormat);

  var box = ctx.mk("div");
  ctx.el.appendChild(box);

  var zone = "Asia/Tokyo";
  var base = "2026-03-14 09:30";
  var out = ctx.readout("");

  function render() {
    var d = dayjs(base);
    var now = dayjs();
    var rows = [
      ["dayjs(input)", d.format()],
      ['format("dddd, D MMMM YYYY")', d.format("dddd, D MMMM YYYY")],
      ['format("Do [of] MMMM, h:mm A")', d.format("Do [of] MMMM, h:mm A")],
      ["fromNow()", d.fromNow()],
      ["add(3, 'month').format('YYYY-MM-DD')", d.add(3, "month").format("YYYY-MM-DD")],
      ["startOf('week')", d.startOf("week").format("YYYY-MM-DD HH:mm")],
      ["endOf('quarter')", d.endOf("quarter").format("YYYY-MM-DD HH:mm")],
      ["diff(now, 'day')", String(d.diff(now, "day")) + " days"],
      ["duration(now.diff(d)).humanize()",
        dayjs.duration(now.diff(d)).humanize(true)],
      ["utc().format()", d.utc().format()],
      ['tz("' + zone + '").format("YYYY-MM-DD HH:mm z")',
        d.tz(zone).format("YYYY-MM-DD HH:mm z")],
      ["isLeapYear-ish: daysInMonth()", String(d.daysInMonth())],
      ["immutability check", (function () {
        var a = dayjs(base);
        var b = a.add(1, "day");
        return "a=" + a.format("D MMM") + "  b=" + b.format("D MMM") + "  (a unchanged)";
      })()]
    ];

    box.innerHTML =
      '<p class="demo-h">Every line below is evaluated right now</p>' +
      '<dl class="kv">' + rows.map(function (r) {
        return "<dt>" + ctx.esc(r[0]) + "</dt><dd>" + ctx.esc(r[1]) + "</dd>";
      }).join("") + "</dl>" +
      '<p class="demo-note">Relative time, duration, UTC, time zones and ordinal formatting each come ' +
      "from a separate plugin — the 7 KB core has none of them. That is the whole design.</p>";
    out("core <b>7 KB</b> + 5 plugins loaded");
  }
  render();

  ctx.text("date", base, function (v) { base = v; render(); }, "150px");
  ctx.select("time zone", ["Asia/Tokyo", "Europe/London", "America/New_York", "Australia/Sydney", "UTC"],
             function (v) { zone = v; render(); }, "Asia/Tokyo");
  ctx.btn("Now", function () { base = dayjs().format("YYYY-MM-DD HH:mm"); render(); });
};

/* -------------------------------------------------------------------- Zod */
B.zod = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var z = window.Zod.z || window.Zod;

  var right = ctx.mk("div");
  right.style.cssText = "padding:18px;min-height:100%";
  right.innerHTML = '<div id="zod-out"></div>';
  p.b.appendChild(right);

  var Schema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    age: z.number().int().min(13).max(120),
    role: z.enum(["admin", "editor", "viewer"]),
    tags: z.array(z.string().min(2)).max(5),
    profile: z.object({
      displayName: z.string().min(2).max(32),
      website: z.string().url().optional()
    }),
    createdAt: z.string()
  });

  var SAMPLES = {
    valid: {
      id: "6f1e2a24-9f6f-4b3d-8a1a-2f2f4f6b7c8d",
      email: "dev@example.com",
      age: 34,
      role: "editor",
      tags: ["charts", "maps"],
      profile: { displayName: "Ada", website: "https://example.com" },
      createdAt: "2026-03-14T09:30:00Z"
    },
    "several problems": {
      id: "not-a-uuid",
      email: "dev@@example",
      age: 9,
      role: "owner",
      tags: ["a", "maps", "x", "y", "z", "too many"],
      profile: { displayName: "A", website: "notaurl" },
      createdAt: "2026-03-14T09:30:00Z"
    },
    "missing fields": { email: "dev@example.com", role: "viewer" }
  };

  var out = ctx.readout("");
  function validate(text) {
    var box = document.getElementById("zod-out");
    var parsed;
    try { parsed = JSON.parse(text); }
    catch (e) {
      box.innerHTML = '<p class="demo-h">JSON error</p><pre class="demo-pre bad">' +
                      ctx.esc(e.message) + "</pre>";
      out('<span style="color:' + T.bad + '">the JSON itself will not parse</span>');
      return;
    }
    var r = Schema.safeParse(parsed);
    if (r.success) {
      box.innerHTML = '<p class="demo-h">Valid</p>' +
        '<p class="demo-p"><span class="demo-badge ok">safeParse succeeded</span></p>' +
        '<p class="demo-note">In TypeScript, <code>z.infer&lt;typeof Schema&gt;</code> would now be ' +
        "the exact type of this object — one definition, checked at runtime and at compile time.</p>" +
        '<pre class="demo-pre">' + ctx.esc(JSON.stringify(r.data, null, 2)) + "</pre>";
      out('<span style="color:' + T.yes + '">valid</span> · 0 issues');
      return;
    }
    var issues = r.error.issues;
    box.innerHTML = '<p class="demo-h">' + issues.length + " issue" + (issues.length === 1 ? "" : "s") + "</p>" +
      issues.map(function (i) {
        return '<div class="demo-card" style="cursor:default;margin-bottom:6px;border-left:3px solid ' + T.bad + '">' +
          "<b>" + ctx.esc(i.path.join(".") || "(root)") + "</b>" +
          '<span class="sub">' + ctx.esc(i.code) + "</span>" +
          '<div class="demo-note" style="margin-top:2px">' + ctx.esc(i.message) + "</div></div>";
      }).join("") +
      '<p class="demo-note">This is the literal <code>error.issues</code> array — path, code and message ' +
      "for every failure, which is what makes it easy to attach to form fields.</p>";
    out('<span style="color:' + T.bad + '">' + issues.length + " issue(s)</span>");
  }

  var editor = ctx.editor(p.a, JSON.stringify(SAMPLES["several problems"], null, 2), validate);
  validate(editor.value);

  ctx.select("sample", Object.keys(SAMPLES), function (v) {
    editor.value = JSON.stringify(SAMPLES[v], null, 2);
    validate(editor.value);
  }, "several problems");
  ctx.label("schema: id uuid · email · age 13-120 · role enum · tags ≤5 · nested profile");
};


/* --------------------------------------------------------------- js-yaml */
B.jsyaml = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("50%");

  var SRC = [
    "# Anchors and aliases — the feature people forget YAML has",
    "defaults: &defaults",
    "  adapter: postgres",
    "  pool: 5",
    "  timeout: 30",
    "",
    "development:",
    "  <<: *defaults",
    "  database: app_dev",
    "",
    "production:",
    "  <<: *defaults",
    "  database: app_prod",
    "  pool: 25",
    "",
    "# Scalars are typed, not just strings",
    "typed:",
    "  int: 42",
    "  octal: 0o755",
    "  float: 6.02e23",
    "  bool: yes            # a string in YAML 1.2 — only true/false are booleans",
    "  nothing: null",
    "  date: 2026-08-02",
    "  version: \"1.10\"      # quoted, so it stays a string",
    "  unquoted: 1.10        # not quoted, so it is a float",
    "",
    "# Block scalars keep or fold newlines",
    "literal: |",
    "  line one",
    "  line two",
    "folded: >",
    "  this becomes",
    "  one long line",
    "",
    "list:",
    "  - plain",
    "  - { inline: map, works: too }",
    "  - [1, 2, 3]",
    "",
    "---",
    "# A second document in the same file",
    "second: true"
  ].join("\n");

  var box = ctx.mk("div");
  box.style.cssText = "padding:12px 14px";
  box.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
    ';margin-bottom:7px">YAML</div>' +
    '<p class="demo-note" style="margin:0 0 8px">Edit anything. Errors below carry a line and column.</p>';
  p.a.appendChild(box);
  var ta = ctx.mk("textarea");
  ta.value = SRC;
  ta.spellcheck = false;
  ta.rows = 40;
  ta.style.cssText = "width:100%;resize:vertical;background:" + T.sunk +
    ";border:1px solid " + T.line + ";border-radius:8px;padding:10px 12px;color:" + T.ink +
    ";font:500 12px " + T.mono + ";line-height:1.65;outline:none";
  box.appendChild(ta);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:14px 16px";
  p.b.appendChild(outBox);

  var out = ctx.readout("");
  var view = "json", indent = 2, sortKeys = false, flowLevel = -1;

  function run() {
    var text = ta.value;
    try {
      var docs = [];
      jsyaml.loadAll(text, function (d) { docs.push(d); });
      var value = docs.length === 1 ? docs[0] : docs;

      var body;
      if (view === "json") {
        body = '<pre class="demo-pre" style="max-height:none">' +
          ctx.esc(JSON.stringify(value, null, 2)) + "</pre>";
      } else if (view === "roundtrip") {
        body = '<pre class="demo-pre" style="max-height:none">' + ctx.esc(docs.map(function (d) {
          return jsyaml.dump(d, { indent: indent, sortKeys: sortKeys, lineWidth: 78,
            flowLevel: flowLevel, noRefs: true });
        }).join("---\n")) + "</pre>" +
        '<p class="demo-note">Note what the round trip loses: comments are gone, and the merge keys ' +
        "have been expanded into real values. YAML parsers keep data, not formatting.</p>";
      } else {
        body = tree(value, 0);
      }

      outBox.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" +
        T.muted + ';margin-bottom:9px">' +
        (view === "json" ? "PARSED → JSON" : view === "roundtrip" ? "DUMPED BACK TO YAML" : "TYPES") +
        "</div>" + body;

      out("<b>" + docs.length + "</b> document" + (docs.length === 1 ? "" : "s") + " · " +
        countKeys(value) + " keys · <b style='color:" + T.yes + "'>parsed</b>");
    } catch (e) {
      var mark = e.mark || {};
      outBox.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" +
        T.bad + ';margin-bottom:9px">YAMLException</div>' +
        '<pre class="demo-pre" style="max-height:none;color:' + T.bad + '">' +
        ctx.esc(e.message) + "</pre>";
      out("<b style='color:" + T.bad + "'>error at line " + ((mark.line || 0) + 1) +
        ", column " + ((mark.column || 0) + 1) + "</b>");
    }
  }

  function countKeys(v) {
    if (Array.isArray(v)) return v.reduce(function (a, x) { return a + countKeys(x); }, 0);
    if (v && typeof v === "object") {
      return Object.keys(v).length + Object.keys(v).reduce(function (a, k) {
        return a + countKeys(v[k]);
      }, 0);
    }
    return 0;
  }

  function typeOf(v) {
    if (v === null) return "null";
    if (Array.isArray(v)) return "array";
    if (v instanceof Date) return "Date";
    return typeof v;
  }
  function tree(v, depth) {
    if (v === null || typeof v !== "object") {
      return '<span style="color:' + T.ink + '">' + ctx.esc(JSON.stringify(v)) +
        '</span> <span style="color:' + T.part + ';font-size:10.5px">' + typeOf(v) + "</span>";
    }
    if (v instanceof Date) {
      return '<span style="color:' + T.ink + '">' + ctx.esc(v.toISOString()) +
        '</span> <span style="color:' + T.part + ';font-size:10.5px">Date</span>';
    }
    var keys = Array.isArray(v) ? v.map(function (_, i) { return i; }) : Object.keys(v);
    return '<div style="padding-left:' + (depth ? 14 : 0) + 'px">' + keys.map(function (k) {
      return '<div style="padding:2px 0;font:500 11.5px ' + T.mono + '"><span style="color:' +
        ctx.series(depth % 8) + '">' + ctx.esc(String(k)) + "</span>" +
        '<span style="color:' + T.muted + '">: </span>' + tree(v[k], depth + 1) + "</div>";
    }).join("") + "</div>";
  }

  ta.addEventListener("input", run);
  run();

  ctx.select("view", [{ v: "json", t: "as JSON" }, { v: "types", t: "resolved types" },
    { v: "roundtrip", t: "dump back to YAML" }], function (v) { view = v; run(); }, "json");
  ctx.range("dump indent", { min: 1, max: 6, value: 2 }, function (v) { indent = v; run(); });
  ctx.check("sort keys on dump", false, function (v) { sortKeys = v; run(); });
  ctx.select("flow level", [{ v: "-1", t: "block" }, { v: "1", t: "flow from depth 1" },
    { v: "2", t: "flow from depth 2" }], function (v) { flowLevel = +v; run(); }, "-1");
  ctx.btn("Break the indentation", function () {
    ta.value = ta.value.replace("  adapter: postgres", "   adapter: postgres");
    run();
  });
  ctx.btn("Reset", function () { ta.value = SRC; run(); }, true);
};

/* ------------------------------------------------------------------- Ajv */
B.ajv = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var SCHEMA = JSON.stringify({
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    required: ["id", "email", "plan"],
    additionalProperties: false,
    properties: {
      id: { type: "integer", minimum: 1 },
      email: { type: "string", format: "email" },
      plan: { enum: ["free", "pro", "enterprise"] },
      seats: { type: "integer", minimum: 1, maximum: 500, default: 1 },
      website: { type: "string", format: "uri" },
      startedAt: { type: "string", format: "date-time" },
      tags: { type: "array", items: { type: "string", minLength: 2 }, uniqueItems: true, maxItems: 5 },
      billing: {
        type: "object",
        required: ["country"],
        properties: {
          country: { type: "string", pattern: "^[A-Z]{2}$" },
          vat: { type: "string", minLength: 8 }
        }
      }
    },
    allOf: [{
      if: { properties: { plan: { const: "enterprise" } }, required: ["plan"] },
      then: { required: ["billing"], properties: { seats: { minimum: 10 } } }
    }]
  }, null, 2);

  var DATA = JSON.stringify({
    id: 0,
    email: "not-an-email",
    plan: "enterprise",
    seats: 3,
    website: "example.com",
    startedAt: "2026-13-40",
    tags: ["a", "ops", "ops"],
    extra: true
  }, null, 2);

  function editor(parent, label, note, value) {
    var box = ctx.mk("div");
    box.style.cssText = "padding:11px 13px;border-bottom:1px solid " + T.line;
    box.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
      ';margin-bottom:6px">' + label + "</div>" +
      '<p class="demo-note" style="margin:0 0 7px">' + note + "</p>";
    var t = ctx.mk("textarea");
    t.value = value;
    t.spellcheck = false;
    t.rows = label === "SCHEMA" ? 26 : 14;
    t.style.cssText = "width:100%;resize:vertical;background:" + T.sunk + ";border:1px solid " +
      T.line + ";border-radius:8px;padding:9px 11px;color:" + T.ink + ";font:500 11.5px " + T.mono +
      ";line-height:1.6;outline:none";
    box.appendChild(t);
    parent.appendChild(box);
    t.addEventListener("input", run);
    return t;
  }

  var taSchema = editor(p.a, "SCHEMA", "Draft-07, including an <code>if/then</code> rule.", SCHEMA);
  var taData = editor(p.a, "DATA", "Deliberately wrong in eight different ways.", DATA);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:14px 16px";
  p.b.appendChild(outBox);

  var out = ctx.readout("");
  var allErrors = true, useDefaults = true, coerce = false;

  function run() {
    var schema, data;
    try { schema = JSON.parse(taSchema.value); }
    catch (e) { return fail("The schema is not valid JSON", e.message); }
    try { data = JSON.parse(taData.value); }
    catch (e) { return fail("The data is not valid JSON", e.message); }

    var ajv;
    try {
      ajv = new AjvNS.Ajv({
        allErrors: allErrors, useDefaults: useDefaults, coerceTypes: coerce,
        strict: false, verbose: true
      });
      AjvNS.addFormats(ajv);
    } catch (e) { return fail("Ajv could not be constructed", e.message); }

    var validate;
    try { validate = ajv.compile(schema); }
    catch (e) { return fail("The schema itself is invalid", e.message); }

    var copy = JSON.parse(JSON.stringify(data));
    var t0 = performance.now();
    var ok = validate(copy);
    var ms = performance.now() - t0;
    var errors = validate.errors || [];

    outBox.innerHTML =
      '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" +
        (ok ? T.yes : T.bad) + ';margin-bottom:10px">' +
        (ok ? "VALID" : errors.length + " ERROR" + (errors.length === 1 ? "" : "S")) + "</div>" +
      (errors.length
        ? '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
          '<colgroup><col style="width:150px"><col style="width:110px"><col></colgroup>' +
          "<thead><tr><th>instancePath</th><th>keyword</th><th>message</th></tr></thead><tbody>" +
          errors.map(function (e) {
            return '<tr><td><code style="color:' + T.accent + ';font-size:11px">' +
              ctx.esc(e.instancePath || "(root)") + "</code></td><td><code>" + ctx.esc(e.keyword) +
              '</code></td><td style="font-size:12px">' + ctx.esc(e.message) +
              (e.params && Object.keys(e.params).length
                ? '<div style="color:' + T.muted + ";font-family:" + T.mono +
                  ';font-size:10.5px;margin-top:3px">' + ctx.esc(JSON.stringify(e.params)) + "</div>"
                : "") + "</td></tr>";
          }).join("") + "</tbody></table>"
        : '<p class="demo-note">Nothing to report. Break something on the left.</p>') +
      '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
        ';margin:18px 0 8px">DATA AFTER VALIDATION</div>' +
      '<pre class="demo-pre" style="max-height:none">' + ctx.esc(JSON.stringify(copy, null, 2)) + "</pre>" +
      '<p class="demo-note">Ajv mutates the object it is given when <code>useDefaults</code> or ' +
      "<code>coerceTypes</code> is on — that is a feature, and a surprise the first time.</p>" +
      '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
        ';margin:18px 0 8px">HUMAN-READABLE</div>' +
      '<pre class="demo-pre" style="max-height:none">' +
      ctx.esc(ok ? "valid" : ajv.errorsText(errors, { separator: "\n" })) + "</pre>";

    out(ok
      ? "<b style='color:" + T.yes + "'>valid</b> in <b>" + ms.toFixed(2) + " ms</b>"
      : "<b style='color:" + T.bad + "'>" + errors.length + " errors</b> in <b>" +
        ms.toFixed(2) + " ms</b> · compiled to a JavaScript function, not walked");
  }

  function fail(title, detail) {
    outBox.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" +
      T.bad + ';margin-bottom:9px">' + ctx.esc(title.toUpperCase()) + "</div>" +
      '<pre class="demo-pre" style="max-height:none;color:' + T.bad + '">' + ctx.esc(detail) + "</pre>";
    out("<b style='color:" + T.bad + "'>" + ctx.esc(title) + "</b>");
  }

  run();

  ctx.check("allErrors", true, function (v) { allErrors = v; run(); });
  ctx.check("useDefaults", true, function (v) { useDefaults = v; run(); });
  ctx.check("coerceTypes", false, function (v) { coerce = v; run(); });
  ctx.btn("Make the data valid", function () {
    taData.value = JSON.stringify({
      id: 41, email: "ada@example.com", plan: "enterprise", seats: 25,
      website: "https://example.com", startedAt: "2026-08-02T14:30:00Z",
      tags: ["ops", "eu"], billing: { country: "GB", vat: "GB123456789" }
    }, null, 2);
    run();
  }, true);
  ctx.btn("Downgrade to free", function () {
    var d = JSON.parse(taData.value);
    d.plan = "free";
    taData.value = JSON.stringify(d, null, 2);
    run();
  });
  ctx.btn("Reset", function () { taSchema.value = SCHEMA; taData.value = DATA; run(); });
};

})();
