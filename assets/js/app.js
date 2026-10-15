/* ==================================================================
   FrontDemo — application shell.

   Responsibilities:
     · theme (two palettes, exposed to demos as a token object)
     · on-demand vendor loading
     · sidebar, search and hash routing
     · the context object every demo builder is handed
     · home page, category panels, library page, comparison matrix

   A category opens as a grid of panels, one live demo per library, so
   they can be compared side by side. Panels can be reordered (the order
   is remembered per category) but never removed.

   Demo builders live in assets/js/demos/*.js and register themselves:
       B.mylib = async function (ctx) { ... }
   ================================================================== */
(function () {
"use strict";

var GROUPS = window.GROUPS, CATS = window.CATS, CAPS = window.CAPS,
    LIBS = window.LIBS, MK = window.MK, CHECKED = window.CHECKED;
var B = window.B = {};                       /* key -> builder            */
/* No prototype, so a route like #/l/constructor finds nothing. */
var byKey = Object.create(null);   LIBS.forEach(function (l) { byKey[l.k] = l; });
var catById = Object.create(null); CATS.forEach(function (c) { catById[c.id] = c; });
/* Where a library's panel is: its category page, scrolled to it. */
var panelHref = function (l) { return "#/c/" + l.cat + "/" + l.k; };

var $ = function (s, r) { return (r || document).querySelector(s); };
var el = function (tag, cls, html) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
var esc = function (s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
};

/* ------------------------------------------------------------------
   Theme
   ------------------------------------------------------------------ */
var SERIES = {
  dark:  ["#6EA8FE", "#56D3A0", "#E3B341", "#F58A8A", "#A78BFA", "#4FD1DB", "#F0A868", "#93A7C4"],
  light: ["#2C64E3", "#0E8F68", "#B0770F", "#D33F3F", "#7C4DDA", "#0C8794", "#CC6C15", "#57687F"]
};

var T = window.T = {};

function readTheme() {
  var cs = getComputedStyle(document.documentElement);
  var g = function (n) { return cs.getPropertyValue("--" + n).trim(); };
  var dark = document.documentElement.getAttribute("data-theme") !== "light";
  T.dark = dark;
  T.bg = g("bg"); T.panel = g("panel"); T.panel2 = g("panel-2");
  T.stage = g("stage"); T.sunk = g("sunk");
  T.line = g("line"); T.line2 = g("line-2");
  T.ink = g("ink"); T.ink2 = g("ink-2"); T.muted = g("muted");
  T.accent = g("accent"); T.accent2 = g("accent-2");
  T.yes = g("yes"); T.part = g("part"); T.bad = g("bad");
  T.mono = g("mono"); T.sans = g("sans");
  T.series = SERIES[dark ? "dark" : "light"].slice();
  /* Handy pre-mixed values so demos do not each reinvent them. */
  T.grid = dark ? "#2A3240" : "#E4E9F1";
  T.nodeFill = dark ? "#262D3C" : "#FFFFFF";
  T.nodeLine = dark ? "#3C4759" : "#C9D2E0";
  T.edge = dark ? "#7D8CA3" : "#94A2B8";
  return T;
}

/* Remembered settings. Storage can be blocked (a private window, cleared
   site data), so a read falls back to its default and a write gives up
   quietly; setPref with null forgets the setting. */
function pref(k, d) {
  try { return localStorage.getItem(k) || d; } catch (e) { return d; }
}
function setPref(k, v) {
  try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
}

function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  setPref("fd-theme", name);
  readTheme();
  var b = $("#themeBtn");
  if (b) b.textContent = name === "light" ? "◐ Light" : "◑ Dark";
}

/* ------------------------------------------------------------------
   Vendor loading. Scripts are loaded strictly in the order given,
   because some expect a peer global to already exist (LogicFlow's
   extension needs its core). A failed load is forgotten, so the next
   visit tries again.

   A library's stylesheet applies only while a demo that uses it is
   mounted (see destroyRec): some carry page-wide rules, such as
   LogicFlow's :focus { outline: none }. Panels can share one, so each
   use is counted and the last one out switches it off.
   ------------------------------------------------------------------ */
var jsCache = {}, cssCache = {}, cssLinks = {}, cssUse = {};

function loadJS(id) {
  if (jsCache[id]) return jsCache[id];
  jsCache[id] = new Promise(function (res, rej) {
    var s = document.createElement("script");
    s.src = "vendor/" + id + ".js";
    s.onload = function () { res(); };
    s.onerror = function () {
      delete jsCache[id]; s.remove();
      rej(new Error("could not load vendor/" + id + ".js"));
    };
    document.head.appendChild(s);
  });
  return jsCache[id];
}

function loadCSS(id) {
  if (cssLinks[id]) cssLinks[id].disabled = false;
  if (cssCache[id]) return cssCache[id];
  cssCache[id] = new Promise(function (res) {
    var l = cssLinks[id] = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "assets/css/lib/" + id + ".css";
    l.onload = function () { res(); };
    l.onerror = function () { delete cssCache[id]; delete cssLinks[id]; l.remove(); res(); };
    document.head.appendChild(l);
  });
  return cssCache[id];
}

function useCSS(id) {
  cssUse[id] = (cssUse[id] || 0) + 1;
  return loadCSS(id);
}

function dropCSS(id) {
  if (!--cssUse[id] && cssLinks[id]) cssLinks[id].disabled = true;
}

function need() {
  var ids = [].slice.call(arguments);
  return ids.reduce(function (p, id) {
    return p.then(function () { return loadJS(id); });
  }, Promise.resolve());
}
window.__need = need;

/* ------------------------------------------------------------------
   Demo lifecycle. Every mounted demo has a teardown record; a category
   page runs one per panel, a library page one.
   ------------------------------------------------------------------ */
var lives = [];

function destroyRec(rec) {
  if (rec.dead) return;
  rec.dead = true;
  lives.splice(lives.indexOf(rec), 1);
  rec.destroyers.forEach(function (fn) { try { fn(); } catch (e) {} });
  rec.rafs.forEach(function (id) { cancelAnimationFrame(id); });
  rec.timers.forEach(function (id) { clearInterval(id); clearTimeout(id); });
  rec.listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
  rec.css.forEach(dropCSS);
  /* Browsers cap live WebGL contexts at around 16 and drop the oldest
     silently. Anything a demo left behind gets released here, otherwise
     the 3D pages start failing after enough navigation. */
  rec.stage.querySelectorAll("canvas").forEach(function (cv) {
    var gl = null;
    try { gl = cv.getContext("webgl2") || cv.getContext("webgl"); } catch (e) {}
    if (gl) {
      var ext = gl.getExtension("WEBGL_lose_context");
      if (ext) { try { ext.loseContext(); } catch (e) {} }
    }
    cv.width = cv.height = 0;
  });
}

function destroyAll() { lives.slice().forEach(destroyRec); }

/* A demo's panel scrolled into or out of view: raf loops parked while it
   was hidden resume, and onVisible hooks hear about it. */
function setVisible(rec, v) {
  if (rec.visible === v) return;
  rec.visible = v;
  if (v) rec.parked.splice(0).forEach(function (go) { go(); });
  rec.onVis.forEach(function (fn) { try { fn(v); } catch (e) {} });
}

/* parts: the stage's toolbar, stage, mount node and message overlay.
   visible: whether it is on screen (see setVisible). */
function makeCtx(lib, parts, visible) {
  var mount = parts.mount, bar = parts.bar, stage = parts.stage;
  var rec = { dead: false, destroyers: [], rafs: [], timers: [], listeners: [], css: [],
              stage: stage, visible: visible !== false, parked: [], onVis: [], ownTheme: false };
  lives.push(rec);

  /* One ResizeObserver per stage feeds every onResize hook. It reports
     the size it starts with too, which is not a change, so that is skipped. */
  var resizers = [], ro = null;
  function watchSize() {
    if (ro) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    ro = new ResizeObserver(function () {
      if (stage.clientWidth === w && stage.clientHeight === h) return;
      w = stage.clientWidth; h = stage.clientHeight;
      resizers.forEach(function (f) { f(); });
    });
    ro.observe(stage);
    rec.destroyers.push(function () { ro.disconnect(); });
  }

  function ctl(label) {
    var c = el("span", "ctl");
    if (label) c.appendChild(el("span", "k", esc(label)));
    bar.appendChild(c);
    return c;
  }

  var ctx = {
    lib: lib,
    el: mount,
    stage: stage,
    bar: bar,
    T: T,
    dark: T.dark,

    /* ---- layout helpers ---- */
    mount: function (mode) {                       /* "scroll" "pad" "center" */
      String(mode || "").split(/\s+/).forEach(function (m) { if (m) mount.classList.add(m); });
      return mount;
    },
    tall: function () { stage.classList.add("tall"); return ctx; },

    /** A white sheet in either theme, for a library that draws its own light
        page: dark ink, light scrollbars and form controls, a tall stage, and
        left running on a theme switch (ownTheme). */
    paper: function () {
      ctx.tall().ownTheme();
      mount.style.background = "#fff";
      mount.style.color = "#000";
      mount.style.colorScheme = "light";
      return ctx;
    },

    /** Two side-by-side panes — the input/output shape half the demos want. */
    panes: function (leftWidth) {
      mount.classList.add("panes");
      var a = el("div", "pane pane-a"), b = el("div", "pane pane-b");
      a.style.flex = "0 0 " + (leftWidth || "44%");
      mount.appendChild(a); mount.appendChild(b);
      return { a: a, b: b };
    },

    /** A plain code-ish textarea. */
    editor: function (parent, value, onInput) {
      var t = el("textarea", "demo-editor");
      t.value = value;
      t.spellcheck = false;
      if (onInput) {
        var h = function () { onInput(t.value); };
        t.addEventListener("input", h);
      }
      parent.appendChild(t);
      return t;
    },

    /** A canvas sized to its parent, with device-pixel-ratio handled.
        onResize fires on later resizes only — draw once yourself after
        this returns, when your own state is set up. */
    canvas: function (parent, onResize) {
      var cv = el("canvas", "demo-canvas");
      (parent || mount).appendChild(cv);
      var g = cv.getContext("2d");
      var first = true;
      function fit() {
        var r = cv.parentNode.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.max(1, Math.round(r.width * dpr));
        cv.height = Math.max(1, Math.round(r.height * dpr));
        cv.style.width = r.width + "px";
        cv.style.height = r.height + "px";
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (onResize && !first) onResize(r.width, r.height);
        first = false;
      }
      fit();
      ctx.onResize(fit);
      return { cv: cv, g: g, fit: fit,
               get w() { return cv.clientWidth; }, get h() { return cv.clientHeight; } };
    },

    /* ---- toolbar controls ---- */
    label: function (text) { bar.appendChild(el("span", "lbl", esc(text))); },
    gap: function () { bar.appendChild(el("span", "grow")); },

    btn: function (label, onClick, primary) {
      var c = ctl(), b = el("button", primary ? "pri" : "", esc(label));
      b.type = "button";
      b.addEventListener("click", onClick);
      c.appendChild(b);
      return b;
    },

    select: function (label, options, onChange, initial) {
      var c = ctl(label), s = el("select");
      options.forEach(function (o) {
        var v = typeof o === "string" ? o : o.v;
        var t = typeof o === "string" ? o : (o.t || o.v);
        var op = el("option", null, esc(t));
        op.value = v;
        s.appendChild(op);
      });
      if (initial != null) s.value = initial;
      s.addEventListener("change", function () { onChange(s.value); });
      c.appendChild(s);
      return s;
    },

    range: function (label, opts, onChange) {
      var c = ctl(label), r = el("input"), v = el("span", "val");
      r.type = "range";
      r.min = opts.min; r.max = opts.max;
      r.step = opts.step || 1; r.value = opts.value;
      var fmt = opts.fmt || function (x) { return x; };
      v.textContent = fmt(+r.value);
      r.addEventListener("input", function () {
        v.textContent = fmt(+r.value);
        onChange(+r.value);
      });
      c.appendChild(r); c.appendChild(v);
      return r;
    },

    check: function (label, value, onChange) {
      var c = ctl(), lab = el("label");
      lab.style.cssText = "display:inline-flex;align-items:center;gap:6px;cursor:pointer";
      var i = el("input"); i.type = "checkbox"; i.checked = !!value;
      i.addEventListener("change", function () { onChange(i.checked); });
      lab.appendChild(i);
      lab.appendChild(document.createTextNode(label));
      c.appendChild(lab);
      return i;
    },

    text: function (label, value, onInput, width) {
      var c = ctl(label), i = el("input");
      i.type = "text"; i.value = value; i.spellcheck = false;
      if (width) i.style.width = width;
      i.addEventListener("input", function () { onInput(i.value); });
      c.appendChild(i);
      return i;
    },

    /** A live text readout in the toolbar. Returns a setter. */
    readout: function (html) {
      var r = el("span", "readout", html || "");
      bar.appendChild(r);
      return function (h) { r.innerHTML = h; };
    },

    /* ---- lifecycle ----
       A builder can still be awaiting something when its page is left;
       whatever it registers after that is torn down on the spot. */
    onDestroy: function (fn) {
      if (rec.dead) { try { fn(); } catch (e) {} return; }
      rec.destroyers.push(fn);
    },
    dead: function () { return rec.dead; },
    /** The demo looks the same in either theme, so a theme switch leaves it running. */
    ownTheme: function () { rec.ownTheme = true; return ctx; },

    /** Shows a failure that happens after the builder returned, where a
        thrown error would show it; returns a function that hides it again. */
    fail: function (text) {
      var m = parts.msg;
      if (rec.dead) return function () {};
      m.className = "stage-msg on err";
      m.innerHTML = "<p>" + esc(text) + "</p>";
      return function () { if (!rec.dead) m.classList.remove("on"); };
    },

    /** requestAnimationFrame loop that stops itself when the demo unmounts,
        and is parked, asking for no frames, while its panel is out of view. */
    raf: function (fn) {
      if (rec.dead) return;
      var last = performance.now(), slot = rec.rafs.length;   /* one id per loop */
      function go() { last = performance.now(); rec.rafs[slot] = requestAnimationFrame(step); }
      function step(now) {
        if (rec.dead) return;
        if (!rec.visible) { rec.parked.push(go); return; }
        var dt = Math.min(now - last, 100); last = now;
        if (fn(dt, now) === false) return;
        rec.rafs[slot] = requestAnimationFrame(step);
      }
      rec.rafs[slot] = requestAnimationFrame(step);
    },
    /** For a library with a render loop of its own: fn(false) when the
        panel scrolls out of view (at once, if it starts out of view) and
        fn(true) when it is back, to pause and resume that loop. */
    onVisible: function (fn) {
      if (rec.dead) return;
      rec.onVis.push(fn);
      if (!rec.visible) fn(false);
    },
    every: function (ms, fn) {
      if (rec.dead) return 0;
      var id = setInterval(function () { if (!rec.dead) fn(); }, ms); rec.timers.push(id); return id;
    },
    after: function (ms, fn) {
      if (rec.dead) return 0;
      var id = setTimeout(function () { if (!rec.dead) fn(); }, ms); rec.timers.push(id); return id;
    },

    on: function (target, type, fn, opts) {
      if (rec.dead) return;
      target.addEventListener(type, fn, opts);
      rec.listeners.push([target, type, fn, opts]);
    },

    /** Debounced hook for when the stage changes size: the window resized,
        a panel widened, the toolbar wrapped. Cleaned up on unmount. */
    onResize: function (fn) {
      var t = null;
      var h = function () { clearTimeout(t); t = setTimeout(function () { if (!rec.dead) fn(); }, 140); };
      if (rec.dead) return h;
      resizers.push(h);
      watchSize();
      return h;
    },

    /* ---- misc ---- */
    esc: esc,
    mk: el,                       /* element factory — ctx.el is the mount node */
    need: need,
    css: function () {
      var ids = [].slice.call(arguments);
      if (rec.dead) return Promise.resolve();
      rec.css = rec.css.concat(ids);
      return Promise.all(ids.map(useCSS));
    },
    /** Deterministic pseudo-random, so demos look the same on every reload. */
    rng: function (seed) {
      var s = seed || 42;
      return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    },
    series: function (i) { return T.series[i % T.series.length]; }
  };

  return { ctx: ctx, rec: rec };
}

/* ------------------------------------------------------------------
   Sidebar
   ------------------------------------------------------------------ */
var navEl = $("#nav");

function buildNav() {
  var frag = document.createDocumentFragment();

  var home = el("a", "nav-link", '<span class="g">◆</span><span>Overview</span>');
  home.href = "#/"; home.dataset.route = "/";
  frag.appendChild(home);

  var mx = el("a", "nav-link", '<span class="g">▦</span><span>Compare all ' + LIBS.length + '</span>');
  mx.href = "#/matrix"; mx.dataset.route = "/matrix";
  frag.appendChild(mx);

  GROUPS.forEach(function (grp) {
    frag.appendChild(el("p", "grp-title", esc(grp.name)));
    CATS.filter(function (c) { return c.g === grp.id; }).forEach(function (cat) {
      var libs = LIBS.filter(function (l) { return l.cat === cat.id; });
      if (!libs.length) return;
      var d = el("details", "cat");
      d.dataset.cat = cat.id;
      /* The name opens the category's panels; the arrow only folds. */
      var s = el("summary", null,
        '<span class="arw" title="Fold or unfold">▶</span><a class="n" href="#/c/' + cat.id + '">' + esc(cat.name) + "</a>" +
        '<span class="c">' + libs.length + "</span>");
      d.appendChild(s);
      var box = el("div", "cat-items");
      libs.forEach(function (l) {
        var a = el("a", "item",
          '<span class="dot"></span><span class="nm">' + esc(l.n) + '</span><span class="st">' + "★".repeat(l.st) + "</span>");
        a.href = panelHref(l);
        a.dataset.k = l.k;
        a.title = l.n + " — " + l.pkg;
        box.appendChild(a);
      });
      d.appendChild(box);
      frag.appendChild(d);
    });
  });

  navEl.appendChild(frag);
  navEl.appendChild(el("p", "no-hits", "Nothing matches that.")).hidden = true;
  $("#brandCount").textContent = LIBS.length + " libs";
}

/* route: the nav link to light up; cat: the category open on screen,
   whose folder is unfolded; key: the library asked for. A folder that
   was unfolded only because its category was opened folds again when
   another one is; one unfolded by hand stays as it is. */
function markNav(route, cat, key) {
  navEl.querySelectorAll(".nav-link").forEach(function (a) {
    a.classList.toggle("on", a.dataset.route === route);
  });
  navEl.querySelectorAll("details.cat").forEach(function (d) {
    var cur = d.dataset.cat === cat;
    d.classList.toggle("cur", cur);
    if (cur && !d.open) { d.open = true; d.dataset.auto = "1"; }
    else if (!cur && d.dataset.auto && !searchTerm.trim()) { d.open = false; delete d.dataset.auto; }
  });
  navEl.querySelectorAll(".item").forEach(function (a) {
    a.classList.toggle("on", a.dataset.k === key);
  });
}

/* Search filters the tree in place and auto-opens categories with hits. */
var searchTerm = "";
function applySearch() {
  var q = searchTerm.trim().toLowerCase();
  var total = 0;
  navEl.querySelectorAll("details.cat").forEach(function (d) {
    var hits = 0;
    d.querySelectorAll(".item").forEach(function (a) {
      var l = byKey[a.dataset.k];
      var hay = (l.n + " " + l.pkg + " " + l.what + " " + catById[l.cat].name).toLowerCase();
      var ok = !q || hay.indexOf(q) >= 0;
      a.hidden = !ok;
      if (ok) hits++;
    });
    d.hidden = hits === 0;
    d.dataset.hasHit = q && hits ? "1" : "0";
    var c = d.querySelector("summary .c");
    if (c) c.textContent = q ? hits : d.querySelectorAll(".item").length;
    if (q && hits) d.open = true;
    total += hits;
  });
  navEl.querySelectorAll(".grp-title").forEach(function (p) {
    var any = false, n = p.nextElementSibling;
    while (n && n.classList.contains("cat")) { if (!n.hidden) any = true; n = n.nextElementSibling; }
    p.hidden = !any;
  });
  var nh = navEl.querySelector(".no-hits");
  if (nh) nh.hidden = total > 0;
  $("#qclr").hidden = !q;
}

/* ------------------------------------------------------------------
   Pages
   ------------------------------------------------------------------ */
var view = $("#view"), crumb = $("#crumb"), main = $("#main");

function stars(n) {
  return "★".repeat(n) + "<i>" + "★".repeat(5 - n) + "</i>";
}

function size(kb) {
  return kb >= 1024 ? (kb / 1024).toFixed(1) + " MB" : kb + " KB";
}

/* A library's last update: the newer of its latest release and the newest
   commit to its repository (ISO dates compare as strings). */
function lastUpdate(l) {
  return l.commit && l.commit > l.pub ? l.commit : l.pub;
}
function lastUpdateTitle(l) {
  return "The newer of its latest release (" + l.pub + ")" +
         (l.commit ? " and the newest commit to its repository (" + l.commit + ")" : "") +
         ". Looked up " + CHECKED + ".";
}

function renderHome() {
  crumb.innerHTML = "<b>Overview</b>";
  var byGroup = GROUPS.map(function (g) {
    return { g: g, cats: CATS.filter(function (c) { return c.g === g.id; }) };
  });
  var vizCount = LIBS.filter(function (l) { return catById[l.cat].g === "viz"; }).length;
  var rnYes = LIBS.filter(function (l) { return l.c.split(/\s+/)[6] === "y"; }).length;
  /* The diagram editors that draw the shared flowchart carry a profile
     (render / ui / box) for the comparison table. */
  var editors = LIBS.filter(function (l) { return l.render; });

  var h = '<div class="pad">';
  h += '<div class="hero">' +
       '<p class="eyebrow">Every library on this site is running, not pictured</p>' +
       "<h2>A playground for front-end libraries</h2>" +
       "<p>Pick a category from the sidebar and every library in it opens at once, side by side, each " +
       "running in its own panel with controls that drive the real API. Line the panels up in the order " +
       "you want to compare them. A library's Details page adds the honest trade-off, whether it survives " +
       "a React Native app, when it was last updated, and the exact source that produced its demo.</p>" +
       "</div>";

  h += '<div class="stats">' +
       '<div class="stat"><div class="v">' + LIBS.length + '</div><div class="k">libraries</div></div>' +
       '<div class="stat"><div class="v">' + CATS.length + '</div><div class="k">categories</div></div>' +
       '<div class="stat"><div class="v">' + vizCount + '</div><div class="k">graphics libs</div></div>' +
       '<div class="stat"><div class="v">' + rnYes + '</div><div class="k">React Native ready</div></div>' +
       "</div>";

  h += '<div class="sechead"><h3>' + editors.length + " diagram editors, one flowchart</h3><span>Each draws the same " +
       "approval flowchart with its stock shapes, theme and panels. Each name opens all of them side by side at its panel. " +
       "Versions and dates checked " + esc(CHECKED) + ".</span></div>";
  h += '<div class="tscroll"><table class="m cmp"><thead><tr>' +
       '<th class="nm">Framework</th><th>Draws with</th><th>You write it in</th>' +
       "<th>In the box — and used on its page</th><th>License</th><th>Last update</th>" +
       "</tr></thead><tbody>";
  editors.forEach(function (l) {
    h += "<tr>" +
         '<td class="nm"><a href="' + panelHref(l) + '">' + esc(l.n) + '</a><span class="p">' + esc(l.pkg) + "</span></td>" +
         "<td>" + esc(l.render) + "</td><td>" + esc(l.ui) + "</td><td>" + esc(l.box) + "</td>" +
         "<td>" + esc(l.lic) + "</td>" +
         '<td class="ver" title="' + esc(lastUpdateTitle(l)) + '"><b>' + esc(lastUpdate(l)) + "</b>" +
         '<span class="p">' + esc(l.ver) + " released " + esc(l.pub) + "</span></td></tr>";
  });
  h += "</tbody></table></div>";

  byGroup.forEach(function (b) {
    h += '<div class="sechead"><h3>' + esc(b.g.name) + "</h3><span>" + esc(b.g.blurb) + "</span></div>";
    h += '<div class="grpgrid">';
    b.cats.forEach(function (c) {
      var libs = LIBS.filter(function (l) { return l.cat === c.id; });
      h += '<a class="grpcard" href="#/c/' + c.id + '">' +
           "<h4>" + esc(c.name) + ' <span class="n">' + libs.length + "</span></h4>" +
           "<p>" + esc(c.blurb) + "</p>" +
           '<div class="libs">' + libs.map(function (l) { return esc(l.n); }).join(" · ") + "</div></a>";
    });
    h += "</div>";
  });

  h += '<div class="sechead"><h3>How to read the pages</h3></div>';
  h += '<div class="cards">' +
       '<div class="card"><h4>Panels</h4><p>A category opens as a grid of live panels: two to a row on a desktop ' +
       'screen, three on a very wide one, or pick 1–3 yourself. Drag <b>⠿</b> or use the arrows in a panel\'s header ' +
       'to reorder them; ' +
       'the order is remembered. Panels are never removed. Each library loads when its panel scrolls into view, ' +
       'and the controls in its grey bar drive the actual API — they are not canned states.</p></div>' +
       '<div class="card"><h4>Mouse wheel</h4><p>The wheel scrolls the page, even over a map or an editor. To zoom ' +
       'or pan inside a panel with the wheel, click into it first (it gets a blue outline), or hold Ctrl.</p></div>' +
       '<div class="card"><h4>React Native column</h4><p><b class="mk y">✓</b> runs on a device, natively or as pure JS you can ' +
       'drive <code>react-native-svg</code> with. <b class="mk p">◐</b> works on Expo web only; native needs a WebView. ' +
       '<b class="mk n">✗</b> no path into a React Native app at all.</p></div>' +
       '<div class="card"><h4>Details and source</h4><p>A panel\'s <b>Details</b> opens the library on a page of its ' +
       'own: install command, trade-off, capabilities, and the exact builder function that drew the stage — ' +
       'no elisions, no pseudo-code.</p></div>' +
       '<div class="card"><h4>Last update</h4><p>Every panel and page shows the newer of the latest release and the newest ' +
       'commit to the repository. The version badge is the latest release on npm; where the build in ' +
       '<code>vendor/</code> is another version, the page says <b>running X here</b> and the demo is written ' +
       'against that API.</p></div>' +
       "</div>";

  h += "</div>";
  view.innerHTML = h;
}

function renderMatrix() {
  crumb.innerHTML = '<a href="#/">Overview</a><span class="sep">/</span><b>Compare all</b>';
  var picked = {};

  var h = '<div class="pad wide">';
  h += '<div class="sechead"><h3>All ' + LIBS.length + " libraries</h3><span>Tick a capability to narrow the list. Hover a column header for what it means.</span></div>";
  h += '<div class="filters" id="capFilters"></div>';
  h += '<div class="tscroll"><table class="m"><thead><tr>' +
       '<th class="nm">Library</th><th class="sz">Size</th><th class="up">Last update</th>' +
       CAPS.map(function (c) { return '<th data-cap="' + c.id + '" title="' + esc(c.full) + '">' + c.short + "</th>"; }).join("") +
       "</tr></thead><tbody id=\"mbody\"></tbody></table></div>";
  h += '<div class="legend">' +
       '<span><b class="mk y">✓</b> yes</span><span><b class="mk p">◐</b> partly</span>' +
       '<span><b class="mk n">✗</b> no</span><span><b class="mk a">—</b> not applicable</span>' +
       '<span id="mcount"></span></div>';
  h += "</div>";
  view.innerHTML = h;

  var filters = $("#capFilters");
  CAPS.forEach(function (c) {
    var lab = el("label", "chip");
    var i = el("input"); i.type = "checkbox";
    lab.appendChild(i);
    lab.appendChild(document.createTextNode(c.short.replace(/<br>/g, " ")));
    lab.title = c.full;
    i.addEventListener("change", function () { picked[c.id] = i.checked; draw(); });
    filters.appendChild(lab);
  });
  var clr = el("button", "iconbtn", "Clear");
  clr.type = "button";
  clr.addEventListener("click", function () {
    picked = {};
    filters.querySelectorAll("input").forEach(function (i) { i.checked = false; });
    draw();
  });
  filters.appendChild(clr);

  function pass(l) {
    var m = l.c.split(/\s+/);
    for (var i = 0; i < CAPS.length; i++) {
      if (picked[CAPS[i].id] && m[i] !== "y" && m[i] !== "p") return false;
    }
    return true;
  }

  function draw() {
    var body = "", n = 0;
    CATS.forEach(function (c) {
      var rows = LIBS.filter(function (l) { return l.cat === c.id && pass(l); });
      if (!rows.length) return;
      body += '<tr class="cathead"><td colspan="' + (CAPS.length + 3) + '"><a href="#/c/' + c.id + '">' +
              esc(c.name) + '</a><span class="n">' + rows.length + "</span></td></tr>";
      rows.forEach(function (l) {
        n++;
        body += "<tr>" +
          '<td class="nm"><a href="' + panelHref(l) + '">' + esc(l.n) + '</a><span class="p">' + esc(l.pkg) + "</span></td>" +
          '<td class="sz">' + size(l.kb) + "</td>" +
          '<td class="up" title="' + esc(lastUpdateTitle(l)) + '">' + esc(lastUpdate(l)) + "</td>" +
          l.c.split(/\s+/).map(function (m) {
            var d = MK[m] || MK.n;
            return '<td><span class="mk ' + d[0] + '">' + d[1] + "</span></td>";
          }).join("") + "</tr>";
      });
    });
    $("#mbody").innerHTML = body;
    $("#mcount").innerHTML = "<b>" + n + "</b> / " + LIBS.length + " shown";
    document.querySelectorAll("thead th[data-cap]").forEach(function (th) {
      th.classList.toggle("on", !!picked[th.dataset.cap]);
    });
  }
  draw();
}

var RN_TEXT = {
  y: "Runs in React Native",
  p: "Expo web only",
  n: "Not usable in React Native"
};

function renderLib(k) {
  var l = byKey[k];
  if (!l) { location.hash = "#/"; return; }
  var cat = catById[l.cat];
  var marks = l.c.split(/\s+/);
  var rn = marks[6];
  crumb.innerHTML = '<a href="#/">Overview</a><span class="sep">/</span>' +
                    '<a class="cat" href="' + panelHref(l) + '">' + esc(cat.name) + "</a>" +
                    '<span class="sep">/</span><b>' + esc(l.n) + "</b>";
  document.title = l.n + " — FrontDemo";

  var licWarn = /SEE LICENSE|no-charge|LGPL|MPL/i.test(l.lic);
  /* A library installed from somewhere other than npm says how. */
  var install = l.install || "npm i " + l.pkg;
  var repoUrl = /^https?:/.test(l.repo || "");
  var h = '<div class="pad">';
  h += '<header class="lib-head">' +
       '<div class="lib-title"><h2>' + esc(l.n) + "</h2>" +
       '<span class="stars" title="How readily I would reach for it">' + stars(l.st) + "</span>" +
       (l.npm === false && !l.install
         ? '<a class="npm" href="' + esc(l.site) + '" target="_blank" rel="noopener" title="How it is embedded">' +
           esc(l.ext || l.pkg) + ' <span class="cp">embed docs</span></a>'
         : '<button class="npm" id="cpNpm" type="button" title="Copy install command">' + esc(install) +
           ' <span class="cp">copy</span></button>') + "</div>" +
       '<p class="lib-what">' + esc(l.what) + "</p>" +
       '<div class="facts">' +
       '<span class="fact upd" title="' + esc(lastUpdateTitle(l)) + '">last update <b>' + esc(lastUpdate(l)) + "</b></span>" +
       '<span class="fact">' + (l.npm === false ? "release" : "npm") + " <b>" + esc(l.ver) + "</b></span>" +
       '<span class="fact">released <b>' + esc(l.pub) + "</b></span>" +
       (l.commit ? '<span class="fact">last commit <b>' + esc(l.commit) + "</b></span>" : "") +
       (l.vend ? '<span class="fact warn" title="The build in this repo is not the latest npm version, ' +
                 'so the demo is written against the one running here.">running <b>' +
                 esc(l.vend) + "</b> here</span>" : "") +
       (l.build ? '<span class="fact">' + esc(l.build) + "</span>" : "") +
       '<span class="fact' + (licWarn ? " warn" : "") + '">' + esc(l.lic) + "</span>" +
       '<span class="fact">' + (l.ext ? "loads" : "build here") + " <b>" + size(l.kb) + "</b>" +
       (l.ext ? " from " + esc(l.ext) : "") + "</span>" +
       '<span class="fact">' + esc(cat.name) + "</span>" +
       "</div></header>";

  h += '<div class="stage-card" id="stageCard">' + stageHTML(l, true) + "</div>";

  h += '<div class="tryline"><span class="tag">Try</span><span>' + esc(l.try) + "</span></div>";

  h += '<div class="cards">';
  h += '<div class="card"><h4>The trade-off</h4>' +
       '<div class="pro"><i>+</i><span>' + esc(l.pro) + "</span></div>" +
       '<div class="con"><i>−</i><span>' + esc(l.con) + "</span></div></div>";
  h += '<div class="card"><h4>React Native &amp; mobile</h4>' +
       '<div class="rnrow"><span class="rnbadge ' + rn + '">' + RN_TEXT[rn] + "</span>" +
       '<span class="capchip ' + marks[5] + '"><b>' + MK[marks[5]][1] + "</b> touch / mobile web</span></div>" +
       "<p>" + esc(l.rnNote) + "</p></div>";
  h += '<div class="card"><h4>Capabilities</h4><div class="capgrid">' +
       CAPS.map(function (c, i) {
         var d = MK[marks[i]] || MK.n;
         return '<span class="capchip ' + d[0] + '" title="' + esc(c.full) + '"><b>' + d[1] + "</b> " +
                c.short.replace(/<br>/g, " ") + "</span>";
       }).join("") + "</div></div>";
  h += '<div class="card"><h4>Links</h4><div class="linkrow">' +
       '<a href="' + esc(l.site) + '" target="_blank" rel="noopener">Homepage</a>' +
       (l.repo ? '<a href="' + esc(repoUrl ? l.repo : "https://github.com/" + l.repo) +
                 '" target="_blank" rel="noopener">' + (repoUrl ? "Source" : "GitHub") + "</a>" : "") +
       (l.npm === false ? "" :
         '<a href="https://www.npmjs.com/package/' + esc(l.pkg) + '" target="_blank" rel="noopener">npm</a>') +
       '<a href="' + panelHref(l) + '">Beside the other ' + esc(cat.name) + "</a>" +
       '<a href="#/matrix">Compare</a></div></div>';
  h += "</div>";

  h += '<details class="src" id="srcBox"><summary><span class="arw">▶</span>' +
       "<span>Source of this demo</span>" +
       '<span class="hint">the real builder, verbatim</span></summary>' +
       '<pre><code id="srcCode"></code></pre></details>';
  h += "</div>";

  view.innerHTML = h;

  if ($("#cpNpm")) $("#cpNpm").addEventListener("click", function () {
    var b = this;
    navigator.clipboard.writeText(install).then(function () {
      var s = b.querySelector(".cp");
      s.textContent = "copied";
      setTimeout(function () { s.textContent = "copy"; }, 1600);
    }, function () {});
  });

  wireSource(l);
  runDemo(l, stageParts($("#stageCard")));
}

/* The source panel shows the builder function itself — Function#toString
   gives us the real thing, so it can never drift from what ran. */
function wireSource(l) {
  var box = $("#srcBox"), code = $("#srcCode"), done = false;
  box.addEventListener("toggle", function () {
    if (!box.open || done) return;
    done = true;
    var fn = B[l.k];
    var text = fn ? dedent(fn.toString()) : "// no builder registered for " + l.k;
    text = "B[" + JSON.stringify(l.k) + "] = " + text + ";";
    code.textContent = text;
    need("hljs").then(function () { return useCSS("hljs"); }).then(function () {
      if (window.hljs) {
        code.innerHTML = window.hljs.highlight(text, { language: "javascript" }).value;
      }
    }).catch(function () {});
  });
}

function dedent(src) {
  var lines = src.split("\n");
  var indents = lines.slice(1).filter(function (x) { return x.trim(); })
                     .map(function (x) { return x.match(/^\s*/)[0].length; });
  var min = indents.length ? Math.min.apply(null, indents) : 0;
  return lines.map(function (x, i) { return i === 0 ? x : x.slice(min); }).join("\n");
}

/* The stage a demo mounts into: toolbar, stage, mount node, and the
   loading / error message over it. The library page keeps the ids its
   test scripts look for. */
function stageHTML(l, ids) {
  var id = function (n) { return ids ? ' id="' + n + '"' : ""; };
  return '<div class="stage-bar"' + id("bar") + '><span class="lbl">Live</span></div>' +
         '<div class="stage"' + id("stage") + ">" +
         '<div class="mount"' + id("mount") + "></div>" +
         '<div class="stage-msg on"' + id("msg") + '><div class="sp"></div><p>loading ' + esc(l.pkg) + "…</p></div>" +
         "</div>";
}

function stageParts(host) {
  return { bar: host.querySelector(".stage-bar"), stage: host.querySelector(".stage"),
           mount: host.querySelector(".mount"), msg: host.querySelector(".stage-msg") };
}

/* Runs a library's builder on a stage. Returns its teardown record. */
function runDemo(l, parts, visible) {
  var msg = parts.msg, fn = B[l.k];
  if (!fn) {
    msg.className = "stage-msg on err";
    msg.innerHTML = "<p>No demo builder is registered for “" + esc(l.k) + "” yet.</p>";
    return null;
  }
  var made = makeCtx(l, parts, visible), ctx = made.ctx, rec = made.rec;
  (async function () {
    try {
      if (l.css && l.css.length) await ctx.css.apply(null, l.css);
      if (l.js && l.js.length) await need.apply(null, l.js);
      /* An ES-module build (it lazy-loads chunks of its own) is imported
         rather than script-tagged, and handed to the builder as ctx.mod. */
      if (l.esm) ctx.mod = await import(new URL("vendor/" + l.esm, document.baseURI).href);
      if (rec.dead) return;
      await fn(ctx);
      if (rec.dead) return;
      msg.classList.remove("on");
    } catch (e) {
      if (rec.dead) return;
      msg.className = "stage-msg on err";
      msg.innerHTML = "<p>" + esc(l.n) + " failed to start.<br>" + esc((e && e.message) || e) + "</p>";
      if (window.console) console.error("[" + l.k + "]", e);
    }
  })();
  return rec;
}

/* ------------------------------------------------------------------
   Category page: every library of a category as a live panel, in a
   grid of one to three columns. Panels can be reordered — by dragging
   ⠿, with ◀ ▶, or with the arrow keys on ⠿ — but never removed.

   Reordering only changes each panel's CSS order. A panel never leaves
   the DOM, which would reload draw.io's iframe and can upset a
   library's custom elements.
   ------------------------------------------------------------------ */
var grid = null;   /* the category page on screen */
var COLS = ["auto", "1", "2", "3"];
var calm = matchMedia("(prefers-reduced-motion: reduce)");

function readCols() {
  var v = pref("fd-cols", "auto");
  return COLS.indexOf(v) >= 0 ? v : "auto";
}

/* The saved order, minus libraries that have gone, plus new ones at the end. */
function loadOrder(cat, keys) {
  var saved = [];
  try { saved = JSON.parse(pref("fd-order-" + cat, "[]")); } catch (e) {}
  if (!Array.isArray(saved)) saved = [];
  var order = saved.filter(function (k, i) { return keys.indexOf(k) >= 0 && saved.indexOf(k) === i; });
  keys.forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); });
  return order;
}

