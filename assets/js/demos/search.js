/* Client-side full-text search.

   All three demos index the same corpus: the library registry behind this
   very site. That makes the differences between them comparable rather
   than anecdotal — same documents, same queries, three engines. */
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
function cols(ctx) {
  var p = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(p);
  var a = ctx.mk("div", "demo-colbox"), b = ctx.mk("div", "demo-colbox");
  p.appendChild(a); p.appendChild(b);
  return { a: a, b: b };
}

/* One flat document per library. */
function corpus() {
  return window.LIBS.map(function (l) {
    return {
      k: l.k, n: l.n, pkg: l.pkg, cat: l.cat,
      what: l.what,
      notes: l.pro + " " + l.con
    };
  });
}
function byKey(docs) {
  var m = {};
  docs.forEach(function (d) { m[d.k] = d; });
  return m;
}

/* A search box that sits above the results, big enough to be the point
   of the page rather than an afterthought. */
function searchBox(ctx, parent, placeholder, onInput) {
  var T = ctx.T;
  var wrap = ctx.mk("div");
  wrap.style.cssText = "position:relative;margin-bottom:14px";
  var i = ctx.mk("input");
  i.type = "search";
  i.placeholder = placeholder;
  i.spellcheck = false;
  i.autocomplete = "off";
  i.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line2 +
    ";border-radius:10px;padding:12px 16px 12px 40px;color:" + T.ink + ";font:500 15px " + T.sans +
    ";outline:none";
  i.addEventListener("focus", function () { i.style.borderColor = T.accent; });
  i.addEventListener("blur", function () { i.style.borderColor = T.line2; });
  i.addEventListener("input", function () { onInput(i.value); });
  var ico = ctx.mk("span");
  ico.textContent = "⌕";
  ico.style.cssText = "position:absolute;left:15px;top:50%;transform:translateY(-50%);font-size:17px;color:" + T.muted;
  wrap.appendChild(i); wrap.appendChild(ico);
  parent.appendChild(wrap);
  return i;
}

function hit(ctx, doc, score, maxScore, extra) {
  var T = ctx.T;
  var w = Math.max(3, Math.round(score / maxScore * 100));
  return '<div style="padding:10px 12px;border:1px solid ' + T.line + ";border-radius:9px;background:" +
    T.panel + ';margin-bottom:8px">' +
    '<div style="display:flex;align-items:baseline;gap:9px">' +
    '<span style="font:600 13.5px ' + T.sans + ";color:" + T.ink + '">' + ctx.esc(doc.n) + "</span>" +
    '<code style="font-size:10.5px;color:' + T.muted + '">' + ctx.esc(doc.pkg) + "</code>" +
    '<span style="margin-left:auto;font:600 11px ' + T.mono + ";color:" + T.accent + '">' +
      score.toFixed(3) + "</span></div>" +
    '<div style="height:4px;border-radius:2px;background:' + T.sunk + ';margin:6px 0 6px">' +
    '<div style="height:100%;border-radius:2px;width:' + w + "%;background:" + T.accent + '"></div></div>' +
    '<div style="font-size:12px;line-height:1.6;color:' + T.ink2 + '">' +
      ctx.esc(doc.what.slice(0, 130)) + "…</div>" +
    (extra ? '<div style="margin-top:5px;font:500 10.5px ' + T.mono + ";color:" + T.muted + '">' +
      extra + "</div>" : "") + "</div>";
}

