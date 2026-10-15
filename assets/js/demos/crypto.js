/* Hashing, encryption and identifier generation. */
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
function textField(ctx, parent, value, onInput, mono) {
  var T = ctx.T;
  var i = ctx.mk("input");
  i.type = "text";
  i.value = value;
  i.spellcheck = false;
  i.style.cssText = "width:100%;background:" + T.sunk + ";border:1px solid " + T.line +
    ";border-radius:8px;padding:9px 12px;color:" + T.ink + ";font:500 13px " +
    (mono ? T.mono : T.sans) + ";outline:none;margin-bottom:10px";
  i.addEventListener("focus", function () { i.style.borderColor = T.accent; });
  i.addEventListener("blur", function () { i.style.borderColor = T.line; });
  i.addEventListener("input", function () { onInput(i.value); });
  parent.appendChild(i);
  return i;
}
function kvTable(ctx, rows, wrapCol) {
  return '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
    '<colgroup><col style="width:132px"><col></colgroup><tbody>' + rows.map(function (r) {
      return "<tr><td><code>" + ctx.esc(r[0]) + '</code></td><td style="' +
        (wrapCol === false ? "" : "word-break:break-all;font-family:" + ctx.T.mono + ";font-size:11.5px") +
        '">' + r[1] + "</td></tr>";
    }).join("") + "</tbody></table>";
}

