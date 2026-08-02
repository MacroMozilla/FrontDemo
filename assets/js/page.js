(function(){
"use strict";
var CATS=window.CATS, CAPS=window.CAPS, LIBS=window.LIBS, MK=window.MK;
var B=window.B={}, RS=window.RS={};
// 单页版的页面逻辑。被 one.js 原样嵌进 IIFE，能直接用外面定义的
// CATS / CAPS / LIBS / MK / B / RS。
// 两级筛选：① 领域（多选，不选=全部） ② 能力（多选，全部要满足）—— 表格和 demo 同时收窄。

var pickedCap = {}, pickedCat = {};

// ── 表头 ──
var thead = document.getElementById("thead");
thead.innerHTML = '<th class="nm">方案 · 推荐度</th><th class="pc">优点 / 缺点</th>'
  + CAPS.map(function(c){ return '<th data-cap="' + c[0] + '">' + c[1] + '</th>'; }).join("");

function stars(n){
  return '<span class="st on">' + "★".repeat(n) + '</span><span class="st off">' + "★".repeat(5 - n) + '</span>';
}

// ── 表体：领域分组，组内推荐度降序 ──
var html = "";
CATS.forEach(function(ct){
  var rows = LIBS.filter(function(l){ return l.cat === ct[0]; });
  if (!rows.length) return;
  html += '<tr class="cat" data-cat="' + ct[0] + '"><td colspan="' + (CAPS.length + 2) + '">'
        + ct[1] + '<span class="cnum">' + rows.length + ' 个</span></td></tr>';
  rows.forEach(function(l){
    html += '<tr data-k="' + l.k + '" data-cat="' + l.cat + '">'
      + '<td class="nm"><a class="n" href="#d-' + l.k + '">' + l.n + '</a>'
      + '<span class="p">' + l.pkg + '<br>' + l.pub + ' · ' + l.kb + ' KB</span>'
      + '<span class="rec">' + stars(l.st) + '</span></td>'
      + '<td class="pc"><div class="probox"><span class="pro">' + l.pro + '</span>'
      + '<span class="con">' + l.con + '</span></div></td>'
      + l.c.split(/\s+/).map(function(m, i){
          var d = MK[m] || MK.n;
          return '<td data-cap="' + CAPS[i][0] + '"><span class="mk ' + d[0] + '">' + d[1] + '</span></td>';
        }).join("") + '</tr>';
  });
});
document.getElementById("tbody").innerHTML = html;

// ── ① 领域筛选 ──
var catBox = document.getElementById("cats");
var catCnt = document.createElement("span"); catCnt.className = "cnt"; catBox.appendChild(catCnt);
CATS.forEach(function(ct){
  var n = LIBS.filter(function(l){ return l.cat === ct[0]; }).length;
  if (!n) return;
  var inp = document.createElement("input");
  inp.type = "checkbox"; inp.dataset.cat = ct[0];
  var lab = document.createElement("label");
  lab.className = "cb";
  // 一行要装 13 个，标签用斜杠前的短名；完整名进 title，鼠标停上去能看
  var short = ct[1].split(" / ")[0];
  lab.title = ct[1] + "（" + n + " 个）";
  lab.append(inp, document.createTextNode(short));
  var cn = document.createElement("span");
  cn.className = "cn"; cn.textContent = n;
  lab.appendChild(cn);
  inp.addEventListener("change", function(){ pickedCat[ct[0]] = inp.checked; apply(); });
  catBox.insertBefore(lab, catCnt);
});

// ── ② 能力筛选 ──
var capBox = document.getElementById("caps");
var capCnt = document.createElement("span"); capCnt.className = "cnt"; capBox.appendChild(capCnt);
CAPS.forEach(function(c){
  var inp = document.createElement("input");
  inp.type = "checkbox"; inp.dataset.cap = c[0];
  var lab = document.createElement("label");
  lab.className = "cb";
  lab.append(inp, document.createTextNode(c[1].replace(/<br>/g, "")));
  inp.addEventListener("change", function(){ pickedCap[c[0]] = inp.checked; apply(); });
  capBox.insertBefore(lab, capCnt);
});
var clr = document.createElement("button");
clr.type = "button"; clr.textContent = "全部清空";
clr.addEventListener("click", function(){
  pickedCap = {}; pickedCat = {};
  document.querySelectorAll(".filt input").forEach(function(i){ i.checked = false; });
  apply();
});
capBox.insertBefore(clr, capCnt);

// ── 一排几个 ──
var gridEl = document.getElementById("grid");
var per = document.getElementById("perbtns");
[2, 3, 4, 6].forEach(function(n){
  var b = document.createElement("button");
  b.type = "button"; b.textContent = n;
  if (n === 4) b.className = "on";
  b.addEventListener("click", function(){
    gridEl.style.setProperty("--per", n);
    gridEl.style.setProperty("--h", (n <= 2 ? 400 : n === 3 ? 320 : n === 4 ? 270 : 210) + "px");
    per.querySelectorAll("button").forEach(function(x){ x.classList.toggle("on", x === b); });
    setTimeout(resizeAll, 60);
  });
  per.appendChild(b);
});

// ── demo 卡片上的名次 + 星（顺序跟表格同一个真源）──
LIBS.forEach(function(l, i){
  var d = document.getElementById("d-" + l.k);
  if (!d) return;
  var right = d.querySelector(".lh .right");
  if (right && !right.querySelector(".rank")) {
    var s = document.createElement("span");
    s.className = "rank";
    s.innerHTML = "#" + (i + 1) + " " + stars(l.st);
    right.insertBefore(s, right.firstChild);
  }
});

// ── 筛选：领域和能力都要过 ──
function pass(l){
  // 「只看已选」也走同一条筛选路径，表格和 demo 才会一起收窄
  if (window.__onlyMine && window.__onlyMine() && !window.__isMine(l.k)) return false;
  var anyCat = CATS.some(function(c){ return pickedCat[c[0]]; });
  if (anyCat && !pickedCat[l.cat]) return false;
  var m = l.c.split(/\s+/);
  for (var i = 0; i < CAPS.length; i++) {
    if (!pickedCap[CAPS[i][0]]) continue;
    if (m[i] !== "y" && m[i] !== "p") return false;
  }
  return true;
}
var empty = document.getElementById("empty"), cnt2 = document.getElementById("cnt2");
function apply(){
  var n = 0, perCat = {};
  LIBS.forEach(function(l){
    var ok = pass(l);
    if (ok) { n++; perCat[l.cat] = (perCat[l.cat] || 0) + 1; }
    document.querySelectorAll('tr[data-k="' + l.k + '"]').forEach(function(tr){ tr.hidden = !ok; });
    var d = document.getElementById("d-" + l.k);
    if (d) d.hidden = !ok;
  });
  document.querySelectorAll("tr.cat").forEach(function(tr){ tr.hidden = !perCat[tr.dataset.cat]; });
  document.querySelectorAll("thead th[data-cap]").forEach(function(th){
    th.classList.toggle("on", !!pickedCap[th.dataset.cap]);
  });
  var nCat = CATS.filter(function(c){ return pickedCat[c[0]]; }).length;
  var nCap = CAPS.filter(function(c){ return pickedCap[c[0]]; }).length;
  catCnt.innerHTML = nCat ? '选了 ' + nCat + ' 个领域' : '全部 ' + CATS.length + ' 个领域';
  capCnt.innerHTML = (nCap ? '勾了 ' + nCap + ' 项能力 · ' : '') + '剩 <b>' + n + '</b> / ' + LIBS.length + ' 个方案';
  cnt2.textContent = n + " / " + LIBS.length + " 个";
  empty.hidden = n > 0;
  bootVisible();
}

// ── vendor：gzip+base64，滚到才解压 ──
// 40 MB 的库压到 base64 14.9 MB 才塞得进 16 MB 的单页上限。
// 解压是异步的，所以 need() 返回 Promise，所有 builder 都是 async。
// GitHub Pages 上没有 CSP、也没有单文件上限 —— 库就是普通的 .js，按需 <script> 加载即可。
// （artifact 版那套 gzip+base64+DecompressionStream 是为了塞进 16 MB 单页，这里不需要。）
var loaded = {};
// ⚠ 必须串行：need("vue","vueflow") 里 vueflow 依赖 vue 先就位，
// need("vega","vegalite","vegaembed") 同理。并行加载会让后者先执行 → 缺依赖（实测踩过）。
function need(){
  var ids = [].slice.call(arguments);
  return ids.reduce(function(p, id){ return p.then(function(){ return load(id); }); },
                    Promise.resolve());
}
function load(id){
  if (loaded[id]) return loaded[id];
  loaded[id] = new Promise(function(res, rej){
    var s = document.createElement("script");
    s.src = "vendor/" + id + ".js";
    s.onload = function(){ res(); };
    s.onerror = function(){ rej(new Error("加载不到 vendor/" + id + ".js")); };
    document.head.appendChild(s);
  });
  return loaded[id];
}
window.__need = need;

function fail(k, name, e){
  var el = document.getElementById(k + "-err");
  if (el) { el.textContent = name + " 没跑起来：" + ((e && e.message) || e); el.classList.add("on"); }
  if (window.console) console.error(name, e);
}
var booted = {};
async function boot(k){
  if (booted[k] || !B[k]) return;
  booted[k] = 1;
  var el = document.getElementById(k + "-err");
  if (el) { el.textContent = "解压中…"; el.classList.add("on"); }
  try { await B[k](); if (el) el.classList.remove("on"); }
  catch (e) { fail(k, k, e); }
}
function resizeAll(){
  Object.keys(RS).forEach(function(k){ if (booted[k]) { try { RS[k](); } catch (e) {} } });
}
window.addEventListener("resize", function(){
  clearTimeout(window.__rt); window.__rt = setTimeout(resizeAll, 180);
});

// 只启动"当前可见且没被筛掉"的
var io = null;
function bootVisible(){
  if (!window.IntersectionObserver) { LIBS.forEach(function(l){ boot(l.k); }); return; }
  if (!io) io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (e.isIntersecting && !e.target.hidden) { boot(e.target.id.replace("d-", "")); io.unobserve(e.target); }
    });
  }, { rootMargin: "300px" });
  LIBS.forEach(function(l){
    var el = document.getElementById("d-" + l.k);
    if (el && !el.hidden && !booted[l.k]) io.observe(el);
  });
}

