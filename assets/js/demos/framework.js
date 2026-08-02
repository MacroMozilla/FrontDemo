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

})();
