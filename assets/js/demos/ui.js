/* Interaction and UI behaviour. */
(function () {
"use strict";
var B = window.B;

/* ------------------------------------------------------------- SortableJS */
B.sortable = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var COLUMNS = [
    { id: "todo", title: "Backlog", items: ["Virtualise the grid", "Dark theme audit", "Drop IE polyfills", "Cache warmup"] },
    { id: "doing", title: "In progress", items: ["Bundle split", "Form validation"] },
    { id: "review", title: "In review", items: ["Sidebar routing", "Skeleton loaders"] },
    { id: "done", title: "Done", items: ["Design tokens"] }
  ];

  var board = ctx.mk("div", "demo-cols");
  ctx.el.appendChild(board);

  var instances = [];
  var state = {};
  COLUMNS.forEach(function (col, ci) {
    state[col.id] = col.items.slice();
    var box = ctx.mk("div", "demo-colbox");
    box.appendChild(ctx.mk("h5", null, ctx.esc(col.title) + ' <span style="float:right;color:' +
                           ctx.series(ci) + '">' + col.items.length + "</span>"));
    var list = ctx.mk("div", "demo-cards");
    list.dataset.col = col.id;
    col.items.forEach(function (t, i) {
      var c = ctx.mk("div", "demo-card");
      c.innerHTML = "<b>" + ctx.esc(t) + "</b><span class=\"sub\">FE-" + (1200 + ci * 10 + i) + "</span>";
      c.style.borderLeft = "3px solid " + ctx.series(ci);
      list.appendChild(c);
    });
    box.appendChild(list);
    board.appendChild(box);

    instances.push(new Sortable(list, {
      group: "kanban",
      animation: 170,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      forceFallback: false,
      onEnd: report
    }));
  });

  var style = ctx.mk("style");
  style.textContent =
    ".sortable-ghost{opacity:.35;background:" + T.accent + "22 !important;border-color:" + T.accent + " !important}" +
    ".sortable-chosen{box-shadow:0 6px 18px rgba(0,0,0,.35)}";
  ctx.el.appendChild(style);

  var summary = ctx.mk("pre", "demo-pre");
  summary.style.marginTop = "16px";
  ctx.el.appendChild(summary);

  var out = ctx.readout("drag cards inside a column, or across to another one");
  function report() {
    var lines = [];
    board.querySelectorAll("[data-col]").forEach(function (list) {
      var names = [].map.call(list.children, function (c) { return c.querySelector("b").textContent; });
      lines.push(list.dataset.col.padEnd(8) + " → [" + names.join(", ") + "]");
      var head = list.previousElementSibling.querySelector("span");
      if (head) head.textContent = names.length;
    });
    summary.textContent = lines.join("\n");
    out("order updated — this is the array you would persist");
  }
  report();
  ctx.onDestroy(function () { instances.forEach(function (i) { i.destroy(); }); });

  /* Sortable's behaviour is almost entirely option-driven, so the toolbar
     is the honest way to show what it does — every control below just sets
     an option on the live instances. */
  function setAll(key, value) {
    instances.forEach(function (i) { i.option(key, value); });
  }

  ctx.range("animation", { min: 0, max: 600, step: 20, value: 170,
    fmt: function (v) { return v + " ms"; } }, function (v) {
    setAll("animation", v);
    out("animation is <b>" + v + " ms</b> — 0 makes it snap");
  });
  ctx.range("swap threshold", { min: 0.2, max: 1, step: 0.05, value: 1,
    fmt: function (v) { return v.toFixed(2); } }, function (v) {
    setAll("swapThreshold", v);
    out("a card now has to overlap <b>" + Math.round(v * 100) + "%</b> of its neighbour to displace it");
  });
  ctx.check("sort within a column", true, function (v) {
    setAll("sort", v);
    out(v ? "reordering allowed inside a column"
          : "reordering disabled — you can still drag <b>between</b> columns");
  });
  ctx.check("lock the Done column", false, function (v) {
    var done = instances[instances.length - 1];
    done.option("group", v ? { name: "kanban", pull: false, put: true } : "kanban");
    out(v ? "cards can enter <b>Done</b> but not leave it" : "Done unlocked");
  });
  ctx.check("fallback (no HTML5 DnD)", false, function (v) {
    setAll("forceFallback", v);
    out(v ? "using the mouse-event fallback — the path mobile takes"
          : "using the browser's native drag and drop");
  });
  ctx.btn("Shuffle every column", function () {
    board.querySelectorAll("[data-col]").forEach(function (list) {
      var kids = [].slice.call(list.children);
      kids.sort(function () { return Math.random() - 0.5; });
      kids.forEach(function (k) { list.appendChild(k); });
    });
    report();
  }, true);
  ctx.btn("Log the order", function () {
    var order = {};
    board.querySelectorAll("[data-col]").forEach(function (list) {
      order[list.dataset.col] = [].map.call(list.children, function (c) {
        return c.querySelector(".sub").textContent;
      });
    });
    summary.textContent = JSON.stringify(order, null, 2);
    out("that JSON is exactly what <code>toArray()</code> would give you");
  });
};

/* ------------------------------------------------------------ interact.js */
B.interact = async function (ctx) {
  var T = ctx.T;
  var board = ctx.mk("div", "demo-grid-bg");
  board.style.cssText = "position:absolute;inset:0;overflow:hidden";
  ctx.el.appendChild(board);

  var box = ctx.mk("div");
  box.style.cssText =
    "position:absolute;left:60px;top:60px;width:220px;height:150px;border-radius:12px;" +
    "background:" + ctx.series(0) + ";color:#0b0e14;font:600 13px " + T.sans + ";" +
    "display:grid;place-items:center;touch-action:none;user-select:none;cursor:move;" +
    "box-shadow:0 8px 26px rgba(0,0,0,.3)";
  box.textContent = "drag · resize · pinch";
  board.appendChild(box);

  var x = 60, y = 60, w = 220, h = 150, angle = 0, scale = 1;
  var snap = true, out = ctx.readout("");

  function apply() {
    box.style.width = w + "px";
    box.style.height = h + "px";
    box.style.transform = "translate(" + (x - 60) + "px," + (y - 60) + "px) rotate(" + angle.toFixed(1) +
                          "deg) scale(" + scale.toFixed(2) + ")";
    out("x <b>" + Math.round(x) + "</b> y <b>" + Math.round(y) + "</b> · " +
        Math.round(w) + "×" + Math.round(h) + " · " + angle.toFixed(0) + "° · " + scale.toFixed(2) + "×");
  }
  apply();

  /* interact.js reports; applying the transform is deliberately your job. */
  var it = interact(box)
    .draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({ restriction: board, endOnly: true })
      ],
      listeners: {
        move: function (e) {
          x += e.dx; y += e.dy;
          if (snap) { x = Math.round(x / 22) * 22; y = Math.round(y / 22) * 22; }
          apply();
        }
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      modifiers: [interact.modifiers.restrictSize({ min: { width: 90, height: 70 } })],
      listeners: {
        move: function (e) {
          w = e.rect.width; h = e.rect.height;
          x += e.deltaRect.left; y += e.deltaRect.top;
          apply();
        }
      }
    })
    .gesturable({
      listeners: {
        move: function (e) {
          angle += e.da;
          scale = Math.max(.4, Math.min(2.4, scale * (1 + e.ds)));
          apply();
        }
      }
    });

  ctx.check("snap to 22px grid", true, function (v) { snap = v; });
  ctx.check("inertia", true, function (v) { it.draggable({ inertia: v }); });
  ctx.btn("Reset", function () { x = 60; y = 60; w = 220; h = 150; angle = 0; scale = 1; apply(); });
  ctx.label("drag the edges to resize · pinch or two-finger rotate");

  ctx.onDestroy(function () { it.unset(); });
};