function saveOrder(g) { setPref("fd-order-" + g.cat, JSON.stringify(g.order)); }

function panelHTML(l) {
  var n = esc(l.n);
  /* The version the demo runs: npm's latest, or the build here when that differs. */
  var ver = l.vend ? '<b class="warn" title="npm has ' + esc(l.ver) + "; this demo is written against the " +
                     esc(l.vend) + ' build running here">' + esc(l.vend) + "</b>" : esc(l.ver);
  return '<section class="panel" data-k="' + l.k + '" aria-label="' + n + '">' +
    '<header class="ph">' +
    '<button class="grip" type="button" title="Drag to reorder (or focus it and use the arrow keys)" ' +
    'aria-label="Reorder ' + n + '">⠿</button>' +
    '<div class="pt"><div class="pn">' +
    '<a class="nm" href="#/l/' + l.k + '" title="' + n + ' on a page of its own">' + n + "</a>" +
    '<span class="stars" title="How readily I would reach for it">' + stars(l.st) + "</span>" +
    '<span class="pv" title="' + esc(lastUpdateTitle(l)) + '">' + ver + " · updated " +
    esc(lastUpdate(l)) + "</span></div>" +
    '<p class="pw" title="' + esc(l.what) + '">' + esc(l.what) + "</p></div>" +
    '<div class="pa">' +
    /* The arrows themselves come from the stylesheet: ◀ ▶ side by side, ▲ ▼ in one column. */
    '<button class="mv" type="button" data-mv="-1" title="Move earlier" aria-label="Move ' + n + ' earlier"></button>' +
    '<button class="mv" type="button" data-mv="1" title="Move later" aria-label="Move ' + n + ' later"></button>' +
    '<button class="ex" type="button" title="Widen to the full row" aria-pressed="false">⤢</button>' +
    '<a class="dt" href="#/l/' + l.k + '" title="Install command, trade-off, React Native notes and the source of this demo">Details</a>' +
    "</div></header>" +
    '<div class="pbody">' + stageHTML(l) + "</div></section>";
}

