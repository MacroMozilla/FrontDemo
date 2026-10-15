/* Forms & input controls. */
(function () {
"use strict";
var B = window.B;

/* Shared field styling, so five different libraries sit on one page
   without five different visual languages. */
function field(ctx, parent, label, hint) {
  var T = ctx.T;
  var box = ctx.mk("div");
  box.style.cssText = "margin-bottom:18px;max-width:420px";
  box.innerHTML = '<div class="demo-h" style="margin-bottom:5px">' + ctx.esc(label) + "</div>";
  var slot = ctx.mk("div");
  box.appendChild(slot);
  if (hint) {
    var h = ctx.mk("p", "demo-note", hint);
    h.style.marginTop = "5px";
    box.appendChild(h);
  }
  parent.appendChild(box);
  return slot;
}
function input(ctx, parent, placeholder) {
  var T = ctx.T;
  var i = ctx.mk("input");
  i.type = "text";
  i.placeholder = placeholder || "";
  i.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line +
    ";border-radius:8px;padding:9px 13px;color:" + T.ink + ";font:inherit;font-size:13.5px";
  parent.appendChild(i);
  return i;
}

/* -------------------------------------------------------------- flatpickr */
B.flatpickr = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">One library, four modes</p>' +
    '<p class="demo-p">The same 49 KB covers a single date, a range, several dates at once and a ' +
    "date-time. Click any field.</p>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".flatpickr-calendar{background:" + T.panel + ";border:1px solid " + T.line2 +
      ";box-shadow:0 12px 34px rgba(0,0,0,.4)}" +
    ".flatpickr-months,.flatpickr-weekdays,.flatpickr-weekdaycontainer{background:" + T.panel + "}" +
    ".flatpickr-month,.flatpickr-current-month,.flatpickr-weekday{color:" + T.ink2 + " !important;fill:" + T.ink2 + "}" +
    ".flatpickr-day{color:" + T.ink2 + "}" +
    ".flatpickr-day:hover{background:" + T.sunk + ";border-color:" + T.line + "}" +
    ".flatpickr-day.selected,.flatpickr-day.startRange,.flatpickr-day.endRange{" +
      "background:" + T.accent + ";border-color:" + T.accent + ";color:" + (T.dark ? "#0b0e14" : "#fff") + "}" +
    ".flatpickr-day.inRange{background:" + T.sunk + ";border-color:" + T.sunk + ";box-shadow:none}" +
    ".flatpickr-day.flatpickr-disabled,.flatpickr-day.prevMonthDay,.flatpickr-day.nextMonthDay{color:" + T.muted + "}" +
    ".flatpickr-time input,.flatpickr-time .flatpickr-am-pm{color:" + T.ink + "}" +
    ".flatpickr-time input:hover,.numInputWrapper:hover{background:" + T.sunk + "}" +
    ".flatpickr-monthDropdown-months{background:" + T.panel + ";color:" + T.ink2 + "}";
  ctx.el.appendChild(style);

  var out = ctx.readout("click a field to open its calendar");
  var pickers = [];

  function make(label, hint, opts) {
    var slot = field(ctx, host, label, hint);
    var el = input(ctx, slot, "select…");
    var fp = flatpickr(el, Object.assign({
      onChange: function (dates) {
        out("<b>" + label + "</b> → " + dates.map(function (d) { return d.toISOString().slice(0, 16).replace("T", " "); }).join(", "));
      }
    }, opts));
    pickers.push(fp);
    return fp;
  }

  make("Single date", "the default mode", { defaultDate: "today" });
  make("Date range", "mode: 'range' — one instance, two dates", { mode: "range" });
  make("Multiple dates", "mode: 'multiple' — pick as many as you like", { mode: "multiple" });
  make("Date and time", "enableTime with 15-minute steps", {
    enableTime: true, minuteIncrement: 15, dateFormat: "Y-m-d H:i", defaultDate: "today"
  });
  make("With disabled days", "weekends are rejected by a predicate", {
    disable: [function (d) { return d.getDay() === 0 || d.getDay() === 6; }]
  });

  ctx.onDestroy(function () { pickers.forEach(function (p) { p.destroy(); }); });
  ctx.btn("Open the range picker", function () { pickers[1].open(); }, true);
};

/* ------------------------------------------------------------- Tom Select */
B.tomselect = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">A real &lt;select&gt;, enhanced</p>' +
    '<p class="demo-p">Each control below starts life as a plain select or input. Turn JavaScript off ' +
    "and you still have a working form field — that is the point of progressive enhancement.</p>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".ts-wrapper .ts-control{background:" + T.sunk + ";border-color:" + T.line + ";color:" + T.ink +
      ";border-radius:8px;padding:7px 11px}" +
    ".ts-wrapper.focus .ts-control{border-color:" + T.accent + ";box-shadow:none}" +
    ".ts-dropdown{background:" + T.panel + ";border-color:" + T.line2 + ";color:" + T.ink2 + "}" +
    ".ts-dropdown .active{background:" + T.accent + ";color:" + (T.dark ? "#0b0e14" : "#fff") + "}" +
    ".ts-dropdown .optgroup-header{background:" + T.panel2 + ";color:" + T.muted + "}" +
    ".ts-control > .item{background:" + T.accent + " !important;color:" + (T.dark ? "#0b0e14" : "#fff") +
      " !important;border-radius:5px;padding:1px 7px !important}" +
    ".ts-control input{color:" + T.ink + " !important}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  var instances = [];

  /* 1. Multi-select with tagging */
  var s1 = field(ctx, host, "Skills — type to filter, Enter to create",
                 "create: true lets a value that was never in the list become an option");
  var sel1 = ctx.mk("select");
  sel1.multiple = true;
  ["TypeScript", "Rust", "Go", "Python", "SQL", "CSS", "WebGL", "Elixir"].forEach(function (v) {
    var o = ctx.mk("option", null, v); o.value = v; sel1.appendChild(o);
  });
  s1.appendChild(sel1);
  instances.push(new TomSelect(sel1, {
    plugins: ["remove_button", "drag_drop"],
    create: true, persist: false,
    items: ["TypeScript", "Rust"],
    onChange: function (v) { out("skills → <b>" + (v || []).join(", ") + "</b>"); }
  }));

  /* 2. Grouped single select with a rich render */
  var s2 = field(ctx, host, "Framework — grouped, with descriptions",
                 "optgroups plus a custom render function for each row");
  var sel2 = ctx.mk("select");
  s2.appendChild(sel2);
  instances.push(new TomSelect(sel2, {
    valueField: "id", labelField: "name", searchField: ["name", "desc"],
    optgroupField: "group", optgroups: [
      { value: "spa", label: "Single-page" }, { value: "meta", label: "Meta-frameworks" }
    ],
    options: [
      { id: "react", name: "React", desc: "the default", group: "spa" },
      { id: "vue", name: "Vue", desc: "gentle reactivity", group: "spa" },
      { id: "svelte", name: "Svelte", desc: "compiles away", group: "spa" },
      { id: "next", name: "Next.js", desc: "React, server-first", group: "meta" },
      { id: "nuxt", name: "Nuxt", desc: "Vue, server-first", group: "meta" }
    ],
    render: {
      option: function (d, esc) {
        return '<div style="padding:7px 11px"><b>' + esc(d.name) + "</b>" +
               '<div style="font-size:11px;opacity:.65">' + esc(d.desc) + "</div></div>";
      }
    },
    onChange: function (v) { out("framework → <b>" + v + "</b>"); }
  }));

  /* 3. Free-text tag input on a plain text field */
  var s3 = field(ctx, host, "Tags — a plain text input, comma separated",
                 "the underlying value stays a comma-separated string");
  var inp = input(ctx, s3, "add tags…");
  instances.push(new TomSelect(inp, {
    persist: false, createOnBlur: true, create: true,
    onChange: function (v) { out("tags → <b>" + v + "</b>"); }
  }));

  ctx.onDestroy(function () { instances.forEach(function (i) { i.destroy(); }); });
  ctx.btn("Clear all", function () { instances.forEach(function (i) { i.clear(); }); });
};

/* ------------------------------------------------------------------ IMask */
B.imask = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Masking that survives paste and backspace</p>' +
    '<p class="demo-p">Try pasting <code>4111111111111111</code> into the card field, then put the ' +
    "cursor in the middle and delete a digit. Getting the caret to stay put is the entire difficulty of " +
    "input masking, and it is why people stop writing their own.</p>";
  ctx.el.appendChild(host);

  var out = ctx.readout("");
  var masks = [];

  function make(label, hint, opts, placeholder) {
    var slot = field(ctx, host, label, hint);
    var el = input(ctx, slot, placeholder);
    var m = IMask(el, opts);
    m.on("accept", function () {
      out("<b>" + label + "</b> raw <code>" + (m.unmaskedValue || "∅") + "</code>  ·  shown <code>" +
          (m.value || "∅") + "</code>");
    });
    masks.push(m);
    return m;
  }

  make("Card number", "detects the issuer and regroups as you type",
       { mask: "0000 0000 0000 0000" }, "4111 1111 1111 1111");
  make("Phone (UK)", "a fixed pattern with literals",
       { mask: "+{44} 0000 000000" }, "+44 7700 900000");
  make("Currency", "thousands separators, two decimals, scale-aware",
       { mask: Number, scale: 2, thousandsSeparator: ",", padFractionalZeros: true,
         radix: ".", mapToRadix: [","], min: 0, max: 1000000 }, "1,234.56");
  make("Date", "a composite mask built from three blocks",
       { mask: Date, pattern: "d{/}`m{/}`Y",
         blocks: {
           d: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2 },
           m: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2 },
           Y: { mask: IMask.MaskedRange, from: 1900, to: 2099 }
         } }, "31/12/2026");
  make("IPv4", "four ranges, each 0-255 — invalid octets are refused",
       { mask: "num.num.num.num",
         blocks: { num: { mask: IMask.MaskedRange, from: 0, to: 255 } } }, "192.168.0.1");

  ctx.onDestroy(function () { masks.forEach(function (m) { m.destroy(); }); });
};

