/* Overlays & feedback. */
(function () {
"use strict";
var B = window.B;

function btnStyle(ctx, primary) {
  var T = ctx.T;
  return "background:" + (primary ? T.accent : T.sunk) + ";border:1px solid " +
    (primary ? T.accent : T.line) + ";border-radius:8px;padding:8px 15px;font:600 12.5px " + T.sans +
    ";color:" + (primary ? (T.dark ? "#0b0e14" : "#fff") : T.ink2) + ";cursor:pointer";
}

/* ------------------------------------------------------------ SweetAlert2 */
B.swal = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">alert(), confirm() and prompt(), replaced</p>' +
    '<p class="demo-p">Every one of these returns a promise, traps focus, closes on Escape, and can be ' +
    "themed. The result of whatever you pick appears below.</p>" +
    '<div id="sw-btns" style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px"></div>' +
    '<pre class="demo-pre" id="sw-result">nothing yet</pre>';
  ctx.el.appendChild(host);

  var dark = {
    background: T.panel, color: T.ink,
    customClass: { popup: "fd-swal" }
  };
  var style = ctx.mk("style");
  style.textContent =
    ".fd-swal{border:1px solid " + T.line2 + ";border-radius:12px}" +
    ".swal2-html-container,.swal2-title{color:" + T.ink + " !important}" +
    ".swal2-input,.swal2-textarea,.swal2-select{background:" + T.sunk + " !important;color:" + T.ink +
      " !important;border:1px solid " + T.line + " !important;box-shadow:none !important}" +
    ".swal2-validation-message{background:" + T.sunk + ";color:" + T.bad + "}";
  ctx.el.appendChild(style);

  function show(v) {
    host.querySelector("#sw-result").textContent = JSON.stringify(v, null, 2);
    out("returned <b>" + (v && v.isConfirmed ? "confirmed" : v && v.isDenied ? "denied" : "dismissed") + "</b>");
  }
  var out = ctx.readout("every dialog resolves to a result object");

  var actions = [
    ["Toast", function () {
      Swal.fire(Object.assign({}, dark, {
        toast: true, position: "top-end", icon: "success", title: "Saved",
        showConfirmButton: false, timer: 2200, timerProgressBar: true
      }));
      out("a toast is the same API with toast: true");
    }],
    ["Confirm", function () {
      Swal.fire(Object.assign({}, dark, {
        title: "Delete this project?", text: "This cannot be undone.",
        icon: "warning", showCancelButton: true, confirmButtonColor: T.bad,
        confirmButtonText: "Yes, delete it"
      })).then(show);
    }],
    ["Three-way", function () {
      Swal.fire(Object.assign({}, dark, {
        title: "Unsaved changes", showDenyButton: true, showCancelButton: true,
        confirmButtonText: "Save", denyButtonText: "Discard"
      })).then(show);
    }],
    ["Input with validation", function () {
      Swal.fire(Object.assign({}, dark, {
        title: "What is your email?", input: "email",
        inputPlaceholder: "you@example.com", showCancelButton: true,
        inputValidator: function (v) { return !v ? "An email is required" : null; }
      })).then(show);
    }],
    ["Form (two fields)", function () {
      Swal.fire(Object.assign({}, dark, {
        title: "New API key",
        html: '<input id="sw-a" class="swal2-input" placeholder="name">' +
              '<select id="sw-b" class="swal2-select"><option>read</option><option>write</option></select>',
        focusConfirm: false,
        preConfirm: function () {
          return { name: document.getElementById("sw-a").value,
                   scope: document.getElementById("sw-b").value };
        }
      })).then(show);
    }],
    ["Queue of three", function () {
      Swal.fire(Object.assign({}, dark, { title: "Step 1 of 3", input: "text" }))
        .then(function () { return Swal.fire(Object.assign({}, dark, { title: "Step 2 of 3", input: "text" })); })
        .then(function () { return Swal.fire(Object.assign({}, dark, { title: "Step 3 of 3", icon: "success" })); })
        .then(show);
    }]
  ];
  var box = host.querySelector("#sw-btns");
  actions.forEach(function (a, i) {
    var b = ctx.mk("button", null, a[0]);
    b.type = "button";
    b.style.cssText = btnStyle(ctx, i === 0);
    b.addEventListener("click", a[1]);
    box.appendChild(b);
  });

  ctx.onDestroy(function () { if (window.Swal) Swal.close(); });
};

/* -------------------------------------------------------------- PhotoSwipe */
B.photoswipe = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  /* Generated images, so nothing is fetched. */
  function makeImage(i, w, h) {
    var c = document.createElement("canvas");
    c.width = w; c.height = h;
    var g = c.getContext("2d");
    var grad = g.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, ctx.series(i % 8));
    grad.addColorStop(1, ctx.series((i + 3) % 8));
    g.fillStyle = grad; g.fillRect(0, 0, w, h);
    for (var k = 0; k < 26; k++) {
      g.globalAlpha = .10 + Math.random() * .22;
      g.fillStyle = k % 2 ? "#fff" : "#000";
      g.beginPath();
      g.arc(Math.random() * w, Math.random() * h, 20 + Math.random() * (w / 5), 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    g.fillStyle = "rgba(0,0,0,.45)";
    g.fillRect(0, h - 78, w, 78);
    g.fillStyle = "#fff";
    g.font = "600 34px " + T.sans;
    g.fillText("Image " + (i + 1) + " · " + w + "×" + h, 26, h - 28);
    return c.toDataURL("image/jpeg", 0.85);
  }

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">Click a thumbnail</p>' +
    '<p class="demo-p">Zoom with the wheel or a pinch, drag to pan, swipe down to dismiss. The open and ' +
    "close animate from and back to the thumbnail you clicked.</p>" +
    '<div id="ps-gallery" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px"></div>';
  ctx.el.appendChild(host);

  var gallery = host.querySelector("#ps-gallery");
  var sizes = [[1600, 1067], [1200, 1600], [1800, 1000], [1400, 1400], [1500, 900], [1000, 1500]];
  sizes.forEach(function (s, i) {
    var url = makeImage(i, s[0] / 2, s[1] / 2);
    var a = ctx.mk("a");
    a.href = url;
    a.setAttribute("data-pswp-width", s[0]);
    a.setAttribute("data-pswp-height", s[1]);
    a.target = "_blank";
    a.style.cssText = "display:block;border-radius:10px;overflow:hidden;aspect-ratio:4/3;border:1px solid " + T.line;
    a.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;display:block">';
    gallery.appendChild(a);
  });

  var lightbox = new PhotoSwipeLightbox({
    gallery: "#ps-gallery", children: "a",
    pswpModule: window.PhotoSwipe,
    bgOpacity: .92, padding: { top: 24, bottom: 24, left: 24, right: 24 }
  });
  lightbox.init();
  ctx.onDestroy(function () { lightbox.destroy(); });

  var out = ctx.readout("<b>" + sizes.length + "</b> images · each declares its natural size on the link");
  lightbox.on("change", function () {
    out("slide <b>" + (lightbox.pswp.currIndex + 1) + "</b> of " + sizes.length + " · wheel to zoom, drag to pan");
  });
};

/* -------------------------------------------------------------- Micromodal */
B.micromodal = async function (ctx) {
  var T = ctx.T;
  ctx.mount("scroll pad");

  var host = ctx.mk("div");
  host.innerHTML =
    '<p class="demo-h">The hard part of a modal is the keyboard, not the box</p>' +
    '<p class="demo-p">Open the dialog, then press Tab over and over. Focus cycles inside it and never ' +
    "reaches the page behind. Escape closes it and returns focus to the button you came from. That is " +
    "what the 7 KB buys — the visuals below are this demo's own CSS.</p>" +
    '<button id="mm-open" style="' + btnStyle(ctx, true) + '">Open dialog</button>' +
    '<button id="mm-open2" style="' + btnStyle(ctx, false) + ';margin-left:9px">Open a form dialog</button>' +

    '<div class="fd-modal" id="mm-1" aria-hidden="true">' +
      '<div class="fd-modal__overlay" tabindex="-1" data-micromodal-close>' +
        '<div class="fd-modal__container" role="dialog" aria-modal="true" aria-labelledby="mm-1-title">' +
          '<h2 id="mm-1-title" style="margin-bottom:8px;font-size:17px">Focus is trapped in here</h2>' +
          '<p class="demo-p">Press Tab repeatedly — you will cycle through these three controls and ' +
          "nothing outside. Screen readers see aria-modal and stop announcing the page behind.</p>" +
          '<div style="display:flex;gap:9px;margin-top:14px">' +
            '<button style="' + btnStyle(ctx, false) + '">First</button>' +
            '<button style="' + btnStyle(ctx, false) + '">Second</button>' +
            '<button data-micromodal-close style="' + btnStyle(ctx, true) + '">Close</button>' +
          "</div></div></div></div>" +

    '<div class="fd-modal" id="mm-2" aria-hidden="true">' +
      '<div class="fd-modal__overlay" tabindex="-1" data-micromodal-close>' +
        '<div class="fd-modal__container" role="dialog" aria-modal="true" aria-labelledby="mm-2-title">' +
          '<h2 id="mm-2-title" style="margin-bottom:10px;font-size:17px">Invite a teammate</h2>' +
          '<input placeholder="name@company.com" style="width:100%;background:' + T.sunk +
            ";border:1px solid " + T.line + ";border-radius:8px;padding:9px 12px;color:" + T.ink +
            ';font:inherit;margin-bottom:10px">' +
          '<select style="width:100%;background:' + T.sunk + ";border:1px solid " + T.line +
            ";border-radius:8px;padding:9px 12px;color:" + T.ink + ';font:inherit">' +
            "<option>Viewer</option><option>Editor</option><option>Admin</option></select>" +
          '<div style="display:flex;gap:9px;margin-top:14px;justify-content:flex-end">' +
            '<button data-micromodal-close style="' + btnStyle(ctx, false) + '">Cancel</button>' +
            '<button data-micromodal-close style="' + btnStyle(ctx, true) + '">Send invite</button>' +
          "</div></div></div></div>";
  ctx.el.appendChild(host);

  var style = ctx.mk("style");
  style.textContent =
    ".fd-modal{display:none}.fd-modal.is-open{display:block}" +
    ".fd-modal__overlay{position:fixed;inset:0;background:rgba(4,7,14,.72);display:flex;" +
      "align-items:center;justify-content:center;z-index:200}" +
    ".fd-modal__container{background:" + T.panel + ";border:1px solid " + T.line2 +
      ";border-radius:14px;padding:24px;max-width:440px;width:calc(100% - 40px);" +
      "box-shadow:0 24px 60px rgba(0,0,0,.5)}";
  ctx.el.appendChild(style);

  var out = ctx.readout("");
  MicroModal.init({
    disableScroll: true, awaitCloseAnimation: false,
    onShow: function (m) { out("<b>" + m.id + "</b> open · focus trapped, Escape closes"); },
    onClose: function () { out("closed · focus went back to the trigger"); }
  });
  host.querySelector("#mm-open").addEventListener("click", function () { MicroModal.show("mm-1"); });
  host.querySelector("#mm-open2").addEventListener("click", function () { MicroModal.show("mm-2"); });
  ctx.onDestroy(function () { try { MicroModal.close(); } catch (e) {} });
};

})();