/* ------------------------------------------------------------ MiniSearch */
B.minisearch = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var docs = corpus(), map = byKey(docs);

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Typo-tolerant search over ' + docs.length + ' documents</p>' +
    '<p class="demo-p">The corpus is the registry behind this site. Try <code>chrat</code>, ' +
    "<code>animatoin</code> or <code>webgl</code> — prefix matching finds you results while you are still " +
    "typing, and fuzzy matching survives the typo.</p>";
  ctx.el.appendChild(host);

  var input = searchBox(ctx, ctx.el, "Search 162 libraries…", function (v) { run(v); });

  var c = cols(ctx);
  var resCard = card(ctx, c.a, "RESULTS", "Ranked by BM25-style score across three fields.");
  var resHost = ctx.mk("div");
  resCard.appendChild(resHost);

  var sugCard = card(ctx, c.b, "autoSuggest()",
    "A separate API for the dropdown you put under the box — it returns completions, not documents.");
  var sugHost = ctx.mk("div");
  sugCard.appendChild(sugHost);

  var statCard = card(ctx, c.b, "INDEX", "");
  var statHost = ctx.mk("div");
  statCard.appendChild(statHost);

  var t0 = performance.now();
  var mini = new MiniSearch({
    idField: "k",
    fields: ["n", "pkg", "what", "notes"],
    storeFields: ["n", "pkg", "what", "cat"],
    searchOptions: { boost: { n: 4, pkg: 3 }, prefix: true, fuzzy: 0.4 }
  });
  mini.addAll(docs);
  var buildMs = performance.now() - t0;

  var out = ctx.readout("");
  var fuzzy = 0.4, prefix = true, combine = "OR";

  function run(q) {
    q = (q == null ? input.value : q).trim();
    if (!q) {
      resHost.innerHTML = '<p class="demo-note">Type something. Every keystroke re-runs the query.</p>';
      sugHost.innerHTML = '<p class="demo-note">—</p>';
      out("idle · " + docs.length + " documents indexed");
      return;
    }
    var t1 = performance.now();
    var hits = mini.search(q, {
      boost: { n: 4, pkg: 3 },
      prefix: prefix,
      fuzzy: fuzzy,
      combineWith: combine
    });
    var ms = performance.now() - t1;
    var max = hits.length ? hits[0].score : 1;
    resHost.innerHTML = hits.length
      ? hits.slice(0, 12).map(function (h) {
        return hit(ctx, map[h.id], h.score, max,
          "matched <b>" + h.terms.join("</b>, <b>") + "</b> in " + Object.keys(h.match)
            .map(function (t) { return h.match[t].join("/"); })
            .filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", "));
      }).join("")
      : '<p class="demo-note">No hits. Loosen the fuzzy threshold or switch to OR.</p>';

    var sug = mini.autoSuggest(q, { fuzzy: fuzzy, prefix: prefix });
    sugHost.innerHTML = sug.length
      ? sug.slice(0, 8).map(function (s) {
        return '<div style="display:flex;justify-content:space-between;padding:6px 10px;border-radius:7px;' +
          "background:" + T.sunk + ";margin-bottom:5px;font:500 12.5px " + T.mono + ";color:" + T.ink2 + '">' +
          "<span>" + ctx.esc(s.suggestion) + '</span><span style="color:' + T.muted + '">' +
          s.score.toFixed(2) + "</span></div>";
      }).join("")
      : '<p class="demo-note">no suggestions</p>';

    out("<b>" + hits.length + "</b> hits in <b>" + ms.toFixed(2) + " ms</b>");
  }

  statHost.innerHTML = '<table class="demo-tbl"><tbody>' +
    "<tr><td>documents</td><td><b>" + docs.length + "</b></td></tr>" +
    "<tr><td>indexed fields</td><td><code>n, pkg, what, notes</code></td></tr>" +
    "<tr><td>build time</td><td><b>" + buildMs.toFixed(1) + " ms</b></td></tr>" +
    "<tr><td>serialised size</td><td><b>" +
      (JSON.stringify(mini).length / 1024).toFixed(0) + " KB</b> (JSON.stringify → ship it prebuilt)</td></tr>" +
    "</tbody></table>";

  run("");
  input.value = "chrat";
  run("chrat");

  ctx.range("fuzzy", { min: 0, max: 0.6, step: 0.05, value: 0.4, fmt: function (v) { return v.toFixed(2); } },
    function (v) { fuzzy = v; run(); });
  ctx.check("prefix matching", true, function (v) { prefix = v; run(); });
  ctx.select("combine terms with", ["OR", "AND"], function (v) { combine = v; run(); }, "OR");
  ctx.btn("Try a typo", function () { input.value = "animatoin libary"; run(); }, true);
};