/* -------------------------------------------------------------- CryptoJS */
B.cryptojs = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Every digest, live, on one input</p>' +
    '<p class="demo-p">Change a single character and watch all eight digests change completely — that ' +
    "is the avalanche effect. The panel underneath does keyed HMACs, AES round-trips and PBKDF2 key " +
    "stretching, so you can feel what an iteration count actually costs.</p>" +
    '<p class="demo-note" style="margin-top:-4px">For anything security-critical in a modern browser, ' +
    "reach for <code>crypto.subtle</code> first. CryptoJS earns its place when you need a sync API, " +
    "an algorithm WebCrypto omits (MD5, RIPEMD-160, SHA-3) or support for ancient runtimes.</p>";
  ctx.el.appendChild(host);

  var c = cols(ctx);

  var inCard = card(ctx, c.a, "MESSAGE", "");
  var msg = textField(ctx, inCard, "The quick brown fox jumps over the lazy dog", function () { run(); });
  var digestHost = ctx.mk("div");
  inCard.appendChild(digestHost);

  var hmacCard = card(ctx, c.a, "HMAC", "The same message, keyed. Change the key, every digest changes.");
  var keyIn = textField(ctx, hmacCard, "correct horse battery staple", function () { run(); });
  var hmacHost = ctx.mk("div");
  hmacCard.appendChild(hmacHost);

  var aesCard = card(ctx, c.b, "AES ROUND-TRIP",
    "Encrypt with a passphrase, then decrypt with the same one. Change one and the plaintext comes " +
    "back empty rather than wrong.");
  var passIn = textField(ctx, aesCard, "hunter2", function () { run(); });
  var aesHost = ctx.mk("div");
  aesCard.appendChild(aesHost);

  var kdfCard = card(ctx, c.b, "PBKDF2 KEY STRETCHING",
    "The only defence against someone brute-forcing a stolen hash is making each attempt expensive.");
  var kdfHost = ctx.mk("div");
  kdfCard.appendChild(kdfHost);

  var encCard = card(ctx, c.b, "ENCODINGS", "The same bytes, five ways.");
  var encHost = ctx.mk("div");
  encCard.appendChild(encHost);

  var out = ctx.readout("");
  var iterations = 10000;

  var DIGESTS = [
    ["MD5", function (m) { return CryptoJS.MD5(m); }, 128, "broken — collisions are cheap"],
    ["SHA-1", function (m) { return CryptoJS.SHA1(m); }, 160, "broken — do not use for signatures"],
    ["SHA-256", function (m) { return CryptoJS.SHA256(m); }, 256, "the sensible default"],
    ["SHA-512", function (m) { return CryptoJS.SHA512(m); }, 512, "faster than SHA-256 on 64-bit"],
    ["SHA-3", function (m) { return CryptoJS.SHA3(m, { outputLength: 256 }); }, 256, "different construction"],
    ["RIPEMD-160", function (m) { return CryptoJS.RIPEMD160(m); }, 160, "used by Bitcoin addresses"]
  ];

  function chip(hex, bits) {
    /* Colour the digest so the avalanche effect is visible, not just readable. */
    var T2 = ctx.T;
    var spans = [];
    for (var i = 0; i < hex.length; i += 2) {
      var byte = parseInt(hex.substr(i, 2), 16);
      spans.push('<span style="color:' + ctx.series(byte % 8) + '">' + hex.substr(i, 2) + "</span>");
    }
    return spans.join("");
  }

  function run() {
    var m = msg.value;

    digestHost.innerHTML = kvTable(ctx, DIGESTS.map(function (d) {
      var hex = d[1](m).toString();
      return [d[0] + " · " + d[2] + "b", chip(hex) +
        '<div style="color:' + T.muted + ";font-family:" + T.sans + ';font-size:11px;margin-top:2px">' +
        d[3] + "</div>"];
    }));

    hmacHost.innerHTML = kvTable(ctx, [
      ["HMAC-SHA256", chip(CryptoJS.HmacSHA256(m, keyIn.value).toString())],
      ["HMAC-SHA512", chip(CryptoJS.HmacSHA512(m, keyIn.value).toString().slice(0, 64)) + "…"],
      ["HMAC-MD5", chip(CryptoJS.HmacMD5(m, keyIn.value).toString())]
    ]);

    var cipher = CryptoJS.AES.encrypt(m, passIn.value).toString();
    var back = "";
    try { back = CryptoJS.AES.decrypt(cipher, passIn.value).toString(CryptoJS.enc.Utf8); } catch (e) {}
    var wrong = "";
    try {
      wrong = CryptoJS.AES.decrypt(cipher, passIn.value + "x").toString(CryptoJS.enc.Utf8);
    } catch (e) { wrong = ""; }
    aesHost.innerHTML = kvTable(ctx, [
      ["ciphertext", '<span style="color:' + T.part + '">' + ctx.esc(cipher) + "</span>"],
      ["decrypted", '<span style="color:' + T.yes + '">' + ctx.esc(back) + "</span>"],
      ["wrong passphrase", wrong
        ? ctx.esc(wrong)
        : '<span style="color:' + T.bad + '">empty string — the padding check failed</span>'],
      ["salted format", '<span style="color:' + T.muted +
        '">the "Salted__" prefix is OpenSSL\'s; the salt is random each time, so the ciphertext ' +
        "differs on every keystroke even for identical input</span>"]
    ]);

    encHost.innerHTML = kvTable(ctx, [
      ["Utf8 → Base64", CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(m))],
      ["Utf8 → Hex", CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(m)).slice(0, 96) + "…"],
      ["Utf8 → Latin1 bytes", String(CryptoJS.enc.Utf8.parse(m).sigBytes) + " bytes"],
      ["Base64 → Utf8", ctx.esc(CryptoJS.enc.Base64.parse(
        CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(m))).toString(CryptoJS.enc.Utf8))]
    ]);

    out("message is <b>" + m.length + "</b> chars · <b>" +
      CryptoJS.enc.Utf8.parse(m).sigBytes + "</b> bytes");
  }

  function kdf() {
    kdfHost.innerHTML = '<p class="demo-note">deriving…</p>';
    ctx.after(30, function () {
      var salt = CryptoJS.lib.WordArray.random(128 / 8);
      var t0 = performance.now();
      var key = CryptoJS.PBKDF2(passIn.value, salt, { keySize: 256 / 32, iterations: iterations });
      var ms = performance.now() - t0;
      var perSecond = Math.round(1000 / Math.max(ms, 0.01));
      kdfHost.innerHTML = kvTable(ctx, [
        ["iterations", "<b>" + iterations.toLocaleString("en-US") + "</b>"],
        ["salt (random)", salt.toString()],
        ["derived key", chip(key.toString())],
        ["time", "<b>" + ms.toFixed(1) + " ms</b>"],
        ["attacker rate", "≈ <b>" + perSecond.toLocaleString("en-US") +
          "</b> guesses/second on one core of this machine"]
      ]);
    });
  }

  run();
  kdf();

  ctx.select("PBKDF2 iterations", ["1000", "10000", "50000", "200000"], function (v) {
    iterations = +v; kdf();
  }, "10000");
  ctx.btn("Flip one character", function () {
    var s = msg.value;
    var i = Math.floor(s.length / 2);
    msg.value = s.slice(0, i) + (s[i] === "o" ? "0" : "o") + s.slice(i + 1);
    run();
  }, true);
  ctx.btn("Hash 1 MB", function () {
    var big = new Array(1024 * 128).join("abcdefgh");
    var t0 = performance.now();
    CryptoJS.SHA256(big);
    var ms = performance.now() - t0;
    out("SHA-256 over <b>" + (big.length / 1048576).toFixed(2) + " MB</b> in <b>" +
      ms.toFixed(0) + " ms</b> ≈ " + (big.length / 1048576 / (ms / 1000)).toFixed(0) + " MB/s");
  });
};

