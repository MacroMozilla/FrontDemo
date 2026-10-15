/* ==================================================================
   FrontDemo — application shell.

   Responsibilities:
     · theme (two palettes, exposed to demos as a token object)
     · on-demand vendor loading
     · sidebar, search and hash routing
     · the context object every demo builder is handed
     · home page, library page, comparison matrix

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

function setTheme(name) {
  document.documentElement.setAttribute("data-theme", name);
  try { localStorage.setItem("fd-theme", name); } catch (e) {}
  readTheme();
  var b = $("#themeBtn");
  if (b) b.textContent = name === "light" ? "◐ Light" : "◑ Dark";
}

/* ------------------------------------------------------------------
   Vendor loading. Scripts are loaded strictly in the order given,
   because some expect a peer global to already exist (LogicFlow's
   extension needs its core). A failed load is forgotten, so the next
   visit tries again.

   A library's stylesheet applies only while its page is open (see
   destroyLive): some carry page-wide rules, such as LogicFlow's
   :focus { outline: none }.
   ------------------------------------------------------------------ */
var jsCache = {}, cssCache = {}, cssLinks = {};

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

function need() {
  var ids = [].slice.call(arguments);
  return ids.reduce(function (p, id) {
    return p.then(function () { return loadJS(id); });
  }, Promise.resolve());
}
window.__need = need;

/* ------------------------------------------------------------------
   Demo lifecycle
   ------------------------------------------------------------------ */
var live = null;   /* the currently mounted demo's teardown record */

function destroyLive() {
  if (!live) return;
  live.dead = true;
  live.destroyers.forEach(function (fn) { try { fn(); } catch (e) {} });
  live.rafs.forEach(function (id) { cancelAnimationFrame(id); });
  live.timers.forEach(function (id) { clearInterval(id); clearTimeout(id); });
  live.listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
  live.css.forEach(function (id) { if (cssLinks[id]) cssLinks[id].disabled = true; });
  /* Browsers cap live WebGL contexts at around 16 and drop the oldest
     silently. Anything a demo left behind gets released here, otherwise
     the 3D pages start failing after enough navigation. */
  if (live.mount) {
    live.mount.querySelectorAll("canvas").forEach(function (cv) {
      var gl = null;
      try { gl = cv.getContext("webgl2") || cv.getContext("webgl"); } catch (e) {}
      if (gl) {
        var ext = gl.getExtension("WEBGL_lose_context");
        if (ext) { try { ext.loseContext(); } catch (e) {} }
      }
      cv.width = cv.height = 0;
    });
  }
  live = null;
}

