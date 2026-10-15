/* Editors, markdown and syntax highlighting. */
(function () {
"use strict";
var B = window.B;

/* --------------------------------------------------------- CodeMirror 6 */
B.cm = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0;overflow:auto";
  ctx.el.appendChild(host);

  var SAMPLES = {
    javascript: [
      "// CodeMirror 6 keeps its document in immutable state and applies",
      "// every edit as a transaction. Try Ctrl-click for a second cursor.",
      "export function debounce(fn, wait = 200) {",
      "  let timer = null;",
      "  return (...args) => {",
      "    clearTimeout(timer);",
      "    timer = setTimeout(() => fn(...args), wait);",
      "  };",
      "}",
      "",
      "const search = debounce(async (q) => {",
      "  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);",
      "  if (!res.ok) throw new Error(`search failed: ${res.status}`);",
      "  return res.json();",
      "}, 250);"
    ].join("\n"),
    html: [
      "<!-- Language support is a separate package per language -->",
      '<section class="card">',
      '  <h2 class="card__title">Ship log</h2>',
      "  <ul>",
      "    <li><a href=\"/r/4.2\">4.2</a> — grid virtualisation</li>",
      "    <li><a href=\"/r/4.1\">4.1</a> — dark theme</li>",
      "  </ul>",
      "</section>"
    ].join("\n")
  };

  var langCompartment = new CM.Compartment();
  var themeCompartment = new CM.Compartment();

  function baseTheme() {
    return CM.EditorView.theme({
      "&": { height: "100%", fontSize: "13px", backgroundColor: T.stage, color: T.ink },
      ".cm-content": { fontFamily: T.mono, padding: "14px 0" },
      ".cm-gutters": { backgroundColor: T.sunk, color: T.muted, border: "none" },
      ".cm-activeLine": { backgroundColor: ctx.dark ? "#ffffff08" : "#0000000a" },
      ".cm-activeLineGutter": { backgroundColor: "transparent", color: T.ink2 },
      ".cm-cursor": { borderLeftColor: T.accent },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground":
        { backgroundColor: T.accent + "33" },
      ".cm-panels": { backgroundColor: T.panel, color: T.ink2 }
    }, { dark: ctx.dark });
  }

  var view = new CM.EditorView({
    doc: SAMPLES.javascript,
    extensions: [
      CM.basicSetup,
      CM.keymap.of([CM.indentWithTab]),
      langCompartment.of(CM.javascript()),
      themeCompartment.of(ctx.dark ? [CM.oneDark, baseTheme()] : baseTheme())
    ],
    parent: host
  });

  var out = ctx.readout("");
  function report() {
    var st = view.state;
    out("<b>" + st.doc.lines + "</b> lines · <b>" + st.doc.length + "</b> chars · " +
        st.selection.ranges.length + " cursor" + (st.selection.ranges.length === 1 ? "" : "s"));
  }
  report();
  var poll = ctx.every(400, report);

  ctx.select("language", ["javascript", "html"], function (v) {
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: SAMPLES[v] },
      effects: langCompartment.reconfigure(v === "html" ? CM.html() : CM.javascript())
    });
  }, "javascript");
  ctx.btn("Find (Ctrl-F)", function () { CM.openSearchPanel(view); });
  ctx.btn("Select all occurrences", function () {
    view.focus();
    out("try Ctrl-click in the editor to drop a second cursor");
  });
  ctx.label("multiple cursors · bracket matching · undo history");

  ctx.onDestroy(function () { view.destroy(); });
};