window.__start = function(){ apply(); };

// ── 自己挑：每行一个勾选框，选中整行变蓝，最后一键复制出来 ──────────────
// 跟上面那两排筛选是两回事：筛选是"收窄看什么"，这里是"我看中了哪几个"。
// 选中的会存进 localStorage，刷新还在。
var mine = {};
try { mine = JSON.parse(localStorage.getItem("wm-picked") || "{}"); } catch (e) { mine = {}; }

function saveMine(){ try { localStorage.setItem("wm-picked", JSON.stringify(mine)); } catch (e) {} }

function markRow(k){
  var on = !!mine[k];
  document.querySelectorAll('tr[data-k="' + k + '"]').forEach(function(tr){
    tr.classList.toggle("picked", on);
    var box = tr.querySelector('td.sel input');
    if (box) box.checked = on;
  });
  var d = document.getElementById("d-" + k);
  if (d) d.classList.toggle("picked", on);
}

function pickedList(){
  return LIBS.filter(function(l){ return mine[l.k]; });
}

function renderBar(){
  var ls = pickedList();
  bar.hidden = ls.length === 0;
  if (!ls.length) return;
  barNum.textContent = ls.length;
  barNames.textContent = ls.map(function(l){ return l.n; }).join("、");
  barNames.title = ls.map(function(l){ return l.n + "  " + l.pkg; }).join("\n");
}