/* ------------------------------------------------------------ FlexSearch */
B.flexsearch = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var docs = corpus(), map = byKey(docs);

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Tokenisers change what a partial word can find</p>' +
    '<p class="demo-p">FlexSearch builds a different index for each tokeniser. Search <code>chart</code>, ' +
    "then switch the tokeniser: <code>strict</code> needs whole words, <code>forward</code> matches " +
    "prefixes, <code>reverse</code> matches suffixes too, and <code>full</code> matches anywhere inside " +
    "a word — at a real cost in index size, shown on the right.</p>";
  ctx.el.appendChild(host);

  var input = searchBox(ctx, ctx.el, "Search the same 162 libraries…", function () { run(); });

  var c = cols(ctx);
  var resCard = card(ctx, c.a, "RESULTS", "Per-field results, merged and deduplicated.");
  var resHost = ctx.mk("div");
  resCard.appendChild(resHost);

  var fieldCard = card(ctx, c.b, "WHICH FIELD MATCHED",
    "A Document index keeps one index per field, so you can see where a hit came from.");
  var fieldHost = ctx.mk("div");
  fieldCard.appendChild(fieldHost);

  var costCard = card(ctx, c.b, "TOKENISER COST",
    "Built here, now, over the same documents.");
  var costHost = ctx.mk("div");
  costCard.appendChild(costHost);

  var TOKENS = ["strict", "forward", "reverse", "full"];
  var indexes = {}, cost = {};

  TOKENS.forEach(function (tk) {
    var t0 = performance.now();
    var idx = new FlexSearch.Document({
      tokenize: tk,
      document: { id: "k", index: ["n", "pkg", "what", "notes"] }
    });
    docs.forEach(function (d) { idx.add(d); });
    var ms = performance.now() - t0;
    var size = 0;
    idx.export(function (key, data) { size += (data ? String(data).length : 0); });
    indexes[tk] = idx;
    cost[tk] = { ms: ms, size: size };
  });

  var maxSize = Math.max.apply(null, TOKENS.map(function (t) { return cost[t].size; }));
  costHost.innerHTML = TOKENS.map(function (tk, i) {
    return '<div style="margin-bottom:11px">' +
      '<div style="display:flex;justify-content:space-between;font:600 11.5px ' + T.mono + ";color:" +
        T.ink2 + ';margin-bottom:4px"><span>' + tk + "</span><span>" +
        (cost[tk].size / 1024).toFixed(0) + " KB · " + cost[tk].ms.toFixed(0) + " ms to build</span></div>" +
      '<div style="height:9px;border-radius:5px;background:' + T.sunk + '">' +
      '<div style="height:100%;border-radius:5px;width:' + (cost[tk].size / maxSize * 100).toFixed(1) +
        "%;background:" + ctx.series(i) + '"></div></div></div>';
  }).join("");

  var out = ctx.readout("");
  var token = "forward", limit = 12;

  function run() {
    var q = input.value.trim();
    if (!q) {
      resHost.innerHTML = '<p class="demo-note">Type something.</p>';
      fieldHost.innerHTML = '<p class="demo-note">—</p>';
      out(docs.length + " documents · 4 indexes built");
      return;
    }
    var t0 = performance.now();
    var res = indexes[token].search(q, { limit: limit });
    var ms = performance.now() - t0;

    var seen = {}, order = [];
    res.forEach(function (r) {
      r.result.forEach(function (id) {
        if (!seen[id]) { seen[id] = []; order.push(id); }
        seen[id].push(r.field);
      });
    });

    resHost.innerHTML = order.length
      ? order.slice(0, limit).map(function (id, i) {
        return hit(ctx, map[id], order.length - i, order.length,
          "found in <b>" + seen[id].join("</b>, <b>") + "</b>");
      }).join("")
      : '<p class="demo-note">Nothing. Try a looser tokeniser.</p>';

    fieldHost.innerHTML = res.length
      ? '<table class="demo-tbl"><thead><tr><th>field</th><th>hits</th><th>top match</th></tr></thead><tbody>' +
        res.map(function (r) {
          return "<tr><td><code>" + r.field + "</code></td><td><b>" + r.result.length +
            "</b></td><td>" + ctx.esc(map[r.result[0]].n) + "</td></tr>";
        }).join("") + "</tbody></table>"
      : '<p class="demo-note">no field matched</p>';

    out("<b>" + order.length + "</b> documents in <b>" + ms.toFixed(2) + " ms</b> · tokenizer <b>" +
      token + "</b>");
  }

  input.value = "chart";
  run();

  ctx.select("tokenizer", TOKENS, function (v) { token = v; run(); }, "forward");
  ctx.range("limit", { min: 3, max: 30, value: 12 }, function (v) { limit = v; run(); });
  ctx.btn("Search a suffix: 'script'", function () { input.value = "script"; run(); });
  ctx.btn("Search inside a word: 'ndere'", function () { input.value = "ndere"; run(); }, true);
};