/* ----------------------------------------------------------- Floating UI */
B.floating = async function (ctx) {
  var T = ctx.T;
  var FUI = window.FloatingUIDOM;

  var scroller = ctx.mk("div");
  scroller.style.cssText = "position:absolute;inset:0;overflow:auto;padding:40px";
  ctx.el.appendChild(scroller);

  var inner = ctx.mk("div");
  inner.style.cssText = "width:1500px;height:900px;position:relative";
  scroller.appendChild(inner);

  var hint = ctx.mk("p", "demo-note");
  hint.style.cssText = "position:sticky;top:0;left:0;width:340px;z-index:3";
  hint.innerHTML = "Scroll this panel in any direction. As a trigger approaches an edge the tooltip " +
                   "<b>flips</b> to the other side and <b>shifts</b> along it, rather than being clipped.";
  inner.appendChild(hint);

  var tip = ctx.mk("div");
  tip.style.cssText =
    "position:absolute;top:0;left:0;background:" + T.panel + ";color:" + T.ink +
    ";border:1px solid " + T.line2 + ";border-radius:8px;padding:7px 11px;font-size:12.5px;" +
    "box-shadow:0 8px 24px rgba(0,0,0,.35);pointer-events:none;opacity:0;transition:opacity .12s;z-index:9;width:max-content;max-width:230px";
  var arrow = ctx.mk("div");
  arrow.style.cssText = "position:absolute;width:9px;height:9px;background:" + T.panel +
                        ";border:1px solid " + T.line2 + ";transform:rotate(45deg)";
  tip.appendChild(arrow);
  var tipText = ctx.mk("span");
  tip.appendChild(tipText);
  inner.appendChild(tip);

  var placement = "top", out = ctx.readout("hover any button");

  /* Clustered near the top-left so several are visible without scrolling,
     with outliers to scroll towards for the flip/shift behaviour. */
  var spots = [[40, 110], [300, 150], [560, 110], [180, 300], [430, 330], [660, 260],
               [40, 470], [330, 500], [620, 460], [1280, 120], [1330, 700], [60, 820]];
  spots.forEach(function (pos, i) {
    var btn = ctx.mk("button");
    btn.type = "button";
    btn.textContent = "trigger " + (i + 1);
    btn.style.cssText = "position:absolute;left:" + pos[0] + "px;top:" + pos[1] + "px;" +
      "background:" + ctx.series(i % 8) + ";border:0;border-radius:8px;padding:9px 15px;" +
      "font:600 12.5px " + T.sans + ";color:#0b0e14;cursor:pointer";
    inner.appendChild(btn);

    function show() {
      tipText.textContent = "Tooltip " + (i + 1) + " — placed by middleware, not by me.";
      tip.style.opacity = "1";
      FUI.computePosition(btn, tip, {
        placement: placement,
        middleware: [
          FUI.offset(10),
          FUI.flip({ padding: 8 }),
          FUI.shift({ padding: 8 }),
          FUI.arrow({ element: arrow, padding: 6 })
        ]
      }).then(function (r) {
        Object.assign(tip.style, { left: r.x + "px", top: r.y + "px" });
        var side = r.placement.split("-")[0];
        var opp = { top: "bottom", bottom: "top", left: "right", right: "left" }[side];
        var ad = r.middlewareData.arrow;
        Object.assign(arrow.style, {
          left: ad && ad.x != null ? ad.x + "px" : "",
          top: ad && ad.y != null ? ad.y + "px" : "",
          right: "", bottom: "",
          borderTop: side === "bottom" ? "" : "none",
          borderLeft: side === "right" ? "" : "none",
          borderRight: side === "left" ? "" : "none",
          borderBottom: side === "top" ? "" : "none"
        });
        arrow.style[opp] = "-5px";
        out("asked for <b>" + placement + "</b>, resolved to <b>" + r.placement + "</b>");
      });
    }
    btn.addEventListener("pointerenter", show);
    btn.addEventListener("pointerleave", function () { tip.style.opacity = "0"; });
    btn.addEventListener("focus", show);
  });

  ctx.select("preferred placement", ["top", "bottom", "left", "right",
                                     "top-start", "bottom-end"], function (v) { placement = v; }, "top");
  ctx.btn("Scroll to a corner", function () {
    scroller.scrollTo({ left: inner.clientWidth, top: inner.clientHeight, behavior: "smooth" });
  });
};