function makeCtx(lib, mount, bar, stage) {
  var rec = { dead: false, destroyers: [], rafs: [], timers: [], listeners: [], css: [], mount: mount };
  live = rec;

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
      var m = $("#msg");
      if (rec.dead) return function () {};
      m.className = "stage-msg on err";
      m.innerHTML = "<p>" + esc(text) + "</p>";
      return function () { if (!rec.dead) m.classList.remove("on"); };
    },

    /** requestAnimationFrame loop that stops itself when the demo unmounts. */
    raf: function (fn) {
      if (rec.dead) return;
      var last = performance.now(), slot = rec.rafs.length;   /* one id per loop */
      function step(now) {
        if (rec.dead) return;
        var dt = Math.min(now - last, 100); last = now;
        if (fn(dt, now) === false) return;
        rec.rafs[slot] = requestAnimationFrame(step);
      }
      rec.rafs[slot] = requestAnimationFrame(step);
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

    /** Debounced resize hook, cleaned up on unmount. */
    onResize: function (fn) {
      var t = null;
      var h = function () { clearTimeout(t); t = setTimeout(function () { if (!rec.dead) fn(); }, 140); };
      if (rec.dead) return h;
      window.addEventListener("resize", h);
      rec.listeners.push([window, "resize", h]);
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
      return Promise.all(ids.map(loadCSS));
    },
    /** Deterministic pseudo-random, so demos look the same on every reload. */
    rng: function (seed) {
      var s = seed || 42;
      return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
    },
    series: function (i) { return T.series[i % T.series.length]; }
  };

  return ctx;
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
      var s = el("summary", null,
        '<span class="arw">▶</span><span class="n">' + esc(cat.name) + '</span><span class="c">' + libs.length + "</span>");
      d.appendChild(s);
      var box = el("div", "cat-items");
      libs.forEach(function (l) {
        var a = el("a", "item",
          '<span class="dot"></span><span class="nm">' + esc(l.n) + '</span><span class="st">' + "★".repeat(l.st) + "</span>");
        a.href = "#/l/" + l.k;
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

function markNav(route, key) {
  navEl.querySelectorAll(".nav-link").forEach(function (a) {
    a.classList.toggle("on", a.dataset.route === route);
  });
  navEl.querySelectorAll(".item").forEach(function (a) {
    var on = a.dataset.k === key;
    a.classList.toggle("on", on);
    if (on) {
      var d = a.closest("details");
      if (d && !d.open) d.open = true;
    }
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
var view = $("#view"), crumb = $("#crumb");

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
       "<p>Pick anything from the sidebar. You get the library mounted on a real stage with controls " +
       "to push it around, the honest trade-off, whether it survives a React Native app, when it was last " +
       "updated, and the exact source that produced what you are looking at.</p>" +
       "</div>";

  h += '<div class="stats">' +
       '<div class="stat"><div class="v">' + LIBS.length + '</div><div class="k">libraries</div></div>' +
       '<div class="stat"><div class="v">' + CATS.length + '</div><div class="k">categories</div></div>' +
       '<div class="stat"><div class="v">' + vizCount + '</div><div class="k">graphics libs</div></div>' +
       '<div class="stat"><div class="v">' + rnYes + '</div><div class="k">React Native ready</div></div>' +
       "</div>";

  h += '<div class="sechead"><h3>' + editors.length + " diagram editors, one flowchart</h3><span>Each draws the same " +
       "approval flowchart with its stock shapes, theme and panels. Each name opens its live page. " +
       "Versions and dates checked " + esc(CHECKED) + ".</span></div>";
  h += '<div class="tscroll"><table class="m cmp"><thead><tr>' +
       '<th class="nm">Framework</th><th>Draws with</th><th>You write it in</th>' +
       "<th>In the box — and used on its page</th><th>License</th><th>Last update</th>" +
       "</tr></thead><tbody>";
  editors.forEach(function (l) {
    h += "<tr>" +
         '<td class="nm"><a href="#/l/' + l.k + '">' + esc(l.n) + '</a><span class="p">' + esc(l.pkg) + "</span></td>" +
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
      h += '<a class="grpcard" href="#/l/' + libs[0].k + '">' +
           "<h4>" + esc(c.name) + ' <span class="n">' + libs.length + "</span></h4>" +
           "<p>" + esc(c.blurb) + "</p>" +
           '<div class="libs">' + libs.map(function (l) { return esc(l.n); }).join(" · ") + "</div></a>";
    });
    h += "</div>";
  });

  h += '<div class="sechead"><h3>How to read the pages</h3></div>';
  h += '<div class="cards">' +
       '<div class="card"><h4>Stage</h4><p>The library is mounted for real and loaded only when you open its page. ' +
       'Controls in the grey bar drive the actual API — they are not canned states.</p></div>' +
       '<div class="card"><h4>React Native column</h4><p><b class="mk y">✓</b> runs on a device, natively or as pure JS you can ' +
       'drive <code>react-native-svg</code> with. <b class="mk p">◐</b> works on Expo web only; native needs a WebView. ' +
       '<b class="mk n">✗</b> no path into a React Native app at all.</p></div>' +
       '<div class="card"><h4>Source</h4><p>Every page ends with the exact builder function that drew the stage — ' +
       'no elisions, no pseudo-code.</p></div>' +
       '<div class="card"><h4>Last update</h4><p>Every page leads with the newer of the latest release and the newest ' +
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
      body += '<tr class="cathead"><td colspan="' + (CAPS.length + 3) + '">' +
              esc(c.name) + '<span class="n">' + rows.length + "</span></td></tr>";
      rows.forEach(function (l) {
        n++;
        body += "<tr>" +
          '<td class="nm"><a href="#/l/' + l.k + '">' + esc(l.n) + '</a><span class="p">' + esc(l.pkg) + "</span></td>" +
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
                    '<span class="cat">' + esc(cat.name) + '</span><span class="sep">/</span><b>' + esc(l.n) + "</b>";
  document.title = l.n + " — FrontDemo";

  var licWarn = /SEE LICENSE|no-charge|LGPL|MPL/i.test(l.lic);
  var h = '<div class="pad">';
  h += '<header class="lib-head">' +
       '<div class="lib-title"><h2>' + esc(l.n) + "</h2>" +
       '<span class="stars" title="How readily I would reach for it">' + stars(l.st) + "</span>" +
       (l.npm === false
         ? '<a class="npm" href="' + esc(l.site) + '" target="_blank" rel="noopener" title="How it is embedded">' +
           esc(l.ext || l.pkg) + ' <span class="cp">embed docs</span></a>'
         : '<button class="npm" id="cpNpm" type="button" title="Copy install command">npm i ' + esc(l.pkg) +
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

  h += '<div class="stage-card">' +
       '<div class="stage-bar" id="bar"><span class="lbl">Live</span></div>' +
       '<div class="stage" id="stage">' +
       '<div class="mount" id="mount"></div>' +
       '<div class="stage-msg on" id="msg"><div class="sp"></div><p>loading ' + esc(l.pkg) + "…</p></div>" +
       "</div></div>";

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
       (l.repo ? '<a href="https://github.com/' + esc(l.repo) + '" target="_blank" rel="noopener">GitHub</a>' : "") +
       (l.npm === false ? "" :
         '<a href="https://www.npmjs.com/package/' + esc(l.pkg) + '" target="_blank" rel="noopener">npm</a>') +
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
    navigator.clipboard.writeText("npm i " + l.pkg).then(function () {
      var s = b.querySelector(".cp");
      s.textContent = "copied";
      setTimeout(function () { s.textContent = "copy"; }, 1600);
    }, function () {});
  });

  wireSource(l);
  runDemo(l);
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
    need("hljs").then(function () { return loadCSS("hljs"); }).then(function () {
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

async function runDemo(l) {
  var mount = $("#mount"), bar = $("#bar"), stage = $("#stage"), msg = $("#msg");
  var fn = B[l.k];
  if (!fn) {
    msg.className = "stage-msg on err";
    msg.innerHTML = "<p>No demo builder is registered for “" + esc(l.k) + "” yet.</p>";
    return;
  }
  var ctx = makeCtx(l, mount, bar, stage);
  var mine = live;
  try {
    if (l.css && l.css.length) await ctx.css.apply(null, l.css);
    if (l.js && l.js.length) await need.apply(null, l.js);
    /* An ES-module build (it lazy-loads chunks of its own) is imported
       rather than script-tagged, and handed to the builder as ctx.mod. */
    if (l.esm) ctx.mod = await import(new URL("vendor/" + l.esm, document.baseURI).href);
    if (mine.dead) return;
    await fn(ctx);
    if (mine.dead) return;
    msg.classList.remove("on");
  } catch (e) {
    if (mine.dead) return;
    msg.className = "stage-msg on err";
    msg.innerHTML = "<p>" + esc(l.n) + " failed to start.<br>" + esc((e && e.message) || e) + "</p>";
    if (window.console) console.error("[" + l.k + "]", e);
  }
}

/* ------------------------------------------------------------------
   Router
   ------------------------------------------------------------------ */
function route() {
  destroyLive();
  var h = location.hash.replace(/^#/, "") || "/";
  document.title = "FrontDemo — a playground for front-end libraries";
  $("#main").scrollTop = 0;
  closeDrawer();

  if (h.indexOf("/l/") === 0) {
    var k = h.slice(3);
    markNav(null, k);
    renderLib(k);
  } else if (h === "/matrix") {
    markNav("/matrix", null);
    renderMatrix();
  } else {
    markNav("/", null);
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
  var saved = "dark";
  try { saved = localStorage.getItem("fd-theme") || "dark"; } catch (e) {}
  setTheme(saved);

  buildNav();

  $("#themeBtn").addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
    /* Demos bake colours in at build time, so re-run the current one,
       unless it keeps its own look in either theme (ctx.ownTheme): the
       diagram editors on their white page would only lose what was drawn. */
    var h = location.hash.replace(/^#/, ""), l = h.indexOf("/l/") === 0 && byKey[h.slice(3)];
    if (l && !(live && live.ownTheme)) { destroyLive(); renderLib(l.k); }
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