/* ---------------------------------------------------------------- Lunr.js */
B.lunr = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var docs = corpus(), map = byKey(docs);

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">A query language, not just a text box</p>' +
    '<p class="demo-p">Lunr ships a real query parser: <code>+required</code>, <code>-excluded</code>, ' +
    "<code>field:term</code>, <code>wild*cards</code> and <code>fuzzy~1</code>. It also stems every " +
    "term, so <code>animating</code> and <code>animation</code> collapse to the same token — the " +
    "pipeline panel shows exactly what your query became.</p>";
  ctx.el.appendChild(host);

  var input = searchBox(ctx, ctx.el, 'e.g.  +chart -react  what:webgl  anim*', function () { run(); });

  var c = cols(ctx);
  var resCard = card(ctx, c.a, "RESULTS", "Scored with TF-IDF and field boosts.");
  var resHost = ctx.mk("div");
  resCard.appendChild(resHost);

  var pipeCard = card(ctx, c.b, "WHAT THE PIPELINE DID",
    "Your raw query, tokenised, stop-word filtered and stemmed.");
  var pipeHost = ctx.mk("div");
  pipeCard.appendChild(pipeHost);

  var synCard = card(ctx, c.b, "QUERY SYNTAX", "Click any of these to run it.");
  var synHost = ctx.mk("div");
  synCard.appendChild(synHost);

  var t0 = performance.now();
  var idx = lunr(function () {
    this.ref("k");
    this.field("n", { boost: 10 });
    this.field("pkg", { boost: 6 });
    this.field("what");
    this.field("notes");
    var self = this;
    docs.forEach(function (d) { self.add(d); });
  });
  var buildMs = performance.now() - t0;

  var out = ctx.readout("");

  var EXAMPLES = [
    ["chart", "one plain term — stemmed before matching"],
    ["+chart -react", "chart required, anything mentioning react excluded"],
    ["n:three", "restrict a term to the name field"],
    ["anim*", "trailing wildcard"],
    ["*graph*", "wildcards on both ends"],
    ["webgl~1", "edit distance 1 — survives one typo"],
    ["what:webgl notes:fast", "different terms against different fields"],
    ["animating", "stemming: finds documents that say 'animation'"]
  ];
  synHost.innerHTML = EXAMPLES.map(function (e) {
    return '<div data-q="' + ctx.esc(e[0]) + '" style="cursor:pointer;padding:7px 10px;border-radius:7px;' +
      "background:" + T.sunk + ";margin-bottom:6px;border:1px solid " + T.line + '">' +
      '<code style="font-size:12px;color:' + T.accent + '">' + ctx.esc(e[0]) + "</code>" +
      '<div style="font-size:11.5px;color:' + T.muted + ';margin-top:3px">' + e[1] + "</div></div>";
  }).join("");
  synHost.querySelectorAll("[data-q]").forEach(function (el) {
    el.addEventListener("click", function () { input.value = el.dataset.q; run(); });
  });

  function pipeline(q) {
    /* Run the same pipeline the index used, so the panel is honest. */
    var raw = q.split(/\s+/).filter(Boolean);
    return raw.map(function (term) {
      var bare = term.replace(/^[+-]/, "").replace(/^\w+:/, "").replace(/~\d+$/, "");
      var toks = lunr.tokenizer(bare.replace(/\*/g, " ")).map(String);
      var stemmed = toks.map(function (t) {
        return lunr.stemmer(new lunr.Token(t, {})).toString();
      });
      var stopped = toks.filter(function (t) {
        return !lunr.stopWordFilter(new lunr.Token(t, {}));
      });
      return { raw: term, tokens: toks, stemmed: stemmed, dropped: stopped };
    });
  }

  function run() {
    var q = input.value.trim();
    if (!q) {
      resHost.innerHTML = '<p class="demo-note">Type a query, or click one on the right.</p>';
      pipeHost.innerHTML = '<p class="demo-note">—</p>';
      out(docs.length + " documents · built in " + buildMs.toFixed(1) + " ms");
      return;
    }
    var t1 = performance.now(), hits, err = null;
    try { hits = idx.search(q); } catch (e) { hits = []; err = e.message; }
    var ms = performance.now() - t1;
    var max = hits.length ? hits[0].score : 1;

    resHost.innerHTML = err
      ? '<div style="font:500 12px ' + T.mono + ";color:" + T.bad + '">' + ctx.esc(err) + "</div>"
      : hits.length
        ? hits.slice(0, 12).map(function (h) {
          var fields = {};
          Object.keys(h.matchData.metadata).forEach(function (term) {
            Object.keys(h.matchData.metadata[term]).forEach(function (f) { fields[f] = 1; });
          });
          return hit(ctx, map[h.ref], h.score, max,
            "terms <b>" + Object.keys(h.matchData.metadata).join("</b>, <b>") +
            "</b> in " + Object.keys(fields).join(", "));
        }).join("")
        : '<p class="demo-note">No hits.</p>';

    pipeHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>as typed</th><th>tokenised</th>' +
      "<th>stemmed</th></tr></thead><tbody>" + pipeline(q).map(function (p) {
        return "<tr><td><code>" + ctx.esc(p.raw) + "</code></td><td>" +
          ctx.esc(p.tokens.join(" ") || "—") + "</td><td><b>" +
          ctx.esc(p.stemmed.join(" ") || "—") + "</b>" +
          (p.dropped.length !== p.tokens.length
            ? ' <span style="color:' + T.part + '">(stop word)</span>' : "") + "</td></tr>";
      }).join("") + "</tbody></table>";

    out(err ? "<b style='color:" + T.bad + "'>parse error</b>"
      : "<b>" + hits.length + "</b> hits in <b>" + ms.toFixed(2) + " ms</b>");
  }

  input.value = "+chart -react";
  run();

  ctx.btn("Show the serialised index", function () {
    var json = JSON.stringify(idx);
    resHost.innerHTML = '<p class="demo-note">' + (json.length / 1024).toFixed(0) +
      " KB. Build this at deploy time, ship it as JSON, and call " +
      "<code>lunr.Index.load()</code> in the browser — no indexing on the client at all.</p>" +
      '<pre class="demo-pre">' + ctx.esc(json.slice(0, 1400)) + "…</pre>";
  });
  ctx.btn("Reset", function () { input.value = "+chart -react"; run(); }, true);
};

})();
