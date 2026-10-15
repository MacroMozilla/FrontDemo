/* Templating, Markdown, diffing and text scanning. */
(function () {
"use strict";
var B = window.B;

/* A labelled section inside a pane. Every demo here is
   "editable input on the left, derived output on the right". */
function section(ctx, parent, title, note) {
  var T = ctx.T;
  var box = ctx.mk("div");
  box.style.cssText = "padding:12px 14px;border-bottom:1px solid " + T.line;
  box.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
    ';margin-bottom:7px">' + title + "</div>" +
    (note ? '<p class="demo-note" style="margin:0 0 8px">' + note + "</p>" : "");
  parent.appendChild(box);
  return box;
}
function area(ctx, parent, value, rows, onInput) {
  var T = ctx.T;
  var t = ctx.mk("textarea");
  t.value = value;
  t.spellcheck = false;
  t.rows = rows || 8;
  t.style.cssText = "width:100%;resize:vertical;background:" + T.sunk + ";border:1px solid " + T.line +
    ";border-radius:8px;padding:9px 11px;color:" + T.ink + ";font:500 12px " + T.mono +
    ";line-height:1.6;outline:none";
  t.addEventListener("focus", function () { t.style.borderColor = T.accent; });
  t.addEventListener("blur", function () { t.style.borderColor = T.line; });
  if (onInput) t.addEventListener("input", function () { onInput(t.value); });
  parent.appendChild(t);
  return t;
}
function head(ctx, label) {
  return '<div style="font:700 9.5px ' + ctx.T.mono + ";letter-spacing:.14em;color:" + ctx.T.muted +
    ';margin-bottom:10px">' + label + "</div>";
}

/* ------------------------------------------------------------- Handlebars */
B.handlebars = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var TPL =
    "<h3>{{title}}</h3>\n" +
    "\n" +
    "{{#if orders.length}}\n" +
    "  <ul>\n" +
    "  {{#each orders}}\n" +
    "    {{> row}}\n" +
    "  {{/each}}\n" +
    "  </ul>\n" +
    "  <p>Total: {{money total}} across {{orders.length}} orders.</p>\n" +
    "{{else}}\n" +
    "  <p>Nothing to show.</p>\n" +
    "{{/if}}\n" +
    "\n" +
    "<p>Region {{upper region}} — {{#shout}}{{owner}}{{/shout}}</p>\n";

  var PARTIAL =
    '<li class="{{#if urgent}}urgent{{/if}}">\n' +
    "  <span>{{customer}}</span>\n" +
    "  {{money amount}}\n" +
    '  {{#if urgent}}<span class="tag">urgent</span>{{/if}}\n' +
    "</li>\n";

  var DATA = JSON.stringify({
    title: "Open orders",
    region: "emea",
    owner: "Priya",
    total: 4188,
    orders: [
      { customer: "Northwind", amount: 1290, urgent: true },
      { customer: "Contoso", amount: 640, urgent: false },
      { customer: "Fabrikam", amount: 1808, urgent: true },
      { customer: "Adventure Works", amount: 450, urgent: false }
    ]
  }, null, 2);

  var sTpl = section(ctx, p.a, "TEMPLATE", "Block helpers, a partial and three custom helpers.");
  var taTpl = area(ctx, sTpl, TPL, 13, run);
  var sPart = section(ctx, p.a, "PARTIAL &nbsp;{{&gt; row}}", "Registered separately, reused per item.");
  var taPart = area(ctx, sPart, PARTIAL, 5, run);
  var sData = section(ctx, p.a, "CONTEXT", "Plain JSON — the template can reach nothing else.");
  var taData = area(ctx, sData, DATA, 12, run);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:16px 18px";
  p.b.appendChild(outBox);

  var style = ctx.mk("style");
  style.textContent =
    ".hb-out h3{margin:0 0 10px;font:600 16px " + T.sans + ";color:" + T.ink + "}" +
    ".hb-out ul{margin:0 0 12px;padding:0;list-style:none}" +
    ".hb-out li{display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:6px;" +
      "border:1px solid " + T.line + ";border-left:3px solid " + T.line2 + ";border-radius:8px;" +
      "background:" + T.panel + ";font:500 12.5px " + T.sans + ";color:" + T.ink2 + "}" +
    ".hb-out li.urgent{border-left-color:" + T.bad + "}" +
    ".hb-out li > span:first-child{flex:1 1 auto}" +
    ".hb-out .tag{font:700 9.5px " + T.mono + ";letter-spacing:.1em;text-transform:uppercase;" +
      "background:" + T.bad + ";color:#fff;border-radius:4px;padding:2px 6px}" +
    ".hb-out p{margin:0 0 8px;font-size:12.5px;color:" + T.ink2 + "}" +
    ".hb-err{font:500 12px " + T.mono + ";color:" + T.bad + ";white-space:pre-wrap;line-height:1.7}";
  ctx.el.appendChild(style);

  var env = Handlebars.create();
  env.registerHelper("money", function (n) {
    return new env.SafeString('<b style="font-family:' + T.mono + ";color:" + T.ink + '">$' +
      Number(n).toLocaleString("en-US") + "</b>");
  });
  env.registerHelper("upper", function (s) { return String(s).toUpperCase(); });
  env.registerHelper("shout", function (opts) { return opts.fn(this).trim() + "!"; });

  var out = ctx.readout("");
  var showSource = false;

  function run() {
    try {
      env.registerPartial("row", taPart.value);
      var t0 = performance.now();
      var fn = env.compile(taTpl.value);
      var tc = performance.now() - t0;
      var data = JSON.parse(taData.value);
      var t1 = performance.now();
      var html = fn(data);
      var tr = performance.now() - t1;
      outBox.innerHTML = head(ctx, showSource ? "COMPILED OUTPUT (SOURCE)" : "RENDERED") + (showSource
        ? '<pre class="demo-pre" style="max-height:none">' + ctx.esc(html) + "</pre>"
        : '<div class="hb-out">' + html + "</div>");
      out("compiled in <b>" + tc.toFixed(1) + " ms</b>, rendered in <b>" + tr.toFixed(2) +
        " ms</b> — " + html.length + " chars");
    } catch (e) {
      outBox.innerHTML = head(ctx, "COMPILE ERROR") +
        '<div class="hb-err">' + ctx.esc(e.message) + "</div>";
      out("<b style='color:" + T.bad + "'>" + ctx.esc(e.name) + "</b>");
    }
  }
  run();

  ctx.check("show the HTML source", false, function (v) { showSource = v; run(); });
  ctx.btn("Empty the orders array", function () {
    var d = JSON.parse(taData.value); d.orders = []; d.total = 0;
    taData.value = JSON.stringify(d, null, 2); run();
  });
  ctx.btn("Break the template", function () {
    taTpl.value = taTpl.value.replace("{{/if}}", "{{/iff}}"); run();
  });
  ctx.btn("Reset", function () {
    taTpl.value = TPL; taPart.value = PARTIAL; taData.value = DATA; run();
  }, true);
};

/* ------------------------------------------------------------ markdown-it */
B.markdownit = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("44%");

  var SRC = [
    "# markdown-it",
    "",
    "It is *CommonMark compliant* -- and with `typographer` on, straight",
    'quotes become "curly" ones, (c) becomes a symbol and -- becomes a dash...',
    "",
    "> Below the parser everything is a **token stream**.",
    "> Plugins rewrite tokens, not strings.",
    "",
    "| feature      | marked | markdown-it |",
    "| ------------ | :----: | :---------: |",
    "| CommonMark   |  most  |     all     |",
    "| token access |   no   |     yes     |",
    "| plugins      |  yes   |     yes     |",
    "",
    "1. Parse into tokens",
    "2. Let plugins mutate them",
    "3. Render",
    "",
    "```js",
    "const md = markdownit({ html: true, linkify: true })",
    "md.parse('# hi', {})   // tokens, not a string",
    "```",
    "",
    "Autolinked because `linkify` is on: https://commonmark.org",
    "",
    "Inline HTML is <em>allowed</em> here, then run through DOMPurify."
  ].join("\n");

  var sIn = section(ctx, p.a, "MARKDOWN", "Edit anything — every view updates on each keystroke.");
  var ta = area(ctx, sIn, SRC, 26, run);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:16px 18px";
  p.b.appendChild(outBox);

  var style = ctx.mk("style");
  style.textContent =
    ".md-out{font:400 13.5px " + T.sans + ";line-height:1.75;color:" + T.ink2 + "}" +
    ".md-out h1{font-size:21px;color:" + T.ink + ";margin:0 0 12px;padding-bottom:8px;border-bottom:1px solid " + T.line + "}" +
    ".md-out h2{font-size:16px;color:" + T.ink + ";margin:18px 0 8px}" +
    ".md-out p{margin:0 0 11px}" +
    ".md-out blockquote{margin:0 0 12px;padding:8px 14px;border-left:3px solid " + T.accent +
      ";background:" + T.sunk + ";border-radius:0 8px 8px 0}" +
    ".md-out blockquote p:last-child{margin:0}" +
    ".md-out table{border-collapse:collapse;margin:0 0 12px;font-size:12.5px;width:100%}" +
    ".md-out th,.md-out td{border:1px solid " + T.line + ";padding:6px 10px}" +
    ".md-out th{background:" + T.sunk + ";color:" + T.ink + ";font-weight:600}" +
    ".md-out code{font:500 12px " + T.mono + ";background:" + T.sunk + ";border:1px solid " + T.line +
      ";border-radius:4px;padding:1px 5px;color:" + T.ink + "}" +
    ".md-out pre{background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;" +
      "padding:11px 13px;overflow:auto;margin:0 0 12px}" +
    ".md-out pre code{background:none;border:0;padding:0;line-height:1.7}" +
    ".md-out a{color:" + T.accent + "}" +
    ".md-out ul,.md-out ol{margin:0 0 12px;padding-left:22px}" +
    ".md-out li{margin-bottom:4px}" +
    ".md-tok{font:500 11.5px " + T.mono + ";line-height:1.7}" +
    ".md-tok div{white-space:pre}" +
    ".md-tok .t{color:" + T.accent + "}" +
    ".md-tok .n{color:" + T.muted + "}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  var preset = "default", view = "rendered", typographer = true, linkifyOpt = true;

  function tokenRows(tokens, depth, rows) {
    tokens.forEach(function (t) {
      var pad = new Array(depth + 1).join("    ");
      var extra = t.tag ? " <" + t.tag + ">" : "";
      var content = t.content ? "  " + JSON.stringify(t.content.slice(0, 40)) : "";
      rows.push('<div><span class="n">' + ctx.esc(pad) + '</span><span class="t">' +
        ctx.esc(t.type) + '</span><span class="n">' + ctx.esc(extra + content) + "</span></div>");
      if (t.children && t.children.length) tokenRows(t.children, depth + 1, rows);
    });
    return rows;
  }
  function countTokens(ts) {
    var n = 0;
    ts.forEach(function (t) { n++; if (t.children) n += countTokens(t.children); });
    return n;
  }

  function run() {
    var md = markdownit(preset, {
      html: true, linkify: linkifyOpt, typographer: typographer, breaks: false
    });
    var t0 = performance.now();
    var tokens = md.parse(ta.value, {});
    var html = md.render(ta.value);
    var ms = performance.now() - t0;
    var clean = DOMPurify.sanitize(html);

    if (view === "rendered") {
      outBox.innerHTML = head(ctx, "RENDERED (SANITISED)") + '<div class="md-out">' + clean + "</div>";
    } else if (view === "tokens") {
      outBox.innerHTML = head(ctx, "TOKEN STREAM · md.parse()") +
        '<div class="md-tok">' + tokenRows(tokens, 0, []).join("") + "</div>";
    } else {
      outBox.innerHTML = head(ctx, "RAW HTML · md.render()") +
        '<pre class="demo-pre" style="max-height:none">' + ctx.esc(html) + "</pre>";
    }

    out("<b>" + countTokens(tokens) + "</b> tokens · <b>" + ms.toFixed(1) + " ms</b>" +
      (clean.length !== html.length
        ? " · <span style='color:" + T.part + "'>DOMPurify stripped " + (html.length - clean.length) + " chars</span>"
        : ""));
  }
  run();

  ctx.select("view", [{ v: "rendered", t: "rendered" }, { v: "tokens", t: "token stream" },
    { v: "html", t: "raw HTML" }], function (v) { view = v; run(); }, "rendered");
  ctx.select("preset", ["default", "commonmark", "zero"], function (v) { preset = v; run(); }, "default");
  ctx.check("typographer", true, function (v) { typographer = v; run(); });
  ctx.check("linkify", true, function (v) { linkifyOpt = v; run(); });
  ctx.btn("Paste an XSS payload", function () {
    ta.value = SRC + "\n\n<img src=x onerror=\"alert('xss')\">\n\n" +
      "[a poisoned link](javascript:alert('xss'))\n";
    run();
  });
};