/* ------------------------------------------------------------------ Quill */
B.quill = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("58%");

  /* Quill ships a light theme; nudge it onto the page palette. */
  var style = ctx.mk("style");
  style.textContent =
    ".ql-toolbar.ql-snow{border:0;border-bottom:1px solid " + T.line + ";background:" + T.panel2 + "}" +
    ".ql-container.ql-snow{border:0;font-family:" + T.sans + ";font-size:14px;color:" + T.ink + "}" +
    ".ql-editor{min-height:100%}" +
    ".ql-editor.ql-blank::before{color:" + T.muted + "}" +
    ".ql-snow .ql-stroke{stroke:" + T.ink2 + "}" +
    ".ql-snow .ql-fill{fill:" + T.ink2 + "}" +
    ".ql-snow .ql-picker{color:" + T.ink2 + "}" +
    ".ql-snow .ql-picker-options{background:" + T.panel + ";border-color:" + T.line + "}" +
    ".ql-snow.ql-toolbar button:hover .ql-stroke{stroke:" + T.accent + "}" +
    ".ql-snow.ql-toolbar button.ql-active .ql-stroke{stroke:" + T.accent + "}" +
    ".ql-snow.ql-toolbar button.ql-active .ql-fill{fill:" + T.accent + "}" +
    ".ql-snow a{color:" + T.accent + "}" +
    ".ql-snow blockquote{border-left:3px solid " + T.line2 + ";color:" + T.ink2 + "}";
  ctx.el.appendChild(style);

  var host = ctx.mk("div");
  host.style.cssText = "height:100%";
  p.a.appendChild(host);
  p.a.style.background = ctx.T.stage;

  var side = ctx.mk("div");
  side.style.cssText = "padding:16px;min-height:100%";
  side.innerHTML = '<p class="demo-h">Delta — the actual document model</p>' +
    '<p class="demo-note" style="margin:0 0 10px">Quill does not store HTML. It stores a list of ' +
    "insert operations with attributes, which is what makes diffing and collaborative editing tractable.</p>" +
    '<pre class="demo-pre" id="quill-delta" style="max-height:calc(100% - 90px)"></pre>';
  p.b.appendChild(side);

  var quill = new Quill(host, {
    theme: "snow",
    placeholder: "Type something, then format it…",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block", "link"],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ]
    }
  });

  quill.setContents([
    { insert: "Rich text, stored as operations\n", attributes: { header: 2 } },
    { insert: "Select any of this text and hit " },
    { insert: "bold", attributes: { bold: true } },
    { insert: " or " },
    { insert: "colour", attributes: { color: "#6EA8FE" } },
    { insert: " — then watch the panel on the right.\n" },
    { insert: "Every change is an operation, not an HTML diff.\n", attributes: { blockquote: true } },
    { insert: "quill.getContents()", attributes: { "code-block": true } },
    { insert: "\n" }
  ]);

  var out = ctx.readout("");
  function show() {
    var d = quill.getContents();
    document.getElementById("quill-delta").textContent = JSON.stringify(d.ops, null, 1);
    out("<b>" + d.ops.length + "</b> operations · <b>" + quill.getLength() + "</b> characters");
  }
  show();
  quill.on("text-change", show);

  ctx.btn("Insert heading", function () {
    var i = quill.getLength() - 1;
    quill.insertText(i, "\nA new section\n", { header: 3 });
  });
  ctx.btn("Show HTML", function () {
    document.getElementById("quill-delta").textContent = quill.root.innerHTML.replace(/></g, ">\n<");
    out("that HTML is derived output — the Delta above is the source of truth");
  });
};

/* ----------------------------------------------------------------- marked */
B.marked = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var out = ctx.mk("div");
  out.style.cssText = "padding:20px 24px;min-height:100%;line-height:1.7;color:" + T.ink2;
  p.b.appendChild(out);

  var style = ctx.mk("style");
  style.textContent =
    "#md-out h1,#md-out h2,#md-out h3{color:" + T.ink + ";margin:18px 0 8px;line-height:1.3}" +
    "#md-out h1{font-size:23px}#md-out h2{font-size:18px}#md-out h3{font-size:15px}" +
    "#md-out p{margin:9px 0}" +
    "#md-out code{background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:4px;padding:1px 5px;font-size:12px}" +
    "#md-out pre{background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;padding:12px;overflow:auto}" +
    "#md-out pre code{border:0;background:none;padding:0}" +
    "#md-out blockquote{border-left:3px solid " + T.accent + ";margin:12px 0;padding:2px 14px;color:" + T.muted + "}" +
    "#md-out table{border-collapse:collapse;margin:12px 0;font-size:13px}" +
    "#md-out th,#md-out td{border:1px solid " + T.line + ";padding:6px 10px;text-align:left}" +
    "#md-out th{background:" + T.panel2 + ";color:" + T.muted + "}" +
    "#md-out ul,#md-out ol{padding-left:22px}" +
    "#md-out li{margin:3px 0}" +
    "#md-out a{color:" + T.accent + "}" +
    "#md-out hr{border:0;border-top:1px solid " + T.line + ";margin:16px 0}";
  ctx.el.appendChild(style);
  out.id = "md-out";

  var SOURCE = [
    "# marked",
    "",
    "Text in, HTML out — and **nothing else**. It deliberately does not sanitise,",
    "so this demo pipes the result through DOMPurify before inserting it.",
    "",
    "> Try the payload below. marked will happily emit the tag; DOMPurify removes it.",
    "",
    "```js",
    "const html = DOMPurify.sanitize(marked.parse(src));",
    "```",
    "",
    "| feature | supported |",
    "| --- | --- |",
    "| GFM tables | yes |",
    "| task lists | yes |",
    "| footnotes | via extension |",
    "",
    "- [x] CommonMark",
    "- [x] GitHub flavoured",
    "- [ ] your custom renderer",
    "",
    "---",
    "",
    "<img src=x onerror=\"alert('xss')\">",
    "",
    "Inline `code`, a [link](https://marked.js.org/), and ~~strikethrough~~."
  ].join("\n");

  var sanitise = true, status = ctx.readout("");

  function render(src) {
    var t0 = performance.now();
    var raw = marked.parse(src, { gfm: true, breaks: false });
    var clean = sanitise ? DOMPurify.sanitize(raw) : raw;
    out.innerHTML = clean;
    var removed = raw.length - clean.length;
    status("parsed in <b>" + (performance.now() - t0).toFixed(1) + " ms</b> → " +
           raw.length + " chars of HTML" +
           (sanitise ? " · DOMPurify stripped <b>" + Math.max(0, removed) + "</b> chars" : ""));
  }

  var editor = ctx.editor(p.a, SOURCE, render);
  render(SOURCE);

  ctx.check("sanitise with DOMPurify", true, function (v) { sanitise = v; render(editor.value); });
  ctx.btn("Show raw HTML", function () {
    out.textContent = marked.parse(editor.value, { gfm: true });
    status("that is marked's literal output — note the untouched image tag");
  });
};

