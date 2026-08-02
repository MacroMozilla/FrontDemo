/* Frameworks and runtimes — four different answers to "how do I render UI?". */
(function () {
"use strict";
var B = window.B;

/* ----------------------------------------------------------------- Preact */
B.preact = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var h = htm.bind(preact.h);
  var useState = preactHooks.useState, useMemo = preactHooks.useMemo, useEffect = preactHooks.useEffect;

  function App() {
    var a = useState([
      { id: 1, text: "Read the Preact docs", done: true },
      { id: 2, text: "Swap react for preact/compat", done: false },
      { id: 3, text: "Measure the bundle again", done: false }
    ]);
    var items = a[0], setItems = a[1];
    var b = useState("");
    var draft = b[0], setDraft = b[1];
    var c = useState("all");
    var filter = c[0], setFilter = c[1];
    var d = useState(0);
    var renders = d[0], setRenders = d[1];

    useEffect(function () { setRenders(function (n) { return n + 1; }); }, [items, filter]);

    var shown = useMemo(function () {
      return items.filter(function (i) {
        return filter === "all" || (filter === "done") === i.done;
      });
    }, [items, filter]);

    function toggle(id) {
      setItems(items.map(function (i) { return i.id === id ? Object.assign({}, i, { done: !i.done }) : i; }));
    }
    function add(e) {
      e.preventDefault();
      if (!draft.trim()) return;
      setItems(items.concat([{ id: Date.now(), text: draft.trim(), done: false }]));
      setDraft("");
    }

    /* htm gives JSX-like syntax with no build step — tagged templates only. */
    return h`
      <div>
        <p class="demo-h">A component with hooks, no build step</p>
        <p class="demo-p">This is <code>preact</code> + <code>htm</code> in a plain script tag.
          Same hooks, same mental model as React, in 3 KB gzipped.</p>

        <form onSubmit=${add} style="display:flex;gap:8px;margin:12px 0">
          <input value=${draft} onInput=${function (e) { setDraft(e.target.value); }}
                 placeholder="Add an item…"
                 style="flex:1;background:${T.sunk};border:1px solid ${T.line};border-radius:7px;
                        padding:7px 11px;color:${T.ink};font:inherit;font-size:13px" />
          <button type="submit"
                  style="background:${T.accent};border:0;border-radius:7px;padding:7px 16px;
                         color:${T.dark ? "#0b0e14" : "#fff"};font:600 13px ${T.sans};cursor:pointer">Add</button>
        </form>

        <div style="display:flex;gap:6px;margin-bottom:10px">
          ${["all", "open", "done"].map(function (f) {
            return h`<button onClick=${function () { setFilter(f); }}
              style="background:${filter === f ? T.accent : T.sunk};border:1px solid ${filter === f ? T.accent : T.line};
                     color:${filter === f ? (T.dark ? "#0b0e14" : "#fff") : T.ink2};border-radius:16px;
                     padding:3px 13px;font:12px ${T.sans};cursor:pointer">${f}</button>`;
          })}
        </div>

        <div class="demo-cards">
          ${shown.map(function (i) {
            return h`<div class="demo-card" key=${i.id} onClick=${function () { toggle(i.id); }}
                          style="cursor:pointer;opacity:${i.done ? .55 : 1}">
              <b style="text-decoration:${i.done ? "line-through" : "none"}">${i.text}</b>
              <span class="sub">${i.done ? "done" : "open"} · click to toggle</span>
            </div>`;
          })}
        </div>

        <dl class="kv" style="margin-top:16px">
          <dt>items</dt><dd>${items.length}</dd>
          <dt>shown</dt><dd>${shown.length}</dd>
          <dt>renders</dt><dd><b>${renders}</b></dd>
          <dt>preact</dt><dd>${preact.options ? "10.x" : "?"} · 11 KB unminified here</dd>
        </dl>
      </div>`;
  }

  preact.render(h`<${App} />`, ctx.el);
  ctx.onDestroy(function () { preact.render(null, ctx.el); });
  ctx.readout("hooks, memoisation and effects — the React API surface at a fraction of the size");
};

/* --------------------------------------------------------------- Alpine.js */
B.alpine = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var MARKUP =
'<div x-data="{ open: false, tab: \'sizes\', qty: 1, price: 24, size: \'M\', sizes: [\'S\',\'M\',\'L\',\'XL\'] }">\n' +
'  <button @click="open = !open" x-text="open ? \'Hide details\' : \'Show details\'"></button>\n' +
'\n' +
'  <div x-show="open" x-transition>\n' +
'    <template x-for="s in sizes" :key="s">\n' +
'      <button @click="size = s" :class="size === s && \'on\'" x-text="s"></button>\n' +
'    </template>\n' +
'\n' +
'    <input type="number" min="1" max="9" x-model.number="qty">\n' +
'    <p>Total: <b x-text="\'$\' + (qty * price).toFixed(2)"></b></p>\n' +
'  </div>\n' +
'</div>';

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Reactivity declared in HTML attributes</p>' +
    '<p class="demo-p">There is no component file and no build step. Everything below is driven by ' +
    "<code>x-data</code>, <code>x-show</code>, <code>x-for</code> and <code>x-model</code> on plain markup.</p>" +

    '<div class="demo-colbox" style="max-width:420px" ' +
      "x-data=\"{ open: true, qty: 1, price: 24, size: 'M', sizes: ['S','M','L','XL'] }\">" +
      '<button @click="open = !open" ' +
        'style="background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;padding:5px 12px;' +
        "color:" + T.ink2 + ';font:inherit;font-size:12.5px;cursor:pointer" ' +
        "x-text=\"open ? 'Hide details' : 'Show details'\"></button>" +

      '<div x-show="open" x-transition style="margin-top:14px">' +
        '<div class="demo-note" style="margin-bottom:6px">size</div>' +
        '<div style="display:flex;gap:6px;margin-bottom:14px">' +
          '<template x-for="s in sizes" :key="s">' +
            '<button @click="size = s" x-text="s" ' +
              ":style=\"size === s ? 'background:" + T.accent + ";color:" + (T.dark ? "#0b0e14" : "#fff") +
              ";border-color:" + T.accent + "' : ''\" " +
              'style="background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;' +
              "width:40px;padding:5px 0;color:" + T.ink2 + ';font:inherit;font-size:12.5px;cursor:pointer"></button>' +
          "</template>" +
        "</div>" +

        '<div class="demo-note" style="margin-bottom:6px">quantity</div>' +
        '<input type="number" min="1" max="9" x-model.number="qty" ' +
          'style="width:80px;background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;' +
          "padding:6px 10px;color:" + T.ink + ';font:inherit">' +

        '<dl class="kv" style="margin-top:16px">' +
          "<dt>size</dt><dd x-text=\"size\"></dd>" +
          "<dt>quantity</dt><dd x-text=\"qty\"></dd>" +
          "<dt>total</dt><dd><b x-text=\"'$' + (qty * price).toFixed(2)\"></b></dd>" +
        "</dl>" +
      "</div>" +
    "</div>" +

    '<p class="demo-h" style="margin-top:20px">The markup that does it</p>' +
    '<pre class="demo-pre" id="alpine-src"></pre>' +
    '<p class="demo-note">This scales beautifully up to about the complexity you see here, and then ' +
    "stops scaling — logic lives in attributes, so it cannot be tested or reused.</p>";
  ctx.el.appendChild(host);
  host.querySelector("#alpine-src").textContent = MARKUP;

  /* Alpine only scans on start; this subtree arrived afterwards. */
  if (window.Alpine && window.Alpine.initTree) {
    if (!window.Alpine.version || !window.__alpineStarted) {
      window.__alpineStarted = true;
      window.Alpine.start();
    } else {
      window.Alpine.initTree(host);
    }
  }
  ctx.readout("no component file, no bundler — reactivity attached to server-rendered markup");
};

/* -------------------------------------------------------------------- Lit */
B.lit = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var LitElement = Lit.LitElement, html = Lit.html, css = Lit.css;

  /* Define once; custom elements are global, so guard against re-entry. */
  if (!customElements.get("fd-meter")) {
    customElements.define("fd-meter", class extends LitElement {
      static properties = { label: {}, value: { type: Number }, max: { type: Number }, accent: {} };
      static styles = css`
        :host { display: block; margin-bottom: 14px; font-family: inherit; }
        .row { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; }
        .name { font-weight: 600; }
        .val { font-family: ui-monospace, monospace; opacity: .75; }
        .track { height: 9px; border-radius: 5px; background: rgba(128,128,128,.24); overflow: hidden; }
        .fill { height: 100%; border-radius: 5px; transition: width .45s cubic-bezier(.2,.8,.2,1); }
        button { margin-top: 7px; font: inherit; font-size: 11.5px; cursor: pointer;
                 background: transparent; border: 1px solid currentColor; opacity: .6;
                 border-radius: 6px; padding: 2px 9px; color: inherit; }
        button:hover { opacity: 1; }
      `;
      constructor() { super(); this.value = 0; this.max = 100; this.label = ""; this.accent = "#6EA8FE"; }
      render() {
        const pct = Math.round((this.value / this.max) * 100);
        return html`
          <div class="row"><span class="name">${this.label}</span><span class="val">${pct}%</span></div>
          <div class="track"><div class="fill" style="width:${pct}%;background:${this.accent}"></div></div>
          <button @click=${() => { this.value = Math.round(Math.random() * this.max); }}>randomise</button>
        `;
      }
    });
  }

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Real custom elements</p>' +
    '<p class="demo-p">Each meter below is a <code>&lt;fd-meter&gt;</code> element with its own shadow ' +
    "root. Inspect one and you will find encapsulated styles — and it would work identically inside " +
    "React, Vue, or no framework at all.</p><div id=\"lit-host\"></div>" +
    '<p class="demo-h" style="margin-top:18px">Reflected attributes</p>' +
    '<pre class="demo-pre" id="lit-dom"></pre>';
  ctx.el.appendChild(host);

  var mount = host.querySelector("#lit-host");
  var METRICS = [["Bundle size", 34], ["First paint", 68], ["Interaction", 82], ["Accessibility", 91]];
  METRICS.forEach(function (m, i) {
    var el = document.createElement("fd-meter");
    el.label = m[0];
    el.value = m[1];
    el.accent = ctx.series(i);
    mount.appendChild(el);
  });

  var out = ctx.readout("");
  function dump() {
    host.querySelector("#lit-dom").textContent =
      [].map.call(mount.children, function (el) {
        return '<fd-meter label="' + el.label + '" value="' + el.value + '"> #shadow-root';
      }).join("\n");
    out("<b>" + mount.children.length + "</b> custom elements, each with its own shadow root");
  }
  dump();

  ctx.btn("Randomise all", function () {
    [].forEach.call(mount.children, function (el) { el.value = Math.round(Math.random() * 100); });
    setTimeout(dump, 60);
  }, true);
  ctx.btn("Add a meter", function () {
    var el = document.createElement("fd-meter");
    el.label = "Metric " + (mount.children.length + 1);
    el.value = Math.round(Math.random() * 100);
    el.accent = ctx.series(mount.children.length);
    mount.appendChild(el);
    setTimeout(dump, 60);
  });
};

/* ------------------------------------------------------------------- htmx */
B.htmx = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">The server sends HTML, not JSON</p>' +
    '<p class="demo-p">Each button below issues a real GET and swaps the response into the page. ' +
    "There is no client-side template and nothing is parsed — the response <i>is</i> the markup. " +
    "Watch the request log at the bottom.</p>" +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:14px 0">' +
      '<button hx-get="assets/fragments/orders.html" hx-target="#hx-panel" hx-swap="innerHTML" ' +
        'style="background:' + T.accent + ';border:0;border-radius:7px;padding:6px 14px;color:' +
        (ctx.dark ? "#0b0e14" : "#fff") + ';font:600 12.5px ' + T.sans + ';cursor:pointer">Load orders</button>' +
      '<button hx-get="assets/fragments/detail.html" hx-target="#hx-panel" hx-swap="innerHTML" ' +
        'style="background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;padding:6px 14px;color:' +
        T.ink2 + ';font:12.5px ' + T.sans + ';cursor:pointer">Order detail</button>' +
      '<button hx-get="assets/fragments/stats.html" hx-target="#hx-panel" hx-swap="innerHTML" ' +
        'style="background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;padding:6px 14px;color:' +
        T.ink2 + ';font:12.5px ' + T.sans + ';cursor:pointer">Stats</button>' +
      '<button hx-get="assets/fragments/orders.html" hx-target="#hx-panel" hx-swap="beforeend" ' +
        'style="background:' + T.sunk + ';border:1px solid ' + T.line + ';border-radius:7px;padding:6px 14px;color:' +
        T.ink2 + ';font:12.5px ' + T.sans + ';cursor:pointer">Append instead of replace</button>' +
    "</div>" +
    '<div id="hx-panel" class="demo-colbox" style="min-height:150px">' +
      '<p class="demo-note">Nothing loaded yet. Press a button.</p></div>' +
    '<p class="demo-h" style="margin-top:18px">Request log</p>' +
    '<div class="demo-log" id="hx-log"><span class="t">waiting…</span></div>';
  ctx.el.appendChild(host);

  var log = host.querySelector("#hx-log"), n = 0;
  function line(msg) {
    var d = ctx.mk("div");
    d.innerHTML = '<span class="t">' + new Date().toLocaleTimeString() + "</span> " + msg;
    if (n === 0) log.innerHTML = "";
    log.insertBefore(d, log.firstChild);
    n++;
    while (log.children.length > 8) log.removeChild(log.lastChild);
  }

  ctx.on(document.body, "htmx:beforeRequest", function (e) {
    line('<span class="m">GET</span> ' + e.detail.requestConfig.path);
  });
  ctx.on(document.body, "htmx:afterSwap", function (e) {
    line("swapped <b>" + e.detail.target.id + "</b> — " +
         (e.detail.xhr ? e.detail.xhr.responseText.length : "?") + " bytes of HTML");
    out("<b>" + n + "</b> request(s) · zero JSON parsed, zero templates rendered");
  });
  ctx.on(document.body, "htmx:responseError", function (e) {
    line('<span style="color:' + T.bad + '">error ' + e.detail.xhr.status + "</span>");
  });

  htmx.process(host);
  var out = ctx.readout("press a button — every response is an HTML fragment");
};


/* ------------------------------------------------------------------ Vue 3 */
B.vue = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  ctx.el.appendChild(host);

  /* A real template string, compiled at runtime — this is the full build,
     which is exactly what you get from a <script> tag on a CDN. */
  var template =
    '<div>' +
    '  <p class="demo-h">Reactivity you never declare</p>' +
    '  <p class="demo-p">There is no dependency array anywhere below. Vue tracks which reactive ' +
    '    values each computed and each render actually read, and re-runs only those. The counters ' +
    '    on the right are incremented inside the computeds themselves, so they show what really ran.</p>' +
    '' +
    '  <div class="demo-cols">' +
    '    <div class="demo-colbox">' +
    '      <div :style="hd">SERVICES</div>' +
    '      <form @submit.prevent="add" style="display:flex;gap:8px;margin-bottom:12px">' +
    '        <input v-model.trim="draft" placeholder="Add a service…" :style="inputStyle">' +
    '        <button type="submit" :style="btn(true)">Add</button>' +
    '      </form>' +
    '      <div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">' +
    '        <button v-for="f in filters" :key="f" @click="filter = f" :style="chip(filter === f)">{{ f }}</button>' +
    '      </div>' +
    '      <transition-group name="fd" tag="div">' +
    '        <div v-for="s in shown" :key="s.id" :style="rowStyle(s)">' +
    '          <span style="width:7px;height:7px;border-radius:50%" :style="{background: colour(s)}"></span>' +
    '          <span style="flex:1 1 auto">{{ s.name }}</span>' +
    '          <input type="range" min="0" max="100" v-model.number="s.load" style="width:88px">' +
    '          <span :style="pct">{{ s.load }}%</span>' +
    '          <button @click="remove(s.id)" :style="x">&times;</button>' +
    '        </div>' +
    '      </transition-group>' +
    '      <p v-if="!shown.length" class="demo-note">Nothing matches that filter.</p>' +
    '    </div>' +
    '' +
    '    <div class="demo-colbox">' +
    '      <div :style="hd">DERIVED STATE</div>' +
    '      <dl class="kv">' +
    '        <dt>services</dt><dd>{{ services.length }}</dd>' +
    '        <dt>shown</dt><dd>{{ shown.length }}</dd>' +
    '        <dt>average load</dt><dd><b>{{ average }}%</b></dd>' +
    '        <dt>over 80%</dt><dd :style="{color: hot.length ? bad : ink}"><b>{{ hot.length }}</b></dd>' +
    '        <dt>status</dt><dd>{{ headline }}</dd>' +
    '      </dl>' +
    '      <div :style="hd" style="margin-top:16px">WHAT ACTUALLY RE-RAN</div>' +
    '      <dl class="kv">' +
    '        <dt>shown computed</dt><dd><b>{{ runs.shown }}</b></dd>' +
    '        <dt>average computed</dt><dd><b>{{ runs.average }}</b></dd>' +
    '        <dt>headline computed</dt><dd><b>{{ runs.headline }}</b></dd>' +
    '        <dt>watch(filter)</dt><dd><b>{{ runs.watch }}</b></dd>' +
    '      </dl>' +
    '      <p class="demo-note">Drag a load slider: <code>average</code> and <code>headline</code> ' +
    '        re-run, but <code>shown</code> does not unless the filter would change. Nobody wrote ' +
    '        that rule — it falls out of what each computed read last time.</p>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  var ref = Vue.ref, reactive = Vue.reactive, computed = Vue.computed, watch = Vue.watch;

  var app = Vue.createApp({
    template: template,
    setup: function () {
      var services = reactive([
        { id: 1, name: "Deploy pipeline", load: 34 },
        { id: 2, name: "Search index", load: 91 },
        { id: 3, name: "Billing export", load: 12 },
        { id: 4, name: "Session cache", load: 67 },
        { id: 5, name: "Webhook relay", load: 88 }
      ]);
      var draft = ref("");
      var filter = ref("all");
      var nextId = ref(6);
      /* Deliberately NOT reactive: these are written from inside the computeds,
         and a reactive counter read by the template would re-trigger the very
         render that incremented it. */
      var runs = { shown: 0, average: 0, headline: 0, watch: 0 };

      var shown = computed(function () {
        runs.shown++;
        if (filter.value === "all") return services;
        if (filter.value === "busy") return services.filter(function (s) { return s.load >= 60; });
        return services.filter(function (s) { return s.load < 60; });
      });
      var average = computed(function () {
        runs.average++;
        if (!services.length) return 0;
        return Math.round(services.reduce(function (a, s) { return a + s.load; }, 0) / services.length);
      });
      var hot = computed(function () {
        return services.filter(function (s) { return s.load > 80; });
      });
      var headline = computed(function () {
        runs.headline++;
        return hot.value.length ? hot.value.length + " service(s) running hot" : "all within budget";
      });
      watch(filter, function (v, old) { runs.watch++; });

      return {
        services: services, draft: draft, filter: filter, runs: runs,
        shown: shown, average: average, hot: hot, headline: headline,
        filters: ["all", "busy", "idle"],
        bad: T.bad, ink: T.ink,
        hd: "font:700 9.5px " + T.mono + ";letter-spacing:.14em;color:" + T.muted + ";margin-bottom:10px",
        pct: "font:600 10.5px " + T.mono + ";color:" + T.muted + ";width:38px;text-align:right",
        x: "background:none;border:0;color:" + T.muted + ";cursor:pointer;font-size:16px;line-height:1",
        inputStyle: "flex:1;background:" + T.sunk + ";border:1px solid " + T.line +
          ";border-radius:7px;padding:7px 11px;color:" + T.ink + ";font:inherit;font-size:13px",
        btn: function (primary) {
          return "background:" + (primary ? T.accent : T.sunk) + ";border:1px solid " +
            (primary ? T.accent : T.line) + ";border-radius:7px;padding:7px 15px;color:" +
            (primary ? (T.dark ? "#0b0e14" : "#fff") : T.ink2) + ";font:600 13px " + T.sans + ";cursor:pointer";
        },
        chip: function (on) {
          return "background:" + (on ? T.accent : T.sunk) + ";border:1px solid " +
            (on ? T.accent : T.line) + ";color:" + (on ? (T.dark ? "#0b0e14" : "#fff") : T.ink2) +
            ";border-radius:16px;padding:3px 13px;font:12px " + T.sans + ";cursor:pointer";
        },
        colour: function (s) { return s.load > 80 ? T.bad : s.load > 60 ? T.part : T.yes; },
        rowStyle: function (s) {
          return "display:flex;align-items:center;gap:10px;padding:9px 11px;margin-bottom:7px;" +
            "background:" + T.panel + ";border:1px solid " + T.line + ";border-radius:9px;" +
            "font:500 12.5px " + T.sans + ";color:" + T.ink2 + ";transition:all .25s";
        },
        add: function () {
          if (!draft.value) return;
          services.push({ id: nextId.value++, name: draft.value, load: Math.round(Math.random() * 100) });
          draft.value = "";
        },
        remove: function (id) {
          var i = services.findIndex(function (s) { return s.id === id; });
          if (i >= 0) services.splice(i, 1);
        }
      };
    }
  });

  var style = ctx.mk("style");
  style.textContent =
    ".fd-enter-from,.fd-leave-to{opacity:0;transform:translateX(-14px)}" +
    ".fd-enter-active,.fd-leave-active{transition:all .25s ease}" +
    ".fd-leave-active{position:absolute}" +
    ".fd-move{transition:transform .25s ease}";
  ctx.el.appendChild(style);

  app.mount(host);
  ctx.onDestroy(function () { app.unmount(); });
  ctx.readout("Vue " + Vue.version + " · full build, runtime template compilation, no bundler");
};

/* ------------------------------------------------------------------ React */
B.react = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var h = React.createElement;
  var useState = React.useState, useMemo = React.useMemo, useCallback = React.useCallback,
      useEffect = React.useEffect, useRef = React.useRef, memo = React.memo;

  /* Two identical rows: one memoised, one not. The counters are the point. */
  var renderCount = { plain: 0, memo: 0, app: 0, filtered: 0 };
  /* The toolbar lives outside React, so the component publishes its actions here. */
  var api = {};

  function RowBody(props) {
    return h("div", {
      style: {
        display: "flex", alignItems: "center", gap: "10px", padding: "9px 11px",
        marginBottom: "7px", background: T.panel, border: "1px solid " + T.line,
        borderRadius: "9px", font: "500 12.5px " + T.sans, color: T.ink2
      }
    },
      h("span", { style: { width: "7px", height: "7px", borderRadius: "50%",
        background: props.item.load > 80 ? T.bad : props.item.load > 60 ? T.part : T.yes } }),
      h("span", { style: { flex: "1 1 auto" } }, props.item.name),
      h("span", { style: { font: "600 10.5px " + T.mono, color: T.muted } }, props.item.load + "%"),
      h("button", {
        onClick: function () { props.onBump(props.item.id); },
        style: { background: T.sunk, border: "1px solid " + T.line, borderRadius: "6px",
          color: T.ink2, cursor: "pointer", font: "600 11px " + T.mono, padding: "3px 9px" }
      }, "+10"));
  }

  function PlainRow(props) { renderCount.plain++; return h(RowBody, props); }
  var MemoRow = memo(function MemoRowInner(props) { renderCount.memo++; return h(RowBody, props); });

  function App() {
    renderCount.app++;
    var s1 = useState([
      { id: 1, name: "Deploy pipeline", load: 34 },
      { id: 2, name: "Search index", load: 91 },
      { id: 3, name: "Billing export", load: 12 },
      { id: 4, name: "Session cache", load: 67 }
    ]);
    var items = s1[0], setItems = s1[1];
    var s2 = useState("");
    var query = s2[0], setQuery = s2[1];
    var s3 = useState(0);
    var tick = s3[0], setTick = s3[1];
    var s4 = useState(true);
    var useMemoised = s4[0], setUseMemoised = s4[1];

    /* useCallback keeps the prop identity stable, which is the only reason
       React.memo can bail out at all. */
    var bump = useCallback(function (id) {
      setItems(function (list) {
        return list.map(function (i) {
          return i.id === id ? Object.assign({}, i, { load: Math.min(100, i.load + 10) }) : i;
        });
      });
    }, []);

    var filtered = useMemo(function () {
      renderCount.filtered++;
      var q = query.trim().toLowerCase();
      return q ? items.filter(function (i) { return i.name.toLowerCase().indexOf(q) >= 0; }) : items;
    }, [items, query]);

    useEffect(function () {
      var id = setInterval(function () { setTick(function (t) { return t + 1; }); }, 1000);
      return function () { clearInterval(id); };
    }, []);

    api.toggleMemo = function () { setUseMemoised(function (v) { return !v; }); };
    api.bumpAll = function () {
      setItems(function (list) {
        return list.map(function (i) {
          return Object.assign({}, i, { load: Math.min(100, i.load + 7) });
        });
      });
    };
    api.reset = function () {
      renderCount.plain = renderCount.memo = renderCount.app = renderCount.filtered = 0;
      setItems([
        { id: 1, name: "Deploy pipeline", load: 34 },
        { id: 2, name: "Search index", load: 91 },
        { id: 3, name: "Billing export", load: 12 },
        { id: 4, name: "Session cache", load: 67 }
      ]);
      setQuery("");
    };

    var Row = useMemoised ? MemoRow : PlainRow;

    function kv(label, value) {
      return [h("dt", { key: label + "t" }, label), h("dd", { key: label + "d" }, value)];
    }

    return h("div", null,
      h("p", { className: "demo-h" }, "What memoisation actually saved"),
      h("p", { className: "demo-p", dangerouslySetInnerHTML: { __html:
        "A timer bumps state once a second, so <code>App</code> re-renders whether you touch it or " +
        "not. The row counter below only goes up when a row really re-rendered — switch " +
        "<code>React.memo</code> off and watch it climb four times faster." } }),

      h("div", { className: "demo-cols" },
        h("div", { className: "demo-colbox" },
          h("div", { style: { font: "700 9.5px " + T.mono, letterSpacing: ".14em",
            color: T.muted, marginBottom: "10px" } }, "SERVICES"),
          h("input", {
            value: query,
            placeholder: "Filter…",
            onChange: function (e) { setQuery(e.target.value); },
            style: { width: "100%", background: T.sunk, border: "1px solid " + T.line,
              borderRadius: "7px", padding: "8px 11px", color: T.ink, font: "500 13px " + T.sans,
              outline: "none", marginBottom: "12px" }
          }),
          filtered.map(function (it) {
            return h(Row, { key: it.id, item: it, onBump: bump });
          }),
          filtered.length === 0 && h("p", { className: "demo-note" }, "Nothing matches that.")),

        h("div", { className: "demo-colbox" },
          h("div", { style: { font: "700 9.5px " + T.mono, letterSpacing: ".14em",
            color: T.muted, marginBottom: "10px" } }, "RENDER COUNTERS"),
          h("dl", { className: "kv" },
            kv("seconds elapsed", tick),
            kv("<App> renders", renderCount.app),
            kv("useMemo body ran", renderCount.filtered),
            kv("memoised rows rendered", h("b", null, renderCount.memo)),
            kv("plain rows rendered", h("b", null, renderCount.plain)),
            kv("memo active", useMemoised ? "yes" : "no")),
          h("p", { className: "demo-note", dangerouslySetInnerHTML: { __html:
            "<code>useMemo</code> keeps the filtered array identical across renders, and " +
            "<code>useCallback</code> keeps <code>onBump</code> identical. Without both, " +
            "<code>React.memo</code> would compare new objects every time and never bail out." } }),
          h("button", {
            onClick: function () { setUseMemoised(!useMemoised); },
            style: { background: useMemoised ? T.accent : T.sunk,
              border: "1px solid " + (useMemoised ? T.accent : T.line), borderRadius: "8px",
              padding: "8px 14px", color: useMemoised ? (T.dark ? "#0b0e14" : "#fff") : T.ink2,
              font: "600 12.5px " + T.sans, cursor: "pointer", marginTop: "10px" }
          }, useMemoised ? "React.memo is on — turn it off" : "React.memo is off — turn it on"))));
  }

  var root = ReactDOM.createRoot(ctx.el);
  root.render(h(App));
  ctx.onDestroy(function () { root.unmount(); });

  ctx.btn("Toggle React.memo", function () { api.toggleMemo(); }, true);
  ctx.btn("Bump every row", function () { api.bumpAll(); });
  ctx.btn("Reset the counters", function () { api.reset(); });
  ctx.label("React " + React.version + " · createElement, no JSX and no build step");
};

/* ----------------------------------------------------------------- jQuery */
B.jquery = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Both columns run. Compare the lengths.</p>' +
    '<p class="demo-p">Each row runs the jQuery call on the left target and the platform equivalent ' +
    "on the right one, then reports what each returned. Most of them are now the same length — that " +
    "is the story of the last fifteen years of the DOM API, and the reason jQuery stopped growing.</p>";
  ctx.el.appendChild(host);

  var demoBox = ctx.mk("div");
  demoBox.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px";
  ctx.el.appendChild(demoBox);

  function target(label, colour) {
    var box = ctx.mk("div");
    box.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
      ";border-top:3px solid " + colour + ";border-radius:12px;padding:14px 16px";
    box.innerHTML = '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + colour +
      ';margin-bottom:10px">' + label + "</div>" +
      '<div class="fd-panel">' +
      '  <p class="fd-p">A paragraph.</p>' +
      '  <p class="fd-p fd-flag">A flagged paragraph.</p>' +
      '  <ul class="fd-list"><li>alpha</li><li>beta</li><li>gamma</li></ul>' +
      '  <button class="fd-btn" type="button">Click me</button>' +
      '  <div class="fd-out"></div>' +
      "</div>";
    demoBox.appendChild(box);
    return box;
  }
  var jqBox = target("jQuery " + $.fn.jquery, ctx.series(2));
  var vanBox = target("PLATFORM", ctx.series(1));

  var style = ctx.mk("style");
  style.textContent =
    ".fd-p{margin:0 0 7px;font:400 13px " + T.sans + ";color:" + T.ink2 + "}" +
    ".fd-flag{font-weight:600}" +
    ".fd-list{margin:0 0 10px;padding-left:20px;font:400 12.5px " + T.sans + ";color:" + T.ink2 + "}" +
    ".fd-btn{background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:7px;padding:6px 13px;" +
      "color:" + T.ink2 + ";font:600 12px " + T.sans + ";cursor:pointer}" +
    ".fd-out{margin-top:10px;font:500 11.5px " + T.mono + ";color:" + T.muted + ";min-height:20px}" +
    ".fd-hit{background:" + (T.dark ? "rgba(110,168,254,.18)" : "rgba(44,100,227,.12)") +
      ";border-radius:4px}";
  ctx.el.appendChild(style);

  var tableCard = ctx.mk("div");
  tableCard.style.cssText = "background:" + T.panel + ";border:1px solid " + T.line +
    ";border-radius:12px;padding:14px 16px";
  ctx.el.appendChild(tableCard);
  var tableHost = ctx.mk("div");
  tableCard.appendChild(tableHost);

  var out = ctx.readout("");

  var ROWS = [
    { what: "Select every flagged paragraph",
      jq: "$('.fd-flag', root).length",
      van: "root.querySelectorAll('.fd-flag').length",
      runJq: function (r) { return $(".fd-flag", r).length; },
      runVan: function (r) { return r.querySelectorAll(".fd-flag").length; } },
    { what: "Add a class",
      jq: "$('.fd-p', root).addClass('fd-hit')",
      van: "root.querySelectorAll('.fd-p').forEach(n => n.classList.add('fd-hit'))",
      runJq: function (r) { $(".fd-p", r).addClass("fd-hit"); return "3 elements"; },
      runVan: function (r) {
        r.querySelectorAll(".fd-p").forEach(function (n) { n.classList.add("fd-hit"); });
        return "3 elements";
      } },
    { what: "Set text",
      jq: "$('.fd-out', root).text('hello')",
      van: "root.querySelector('.fd-out').textContent = 'hello'",
      runJq: function (r) { $(".fd-out", r).text("set by jQuery"); return "ok"; },
      runVan: function (r) { r.querySelector(".fd-out").textContent = "set by textContent"; return "ok"; } },
    { what: "Append an element",
      jq: "$('.fd-list', root).append('<li>delta</li>')",
      van: "root.querySelector('.fd-list').insertAdjacentHTML('beforeend', '<li>delta</li>')",
      runJq: function (r) { $(".fd-list", r).append("<li>delta</li>"); return "4 items"; },
      runVan: function (r) {
        r.querySelector(".fd-list").insertAdjacentHTML("beforeend", "<li>delta</li>");
        return "4 items";
      } },
    { what: "Closest ancestor",
      jq: "$('.fd-btn', root).closest('.fd-panel').length",
      van: "root.querySelector('.fd-btn').closest('.fd-panel') !== null",
      runJq: function (r) { return $(".fd-btn", r).closest(".fd-panel").length; },
      runVan: function (r) { return r.querySelector(".fd-btn").closest(".fd-panel") !== null; } },
    { what: "Delegated click handler",
      jq: "$(root).on('click', '.fd-btn', fn)",
      van: "root.addEventListener('click', e => { if (e.target.closest('.fd-btn')) fn() })",
      runJq: function (r) {
        $(r).off("click.fd").on("click.fd", ".fd-btn", function () {
          $(".fd-out", r).text("jQuery delegated click at " + new Date().toLocaleTimeString());
        });
        return "bound";
      },
      runVan: function (r) {
        r.addEventListener("click", function (e) {
          if (e.target.closest(".fd-btn")) {
            r.querySelector(".fd-out").textContent =
              "native delegated click at " + new Date().toLocaleTimeString();
          }
        });
        return "bound";
      } },
    { what: "Fade out over 400 ms",
      jq: "$('.fd-list', root).fadeOut(400).fadeIn(400)",
      van: "el.animate([{opacity:1},{opacity:0},{opacity:1}], 800)",
      runJq: function (r) { $(".fd-list", r).fadeOut(400).fadeIn(400); return "animating"; },
      runVan: function (r) {
        r.querySelector(".fd-list").animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], 800);
        return "animating";
      } },
    { what: "Fetch JSON",
      jq: "$.getJSON(url)",
      van: "fetch(url).then(r => r.json())",
      runJq: function () { return "both are one line now"; },
      runVan: function () { return "both are one line now"; } }
  ];

  function draw(results) {
    tableHost.innerHTML =
      '<div style="font:700 9.5px ' + T.mono + ";letter-spacing:.14em;color:" + T.muted +
        ';margin-bottom:10px">SIDE BY SIDE</div>' +
      '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
      '<colgroup><col style="width:170px"><col><col><col style="width:150px"></colgroup>' +
      "<thead><tr><th>task</th><th>jQuery</th><th>platform</th><th>returned</th></tr></thead><tbody>" +
      ROWS.map(function (r, i) {
        var res = results && results[i];
        return "<tr><td>" + ctx.esc(r.what) + '</td><td><code style="font-size:11px;color:' +
          ctx.series(2) + '">' + ctx.esc(r.jq) + '</code><div style="color:' + T.muted +
          ';font:500 10px ' + T.mono + ';margin-top:2px">' + r.jq.length + ' chars</div></td>' +
          '<td><code style="font-size:11px;color:' + ctx.series(1) + '">' + ctx.esc(r.van) +
          '</code><div style="color:' + T.muted + ";font:500 10px " + T.mono + ';margin-top:2px">' +
          r.van.length + " chars</div></td><td>" +
          (res ? '<div style="color:' + ctx.series(2) + ';font:500 11px ' + T.mono + '">' +
            ctx.esc(String(res[0])) + '</div><div style="color:' + ctx.series(1) + ";font:500 11px " +
            T.mono + '">' + ctx.esc(String(res[1])) + "</div>" : "—") + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  draw(null);

  function runAll() {
    var results = ROWS.map(function (r) {
      var a, b;
      try { a = r.runJq(jqBox); } catch (e) { a = "error"; }
      try { b = r.runVan(vanBox); } catch (e) { b = "error"; }
      return [a, b];
    });
    draw(results);
    var jqChars = ROWS.reduce(function (a, r) { return a + r.jq.length; }, 0);
    var vanChars = ROWS.reduce(function (a, r) { return a + r.van.length; }, 0);
    out("<b>" + jqChars + "</b> characters of jQuery versus <b>" + vanChars +
      "</b> of platform API — for <b>85 KB</b> of download");
  }
  runAll();

  ctx.btn("Run every row again", runAll, true);
  ctx.btn("Reset both panels", function () {
    demoBox.innerHTML = "";
    jqBox = target("jQuery " + $.fn.jquery, ctx.series(2));
    vanBox = target("PLATFORM", ctx.series(1));
    draw(null);
    out("panels reset");
  });
  ctx.label("both panels are live — click either button");
};

})();