/* ----------------------------------------------------------------- jsdiff */
B.jsdiff = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("42%");

  var OLD = [
    "function greet(name) {",
    "  const greeting = 'Hello'",
    "  console.log(greeting + ', ' + name)",
    "  return greeting",
    "}",
    "",
    "greet('world')"
  ].join("\n");
  var NEW = [
    "function greet(name, punctuation = '!') {",
    "  const greeting = 'Hi there'",
    "  console.log(`${greeting}, ${name}${punctuation}`)",
    "  return { greeting, name }",
    "}",
    "",
    "greet('world', '?')",
    "greet('everyone')"
  ].join("\n");

  var sA = section(ctx, p.a, "OLD", "");
  var taA = area(ctx, sA, OLD, 10, run);
  var sB = section(ctx, p.a, "NEW", "Edit either side — the diff recomputes on every keystroke.");
  var taB = area(ctx, sB, NEW, 11, run);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:16px 18px";
  p.b.appendChild(outBox);

  var style = ctx.mk("style");
  style.textContent =
    ".df{font:500 12px " + T.mono + ";line-height:1.75;white-space:pre-wrap;word-break:break-word;" +
      "background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;padding:11px 13px}" +
    ".df ins{background:" + (T.dark ? "rgba(86,211,160,.22)" : "rgba(14,143,104,.16)") +
      ";color:" + T.yes + ";text-decoration:none;border-radius:3px}" +
    ".df del{background:" + (T.dark ? "rgba(245,138,138,.22)" : "rgba(211,63,63,.14)") +
      ";color:" + T.bad + ";text-decoration:line-through;border-radius:3px}" +
    ".df-row{display:flex;gap:10px;padding:1px 8px;font:500 12px " + T.mono + ";line-height:1.75;" +
      "white-space:pre-wrap;color:" + T.ink2 + "}" +
    ".df-row .g{color:" + T.muted + ";user-select:none;width:12px;flex:0 0 auto;text-align:center}" +
    ".df-row.add{background:" + (T.dark ? "rgba(86,211,160,.13)" : "rgba(14,143,104,.10)") + "}" +
    ".df-row.add .g{color:" + T.yes + "}" +
    ".df-row.del{background:" + (T.dark ? "rgba(245,138,138,.13)" : "rgba(211,63,63,.09)") + "}" +
    ".df-row.del .g{color:" + T.bad + "}" +
    ".df-box{background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;" +
      "padding:9px 6px;overflow:auto}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  var mode = "lines", ignoreCase = false;

  var MODES = {
    chars: function (a, b) { return Diff.diffChars(a, b, { ignoreCase: ignoreCase }); },
    words: function (a, b) { return Diff.diffWords(a, b, { ignoreCase: ignoreCase }); },
    "words + space": function (a, b) { return Diff.diffWordsWithSpace(a, b); },
    lines: function (a, b) { return Diff.diffLines(a, b); },
    "trimmed lines": function (a, b) { return Diff.diffTrimmedLines(a, b); },
    sentences: function (a, b) { return Diff.diffSentences(a, b); }
  };

  function run() {
    var a = taA.value, b = taB.value;
    var parts = MODES[mode](a, b);
    var body, added = 0, removed = 0;

    if (mode === "lines" || mode === "trimmed lines") {
      var rows = [];
      parts.forEach(function (part) {
        var cls = part.added ? "add" : part.removed ? "del" : "";
        var g = part.added ? "+" : part.removed ? "−" : " ";
        part.value.replace(/\n$/, "").split("\n").forEach(function (line) {
          rows.push('<div class="df-row ' + cls + '"><span class="g">' + g + "</span><span>" +
            (ctx.esc(line) || "&nbsp;") + "</span></div>");
        });
        if (part.added) added += part.count || 0;
        if (part.removed) removed += part.count || 0;
      });
      body = '<div class="df-box">' + rows.join("") + "</div>";
    } else {
      body = '<div class="df">' + parts.map(function (part) {
        var v = ctx.esc(part.value);
        if (part.added) { added += part.value.length; return "<ins>" + v + "</ins>"; }
        if (part.removed) { removed += part.value.length; return "<del>" + v + "</del>"; }
        return v;
      }).join("") + "</div>";
    }

    var patch = Diff.createTwoFilesPatch("old.js", "new.js", a, b, "", "", { context: 2 });
    outBox.innerHTML =
      head(ctx, "INLINE DIFF · " + mode.toUpperCase()) + body +
      '<div style="height:18px"></div>' +
      head(ctx, "UNIFIED PATCH · Diff.createTwoFilesPatch()") +
      '<pre class="demo-pre" style="max-height:none">' + ctx.esc(patch) + "</pre>";

    var unit = (mode === "lines" || mode === "trimmed lines") ? "lines" : "chars";
    out("<b style='color:" + T.yes + "'>+" + added + "</b> / <b style='color:" + T.bad + "'>−" +
      removed + "</b> " + unit + " · <b>" + parts.length + "</b> parts");
  }
  run();

  ctx.select("granularity", Object.keys(MODES), function (v) { mode = v; run(); }, "lines");
  ctx.check("ignore case", false, function (v) { ignoreCase = v; run(); });
  ctx.btn("Two JSON objects", function () {
    taA.value = JSON.stringify({ id: 7, name: "widget", tags: ["a", "b"], price: 9.5, active: true }, null, 2);
    taB.value = JSON.stringify({ id: 7, name: "widget pro", tags: ["a", "c", "d"], price: 12, active: true }, null, 2);
    run();
  });
  ctx.btn("Reset", function () { taA.value = OLD; taB.value = NEW; run(); }, true);
};