function renderCat(id, focus) {
  var cat = catById[id];
  var libs = LIBS.filter(function (l) { return l.cat === id; });
  var keys = libs.map(function (l) { return l.k; });
  var grp = GROUPS.filter(function (x) { return x.id === cat.g; })[0];
  crumb.innerHTML = '<a href="#/">Overview</a><span class="sep">/</span><b>' + esc(cat.name) + "</b>";
  document.title = cat.name + " — FrontDemo";

  var cols = readCols();
  var h = '<div class="pad wide">' +
    '<header class="cat-head"><div class="cat-title"><h2>' + esc(cat.name) + "</h2>" +
    '<span class="n">' + libs.length + (libs.length === 1 ? " library" : " libraries") + "</span>" +
    (grp ? '<span class="g">' + esc(grp.name) + "</span>" : "") + "</div>" +
    '<p class="cat-blurb">' + esc(cat.blurb) + "</p>" +
    '<div class="cat-tools">' +
    '<span class="seg" role="group" aria-label="Panels per row"><span class="k">Per row</span>' +
    COLS.map(function (v) {
      return '<button type="button" data-cols="' + v + '" aria-pressed="' + (v === cols) + '"' +
             (v === cols ? ' class="on"' : "") + ">" + (v === "auto" ? "Auto" : v) + "</button>";
    }).join("") + "</span>" +
    '<button class="iconbtn" type="button" id="resetOrder" title="Back to the default order">Reset order</button>' +
    '<span class="cat-hint">Drag <b>⠿</b> or use the arrows on a panel to reorder; the order is remembered. ' +
    '<span class="hm">The wheel scrolls the page; click into a panel to zoom or pan it with the wheel.</span>' +
    '<span class="ht">Tap a panel before panning or zooming it; until then a swipe scrolls the page.</span></span>' +
    "</div></header>" +
    '<div class="pgrid" id="pgrid" data-cols="' + cols + '">' + libs.map(panelHTML).join("") + "</div></div>";
  view.innerHTML = h;

  var g = grid = { cat: id, el: $("#pgrid"), order: loadOrder(id, keys), panels: {}, active: null, hinted: false };
  g.el.querySelectorAll(".panel").forEach(function (p) {
    var k = p.dataset.k;
    g.panels[k] = { l: byKey[k], el: p, rec: null, started: false, near: false, vis: false, timer: 0,
                    prev: p.querySelector('[data-mv="-1"]'), next: p.querySelector('[data-mv="1"]'),
                    nav: navEl.querySelector('.item[data-k="' + k + '"]') };
  });
  applyOrder(g);

  view.querySelectorAll(".seg [data-cols]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.dataset.cols;
      setPref("fd-cols", v);
      g.el.dataset.cols = v;
      view.querySelectorAll(".seg [data-cols]").forEach(function (x) {
        x.classList.toggle("on", x === b);
        x.setAttribute("aria-pressed", x === b);
      });
    });
  });
  $("#resetOrder").addEventListener("click", function () {
    reorder(g, function () { g.order = keys.slice(); });
    setPref("fd-order-" + id, null);
  });

  wireGrid(g);
  watchPanels(g);
  if (focus && g.panels[focus]) focusPanel(focus);
}