/* ----------------------------------------------------------- highlight.js */
B.hljs = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var p = ctx.panes("46%");

  var right = ctx.mk("div");
  right.style.cssText = "padding:18px;min-height:100%";
  right.innerHTML =
    '<p class="demo-h">Detected language</p>' +
    '<div id="hl-guess" style="margin-bottom:14px"></div>' +
    '<pre class="demo-pre" style="max-height:calc(100% - 120px)"><code id="hl-out" class="hljs"></code></pre>';
  p.b.appendChild(right);

  var SAMPLES = {
    rust: [
      "#[derive(Debug, Clone)]",
      "pub struct Grid<T> { cells: Vec<T>, width: usize }",
      "",
      "impl<T: Default + Clone> Grid<T> {",
      "    pub fn new(width: usize, height: usize) -> Self {",
      "        Self { cells: vec![T::default(); width * height], width }",
      "    }",
      "    pub fn get(&self, x: usize, y: usize) -> Option<&T> {",
      "        self.cells.get(y * self.width + x)",
      "    }",
      "}"
    ].join("\n"),
    python: [
      "from dataclasses import dataclass",
      "",
      "@dataclass(frozen=True)",
      "class Point:",
      "    x: float",
      "    y: float",
      "",
      "    def __add__(self, other: 'Point') -> 'Point':",
      "        return Point(self.x + other.x, self.y + other.y)",
      "",
      "pts = [Point(i, i ** 0.5) for i in range(10)]",
      "print(sum((p.y for p in pts), start=0.0))"
    ].join("\n"),
    sql: [
      "WITH weekly AS (",
      "  SELECT date_trunc('week', created_at) AS wk,",
      "         count(*) FILTER (WHERE status = 'shipped') AS shipped,",
      "         count(*) AS total",
      "  FROM orders",
      "  WHERE created_at >= now() - interval '90 days'",
      "  GROUP BY 1",
      ")",
      "SELECT wk, shipped, total, round(100.0 * shipped / total, 1) AS pct",
      "FROM weekly ORDER BY wk DESC;"
    ].join("\n"),
    go: [
      "package main",
      "",
      'import ("context"; "errors"; "time")',
      "",
      "func fetchAll(ctx context.Context, urls []string) ([][]byte, error) {",
      "\tif len(urls) == 0 {",
      '\t\treturn nil, errors.New("no urls")',
      "\t}",
      "\tctx, cancel := context.WithTimeout(ctx, 5*time.Second)",
      "\tdefer cancel()",
      "\treturn nil, nil",
      "}"
    ].join("\n")
  };

  var status = ctx.readout("");
  function render(code) {
    /* highlightAuto scores every registered grammar and picks a winner. */
    var r = hljs.highlightAuto(code);
    document.getElementById("hl-out").innerHTML = r.value;
    var second = r.secondBest;
    document.getElementById("hl-guess").innerHTML =
      '<span class="demo-badge ok">' + (r.language || "unknown") + "</span> " +
      '<span class="demo-note">relevance ' + r.relevance + "</span>" +
      (second ? '<div class="demo-note" style="margin-top:6px">runner-up: <b>' + second.language +
                "</b> at " + second.relevance + "</div>" : "");
    status("guessed <b>" + (r.language || "unknown") + "</b> from " +
           hljs.listLanguages().length + " registered grammars");
  }

  var editor = ctx.editor(p.a, SAMPLES.rust, render);
  render(SAMPLES.rust);

  ctx.select("sample", Object.keys(SAMPLES), function (v) {
    editor.value = SAMPLES[v]; render(SAMPLES[v]);
  }, "rust");
  ctx.label("paste your own code — nothing tells it the language");
};

})();