/* ------------------------------------------------------------- noUiSlider */
B.nouislider = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Sliders that behave on touch and keyboard</p>' +
    '<p class="demo-p">Tab to a handle and use the arrow keys — the whole control is reachable without ' +
    "a pointer, which is unusual for a custom slider.</p>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".noUi-target{background:" + T.sunk + ";border:1px solid " + T.line + ";box-shadow:none;height:8px}" +
    ".noUi-connect{background:" + T.accent + "}" +
    ".noUi-handle{background:" + T.panel + ";border:2px solid " + T.accent +
      ";box-shadow:0 2px 8px rgba(0,0,0,.35);border-radius:50%;width:20px !important;height:20px !important;" +
      "right:-10px !important;top:-7px !important;cursor:grab}" +
    ".noUi-handle:before,.noUi-handle:after{display:none}" +
    ".noUi-handle:focus{outline:none;border-color:" + T.ink + "}" +
    ".noUi-tooltip{background:" + T.panel + ";border:1px solid " + T.line2 + ";color:" + T.ink +
      ";font:11px " + T.mono + ";padding:2px 7px}" +
    ".noUi-marker{background:" + T.line2 + "}" +
    ".noUi-value{color:" + T.muted + ";font:10px " + T.mono + "}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  var sliders = [];

  function make(label, hint, opts) {
    var slot = field(ctx, host, label, hint);
    slot.style.padding = "14px 12px 34px";
    var el = ctx.mk("div");
    slot.appendChild(el);
    noUiSlider.create(el, opts);
    el.noUiSlider.on("update", function (values) {
      out("<b>" + label + "</b> → " + values.map(function (v) { return Number(v).toFixed(0); }).join(" – "));
    });
    sliders.push(el);
    return el;
  }

  make("Range with two handles", "connect: true fills the span between them", {
    start: [20, 75], connect: true, range: { min: 0, max: 100 }, tooltips: true,
    pips: { mode: "count", values: 5, density: 4 }
  });
  make("Logarithmic scale", "the same pixel distance covers very different values", {
    start: [1000], connect: "lower", tooltips: true,
    range: { min: 1, "50%": 1000, max: 1000000 },
    format: { to: function (v) { return Math.round(v); }, from: Number }
  });
  make("Stepped, three handles", "step: 10 with handles that cannot cross", {
    start: [10, 50, 90], connect: [false, true, true, false], step: 10,
    range: { min: 0, max: 100 }, tooltips: true, margin: 10
  });

  ctx.onDestroy(function () { sliders.forEach(function (s) { s.noUiSlider.destroy(); }); });
};