function applyOrder(g) {
  g.order.forEach(function (k, i) {
    var P = g.panels[k];
    P.el.style.order = i;
    P.prev.disabled = i === 0;
    P.next.disabled = i === g.order.length - 1;
  });
}

/* Slides a panel from a transform back to its place, unless the user
   asked for reduced motion. */
function slide(p, from, ms, easing) {
  if (!calm.matches) p.animate([{ transform: from }, { transform: "none" }], { duration: ms, easing: easing });
}

/* Applies a change to g.order, then slides each panel from where it was
   to where it is now, so a reorder is easy to follow. Positions are
   read from offsetLeft/Top, which ignore the transforms of a slide
   still in flight. skip: the panel being dragged, which follows the
   pointer instead, and whose drag saves the order once it ends. */
function reorder(g, change, skip) {
  var before = {};
  g.order.forEach(function (k) { var p = g.panels[k].el; before[k] = [p.offsetLeft, p.offsetTop]; });
  change();
  applyOrder(g);
  if (!skip) saveOrder(g);
  g.order.forEach(function (k) {
    var p = g.panels[k].el, dx = before[k][0] - p.offsetLeft, dy = before[k][1] - p.offsetTop;
    if (p !== skip && (dx || dy)) slide(p, "translate(" + dx + "px," + dy + "px)", 220, "cubic-bezier(.2,.7,.3,1)");
  });
}

