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

})();