/* ------------------------------------------------------------------ Pickr */
B.pickr = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">One control, every output format</p>' +
    '<p class="demo-p">Pick a colour on the left and watch all five representations update. The ' +
    "preview block uses the RGBA value directly.</p>" +
    '<div style="display:flex;gap:26px;align-items:flex-start;flex-wrap:wrap">' +
      '<div id="pk-host"></div>' +
      '<div style="flex:1 1 260px;min-width:240px">' +
        '<div id="pk-preview" style="height:76px;border-radius:10px;border:1px solid ' + T.line + ';margin-bottom:14px"></div>' +
        '<dl class="kv" id="pk-out"></dl>' +
      "</div>" +
    "</div>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".pcr-app{background:" + T.panel + ";border:1px solid " + T.line2 + "}" +
    ".pcr-app .pcr-interaction input{background:" + T.sunk + ";color:" + T.ink + ";border:1px solid " + T.line + "}" +
    ".pcr-app .pcr-interaction .pcr-result{color:" + T.ink + "}";
  ctx.el.appendChild(style);

  var pickr = Pickr.create({
    el: host.querySelector("#pk-host"),
    theme: "nano",
    default: ctx.series(0),
    inline: true,
    showAlways: true,
    swatches: [ctx.series(0), ctx.series(1), ctx.series(2), ctx.series(3),
               ctx.series(4), ctx.series(5), "#ffffff", "#111111"],
    components: {
      preview: true, opacity: true, hue: true,
      interaction: { hex: true, rgba: true, hsla: true, input: true }
    }
  });
  ctx.onDestroy(function () { pickr.destroyAndRemove(); });

  var out = ctx.readout("");
  function show(colour) {
    if (!colour) return;
    host.querySelector("#pk-preview").style.background = colour.toRGBA().toString(3);
    host.querySelector("#pk-out").innerHTML =
      "<dt>HEXA</dt><dd>" + colour.toHEXA().toString() + "</dd>" +
      "<dt>RGBA</dt><dd>" + colour.toRGBA().toString(2) + "</dd>" +
      "<dt>HSLA</dt><dd>" + colour.toHSLA().toString(2) + "</dd>" +
      "<dt>HSVA</dt><dd>" + colour.toHSVA().toString(2) + "</dd>" +
      "<dt>CMYK</dt><dd>" + colour.toCMYK().toString(2) + "</dd>";
    out("one picker, <b>five</b> output formats");
  }
  pickr.on("init", function (p) { show(p.getColor()); });
  pickr.on("change", show);
};

})();