function movePanel(g, p, d) {
  var k = p.dataset.k, i = g.order.indexOf(k), j = i + d;
  if (j < 0 || j >= g.order.length) return;
  reorder(g, function () { g.order.splice(i, 1); g.order.splice(j, 0, k); });
  revealPanel(p);
}

/* Where a panel's top edge sits in the viewport, from its layout
   position rather than its box, which a slide may still be moving. */
function panelTop(p) { return grid.el.getBoundingClientRect().top + p.offsetTop; }

/* The top of the visible page, below the sticky top bar. */
function viewTop() { return main.getBoundingClientRect().top + $(".topbar").offsetHeight; }

/* Scrolls the page at once, whatever .main's smooth scroll-behavior says. */
function jumpMain(y) {
  main.style.scrollBehavior = "auto";
  main.scrollTop = Math.max(0, y);
  main.style.scrollBehavior = "";
}

/* Every scroll the app makes on purpose goes through here; it ends a
   scroll hold in progress (see holdFocus). */
function scrollMain(y, instant) {
  if (stopHold) stopHold();
  if (instant) jumpMain(y); else main.scrollTop = Math.max(0, y);
}

/* Scrolls just enough to keep a moved panel in view. */
function revealPanel(p) {
  var top = viewTop() + 10, bottom = main.getBoundingClientRect().bottom - 10;
  var t = panelTop(p), b = t + p.offsetHeight;
  if (t < top) scrollMain(main.scrollTop - (top - t));
  else if (b > bottom) scrollMain(main.scrollTop + Math.min(b - bottom, t - top));
}