/* ----------------------------------------------------------------- Swiper */
B.swiper = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div", "swiper");
  host.style.cssText = "position:absolute;inset:24px;padding-bottom:30px";
  ctx.el.appendChild(host);
  var wrapper = ctx.mk("div", "swiper-wrapper");
  host.appendChild(wrapper);

  var LABELS = ["Rendering", "State", "Routing", "Forms", "Testing", "Build", "Deploy", "Observability"];
  LABELS.forEach(function (label, i) {
    var s = ctx.mk("div", "swiper-slide");
    s.style.cssText = "display:grid;place-items:center;border-radius:16px;color:#0b0e14;" +
      "background:linear-gradient(150deg," + ctx.series(i % 8) + "," + ctx.series((i + 3) % 8) + ");" +
      "font:700 22px " + T.sans;
    s.innerHTML = "<div style='text-align:center'>" + label +
                  "<div style='font:500 12px " + T.mono + ";opacity:.7;margin-top:6px'>slide " + (i + 1) + " / " +
                  LABELS.length + "</div></div>";
    wrapper.appendChild(s);
  });

  var pag = ctx.mk("div", "swiper-pagination");
  var prev = ctx.mk("div", "swiper-button-prev");
  var next = ctx.mk("div", "swiper-button-next");
  host.appendChild(pag); host.appendChild(prev); host.appendChild(next);

  var style = ctx.mk("style");
  style.textContent =
    ".swiper-pagination-bullet{background:" + T.muted + "}" +
    ".swiper-pagination-bullet-active{background:" + T.accent + "}" +
    ".swiper-button-prev,.swiper-button-next{color:" + T.accent + ";--swiper-navigation-size:26px}";
  ctx.el.appendChild(style);

  var swiper = null, out = ctx.readout("");
  function build(effect) {
    if (swiper) swiper.destroy(true, false);
    var opts = {
      loop: true,
      grabCursor: true,
      pagination: { el: pag, clickable: true },
      navigation: { prevEl: prev, nextEl: next },
      keyboard: { enabled: true },
      on: { slideChange: function () {
        out("slide <b>" + (this.realIndex + 1) + "</b> of " + LABELS.length + " · effect <b>" + effect + "</b>");
      } }
    };
    if (effect === "coverflow") {
      Object.assign(opts, { effect: "coverflow", centeredSlides: true, slidesPerView: 1.7,
        coverflowEffect: { rotate: 34, stretch: 0, depth: 140, modifier: 1, slideShadows: false } });
    } else if (effect === "cards") {
      Object.assign(opts, { effect: "cards", cardsEffect: { perSlideOffset: 9, perSlideRotate: 3 } });
    } else if (effect === "fade") {
      Object.assign(opts, { effect: "fade", fadeEffect: { crossFade: true } });
    } else {
      Object.assign(opts, { slidesPerView: 1.25, spaceBetween: 18, centeredSlides: true });
    }
    swiper = new Swiper(host, opts);
    out("effect <b>" + effect + "</b> — swipe, drag, or use the arrow keys");
  }
  build("coverflow");

  ctx.select("effect", ["coverflow", "slide", "cards", "fade"], build, "coverflow");
  ctx.check("autoplay", false, function (v) {
    if (!swiper) return;
    if (v && swiper.autoplay) swiper.autoplay.start();
    else if (swiper.autoplay) swiper.autoplay.stop();
  });

  ctx.onDestroy(function () { if (swiper) swiper.destroy(true, false); });
};