function togglePick(k, on){
  if (on) mine[k] = 1; else delete mine[k];
  saveMine(); markRow(k); renderBar();
}

// 表格里插勾选列
var thRow = document.getElementById("thead");
var thSel = document.createElement("th");
thSel.className = "sel"; thSel.textContent = "选"; thSel.title = "勾中你看中的方案，最后可以一次复制出来";
thRow.insertBefore(thSel, thRow.firstChild);

document.querySelectorAll("#tbody tr[data-k]").forEach(function(tr){
  var k = tr.dataset.k;
  var td = document.createElement("td");
  td.className = "sel";
  var inp = document.createElement("input");
  inp.type = "checkbox"; inp.checked = !!mine[k];
  inp.title = "选中它";
  inp.addEventListener("click", function(ev){ ev.stopPropagation(); togglePick(k, inp.checked); });
  td.appendChild(inp);
  tr.insertBefore(td, tr.firstChild);
  // 点这一行任何空白处也能选，别逼人非得点中那个小方块
  tr.addEventListener("click", function(ev){
    if (ev.target.closest("a, input, button")) return;
    togglePick(k, !mine[k]);
  });
  if (mine[k]) markRow(k);
});
// 领域分隔行要多跨一列
document.querySelectorAll("#tbody tr.cat td").forEach(function(td){
  td.colSpan = CAPS.length + 3;
});