/* --------------------------------------------------------------- Nano ID */
B.nanoid = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Shorter than a UUID, same collision safety</p>' +
    '<p class="demo-p">Nano ID uses a 64-character URL-safe alphabet instead of hex, so 21 characters ' +
    "carry about as much entropy as a 36-character UUID. Move the sliders and the collision estimate " +
    "below recalculates — that is the number every choice of length really comes down to.</p>";
  ctx.el.appendChild(host);

  var c = cols(ctx);

  var idCard = card(ctx, c.a, "GENERATED IDS", "New batch on every change; each one is crypto-random.");
  var idHost = ctx.mk("div");
  idHost.style.cssText = "font:500 13px " + T.mono + ";line-height:2;color:" + T.ink +
    ";background:" + T.sunk + ";border:1px solid " + T.line + ";border-radius:9px;padding:11px 13px;" +
    "word-break:break-all";
  idCard.appendChild(idHost);

  var alphaCard = card(ctx, c.a, "CUSTOM ALPHABET",
    "Drop look-alike characters, or restrict to digits for a human-readable code.");
  var alphaIn = textField(ctx, alphaCard, "0123456789ABCDEFGHJKMNPQRSTVWXYZ", function () { draw(); }, true);
  var alphaHost = ctx.mk("div");
  alphaHost.style.cssText = "font:500 13px " + T.mono + ";line-height:2;color:" + T.ink2;
  alphaCard.appendChild(alphaHost);

  var mathCard = card(ctx, c.b, "COLLISION MATHS",
    "How long you would have to generate ids at this rate before a 1% chance of any collision.");
  var mathHost = ctx.mk("div");
  mathCard.appendChild(mathHost);

  var cmpCard = card(ctx, c.b, "AGAINST THE ALTERNATIVES", "");
  var cmpHost = ctx.mk("div");
  cmpCard.appendChild(cmpHost);

  var out = ctx.readout("");
  var size = 21, rate = 1000000, count = 8;

  function humanYears(y) {
    if (y < 1) return (y * 365).toFixed(1) + " days";
    if (y < 1e3) return y.toFixed(0) + " years";
    if (y < 1e6) return (y / 1e3).toFixed(1) + " thousand years";
    if (y < 1e9) return (y / 1e6).toFixed(1) + " million years";
    if (y < 1e12) return (y / 1e9).toFixed(1) + " billion years";
    return y.toExponential(2) + " years";
  }
  /* ids needed for a 1% chance of at least one collision, via the birthday
     approximation, kept in log space so 64^21 does not overflow. */
  function idsFor1pc(alphabetSize, len) {
    var lnTotal = len * Math.log(alphabetSize);
    return Math.exp(0.5 * (lnTotal + Math.log(2 * Math.log(1 / 0.99))));
  }
  function bits(alphabetSize, len) { return len * Math.log2(alphabetSize); }

  function draw() {
    var ids = [];
    for (var i = 0; i < count; i++) ids.push(NanoID.nanoid(size));
    idHost.innerHTML = ids.map(function (id) { return ctx.esc(id); }).join("<br>");

    var alphabet = alphaIn.value || NanoID.urlAlphabet;
    var custom = NanoID.customAlphabet(alphabet, size);
    var cids = [];
    for (var j = 0; j < 4; j++) cids.push(custom());
    alphaHost.innerHTML = '<div style="color:' + T.muted + ";font:500 11px " + T.mono +
      ';margin-bottom:5px">' + alphabet.length + " symbols · " +
      bits(alphabet.length, size).toFixed(1) + " bits</div>" +
      cids.map(function (id) { return ctx.esc(id); }).join("<br>");

    var n = idsFor1pc(64, size);
    var years = n / rate / 60 / 60 / 24 / 365;
    var cn = idsFor1pc(Math.max(2, alphabet.length), size);
    var cyears = cn / rate / 60 / 60 / 24 / 365;

    mathHost.innerHTML = kvTable(ctx, [
      ["length", "<b>" + size + "</b> characters"],
      ["alphabet", "<b>64</b> (A-Za-z0-9_-)"],
      ["entropy", "<b>" + bits(64, size).toFixed(0) + "</b> bits"],
      ["ids per second", "<b>" + rate.toLocaleString("en-US") + "</b>"],
      ["1% collision after", '<b style="color:' + T.yes + '">' + humanYears(years) + "</b>"],
      ["with your alphabet", '<b style="color:' + T.part + '">' + humanYears(cyears) + "</b> (" +
        Math.max(2, alphabet.length) + " symbols)"]
    ], false);

    var COMPARE = [
      ["nanoid(" + size + ")", size, bits(64, size)],
      ["nanoid(21) default", 21, bits(64, 21)],
      ["UUID v4", 36, 122],
      ["nanoid(10) short", 10, bits(64, 10)],
      ["6-digit OTP", 6, bits(10, 6)]
    ];
    var maxBits = 128;
    cmpHost.innerHTML = COMPARE.map(function (r, i) {
      return '<div style="margin-bottom:10px">' +
        '<div style="display:flex;justify-content:space-between;font:600 11.5px ' + T.mono + ";color:" +
          T.ink2 + ';margin-bottom:4px"><span>' + r[0] + "</span><span>" + r[1] +
          " chars · " + r[2].toFixed(0) + " bits</span></div>" +
        '<div style="height:9px;border-radius:5px;background:' + T.sunk + '">' +
        '<div style="height:100%;border-radius:5px;width:' + Math.min(100, r[2] / maxBits * 100).toFixed(1) +
          "%;background:" + ctx.series(i) + '"></div></div></div>';
    }).join("");

    out("nanoid(" + size + ") · <b>" + bits(64, size).toFixed(0) + " bits</b> of entropy");
  }
  draw();

  ctx.range("length", { min: 4, max: 36, value: 21 }, function (v) { size = v; draw(); });
  ctx.select("ids per second", [
    { v: "1000", t: "1 thousand" }, { v: "1000000", t: "1 million" },
    { v: "1000000000", t: "1 billion" }
  ], function (v) { rate = +v; draw(); }, "1000000");
  ctx.range("show", { min: 3, max: 20, value: 8 }, function (v) { count = v; draw(); });
  ctx.btn("Digits only", function () { alphaIn.value = "0123456789"; draw(); });
  ctx.btn("New batch", draw, true);
};