/* -------------------------------------------------------------- Driver.js */
B.driver = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var page = ctx.mk("div");
  page.innerHTML =
    '<h3 id="tour-title" style="margin-bottom:6px">Fake settings screen</h3>' +
    '<p class="demo-p">Driver.js needs something to point at, so here is a small page. ' +
    "Press <b>Start tour</b> in the bar above.</p>" +
    '<div class="demo-cols" style="margin-top:14px">' +
      '<div class="demo-colbox" id="tour-a"><h5>Workspace</h5>' +
        '<p class="demo-note">Rename the workspace, change its icon, transfer ownership.</p></div>' +
      '<div class="demo-colbox" id="tour-b"><h5>Members</h5>' +
        '<p class="demo-note">Invite people and set their roles.</p></div>' +
      '<div class="demo-colbox" id="tour-c"><h5>Billing</h5>' +
        '<p class="demo-note">Plan, seats, invoices.</p></div>' +
    "</div>" +
    '<div style="height:420px"></div>' +
    '<div class="demo-colbox" id="tour-d" style="max-width:340px"><h5>Danger zone</h5>' +
      '<p class="demo-note">Deleting a workspace cannot be undone. This step is far down the page, ' +
      "so the tour has to scroll to reach it.</p></div>";
  ctx.el.appendChild(page);

  var style = ctx.mk("style");
  style.textContent =
    ".driver-popover{background:" + T.panel + ";color:" + T.ink + ";border:1px solid " + T.line2 + "}" +
    ".driver-popover-title{color:" + T.ink + "}" +
    ".driver-popover-description{color:" + T.ink2 + "}" +
    ".driver-popover-progress-text{color:" + T.muted + "}" +
    ".driver-popover-navigation-btns button{background:" + T.sunk + ";color:" + T.ink2 +
      ";border:1px solid " + T.line + ";text-shadow:none}" +
    ".driver-popover-arrow-side-left{border-left-color:" + T.panel + "}" +
    ".driver-popover-arrow-side-right{border-right-color:" + T.panel + "}" +
    ".driver-popover-arrow-side-top{border-top-color:" + T.panel + "}" +
    ".driver-popover-arrow-side-bottom{border-bottom-color:" + T.panel + "}";
  ctx.el.appendChild(style);

  var out = ctx.readout("press Start tour");
  var drv = window.driver.js.driver({
    showProgress: true,
    animate: true,
    overlayColor: ctx.dark ? "#05070c" : "#0b1020",
    overlayOpacity: .68,
    onHighlighted: function (el, step, opts) {
      out("step <b>" + (opts.state.activeIndex + 1) + "</b> — the spotlight animates between targets");
    },
    onDestroyed: function () { out("tour finished"); },
    steps: [
      { element: "#tour-title", popover: { title: "Where you are", description: "Driver.js dims the page and cuts a hole around the element you name." } },
      { element: "#tour-a", popover: { title: "Workspace", description: "Each step is one object: a selector plus some copy.", side: "bottom" } },
      { element: "#tour-b", popover: { title: "Members", description: "It positions itself and stays on screen.", side: "bottom" } },
      { element: "#tour-c", popover: { title: "Billing", description: "Keyboard navigation and progress text come free.", side: "left" } },
      { element: "#tour-d", popover: { title: "Off screen", description: "This one is hundreds of pixels down — watch it scroll into view.", side: "top" } }
    ]
  });

  ctx.btn("Start tour", function () { drv.drive(); }, true);
  ctx.btn("Highlight one element", function () {
    drv.highlight({ element: "#tour-c", popover: { title: "One-off highlight", description: "No tour, just a spotlight." } });
  });
  ctx.onDestroy(function () { try { drv.destroy(); } catch (e) {} });
};