/* Brings a panel to the top of the view in one jump (a smooth scroll
   would start every panel it passes) and flashes its outline. */
function focusPanel(k) {
  var p = grid.panels[k].el;
  scrollMain(main.scrollTop + panelTop(p) - viewTop() - 12, true);
  p.classList.remove("flash");
  void p.offsetWidth;
  p.classList.add("flash");
}

function activate(g, p) {
  if (g.active === p) return;
  if (g.active) g.active.classList.remove("on");
  g.active = p;
  if (p) p.classList.add("on");
}

/* The panel whose stage an element is in, if any. */
function stagePanel(t) { return t.closest(".stage") && t.closest(".panel"); }

/* Focus that Tab moves into a panel activates it, draw.io's frame
   included. Focus that goes there by itself does not: draw.io focuses
   its frame once loaded, which takes the keyboard focus from wherever it
   was and scrolls the page to the panel, so both are put back (see
   holdFocus). A click or tap activates its panel before any focus moves. */
var lastTab = 0, lastFocus = null, stopHold = null;

function focusMoved(t) {
  var p = grid && stagePanel(t);
  if (!p || p === grid.active) return;
  if (performance.now() - lastTab < 800) activate(grid, p);
  else if (t.tagName === "IFRAME") holdFocus(t, p);
}