/* ------------------------------------------------------------------ uuid */
B.uuid = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");
  ctx.tall();

  var host = ctx.mk("div");
  host.innerHTML = '<p class="demo-h">Seven versions, and only one of them sorts</p>' +
    '<p class="demo-p">v4 is random, so consecutive ids land all over a B-tree index. v7 puts a ' +
    "millisecond timestamp in the high bits, so lexicographic order <i>is</i> chronological order — " +
    "the two tables below are the same ids, sorted as strings.</p>";
  ctx.el.appendChild(host);

  var c = cols(ctx);

  var genCard = card(ctx, c.a, "ONE OF EACH", "Regenerated on demand; v3 and v5 are deterministic.");
  var genHost = ctx.mk("div");
  genCard.appendChild(genHost);

  var sortCard = card(ctx, c.a, "SORTABILITY",
    "Ten ids generated a few milliseconds apart, then sorted as plain strings.");
  var sortHost = ctx.mk("div");
  sortCard.appendChild(sortHost);

  var anatomyCard = card(ctx, c.b, "ANATOMY", "parse() gives you the 16 bytes behind the dashes.");
  var anatomyHost = ctx.mk("div");
  anatomyCard.appendChild(anatomyHost);

  var validCard = card(ctx, c.b, "validate() AND version()",
    "The library will tell you what it is looking at, including when the answer is 'not a UUID'.");
  var validHost = ctx.mk("div");
  validCard.appendChild(validHost);

  var out = ctx.readout("");
  var NS = UUID.v5.URL;

  function mono(s, colour) {
    return '<code style="color:' + (colour || T.ink) + '">' + ctx.esc(s) + "</code>";
  }

  function draw() {
    var rows = [
      ["v1", UUID.v1(), "time + MAC-ish node — leaks a clock, sorts badly (time is byte-swapped)"],
      ["v3", UUID.v3("https://example.com", NS), "MD5 of a name in a namespace — deterministic"],
      ["v4", UUID.v4(), "122 random bits — the default, and the one that fragments indexes"],
      ["v5", UUID.v5("https://example.com", NS), "SHA-1 of a name in a namespace — deterministic"],
      ["v6", UUID.v6(), "v1 with the time fields reordered so it sorts"],
      ["v7", UUID.v7(), "unix ms + random — the one to reach for in a database"],
      ["NIL", UUID.NIL, "all zeroes"],
      ["MAX", UUID.MAX, "all ones"]
    ];
    genHost.innerHTML = '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
      '<colgroup><col style="width:42px"><col></colgroup><tbody>' +
      rows.map(function (r) {
        return "<tr><td><b>" + r[0] + "</b></td><td>" + mono(r[1], T.accent) +
          '<div style="color:' + T.muted + ";font-size:11px;margin-top:3px;font-family:" + T.sans +
          '">' + r[2] + "</div></td></tr>";
      }).join("") + "</tbody></table>";

    var v4s = [], v7s = [];
    for (var i = 0; i < 6; i++) { v4s.push(UUID.v4()); v7s.push(UUID.v7()); }
    var v4sorted = v4s.slice().sort();
    var v7sorted = v7s.slice().sort();
    function inOrder(orig, sorted) {
      return orig.every(function (x, i) { return x === sorted[i]; });
    }
    sortHost.innerHTML =
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      [["v4", v4sorted, inOrder(v4s, v4sorted)], ["v7", v7sorted, inOrder(v7s, v7sorted)]]
        .map(function (col) {
          return "<div>" +
            '<div style="font:700 10px ' + T.mono + ";letter-spacing:.1em;margin-bottom:6px;color:" +
              (col[2] ? T.yes : T.bad) + '">' + col[0] + " — " +
              (col[2] ? "generation order preserved" : "order scrambled") + "</div>" +
            col[1].map(function (id) {
              return '<div style="font:500 10.5px ' + T.mono + ";color:" + T.ink2 +
                ";padding:3px 0;border-bottom:1px solid " + T.line + '">' +
                '<span style="color:' + (col[0] === "v7" ? T.accent : T.muted) + '">' +
                ctx.esc(id.slice(0, 13)) + "</span>" + ctx.esc(id.slice(13)) + "</div>";
            }).join("") + "</div>";
        }).join("") + "</div>" +
      '<p class="demo-note" style="margin:10px 0 0">The highlighted prefix of each v7 is the ' +
      "millisecond timestamp. That is the whole trick.</p>";

    var sample = UUID.v7();
    var bytes = UUID.parse(sample);
    anatomyHost.innerHTML = kvTable(ctx, [
      ["the string", mono(sample, T.accent)],
      ["parse() → bytes", Array.from(bytes).map(function (b, i) {
        return '<span style="color:' + (i < 6 ? T.accent : i < 8 ? T.part : T.muted) + '">' +
          b.toString(16).padStart(2, "0") + "</span>";
      }).join(" ")],
      ["stringify(bytes)", mono(UUID.stringify(bytes), T.yes)],
      ["timestamp", '<b style="color:' + T.accent + '">' +
        new Date(Number((BigInt("0x" + sample.replace(/-/g, "").slice(0, 12))))).toISOString() + "</b>"],
      ["version nibble", "<b>" + sample[14] + "</b> → version " + UUID.version(sample)],
      ["variant bits", "<b>" + sample[19] + "</b> → RFC 9562 variant"]
    ]);

    var CASES = [
      UUID.v4(), UUID.v7(), UUID.NIL, UUID.MAX,
      "not-a-uuid",
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "123e4567-e89b-12d3-a456-426614174000",
      "6ba7b810-9dad-11d1-80b4-00c04fd430cZ"
    ];
    validHost.innerHTML = '<table class="demo-tbl" style="table-layout:fixed;width:100%">' +
      "<thead><tr><th>value</th><th>valid</th><th>version</th></tr></thead><tbody>" +
      CASES.map(function (v) {
        var ok = UUID.validate(v);
        var ver = "—";
        try { ver = ok ? UUID.version(v) : "—"; } catch (e) { ver = "—"; }
        return '<tr><td style="word-break:break-all"><code style="font-size:11px">' + ctx.esc(v) +
          '</code></td><td style="color:' + (ok ? T.yes : T.bad) + ';font-weight:700">' +
          (ok ? "yes" : "no") + "</td><td>" + ver + "</td></tr>";
      }).join("") + "</tbody></table>";

    out("v3 and v5 of the same name are always identical: <b>" +
      (UUID.v5("https://example.com", NS) === UUID.v5("https://example.com", NS) ? "confirmed" : "no") +
      "</b>");
  }
  draw();

  ctx.btn("Generate again", draw, true);
  ctx.btn("Benchmark 100k v4 vs v7", function () {
    var n = 100000, i;
    var t0 = performance.now();
    for (i = 0; i < n; i++) UUID.v4();
    var v4ms = performance.now() - t0;
    var t1 = performance.now();
    for (i = 0; i < n; i++) UUID.v7();
    var v7ms = performance.now() - t1;
    out("100k ids — v4 <b>" + v4ms.toFixed(0) + " ms</b>, v7 <b>" + v7ms.toFixed(0) + " ms</b>");
  });
  ctx.btn("Show the namespace ids", function () {
    anatomyHost.innerHTML = kvTable(ctx, [
      ["v5.DNS", mono(UUID.v5.DNS, T.accent)],
      ["v5.URL", mono(UUID.v5.URL, T.accent)],
      ["v5('example.com', DNS)", mono(UUID.v5("example.com", UUID.v5.DNS), T.yes)],
      ["v5('example.com', URL)", mono(UUID.v5("example.com", UUID.v5.URL), T.yes)],
      ["same name, other namespace", '<span style="color:' + T.muted +
        '">different id — that is the point of a namespace</span>']
    ]);
  });
};

})();
