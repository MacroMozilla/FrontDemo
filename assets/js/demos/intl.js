/* Internationalisation, dates, durations and time zones. */
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

/* --------------------------------------------------------------- i18next */
B.i18next = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Plurals are not a switch on <code>n === 1</code></p>' +
    '<p class="demo-p">Switch the language. English has two plural forms, Polish has four and Arabic ' +
    "has six — i18next asks <code>Intl.PluralRules</code> which one applies and picks the matching key, " +
    "so the same call site works everywhere. Drag the count slider to watch the forms change.</p>";
  ctx.el.appendChild(host);

  var LANGS = [
    { id: "en", name: "English", dir: "ltr" },
    { id: "de", name: "Deutsch", dir: "ltr" },
    { id: "fr", name: "Français", dir: "ltr" },
    { id: "pl", name: "Polski", dir: "ltr" },
    { id: "ar", name: "العربية", dir: "rtl" }
  ];

  var resources = {
    en: { translation: {
      title: "Shopping basket",
      greeting: "Hello {{name}}, welcome back.",
      item_one: "{{count}} item",
      item_other: "{{count}} items",
      day_one: "{{count}} day left",
      day_other: "{{count}} days left",
      total: "Total: {{amount, currency}}",
      updated: "Last updated {{when, date}}",
      owner_male: "He owns this basket.",
      owner_female: "She owns this basket.",
      owner_other: "They own this basket.",
      summary: "$t(title): $t(item, {\"count\": {{count}} }) — $t(total, {\"amount\": {{amount}} })"
    } },
    de: { translation: {
      title: "Warenkorb",
      greeting: "Hallo {{name}}, willkommen zurück.",
      item_one: "{{count}} Artikel",
      item_other: "{{count}} Artikel",
      day_one: "Noch {{count}} Tag",
      day_other: "Noch {{count}} Tage",
      total: "Gesamt: {{amount, currency}}",
      updated: "Zuletzt aktualisiert {{when, date}}",
      owner_male: "Er besitzt diesen Warenkorb.",
      owner_female: "Sie besitzt diesen Warenkorb.",
      owner_other: "Sie besitzen diesen Warenkorb.",
      summary: "$t(title): $t(item, {\"count\": {{count}} }) — $t(total, {\"amount\": {{amount}} })"
    } },
    fr: { translation: {
      title: "Panier",
      greeting: "Bonjour {{name}}, content de vous revoir.",
      item_one: "{{count}} article",
      item_many: "{{count}} articles",
      item_other: "{{count}} articles",
      day_one: "{{count}} jour restant",
      day_many: "{{count}} jours restants",
      day_other: "{{count}} jours restants",
      total: "Total : {{amount, currency}}",
      updated: "Dernière mise à jour {{when, date}}",
      owner_male: "Il possède ce panier.",
      owner_female: "Elle possède ce panier.",
      owner_other: "Cette personne possède ce panier.",
      summary: "$t(title) : $t(item, {\"count\": {{count}} }) — $t(total, {\"amount\": {{amount}} })"
    } },
    pl: { translation: {
      title: "Koszyk",
      greeting: "Cześć {{name}}, witaj ponownie.",
      item_one: "{{count}} produkt",
      item_few: "{{count}} produkty",
      item_many: "{{count}} produktów",
      item_other: "{{count}} produktu",
      day_one: "Pozostał {{count}} dzień",
      day_few: "Pozostały {{count}} dni",
      day_many: "Pozostało {{count}} dni",
      day_other: "Pozostało {{count}} dnia",
      total: "Razem: {{amount, currency}}",
      updated: "Ostatnia aktualizacja {{when, date}}",
      owner_male: "On jest właścicielem koszyka.",
      owner_female: "Ona jest właścicielką koszyka.",
      owner_other: "Ta osoba jest właścicielem koszyka.",
      summary: "$t(title): $t(item, {\"count\": {{count}} }) — $t(total, {\"amount\": {{amount}} })"
    } },
    ar: { translation: {
      title: "سلة التسوق",
      greeting: "مرحبا {{name}}، أهلا بعودتك.",
      item_zero: "لا توجد عناصر",
      item_one: "عنصر واحد",
      item_two: "عنصران",
      item_few: "{{count}} عناصر",
      item_many: "{{count}} عنصرا",
      item_other: "{{count}} عنصر",
      day_zero: "لم يتبق أي يوم",
      day_one: "بقي يوم واحد",
      day_two: "بقي يومان",
      day_few: "بقيت {{count}} أيام",
      day_many: "بقي {{count}} يوما",
      day_other: "بقي {{count}} يوم",
      total: "المجموع: {{amount, currency}}",
      updated: "آخر تحديث {{when, date}}",
      owner_male: "هو صاحب السلة.",
      owner_female: "هي صاحبة السلة.",
      owner_other: "هذا الشخص صاحب السلة.",
      summary: "$t(title): $t(item, {\"count\": {{count}} }) — $t(total, {\"amount\": {{amount}} })"
    } }
  };

  var CURRENCY = { en: "GBP", de: "EUR", fr: "EUR", pl: "PLN", ar: "AED" };

  var i18n = i18next.createInstance();
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: resources,
    interpolation: {
      escapeValue: false,
      format: function (value, fmt, lng) {
        if (fmt === "currency") {
          return new Intl.NumberFormat(lng, { style: "currency", currency: CURRENCY[lng] || "USD" })
            .format(value);
        }
        if (fmt === "date") {
          return new Intl.DateTimeFormat(lng, { dateStyle: "long", timeStyle: "short" }).format(value);
        }
        return value;
      }
    }
  });

  var c = cols(ctx);
  var outCard = card(ctx, c.a, "RENDERED UI", "Every string below comes from t().");
  var outHost = ctx.mk("div");
  outCard.appendChild(outHost);

  var formsCard = card(ctx, c.a, "PLURAL FORMS FOR THIS LANGUAGE",
    "Which key i18next selects for each count, straight from Intl.PluralRules.");
  var formsHost = ctx.mk("div");
  formsCard.appendChild(formsHost);

  var resCard = card(ctx, c.b, "RESOURCE BUNDLE",
    "The keys that produce the panel on the left. Nothing else is involved.");
  var resHost = ctx.mk("div");
  resCard.appendChild(resHost);

  var out = ctx.readout("");
  var count = 3, gender = "female", name = "Priya";

  function draw() {
    var lng = i18n.language;
    var lang = LANGS.filter(function (l) { return l.id === lng; })[0];
    var t = i18n.t.bind(i18n);
    var amount = count * 12.5 + 4;

    outHost.innerHTML =
      '<div dir="' + lang.dir + '" style="background:' + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:10px;padding:16px 18px;font:400 14px " + T.sans + ";color:" + T.ink2 + '">' +
      '<div style="font:600 17px ' + T.sans + ";color:" + T.ink + ';margin-bottom:10px">' +
        ctx.esc(t("title")) + "</div>" +
      "<p style='margin:0 0 8px'>" + ctx.esc(t("greeting", { name: name })) + "</p>" +
      "<p style='margin:0 0 8px'><b>" + ctx.esc(t("item", { count: count })) + "</b> · " +
        ctx.esc(t("day", { count: count })) + "</p>" +
      "<p style='margin:0 0 8px'>" + ctx.esc(t("total", { amount: amount })) + "</p>" +
      "<p style='margin:0 0 8px'>" + ctx.esc(t("updated", { when: new Date() })) + "</p>" +
      "<p style='margin:0 0 8px'>" + ctx.esc(t("owner", { context: gender })) + "</p>" +
      "<p style='margin:0;color:" + T.muted + ";font-size:12.5px'>" +
        ctx.esc(t("summary", { count: count, amount: amount })) + "</p>" +
      "</div>";

    var pr = new Intl.PluralRules(lng);
    var rows = [0, 1, 2, 3, 5, 11, 21, 101].map(function (n) {
      var cat = pr.select(n);
      var key = "item_" + cat;
      var exists = i18n.exists(key, { lng: lng });
      return "<tr><td><b>" + n + "</b></td><td><code>" + cat + "</code></td><td><code>" +
        (exists ? key : "item_other") + "</code></td><td>" +
        ctx.esc(i18n.t("item", { count: n })) + "</td></tr>";
    }).join("");
    formsHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>count</th><th>category</th>' +
      "<th>key used</th><th>result</th></tr></thead><tbody>" + rows + "</tbody></table>";

    resHost.innerHTML = '<pre class="demo-pre" style="max-height:420px">' +
      ctx.esc(JSON.stringify(resources[lng].translation, null, 2)) + "</pre>";

    out("<b>" + lang.name + "</b> · " + Object.keys(resources[lng].translation).length +
      " keys · " + new Set([0, 1, 2, 3, 5, 11, 21, 101].map(function (n) { return pr.select(n); })).size +
      " plural categories in play");
  }
  draw();

  ctx.select("language", LANGS.map(function (l) { return { v: l.id, t: l.name }; }), function (v) {
    i18n.changeLanguage(v).then(draw);
  }, "en");
  ctx.range("count", { min: 0, max: 120, value: 3 }, function (v) { count = v; draw(); });
  ctx.select("context", ["female", "male", "other"], function (v) { gender = v; draw(); }, "female");
  ctx.text("name", "Priya", function (v) { name = v || "friend"; draw(); }, "90px");
};