/* Takes the focus back from frame f and holds the page where it was:
   for up to two seconds, or until the user scrolls, clicks or types, or
   the app scrolls itself (scrollMain). Chrome lets a cross-origin frame
   take the focus even when it is inert. */
function holdFocus(f, p) {
  if (stopHold) stopHold();
  var keep = main.scrollTop, ac = new AbortController(), stop = setTimeout(done, 2000);
  function done() { stopHold = null; clearTimeout(stop); ac.abort(); }
  stopHold = done;
  main.addEventListener("scroll", function () { if (main.scrollTop !== keep) jumpMain(keep); },
                        { passive: true, signal: ac.signal });
  ["wheel", "pointerdown", "keydown", "touchstart"].forEach(function (t) {
    window.addEventListener(t, done, { capture: true, signal: ac.signal });
  });
  /* Out of the frame (blur() on the iframe element does not do that), and
     only once the move into it is over: during this blur it does nothing. */
  setTimeout(function () {
    if (document.activeElement !== f || grid && grid.active === p) return;
    window.focus();
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
  }, 0);
}

function wireGrid(g) {
  var ge = g.el;

  ge.addEventListener("click", function (e) {
    var t = e.target.closest(".mv, .ex, .nm, .dt");
    if (!t) {
      /* A tap on a stage activates its panel (a swipe that scrolls the page gives no click). */
      var sp = stagePanel(e.target);
      if (sp) activate(g, sp);
      return;
    }
    var p = t.closest(".panel");
    if (t.classList.contains("mv")) { movePanel(g, p, +t.dataset.mv); return; }
    if (t.classList.contains("ex")) {
      var big = p.classList.toggle("big");
      t.setAttribute("aria-pressed", big);
      t.title = big ? "Back to its normal size" : "Widen to the full row";
      t.textContent = big ? "⤡" : "⤢";
      focusPanel(p.dataset.k);
      return;
    }
    /* Leaving for a library's page: make this history entry point at its
       panel, so Back returns to it rather than to the top of the grid. */
    try { history.replaceState(null, "", panelHref(g.panels[p.dataset.k].l)); } catch (x) {}
  });

  ge.addEventListener("keydown", function (e) {
    var grip = e.target.closest(".grip");
    var d = grip && { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
    if (!d) return;
    e.preventDefault();
    movePanel(g, grip.closest(".panel"), d);
    grip.focus();
  });

  ge.addEventListener("pointerdown", function (e) {
    var grip = e.target.closest(".grip");
    if (grip && e.button === 0) { e.preventDefault(); dragPanel(g, grip, e); return; }
    /* A mouse press activates at once, so the wheel works mid-drag; a
       finger only by tapping (above), since touching down may be a swipe. */
    var p = stagePanel(e.target);
    if (p && e.pointerType !== "touch") activate(g, p);
  });

  /* Maps, editors, 3D scenes and graphs all take the wheel to zoom, so a
     screen of panels would leave nothing to scroll the page with. Until
     a panel is clicked into, its wheel events stop here, before the
     library sees them, and the page scrolls instead. Ctrl or Cmd with
     the wheel (and a trackpad pinch) still reaches the library. */
  ge.addEventListener("wheel", function (e) {
    var p = stagePanel(e.target);
    if (!p || p === g.active || e.ctrlKey || e.metaKey) return;
    e.stopPropagation();
    wheelHint(g, p, e);
  }, { capture: true, passive: true });
}

/* Says how to use the wheel inside a panel: the first time it is turned
   over one, and whenever the page has nowhere further to scroll. */
function wheelHint(g, p, e) {
  var stuck = e.deltaY > 0 ? main.scrollTop + main.clientHeight >= main.scrollHeight - 2 : main.scrollTop <= 0;
  if (g.hinted && !stuck) return;
  g.hinted = true;
  var body = p.querySelector(".pbody"), t = body.querySelector(".wheel-hint");
  if (!t) {
    t = el("div", "wheel-hint", "Click inside to zoom or pan it with the wheel · or hold Ctrl");
    body.appendChild(t);
  }
  clearTimeout(t._h);
  t.classList.add("on");
  t._h = setTimeout(function () { t.classList.remove("on"); }, 1600);
}

/* Dragging ⠿: the panel follows the pointer, and whichever panel it is
   over makes room. Near the top or bottom edge the page scrolls. Pointer
   moves and scrolls are folded into one pass per frame. */
function dragPanel(g, grip, e) {
  var p = grip.closest(".panel"), k = p.dataset.k, id = e.pointerId, ac = new AbortController();
  var gr = g.el.getBoundingClientRect();
  var offX = e.clientX - gr.left - p.offsetLeft, offY = e.clientY - gr.top - p.offsetTop;
  var top = viewTop() + 60, bottom = main.getBoundingClientRect().bottom - 60;
  var x = e.clientX, y = e.clientY, tick = 0, lastOver = null;
  p.classList.add("dragging");
  document.body.classList.add("dragging-panel");
  try { grip.setPointerCapture(id); } catch (err) {}

  function over(px, py) {
    for (var i = 0; i < g.order.length; i++) {
      var q = g.panels[g.order[i]].el;
      if (q !== p && px >= q.offsetLeft && px < q.offsetLeft + q.offsetWidth &&
          py >= q.offsetTop && py < q.offsetTop + q.offsetHeight) return q;
    }
    return null;
  }
  function frame() {
    tick = 0;
    var v = y < top ? -Math.ceil((top - y) / 3) : y > bottom ? Math.ceil((y - bottom) / 3) : 0;
    if (v) jumpMain(main.scrollTop + v);
    var r = g.el.getBoundingClientRect(), px = x - r.left, py = y - r.top, q = over(px, py);
    /* Panels of different sizes (one widened) can put the pointer back
       over the panel it just swapped with; wait for it to leave first. */
    if (q && q !== lastOver) {
      var from = g.order.indexOf(k), to = g.order.indexOf(q.dataset.k);
      reorder(g, function () { g.order.splice(from, 1); g.order.splice(to, 0, k); }, p);
    }
    lastOver = q;
    p.style.transform = "translate(" + (px - offX - p.offsetLeft) + "px," + (py - offY - p.offsetTop) + "px)";
    if (v) schedule();   /* keep scrolling while the pointer rests near the edge */
  }
  function schedule() { if (!tick) tick = requestAnimationFrame(frame); }
  function move(ev) {
    if (ev.pointerId !== id) return;
    x = ev.clientX; y = ev.clientY;
    schedule();
  }
  function end(ev) {
    if (ev.pointerId !== id) return;
    ac.abort();
    cancelAnimationFrame(tick);
    p.classList.remove("dragging");
    document.body.classList.remove("dragging-panel");
    saveOrder(g);
    var from = p.style.transform;
    p.style.transform = "";
    if (from) slide(p, from, 180, "ease-out");
  }
  window.addEventListener("pointermove", move, { signal: ac.signal });
  window.addEventListener("pointerup", end, { signal: ac.signal });
  window.addEventListener("pointercancel", end, { signal: ac.signal });
  main.addEventListener("scroll", schedule, { passive: true, signal: ac.signal });
}

/* A panel starts its demo once it has been near the view for a moment,
   so scrolling past a dozen editors does not start them all, and then
   keeps running. Off screen it is paused (see setVisible). */
function watchPanels(g) {
  g.near = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var P = g.panels[en.target.dataset.k];
      P.near = en.isIntersecting;
      if (P.near && !P.started && !P.timer) {
        P.timer = setTimeout(function () { P.timer = 0; if (P.near) startPanel(P); }, 150);
      }
    });
  }, { root: main, rootMargin: "200px 0px" });
  g.seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var P = g.panels[en.target.dataset.k];
      P.vis = en.isIntersecting;
      if (P.rec) setVisible(P.rec, P.vis);
      if (!P.vis && g.active === P.el) activate(g, null);
      /* The sidebar marks the libraries whose panels are in view. */
      if (P.nav) P.nav.classList.toggle("vis", P.vis);
    });
  }, { root: main });
  g.order.forEach(function (k) { g.near.observe(g.panels[k].el); g.seen.observe(g.panels[k].el); });
}