/* ------------------------------------------------------------- hotkeys-js */
B.hotkeys = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Scopes are the reason this is not a switch on event.key</p>' +
    '<p class="demo-p">Press any combination — the keyboard below lights up from ' +
    "<code>hotkeys.getPressedKeyCodes()</code>. The same combination does different things depending " +
    "on the active scope, which is how a real app gives the editor its own shortcuts without " +
    "unbinding the global ones. Click into the text field to see the input filter at work.</p>";
  ctx.el.appendChild(host);

  /* ---- a small visual keyboard ---- */
  var ROWS = [
    ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", "/", "↑"],
    ["Ctrl", "Alt", "Meta", "Space", "←", "↓", "→"]
  ];
  var CODES = {
    Esc: 27, Enter: 13, Shift: 16, Ctrl: 17, Alt: 18, Meta: 91, Space: 32,
    "/": 191, "←": 37, "↑": 38, "→": 39, "↓": 40
  };
  function codeOf(label) {
    if (CODES[label] != null) return CODES[label];
    return label.charCodeAt(0);
  }

  var kbCard = ctx.mk("div");
  kbCard.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
    ";border-radius:12px;padding:16px;margin-bottom:14px";
  ctx.el.appendChild(kbCard);
  var keys = {};
  ROWS.forEach(function (row) {
    var r = ctx.mk("div");
    r.style.cssText = "display:flex;gap:6px;margin-bottom:6px;justify-content:center";
    row.forEach(function (label) {
      var k = ctx.mk("div");
      k.style.cssText = "flex:" + (label.length > 2 ? "0 0 74px" : "0 0 42px") +
        ";height:38px;display:flex;align-items:center;justify-content:center;border-radius:7px;" +
        "border:1px solid " + T.line + ";background:" + T.sunk + ";color:" + T.ink2 +
        ";font:600 11.5px " + T.mono + ";transition:background .08s,color .08s";
      k.textContent = label;
      r.appendChild(k);
      keys[codeOf(label)] = k;
    });
    kbCard.appendChild(r);
  });

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

  var bindCard = panel(colA, "BOUND SHORTCUTS", "The row flashes when its handler runs.");
  var bindHost = ctx.mk("div");
  bindCard.appendChild(bindHost);

  var inputCard = panel(colA, "THE INPUT FILTER",
    "By default hotkeys ignores keystrokes inside form fields. Toggle the filter and try " +
    "<code>ctrl+s</code> while typing.");
  var field = ctx.mk("input");
  field.type = "text";
  field.placeholder = "type here, then press ctrl+s…";
  field.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line +
    ";border-radius:8px;padding:10px 13px;color:" + T.ink + ";font:500 13px " + T.sans + ";outline:none";
  inputCard.appendChild(field);

  var logCard = panel(colB, "EVENT LOG", "");
  var logHost = ctx.mk("div");
  logHost.style.cssText = "font:500 11.5px " + T.mono + ";line-height:1.9;color:" + T.ink2 +
    ";background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:8px;padding:9px 12px;" +
    "height:250px;overflow:auto";
  logCard.appendChild(logHost);
  function say(html, colour) {
    var row = ctx.mk("div");
    row.innerHTML = '<span style="color:' + T.muted + '">› </span><span style="color:' +
      (colour || T.ink2) + '">' + html + "</span>";
    logHost.insertBefore(row, logHost.firstChild);
    while (logHost.children.length > 50) logHost.removeChild(logHost.lastChild);
  }

  var out = ctx.readout("press something");

  /* ---- bindings, per scope ---- */
  var BINDINGS = [
    { keys: "ctrl+s, command+s", scope: "all", what: "Save the document" },
    { keys: "ctrl+k, command+k", scope: "all", what: "Open the command palette" },
    { keys: "ctrl+b, command+b", scope: "editor", what: "Bold — editor only" },
    { keys: "ctrl+b, command+b", scope: "browse", what: "Toggle the sidebar — browse only" },
    { keys: "shift+/", scope: "all", what: "Show help (?)" },
    { keys: "up, down, left, right", scope: "all", what: "Move the selection" },
    { keys: "g g", scope: "all", what: "Not a sequence — hotkeys fires on each g" },
    { keys: "esc", scope: "all", what: "Cancel" }
  ];

  function drawBindings(active) {
    bindHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>keys</th><th>scope</th>' +
      "<th>action</th></tr></thead><tbody>" + BINDINGS.map(function (b, i) {
        return '<tr data-i="' + i + '" style="opacity:' +
          (b.scope === "all" || b.scope === active ? "1" : ".4") + '">' +
          "<td><code>" + ctx.esc(b.keys) + "</code></td><td><code>" + b.scope +
          "</code></td><td>" + ctx.esc(b.what) + "</td></tr>";
      }).join("") + "</tbody></table>";
  }

  var scope = "editor";
  drawBindings(scope);

  function flash(i) {
    var row = bindHost.querySelector('[data-i="' + i + '"]');
    if (!row) return;
    row.style.background = T.accent;
    ctx.after(200, function () { row.style.background = ""; });
  }

  BINDINGS.forEach(function (b, i) {
    hotkeys(b.keys, b.scope === "all" ? { scope: "all" } : { scope: b.scope }, function (e, handler) {
      e.preventDefault();
      flash(i);
      say("<b>" + ctx.esc(handler.key) + "</b> in scope <b>" + handler.scope + "</b> → " +
        ctx.esc(b.what), T.yes);
      out("fired <b>" + ctx.esc(handler.key) + "</b> — " + ctx.esc(b.what));
      return false;
    });
  });
  hotkeys.setScope(scope);
  ctx.onDestroy(function () {
    BINDINGS.forEach(function (b) { hotkeys.unbind(b.keys, b.scope === "all" ? "all" : b.scope); });
    hotkeys.setScope("all");
    hotkeys.filter = function (event) {
      var t = event.target || event.srcElement;
      var tag = t.tagName;
      return !(t.isContentEditable || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA");
    };
  });

  /* Paint the keyboard from whatever is physically held down. */
  function paint() {
    var down = hotkeys.getPressedKeyCodes();
    Object.keys(keys).forEach(function (code) {
      var on = down.indexOf(+code) >= 0;
      keys[code].style.background = on ? T.accent : T.sunk;
      keys[code].style.color = on ? (T.dark ? "#0b0e14" : "#fff") : T.ink2;
      keys[code].style.borderColor = on ? T.accent : T.line;
    });
    if (down.length) {
      out("held: <b>" + hotkeys.getPressedKeyString().join(" + ") + "</b> — scope <b>" +
        hotkeys.getScope() + "</b>");
    }
  }
  ctx.on(document, "keydown", paint, true);
  ctx.on(document, "keyup", function () { ctx.after(0, paint); }, true);
  ctx.on(window, "blur", function () { ctx.after(0, paint); });

  ctx.select("scope", ["editor", "browse"], function (v) {
    scope = v;
    hotkeys.setScope(v);
    drawBindings(v);
    say("setScope(<b>" + v + "</b>) — ctrl+b now means something else", T.part);
  }, "editor");
  ctx.check("filter form fields", true, function (v) {
    hotkeys.filter = v
      ? function (event) {
          var t = event.target || event.srcElement, tag = t.tagName;
          return !(t.isContentEditable || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA");
        }
      : function () { return true; };
    say("filter " + (v ? "on — typing in a field is ignored" : "off — shortcuts fire everywhere"),
      T.part);
  });
  ctx.btn("Fire ctrl+k programmatically", function () { hotkeys.trigger("ctrl+k", "all"); }, true);
  ctx.btn("Clear log", function () { logHost.innerHTML = ""; });

  say("bound <b>" + BINDINGS.length + "</b> shortcuts — scope is <b>editor</b>", T.part);
};

})();