// ── 已选栏 ──
var bar = document.createElement("div");
bar.className = "picked-bar"; bar.hidden = true;
bar.innerHTML = '已选 <span class="num">0</span> 个：<span class="names"></span>'
  + '<button type="button" class="pri" id="pk-md">复制成表格</button>'
  + '<button type="button" id="pk-txt">复制成清单</button>'
  + '<button type="button" id="pk-only">只看已选</button>'
  + '<button type="button" id="pk-clr">清空</button>'
  + '<span class="ok" id="pk-ok"></span>';
document.querySelector(".tscroll").parentNode.appendChild(bar);
var barNum = bar.querySelector(".num"), barNames = bar.querySelector(".names");
var okTip = bar.querySelector("#pk-ok");

function flash(msg){
  okTip.textContent = msg;
  clearTimeout(window.__okT);
  window.__okT = setTimeout(function(){ okTip.textContent = ""; }, 2200);
}
function copy(text, msg){
  function fallback(){
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    flash(ok ? msg : "复制失败，请手动选中");
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function(){ flash(msg); }, fallback);
  } else fallback();
}

var CAPNAME = CAPS.map(function(c){ return c[1].replace(/<br>/g, ""); });
var MKTXT = { y: "✓", p: "◐", n: "✗", a: "—" };

document.getElementById("pk-md").addEventListener("click", function(){
  var ls = pickedList();
  if (!ls.length) return;
  var head = ["方案", "npm 包", "最后发版", "协议", "体积", "推荐度", "优点", "缺点"].concat(CAPNAME);
  var rows = ls.map(function(l){
    return ["**" + l.n + "**", "`" + l.pkg + "`", l.pub, l.lic, l.kb + " KB",
      "★".repeat(l.st), l.pro, l.con]
      .concat(l.c.split(/\s+/).map(function(m){ return MKTXT[m] || m; }));
  });
  var md = "| " + head.join(" | ") + " |\n| " + head.map(function(){ return "---"; }).join(" | ") + " |\n"
    + rows.map(function(r){ return "| " + r.join(" | ") + " |"; }).join("\n");
  copy(md, "已复制 " + ls.length + " 行 Markdown 表格");
});

document.getElementById("pk-txt").addEventListener("click", function(){
  var ls = pickedList();
  if (!ls.length) return;
  var txt = ls.map(function(l){
    return l.n + "  （" + l.pkg + "）\n"
      + "  推荐度 " + "★".repeat(l.st) + "  ·  " + l.lic + "  ·  最后发版 " + l.pub + "  ·  " + l.kb + " KB\n"
      + "  + " + l.pro + "\n  − " + l.con + "\n"
      + "  npm i " + l.pkg;
  }).join("\n\n");
  copy("我选中的 " + ls.length + " 个前端图形库\n" + "=".repeat(30) + "\n\n" + txt, "已复制 " + ls.length + " 条清单");
});

var onlyMine = false;
document.getElementById("pk-only").addEventListener("click", function(){
  onlyMine = !onlyMine;
  this.classList.toggle("pri", onlyMine);
  this.textContent = onlyMine ? "看全部" : "只看已选";
  apply();
});
document.getElementById("pk-clr").addEventListener("click", function(){
  Object.keys(mine).forEach(function(k){ delete mine[k]; markRow(k); });
  saveMine(); renderBar();
  if (onlyMine) document.getElementById("pk-only").click();
});

window.__onlyMine = function(){ return onlyMine; };
window.__isMine = function(k){ return !!mine[k]; };
renderBar();

window.__afterDemos = function(){ window.__start(); };
})();