/* (Re)builds a panel's stage from scratch and runs its demo: a fresh
   stage carries nothing over from a previous run. */
function startPanel(P) {
  var body = P.el.querySelector(".pbody");
  if (lastFocus && body.contains(lastFocus)) lastFocus = null;
  body.innerHTML = stageHTML(P.l);
  P.started = true;
  P.rec = runDemo(P.l, stageParts(body), P.vis);
}

function leaveGrid() {
  if (!grid) return;
  grid.near.disconnect();
  grid.seen.disconnect();
  grid.order.forEach(function (k) {
    var P = grid.panels[k];
    clearTimeout(P.timer);
    if (P.nav) P.nav.classList.remove("vis");
  });
  grid = null;
}

/* ------------------------------------------------------------------
   Router
   ------------------------------------------------------------------ */
function route() {
  var h = location.hash.replace(/^#/, "") || "/";
  var c = /^\/c\/([^\/]+)(?:\/([^\/]+))?$/.exec(h);
  closeDrawer();

  /* Within the category already on screen, only bring a panel into view;
     its demos keep running. */
  if (c && grid && grid.cat === c[1]) {
    markNav(null, c[1], c[2]);
    if (c[2] && grid.panels[c[2]]) focusPanel(c[2]);
    else if (!c[2]) scrollMain(0, true);
    return;
  }

  if (lastFocus && view.contains(lastFocus)) lastFocus = null;   /* would keep the old page alive */
  leaveGrid();
  destroyAll();
  document.title = "FrontDemo — a playground for front-end libraries";
  scrollMain(0, true);

  if (c && catById[c[1]]) {
    markNav(null, c[1], c[2]);
    renderCat(c[1], c[2]);
  } else if (h.indexOf("/l/") === 0) {
    var k = h.slice(3);
    markNav(null, byKey[k] ? byKey[k].cat : null, k);
    renderLib(k);
  } else if (h === "/matrix") {
    markNav("/matrix");
    renderMatrix();
  } else {
    markNav("/");
    renderHome();
  }
}

/* ------------------------------------------------------------------
   Mobile drawer
   ------------------------------------------------------------------ */
function openDrawer()  { $("#side").classList.add("open");  $("#scrim").classList.add("on"); }
function closeDrawer() { $("#side").classList.remove("open"); $("#scrim").classList.remove("on"); }

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
window.__boot = function () {
  setTheme(pref("fd-theme", "dark"));

  buildNav();

  $("#themeBtn").addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    /* Demos bake colours in at build time, so re-run them, except those
       that keep their own look in either theme (ctx.ownTheme): the diagram
       editors on their white page would only lose what was drawn. Panels
       near the view re-run now, the rest when they come near again. */
    if (grid) {
      grid.order.forEach(function (k) {
        var P = grid.panels[k];
        if (!P.rec || P.rec.ownTheme) return;
        destroyRec(P.rec);
        P.rec = null;
        if (P.near) startPanel(P);
        else { P.started = false; P.el.querySelector(".pbody").innerHTML = stageHTML(P.l); }
      });
      return;
    }
    var h = location.hash.replace(/^#/, ""), l = h.indexOf("/l/") === 0 && byKey[h.slice(3)];
    if (l && !lives.some(function (r) { return r.ownTheme; })) { destroyAll(); renderLib(l.k); }
  });

  /* A category's name opens its panels, and folds it when they are
     already open; the arrow beside it only folds. */
  navEl.addEventListener("click", function (e) {
    /* The library already asked for: no hashchange, so bring it back into view here. */
    var it = e.target.closest(".item");
    if (it && it.getAttribute("href") === location.hash && grid && grid.panels[it.dataset.k]) focusPanel(it.dataset.k);
    var s = e.target.closest("summary");
    if (!s) return;
    var d = s.parentNode, to = "#/c/" + d.dataset.cat;
    if (e.target.closest(".arw")) { delete d.dataset.auto; return; }   /* folded or unfolded by hand */
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    if (location.hash === to) { d.open = !d.open; delete d.dataset.auto; }
    else location.hash = to;   /* route() unfolds it, through markNav */
  });

  /* The panel clicked into keeps the wheel until something else is clicked. */
  document.addEventListener("pointerdown", function (e) {
    if (grid && grid.active && !grid.active.contains(e.target)) activate(grid, null);
  }, true);
  /* Focus moving into a panel (see focusMoved): onto page content it is
     seen here; into a frame, the page only sees its own window blur. */
  window.addEventListener("keydown", function (e) { if (e.key === "Tab") lastTab = performance.now(); }, true);
  document.addEventListener("focusin", function (e) {
    if (e.target.tagName === "IFRAME") return;
    lastFocus = e.target;
    focusMoved(e.target);
  });
  window.addEventListener("blur", function () {
    var f = document.activeElement;
    if (f && f.tagName === "IFRAME") focusMoved(f);
  });

  var q = $("#q");
  q.addEventListener("input", function () { searchTerm = q.value; applySearch(); });
  $("#qclr").addEventListener("click", function () { q.value = ""; searchTerm = ""; applySearch(); q.focus(); });

  /* "/" jumps to the search box, unless it is being typed somewhere:
     a field, or an editor's in-place text (maxGraph and Drawnix edit
     labels in contenteditable elements). */
  document.addEventListener("keydown", function (e) {
    var t = e.target, typing = t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || "");
    if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if ($("#burger").offsetParent) openDrawer();     /* narrow screens keep the search in the drawer */
      q.focus(); q.select();
    }
    if (e.key === "Escape" && document.activeElement === q) { q.value = ""; searchTerm = ""; applySearch(); q.blur(); }
  });

  $("#burger").addEventListener("click", openDrawer);
  $("#scrim").addEventListener("click", closeDrawer);
  /* Following a link closes the drawer, even to the page already open
     (no hashchange then). */
  $("#side").addEventListener("click", function (e) { if (e.target.closest("a[href^='#']")) closeDrawer(); });

  window.addEventListener("hashchange", route);
  route();
};

})();