/* ---------------------------------------------------------------- Linkify */
B.linkify = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("44%");

  var SRC = [
    "Deploy notes live at https://example.com/docs/deploy (see the",
    "rollback section). Ping ops@example.com if it fails.",
    "",
    "Cases a hand-rolled regex usually gets wrong:",
    "  - trailing full stop: visit https://example.com.",
    "  - a URL in brackets: (https://en.wikipedia.org/wiki/Foo_(bar))",
    "  - bare host with a path: example.com/pricing",
    "  - not links: version 1.2.3, the ratio 3.14, the file notes.txt",
    "  - unicode host and path: https://xn--and-6ma2c.cl/ano",
    "  - an IP and port: http://192.168.0.1:8080/status",
    "  - a very long one that gets truncated for display:",
    "    https://example.com/a/very/long/path/that/keeps/going/and/going?q=1&r=2",
    "",
    "Mentions and hashtags need a plugin: @maintainer, #v2"
  ].join("\n");

  var sIn = section(ctx, p.a, "PLAIN TEXT", "Edit it — everything on the right is derived.");
  var ta = area(ctx, sIn, SRC, 17, run);

  var outBox = ctx.mk("div");
  outBox.style.cssText = "padding:16px 18px";
  p.b.appendChild(outBox);

  var style = ctx.mk("style");
  style.textContent =
    ".lk-out{font:400 13px " + T.sans + ";line-height:1.9;color:" + T.ink2 + ";white-space:pre-wrap;" +
      "background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:10px;padding:13px 15px}" +
    ".lk-out a{color:" + T.accent + ";text-decoration:none;border-bottom:1px solid " + T.line2 + "}" +
    ".lk-out a:hover{border-bottom-color:" + T.accent + "}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  var newTab = true, nofollow = true, truncate = true;
  var hashtagsOn = false;

  function run() {
    var text = ta.value;
    var opts = { defaultProtocol: "https" };
    if (newTab) opts.target = "_blank";
    if (nofollow) opts.rel = "noopener noreferrer nofollow";
    if (truncate) opts.truncate = 48;

    var html = linkifyHtml(text, opts);
    var tokens = linkify.find(text);
    var byType = {};
    tokens.forEach(function (t) { byType[t.type] = (byType[t.type] || 0) + 1; });

    var rows = tokens.map(function (t) {
      return "<tr><td><code>" + ctx.esc(t.type) + '</code></td><td style="word-break:break-all">' +
        ctx.esc(t.value) + '</td><td style="color:' + T.muted + ';word-break:break-all">' +
        ctx.esc(t.href) + "</td></tr>";
    }).join("");

    outBox.innerHTML =
      head(ctx, "LINKIFIED HTML · linkifyHtml()") + '<div class="lk-out">' + html + "</div>" +
      '<div style="height:18px"></div>' +
      head(ctx, "SCANNER OUTPUT · linkify.find()") +
      '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
      '<colgroup><col style="width:76px"><col><col></colgroup>' +
      "<thead><tr><th>type</th><th>matched text</th><th>href</th></tr></thead>" +
      "<tbody>" + (rows || '<tr><td colspan="3">nothing found</td></tr>') + "</tbody></table>";

    out(Object.keys(byType).map(function (k) {
      return "<b>" + byType[k] + "</b> " + k;
    }).join(" · ") || "no links found");
  }
  run();

  ctx.check("target=_blank", true, function (v) { newTab = v; run(); });
  ctx.check("rel=nofollow", true, function (v) { nofollow = v; run(); });
  ctx.check("truncate to 48", true, function (v) { truncate = v; run(); });
  ctx.btn("Add the #hashtag plugin", function () {
    if (hashtagsOn) return;
    hashtagsOn = true;
    /* A token plugin teaches the scanner a new shape, so hashtags come out
       of the same single pass as URLs and emails — no second regex. */
    linkify.registerPlugin("fd-hashtag", function (o) {
      var scanner = o.scanner, parser = o.parser;
      var numeric = scanner.tokens.groups.numeric;
      var Hashtag = linkify.createTokenClass("hashtag", {
        isLink: true,
        toHref: function () { return "https://example.com/tags/" + this.toString().slice(1); }
      });
      var Pound = parser.start.tt(scanner.tokens.POUND);
      var Tag = Pound.tt(scanner.tokens.WORD, Hashtag);
      Pound.ta(numeric, Tag);
      Tag.tt(scanner.tokens.UNDERSCORE, Tag);
      Tag.tt(scanner.tokens.WORD, Tag);
      Tag.ta(numeric, Tag);
    });
    run();
  });
  ctx.btn("Reset text", function () { ta.value = SRC; run(); }, true);
};

})();