/* ----------------------------------------------------------------- Luxon */
B.luxon = async function (ctx) {
  var T = ctx.T;
  var DateTime = luxon.DateTime, Duration = luxon.Duration, Interval = luxon.Interval;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Time zones as a first-class value</p>' +
    '<p class="demo-p">A Luxon <code>DateTime</code> carries its zone with it, so the same instant can ' +
    "be asked what the wall clock says anywhere. The row below is one instant, rendered six ways — and " +
    "the DST table shows the hour that does not exist.</p>";
  ctx.el.appendChild(host);

  var ZONES = [
    ["Pacific/Auckland", "Auckland"], ["Asia/Tokyo", "Tokyo"], ["Asia/Kolkata", "Kolkata"],
    ["Europe/London", "London"], ["America/New_York", "New York"], ["America/Los_Angeles", "Los Angeles"]
  ];

  var clockCard = card(ctx, ctx.el, "ONE INSTANT, SIX ZONES", "Ticking live; drag the offset slider to move it.");
  var clockHost = ctx.mk("div");
  clockHost.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:11px";
  clockCard.appendChild(clockHost);

  var c = cols(ctx);
  var dstCard = card(ctx, c.a, "THE HOUR THAT DOES NOT EXIST",
    "New York's spring-forward: 02:00–02:59 is skipped. Luxon flags the invalid values instead of " +
    "silently sliding them.");
  var dstHost = ctx.mk("div");
  dstCard.appendChild(dstHost);

  var durCard = card(ctx, c.a, "DURATIONS AND INTERVALS",
    "Durations know units; intervals know how to be split.");
  var durHost = ctx.mk("div");
  durCard.appendChild(durHost);

  var relCard = card(ctx, c.b, "RELATIVE AND HUMAN OUTPUT",
    "toRelative() and toLocaleString() both go through Intl, so they follow the locale.");
  var relHost = ctx.mk("div");
  relCard.appendChild(relHost);

  var parseCard = card(ctx, c.b, "PARSING", "Every constructor returns a DateTime, valid or not.");
  var parseHost = ctx.mk("div");
  parseCard.appendChild(parseHost);

  var out = ctx.readout("");
  var offsetHours = 0, locale = "en-GB";

  function drawClocks() {
    var base = DateTime.now().plus({ hours: offsetHours });
    clockHost.innerHTML = ZONES.map(function (z, i) {
      var d = base.setZone(z[0]).setLocale(locale);
      var day = d.toFormat("ccc d LLL");
      return '<div style="background:' + T.sunk + ";border:1px solid " + T.line +
        ";border-top:3px solid " + ctx.series(i) + ';border-radius:10px;padding:12px 14px">' +
        '<div style="font:700 10px ' + T.mono + ";letter-spacing:.1em;color:" + ctx.series(i) +
          ';margin-bottom:6px">' + z[1].toUpperCase() + "</div>" +
        '<div style="font:600 23px ' + T.mono + ";color:" + T.ink + '">' + d.toFormat("HH:mm:ss") + "</div>" +
        '<div style="font:500 11px ' + T.mono + ";color:" + T.muted + ';margin-top:4px">' + day +
          " · UTC" + d.toFormat("ZZ") + (d.isInDST ? " · DST" : "") + "</div></div>";
    }).join("");
    out("offset <b>" + (offsetHours >= 0 ? "+" : "") + offsetHours + " h</b> · " +
      "spread across <b>" + new Set(ZONES.map(function (z) {
        return base.setZone(z[0]).toFormat("ccc d");
      })).size + "</b> calendar days");
  }

  function drawDst() {
    var rows = [];
    for (var m = 0; m < 240; m += 30) {
      var wall = DateTime.fromObject(
        { year: 2026, month: 3, day: 8, hour: 1, minute: 0 },
        { zone: "America/New_York" }).plus({ minutes: m });
      var literal = DateTime.fromObject(
        { year: 2026, month: 3, day: 8, hour: 1 + Math.floor(m / 60), minute: m % 60 },
        { zone: "America/New_York" });
      var skipped = literal.hour !== (1 + Math.floor(m / 60)) % 24;
      rows.push("<tr><td><code>" + String(1 + Math.floor(m / 60)).padStart(2, "0") + ":" +
        String(m % 60).padStart(2, "0") + "</code></td><td>" + wall.toFormat("HH:mm ZZZZ") +
        '</td><td style="color:' + (skipped ? T.bad : T.yes) + ';font-weight:700">' +
        (skipped ? "does not exist" : "real") + "</td></tr>");
    }
    dstHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>asked for</th>' +
      "<th>Luxon returns</th><th></th></tr></thead><tbody>" + rows.join("") + "</tbody></table>";
  }

  function drawDur() {
    var d = Duration.fromObject({ hours: 50, minutes: 135, seconds: 90 });
    var iv = Interval.fromDateTimes(
      DateTime.fromISO("2026-01-01T09:00", { zone: "utc" }),
      DateTime.fromISO("2026-01-01T17:30", { zone: "utc" }));
    var rows = [
      ["Duration.fromObject({h:50, m:135, s:90})", d.toFormat("hh:mm:ss")],
      [".shiftTo('days','hours','minutes')", d.shiftTo("days", "hours", "minutes").toHuman({ maximumFractionDigits: 0 })],
      [".rescale()", d.rescale().toHuman({ maximumFractionDigits: 0 })],
      [".toISO()", d.toISO()],
      ["Interval 09:00 → 17:30 length", iv.toDuration(["hours", "minutes"]).toHuman()],
      [".splitBy({ hours: 2 })", iv.splitBy({ hours: 2 }).map(function (s) {
        return s.start.toFormat("HH:mm");
      }).join(" · ")],
      [".contains(12:00)", String(iv.contains(DateTime.fromISO("2026-01-01T12:00", { zone: "utc" })))],
      ["Interval overlaps lunch 12–13", String(iv.overlaps(Interval.fromDateTimes(
        DateTime.fromISO("2026-01-01T12:00", { zone: "utc" }),
        DateTime.fromISO("2026-01-01T13:00", { zone: "utc" }))))]
    ];
    durHost.innerHTML = '<table class="demo-tbl"><tbody>' + rows.map(function (r) {
      return "<tr><td><code>" + ctx.esc(r[0]) + "</code></td><td>" + ctx.esc(r[1]) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function drawRel() {
    var now = DateTime.now().setLocale(locale);
    var samples = [
      ["45 seconds ago", now.minus({ seconds: 45 })],
      ["3 hours ago", now.minus({ hours: 3 })],
      ["yesterday", now.minus({ days: 1 })],
      ["in 2 weeks", now.plus({ weeks: 2 })],
      ["in 8 months", now.plus({ months: 8 })]
    ];
    var rows = samples.map(function (s) {
      return "<tr><td>" + s[0] + "</td><td><b>" + ctx.esc(s[1].toRelative()) + "</b></td><td>" +
        ctx.esc(s[1].toRelativeCalendar() || "—") + "</td></tr>";
    }).join("");
    var fmts = [
      ["DATE_FULL", luxon.DateTime.DATE_FULL],
      ["DATETIME_MED", luxon.DateTime.DATETIME_MED],
      ["DATETIME_HUGE", luxon.DateTime.DATETIME_HUGE]
    ].map(function (f) {
      return "<tr><td><code>" + f[0] + "</code></td><td colspan='2'>" +
        ctx.esc(now.toLocaleString(f[1])) + "</td></tr>";
    }).join("");
    relHost.innerHTML = '<table class="demo-tbl"><thead><tr><th>instant</th><th>toRelative()</th>' +
      "<th>calendar</th></tr></thead><tbody>" + rows + fmts + "</tbody></table>";
  }

  function drawParse() {
    var cases = [
      ["fromISO('2026-08-02T14:30+02:00')", DateTime.fromISO("2026-08-02T14:30+02:00")],
      ["fromISO('2026-W31-7')", DateTime.fromISO("2026-W31-7")],
      ["fromFormat('02/08/2026', 'dd/MM/yyyy')", DateTime.fromFormat("02/08/2026", "dd/MM/yyyy")],
      ["fromHTTP('Sun, 02 Aug 2026 12:00:00 GMT')", DateTime.fromHTTP("Sun, 02 Aug 2026 12:00:00 GMT")],
      ["fromSeconds(1785000000)", DateTime.fromSeconds(1785000000)],
      ["fromISO('2026-02-30')  ← invalid", DateTime.fromISO("2026-02-30")],
      ["fromFormat('nope', 'yyyy')  ← invalid", DateTime.fromFormat("nope", "yyyy")]
    ];
    parseHost.innerHTML = '<table class="demo-tbl"><tbody>' + cases.map(function (c2) {
      var d = c2[1];
      return "<tr><td><code>" + ctx.esc(c2[0]) + '</code></td><td style="color:' +
        (d.isValid ? T.ink2 : T.bad) + '">' +
        ctx.esc(d.isValid ? d.setLocale(locale).toISO({ suppressMilliseconds: true }) :
          d.invalidReason + " — " + d.invalidExplanation) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function drawAll() { drawClocks(); drawDst(); drawDur(); drawRel(); drawParse(); }
  drawAll();
  ctx.every(1000, drawClocks);

  ctx.range("offset", { min: -24, max: 24, value: 0, fmt: function (v) { return (v >= 0 ? "+" : "") + v + "h"; } },
    function (v) { offsetHours = v; drawClocks(); });
  ctx.select("locale", ["en-GB", "en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"], function (v) {
    locale = v; drawAll();
  }, "en-GB");
  ctx.btn("Jump to the DST switch", function () {
    var target = DateTime.fromObject({ year: 2026, month: 3, day: 8, hour: 1, minute: 55 },
      { zone: "America/New_York" });
    offsetHours = Math.round(target.diff(DateTime.now(), "hours").hours);
    drawClocks();
  }, true);
};

/* -------------------------------------------------------------- date-fns */
B.datefns = async function (ctx) {
  var T = ctx.T;
  var fns = DateFns;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">200 small functions instead of one big object</p>' +
    '<p class="demo-p">Everything here is a plain <code>Date</code> in and a plain <code>Date</code> ' +
    "out — nothing is wrapped or mutated. Pick a date on the calendar and every panel recomputes from it.</p>";
  ctx.el.appendChild(host);

  var c = cols(ctx);
  var calCard = card(ctx, c.a, "A MONTH BUILT FROM eachDayOfInterval()",
    "Click a day. Weekends and days outside the month come from isWeekend / isSameMonth.");
  var calHost = ctx.mk("div");
  calCard.appendChild(calHost);

  var distCard = card(ctx, c.a, "HUMAN DISTANCES", "");
  var distHost = ctx.mk("div");
  distCard.appendChild(distHost);

  var mathCard = card(ctx, c.b, "DATE ARITHMETIC", "Every row is one exported function.");
  var mathHost = ctx.mk("div");
  mathCard.appendChild(mathHost);

  var fmtCard = card(ctx, c.b, "FORMAT TOKENS", "");
  var fmtHost = ctx.mk("div");
  fmtCard.appendChild(fmtHost);

  var out = ctx.readout("");
  var selected = new Date();
  var cursor = new Date();

  function drawCal() {
    var start = fns.startOfWeek(fns.startOfMonth(cursor), { weekStartsOn: 1 });
    var end = fns.endOfWeek(fns.endOfMonth(cursor), { weekStartsOn: 1 });
    var days = fns.eachDayOfInterval({ start: start, end: end });
    var wd = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    calHost.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
      '<button data-nav="-1" type="button" style="background:' + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:7px;color:" + T.ink2 + ";padding:4px 10px;cursor:pointer;font:600 12px " + T.sans + '">‹</button>' +
      '<div style="font:600 13.5px ' + T.sans + ";color:" + T.ink + '">' +
        fns.format(cursor, "LLLL yyyy") + "</div>" +
      '<button data-nav="1" type="button" style="background:' + T.sunk + ";border:1px solid " + T.line +
        ";border-radius:7px;color:" + T.ink2 + ";padding:4px 10px;cursor:pointer;font:600 12px " + T.sans + '">›</button>' +
      "</div>" +
      '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">' +
      wd.map(function (d) {
        return '<div style="text-align:center;font:700 9.5px ' + T.mono + ";color:" + T.muted +
          ';padding:4px 0">' + d + "</div>";
      }).join("") +
      days.map(function (d) {
        var inMonth = fns.isSameMonth(d, cursor);
        var isSel = fns.isSameDay(d, selected);
        var isToday = fns.isToday(d);
        var we = fns.isWeekend(d);
        return '<button type="button" data-day="' + d.getTime() + '" style="' +
          "border-radius:8px;padding:7px 0;cursor:pointer;font:600 12px " + T.sans + ";" +
          "background:" + (isSel ? T.accent : inMonth ? T.sunk : "transparent") + ";" +
          "border:1px solid " + (isToday ? T.accent : isSel ? T.accent : T.line) + ";" +
          "color:" + (isSel ? (T.dark ? "#0b0e14" : "#fff") : !inMonth ? T.muted : we ? T.part : T.ink) +
          '">' + fns.format(d, "d") + "</button>";
      }).join("") + "</div>";

    calHost.querySelectorAll("[data-nav]").forEach(function (b) {
      b.addEventListener("click", function () {
        cursor = fns.addMonths(cursor, +b.dataset.nav);
        drawCal();
      });
    });
    calHost.querySelectorAll("[data-day]").forEach(function (b) {
      b.addEventListener("click", function () {
        selected = new Date(+b.dataset.day);
        cursor = selected;
        drawAll();
      });
    });
  }

  function rows(host, list) {
    host.innerHTML = '<table class="demo-tbl"><tbody>' + list.map(function (r) {
      return "<tr><td><code>" + ctx.esc(r[0]) + "</code></td><td>" + ctx.esc(String(r[1])) + "</td></tr>";
    }).join("") + "</tbody></table>";
  }

  function drawRest() {
    var now = new Date();
    var d = selected;

    rows(distHost, [
      ["formatDistance(selected, now)", fns.formatDistance(d, now, { addSuffix: true })],
      ["formatDistanceStrict(…)", fns.formatDistanceStrict(d, now, { addSuffix: true })],
      ["formatRelative(selected, now)", fns.formatRelative(d, now)],
      ["intlFormatDistance(…)", fns.intlFormatDistance(d, now)],
      ["differenceInCalendarDays", fns.differenceInCalendarDays(d, now)],
      ["differenceInBusinessDays", fns.differenceInBusinessDays(d, now)],
      ["differenceInCalendarWeeks", fns.differenceInCalendarWeeks(d, now)]
    ]);

    rows(mathHost, [
      ["addDays(selected, 45)", fns.format(fns.addDays(d, 45), "EEE d LLL yyyy")],
      ["addBusinessDays(selected, 10)", fns.format(fns.addBusinessDays(d, 10), "EEE d LLL yyyy")],
      ["nextFriday(selected)", fns.format(fns.nextFriday(d), "EEE d LLL yyyy")],
      ["lastDayOfQuarter(selected)", fns.format(fns.lastDayOfQuarter(d), "EEE d LLL yyyy")],
      ["startOfWeek(selected, {weekStartsOn:1})", fns.format(fns.startOfWeek(d, { weekStartsOn: 1 }), "EEE d LLL")],
      ["getWeek / getISOWeek", fns.getWeek(d) + " / " + fns.getISOWeek(d)],
      ["getDaysInMonth", fns.getDaysInMonth(d)],
      ["isLeapYear", String(fns.isLeapYear(d))],
      ["roundToNearestMinutes(now, {n:15})", fns.format(fns.roundToNearestMinutes(now, { nearestTo: 15 }), "HH:mm")]
    ]);

    rows(fmtHost, [
      ["yyyy-MM-dd'T'HH:mm:ssXXX", fns.format(d, "yyyy-MM-dd'T'HH:mm:ssXXX")],
      ["EEEE, do MMMM yyyy", fns.format(d, "EEEE, do MMMM yyyy")],
      ["qqq QQQQ", fns.format(d, "qqq QQQQ")],
      ["'week' II 'of' RRRR", fns.format(d, "'week' II 'of' RRRR")],
      ["formatISO9075", fns.formatISO9075(d)],
      ["formatRFC7231", fns.formatRFC7231(d)],
      ["parseISO round-trip", fns.isEqual(fns.parseISO(fns.formatISO(d)), fns.startOfSecond(d))
        ? "identical to the second" : "differs"]
    ]);

    out("selected <b>" + fns.format(d, "EEE d LLL yyyy") + "</b> · " +
      fns.formatDistance(d, now, { addSuffix: true }) + " · week <b>" + fns.getISOWeek(d) + "</b>");
  }

  function drawAll() { drawCal(); drawRest(); }
  drawAll();

  ctx.btn("Today", function () { selected = cursor = new Date(); drawAll(); }, true);
  ctx.btn("+90 days", function () { selected = fns.addDays(selected, 90); cursor = selected; drawAll(); });
  ctx.btn("Last day of the quarter", function () {
    selected = fns.lastDayOfQuarter(selected); cursor = selected; drawAll();
  });
  ctx.btn("A year ago", function () { selected = fns.subYears(selected, 1); cursor = selected; drawAll(); });
};

})();
