// 每个库一段 builder。约定：
//   await need("包名")  → 按需加载 vendor/包名.js
//   B[key]              → 构建函数（滚进视野才跑）
//   RS[key]             → 改「一排几个」时重排尺寸
(function(){
"use strict";
var B = window.B, RS = window.RS, need = window.__need;
function fail(k,n,e){ var el=document.getElementById(k+"-err");
  if(el){ el.textContent=n+" 没跑起来："+((e&&e.message)||e); el.classList.add("on"); } }
B["x6"] = async function(){

    await need("x6");
    var m = document.getElementById("x6-m");
    var g = new X6.Graph({ container:m, autoResize:true, background:{color:"#15161B"},
      grid:{ visible:true, type:"dot", args:{color:"#24272E", thickness:1} },
      connecting:{ router:"manhattan", connector:{name:"rounded"}, allowBlank:false,
        createEdge:function(){ return this.createEdge({ attrs:{ line:{ stroke:"#63A6FF", strokeWidth:1.6,
          targetMarker:{name:"block", width:8, height:6} } } }); } } });
    function node(x,y,label){
      return g.addNode({ x:x, y:y, width:96, height:36, label:label, shape:"rect",
        attrs:{ body:{ fill:"#1D2028", stroke:"#3C4250", rx:6, ry:6, strokeWidth:1.2 },
                label:{ fill:"#E9EBEE", fontSize:12 } },
        ports:{ groups:{ g:{ position:"absolute", attrs:{ circle:{ r:4, magnet:true,
          stroke:"#63A6FF", fill:"#15161B", strokeWidth:1.4 } } } },
          items:[{group:"g",args:{x:"50%",y:0}},{group:"g",args:{x:"100%",y:"50%"}},
                 {group:"g",args:{x:"50%",y:"100%"}},{group:"g",args:{x:0,y:"50%"}}] } });
    }
    var a=node(40,26,"选题"), b=node(40,116,"写脚本"), c=node(200,116,"审核"), d=node(200,206,"发布");
    [[a,b],[b,c],[c,d]].forEach(function(p){
      g.addEdge({ source:p[0], target:p[1], router:"manhattan", connector:"rounded",
        attrs:{ line:{ stroke:"#8A93A0", strokeWidth:1.5, targetMarker:{name:"block",width:8,height:6} } } });
    });
    g.zoomToFit({ padding:16, maxScale:1 });
    RS.x6 = function(){ g.zoomToFit({ padding:16, maxScale:1 }); };
  
};

B["xyf"] = async function(){
var NS = { background:"#1D2028", color:"#E9EBEE", border:"1px solid #3C4250",
      borderRadius:6, fontSize:11, width:96, padding:"6px 0" };

    await need("xyflow");
    var React = XYFlow.React, ReactDOM = XYFlow.ReactDOM;   // React 打在包里，不另挂全局
    var e = React.createElement, RF = XYFlow;
    var nodes = [
      { id:"1", position:{x:20,y:16},  data:{label:"素材"},   style:NS },
      { id:"2", position:{x:20,y:104}, data:{label:"粗剪"},   style:NS },
      { id:"3", position:{x:170,y:104},data:{label:"审核"},   style:NS },
      { id:"4", position:{x:170,y:192},data:{label:"发布"},   style:NS }];
    var edges = [
      { id:"a", source:"1", target:"2", animated:true, style:{stroke:"#63A6FF"} },
      { id:"b", source:"2", target:"3", style:{stroke:"#8A93A0"} },
      { id:"c", source:"3", target:"4", style:{stroke:"#8A93A0"} }];
    var root = ReactDOM.createRoot(document.getElementById("xyf-m"));
    root.render(e(RF.ReactFlow, { nodes:nodes, edges:edges, fitView:true,
      proOptions:{hideAttribution:true}, colorMode:"dark",
      defaultEdgeOptions:{ type:"smoothstep" } },
      e(RF.Background, { color:"#2A2E36", gap:14 }),
      e(RF.Controls, { showInteractive:false })));
  
};

B["vf"] = async function(){
var VS = { background:"#1D2028", color:"#E9EBEE", border:"1px solid #3C4250",
      borderRadius:"6px", fontSize:"11px", width:"90px", padding:"6px 0", textAlign:"center" };

    await need("vue","vueflow");
    var m = document.getElementById("vf-m"); m.innerHTML = "";
    var h = Vue.h;
    var nodes = [
      { id:"1", position:{x:24,y:18},  data:{label:"输入"}, style:VS },
      { id:"2", position:{x:24,y:106}, data:{label:"处理"}, style:VS },
      { id:"3", position:{x:176,y:106},data:{label:"输出"}, style:VS }];
    var edges = [
      { id:"e1", source:"1", target:"2", animated:true, style:{stroke:"#63A6FF"} },
      { id:"e2", source:"2", target:"3", style:{stroke:"#8A93A0"} }];
    var app = Vue.createApp({
      setup: function(){
        return function(){ return h(VueFlow.VueFlow, {
          modelValue: nodes.concat(edges), nodes:nodes, edges:edges,
          fitViewOnInit:true, style:{ width:"100%", height:"100%" } }); };
      }
    });
    app.mount(m);
    m.style.background = "#15161B";
  
};

B["joint"] = async function(){

    await need("joint");
    var m = document.getElementById("joint-m"); m.innerHTML = "";
    var graph = new joint.dia.Graph({}, {cellNamespace: joint.shapes});
    var paper = new joint.dia.Paper({ el:m, model:graph, width:"100%", height:"100%",
      gridSize:10, drawGrid:{name:"mesh", args:{color:"#24272E"}},
      background:{color:"#15161B"}, cellViewNamespace:joint.shapes,
      defaultConnectionPoint:{name:"boundary"} });
    function box(x,y,t,f){
      var r = new joint.shapes.standard.Rectangle();
      r.position(x,y); r.resize(92,34);
      r.attr({ body:{fill:f, rx:5, ry:5, strokeWidth:0},
               label:{text:t, fill:"#fff", fontSize:11.5, fontFamily:"system-ui,sans-serif"} });
      return r.addTo(graph);
    }
    var a=box(24,22,"Source","#7c68fc"), b=box(190,22,"Target","#31d0c6"), c=box(108,150,"Result","#fe854f");
    [[a,b],[a,c],[b,c]].forEach(function(p){
      var l = new joint.shapes.standard.Link();
      l.source(p[0]); l.target(p[1]);
      l.attr("line/stroke","#8A93A0"); l.attr("line/strokeWidth",1.6);
      l.addTo(graph);
    });
    // ⚠ 别调 scaleContentToFit —— 这个尺寸下它会在内部死循环，探针整个卡住（实测）。
    // 元素坐标本来就摆在可视范围内，不需要自动缩放。
    RS.joint = function(){ paper.setDimensions("100%","100%"); };
  
};

B["djs"] = async function(){

    await need("diagramjs");
    var Diagram = DiagramJS.default || DiagramJS;
    var m = document.getElementById("djs-m"); m.innerHTML = "";
    var d = new Diagram({ canvas:{ container:m } });
    var canvas = d.get("canvas"), root = canvas.getRootElement();
    var el = d.get("elementFactory");
    var NS = "http://www.w3.org/2000/svg";
    // diagram-js 只给骨架，默认图元是品红描边的占位样式 —— 形状和配色必须自己画。
    function shape(id, x, y, label){
      var sp = el.createShape({ id:id, x:x, y:y, width:96, height:34 });
      canvas.addShape(sp, root);
      var gfx = canvas.getGraphics(sp);
      gfx.innerHTML = "";
      var r = document.createElementNS(NS, "rect");
      r.setAttribute("width", 96); r.setAttribute("height", 34);
      r.setAttribute("rx", 6); r.setAttribute("ry", 6);
      r.setAttribute("fill", "#1D2028");
      r.setAttribute("stroke", "#4A5262");
      r.setAttribute("stroke-width", "1.2");
      gfx.appendChild(r);
      var t = document.createElementNS(NS, "text");
      t.textContent = label;
      t.setAttribute("x", 48); t.setAttribute("y", 22);
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("fill", "#E9EBEE");
      t.setAttribute("font-size", "11.5");
      t.setAttribute("font-family", "system-ui,sans-serif");
      gfx.appendChild(t);
      return sp;
    }
    var a = shape("a", 26, 22, "A 节点");
    var b = shape("b", 26, 118, "B 节点");
    var c = shape("c", 186, 118, "C 节点");
    [[a,b],[b,c]].forEach(function(p2, i){
      var cn = el.createConnection({ id:"c" + i, waypoints:[
        { x:p2[0].x + 48, y:p2[0].y + 34 }, { x:p2[1].x + 48, y:p2[1].y } ] });
      canvas.addConnection(cn, root);
      var g2 = canvas.getGraphics(cn), pa = g2.querySelector("path");
      if (pa) { pa.setAttribute("stroke", "#8A93A0"); pa.setAttribute("stroke-width", "1.6");
                pa.setAttribute("fill", "none"); }
    });
    canvas.zoom("fit-viewport");
    RS.djs = function(){ canvas.zoom("fit-viewport"); };
  
};

B["bak"] = async function(){

    await need("baklava");
    var m = document.getElementById("bak-m"); m.innerHTML = "";
    var Core = BaklavaJS.Core, RV = BaklavaJS.RendererVue, Eng = BaklavaJS.Engine;
    var bk = BaklavaJS.createBaklava(m);   // 顶层导出，不在 RendererVue 下面（实测）
    var ed = bk.editor;
    var Num = Core.defineNode({
      type: "数值",
      inputs:  { v: function(){ return new BaklavaJS.RendererVue.NumberInterface("值", 3); } },
      outputs: { out: function(){ return new Core.NodeInterface("输出", 0); } },
      calculate: function(i){ return { out: i.v }; }
    });
    var Mul = Core.defineNode({
      type: "相乘",
      inputs:  { a: function(){ return new Core.NodeInterface("A", 0); },
                 b: function(){ return new Core.NodeInterface("B", 0); } },
      outputs: { out: function(){ return new BaklavaJS.RendererVue.TextInterface("结果", "0"); } },
      calculate: function(i){ return { out: String(i.a * i.b) }; }
    });
    ed.registerNodeType(Num); ed.registerNodeType(Mul);
    var n1 = new Num(), n2 = new Num(), n3 = new Mul();
    ed.graph.addNode(n1); ed.graph.addNode(n2); ed.graph.addNode(n3);
    n1.position = { x:16, y:16 }; n2.position = { x:16, y:130 }; n3.position = { x:210, y:66 };
    ed.graph.addConnection(n1.outputs.out, n3.inputs.a);
    ed.graph.addConnection(n2.outputs.out, n3.inputs.b);
    // ⚠ applyResult 会改接口值 → 又触发一次 run → 自激死循环，整页卡死（实测）。
    // 必须 pause / resume 把这一圈掐断，这是官方写法。
    var engine = new Eng.DependencyEngine(ed);
    engine.events.afterRun.subscribe(engine, function(r){
      engine.pause(); Eng.applyResult(r, ed); engine.resume();
    });
    engine.start(); engine.runOnce();
  
};

B["max"] = async function(){

    await need("maxgraph");
    var M = window.maxGraph;   // esbuild --global-name=maxGraph，大小写敏感
    if (!M) throw new Error("maxGraph 全局没挂上");
    var m = document.getElementById("max-m"); m.innerHTML = "";
    m.style.background = "#15161B";
    var g = new M.Graph(m);
    g.setPanning(true); g.setConnectable(true); g.setCellsResizable(false);
    new M.RubberBandHandler(g);
    var st = g.getStylesheet();
    var vs = st.getDefaultVertexStyle();
    vs.fillColor="#1D2028"; vs.strokeColor="#4A76B8"; vs.fontColor="#E9EBEE";
    vs.rounded=true; vs.fontSize=11; vs.strokeWidth=1.2;
    var es = st.getDefaultEdgeStyle();
    es.strokeColor="#8A93A0"; es.strokeWidth=1.5; es.edgeStyle="orthogonalEdgeStyle"; es.rounded=true;
    var p = g.getDefaultParent();
    g.batchUpdate(function(){
      // 整体上收：原来「结束」在 y=188，会被卡片下边缘裁掉（实测截图）
      var a=g.insertVertex(p,null,"开始",22,10,86,32);
      var b=g.insertVertex(p,null,"判断",22,84,86,32);
      var c=g.insertVertex(p,null,"处理",178,84,86,32);
      var d=g.insertVertex(p,null,"结束",178,158,86,32);
      g.insertEdge(p,null,"",a,b); g.insertEdge(p,null,"是",b,c); g.insertEdge(p,null,"",c,d);
    });
  
};

B["g6"] = async function(){

    await need("g6");
    var m = document.getElementById("g6-m"); m.innerHTML = "";
    var N = [], E = [];
    for (var i=1;i<=12;i++) N.push({ id:"n"+i, data:{} });
    [[1,2],[1,3],[1,4],[2,5],[3,5],[4,6],[5,7],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,1],[3,9]]
      .forEach(function(p,i){ E.push({ id:"e"+i, source:"n"+p[0], target:"n"+p[1] }); });
    var g = new G6.Graph({ container:m, autoFit:"view", background:"#15161B",
      data:{ nodes:N, edges:E },
      node:{ style:{ fill:"#63A6FF", stroke:"#0A0B0D", lineWidth:1, size:16 } },
      edge:{ style:{ stroke:"#4A5262", lineWidth:1 } },
      layout:{ type:"force", preventOverlap:true, linkDistance:52 },
      behaviors:["drag-canvas","zoom-canvas","drag-element"] });
    g.render();
    RS.g6 = function(){ g.resize(); g.fitView(); };
  
};

B["cy"] = async function(){

    await need("cytoscape");
    var m = document.getElementById("cy-m"); m.innerHTML = "";
    var els = [];
    for (var i=1;i<=13;i++) els.push({ data:{ id:"n"+i } });
    [[1,2],[1,3],[2,4],[3,4],[3,5],[4,6],[5,6],[5,7],[6,8],[7,8],[8,9],[9,10],[2,11],[11,12],[12,13],[13,6]]
      .forEach(function(p,i){ els.push({ data:{ id:"e"+i, source:"n"+p[0], target:"n"+p[1] } }); });
    var cy = cytoscape({ container:m, elements:els, wheelSensitivity:0.2,
      style:[ { selector:"node", style:{ "background-color":"#4ED08A", label:"data(id)",
                  "font-size":8, color:"#0A0B0D", "text-valign":"center", width:20, height:20 } },
              { selector:"edge", style:{ "line-color":"#3A4048", width:1.4,
                  "curve-style":"bezier" } },
              { selector:".hit", style:{ "background-color":"#F6C348", "line-color":"#F6C348", width:3 } } ],
      layout:{ name:"cose", animate:false, padding:14 } });
    m.style.background = "#15161B";
    RS.cy = function(){ cy.resize(); cy.fit(undefined, 14); };
    document.getElementById("cy-btn").addEventListener("click", function(){
      cy.elements().removeClass("hit");
      var r = cy.elements().dijkstra({ root:"#n1", directed:false });
      var p = r.pathTo(cy.$("#n10"));
      p.addClass("hit");
      this.textContent = "n1 → n10 走 " + (p.length-1)/2 + " 跳（点我重跑）";
    });
  
};

B["vn"] = async function(){

    await need("visnetwork");
    var m = document.getElementById("vn-m"); m.innerHTML = "";
    var N = [], E = [];
    for (var i=1;i<=14;i++) N.push({ id:i, label:"N"+i });
    [[1,2],[1,3],[2,4],[3,4],[4,5],[5,6],[6,7],[7,1],[3,8],[8,9],[9,10],[10,4],[11,12],[12,13],[13,14],[14,11],[11,5]]
      .forEach(function(p){ E.push({ from:p[0], to:p[1] }); });
    var net = new vis.Network(m, { nodes:new vis.DataSet(N), edges:new vis.DataSet(E) }, {
      nodes:{ shape:"dot", size:11, color:{ background:"#E0A33E", border:"#0A0B0D" },
              font:{ color:"#B2B8C1", size:9 } },
      edges:{ color:"#3A4048", width:1.2, smooth:{ type:"continuous" } },
      physics:{ stabilization:{ iterations:180 }, barnesHut:{ springLength:70 } },
      interaction:{ hover:true } });
    m.style.background = "#15161B";
    RS.vn = function(){ net.redraw(); net.fit(); };
  
};

B["fg"] = async function(){

    await need("forcegraph");
    var m = document.getElementById("fg-m"); m.innerHTML = "";
    var N = [], L = [];
    for (var i=0;i<40;i++) N.push({ id:i, g:i%4 });
    for (var j=1;j<40;j++) L.push({ source:j, target:Math.floor(Math.random()*j) });
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B"];
    var g = ForceGraph()(m)
      .backgroundColor("#15161B")
      .graphData({ nodes:N, links:L })
      .nodeColor(function(n){ return CL[n.g]; })
      .nodeRelSize(4)
      .linkColor(function(){ return "#2E333B"; })
      .linkWidth(1)
      .width(m.clientWidth).height(m.clientHeight)
      .cooldownTicks(90);
    RS.fg = function(){ g.width(m.clientWidth).height(m.clientHeight); };
  
};

B["rg"] = async function(){

    await need("reagraph");
    var React = Reagraph.React, ReactDOM = Reagraph.ReactDOM;
    var e = React.createElement;
    var N = [], E = [];
    for (var i=1;i<=26;i++) N.push({ id:"n"+i, label:"N"+i });
    for (var j=2;j<=26;j++) E.push({ id:"e"+j, source:"n"+j, target:"n"+(Math.floor(j/2)) });
    var root = ReactDOM.createRoot(document.getElementById("rg-m"));
    root.render(e("div", { style:{width:"100%",height:"100%",background:"#0E0F13"} },
      e(Reagraph.GraphCanvas, { nodes:N, edges:E, layoutType:"forceDirected2d",
        theme:{ canvas:{ background:"#0E0F13" },
                node:{ fill:"#63A6FF", activeFill:"#F6C348", opacity:1, selectedOpacity:1,
                       inactiveOpacity:.4, label:{ color:"#B2B8C1", stroke:"#0E0F13", activeColor:"#F6C348" } },
                edge:{ fill:"#3A4048", activeFill:"#F6C348", opacity:1, selectedOpacity:1, inactiveOpacity:.2,
                       label:{ color:"#B2B8C1", stroke:"#0E0F13", activeColor:"#F6C348" } },
                ring:{ fill:"#2E333B", activeFill:"#F6C348" },
                arrow:{ fill:"#3A4048", activeFill:"#F6C348" },
                lasso:{ background:"#63A6FF22", border:"#63A6FF" } } })));
  
};

B["sig"] = async function(){

    await need("sigma");
    var m = document.getElementById("sig-m"); m.innerHTML = "";
    var G = new SigmaLib.Graph();
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0"];
    for (var i=0;i<300;i++) {
      var a = (i/300)*Math.PI*2, r = 0.25 + (i%7)/9;
      G.addNode("n"+i, { x:Math.cos(a)*r + (i%11)/28, y:Math.sin(a)*r + (i%13)/30,
        size:2 + (i%5)*0.7, color:CL[i%5], label:"" });
    }
    for (var j=0;j<560;j++) {
      var s="n"+(j%300), t="n"+((j*7+3)%300);
      if (s!==t && !G.hasEdge(s,t)) G.addEdge(s,t,{ color:"#262A31", size:0.5 });
    }
    var sg = new SigmaLib.Sigma(G, m, { renderLabels:false, defaultEdgeColor:"#262A31" });
    m.style.background = "#15161B";
    RS.sig = function(){ sg.refresh(); sg.getCamera().animatedReset(); };
  
};

B["fg3"] = async function(){

    await need("fg3d");
    var m = document.getElementById("fg3-m"); m.innerHTML = "";
    var N = [], L = [];
    for (var i=0;i<34;i++) N.push({ id:i, g:i%4 });
    for (var j=1;j<34;j++) L.push({ source:j, target:Math.floor(Math.random()*j) });
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B"];
    var g = ForceGraph3D()(m)
      .backgroundColor("#0E0F13")
      .graphData({ nodes:N, links:L })
      .nodeColor(function(n){ return CL[n.g]; })
      .nodeOpacity(0.95).nodeRelSize(4)
      .linkColor(function(){ return "#3A4048"; })
      .showNavInfo(false)
      .width(m.clientWidth).height(m.clientHeight);
    RS.fg3 = function(){ g.width(m.clientWidth).height(m.clientHeight); };
  
};

B["ec"] = async function(){

    await need("echarts");
    var c = echarts.init(document.getElementById("ec-m"), "dark",
      { renderer:"canvas", width:"auto", height:"auto" });
    c.setOption({ backgroundColor:"#15161B",
      grid:{ left:38, right:14, top:30, bottom:26 },
      tooltip:{ trigger:"axis", axisPointer:{type:"cross"} },
      legend:{ data:["播放量","完播率"], textStyle:{color:"#B2B8C1", fontSize:10}, top:2 },
      xAxis:{ type:"category", data:["1月","3月","5月","7月","9月","11月"], axisLabel:{fontSize:9} },
      yAxis:[{ type:"value", axisLabel:{fontSize:9} }, { type:"value", axisLabel:{fontSize:9}, splitLine:{show:false} }],
      series:[
        { name:"播放量", type:"bar", data:[12,15,22,28,30,38], itemStyle:{color:"#63A6FF", borderRadius:[3,3,0,0]} },
        { name:"完播率", type:"line", yAxisIndex:1, smooth:true,
          data:[38,44,55,66,69,83],
          itemStyle:{color:"#4ED08A"}, lineStyle:{width:2} } ] });
    RS.ec = function(){ c.resize(); };
  
};

B["cjs"] = async function(){

    await need("chartjs");
    var m = document.getElementById("cjs-m"); m.innerHTML = "<canvas></canvas>";
    Chart.defaults.color = "#8A93A0"; Chart.defaults.font.size = 9;
    var ch = new Chart(m.querySelector("canvas"), {
      type:"bar",
      data:{ labels:["1月","3月","5月","7月","9月","11月"], datasets:[
        { label:"播放量", data:[12,15,22,28,30,38], backgroundColor:"#63A6FF", borderRadius:3 },
        { label:"互动", type:"line", data:[6.6000000000000005,8.25,12.100000000000001,15.400000000000002,16.5,20.900000000000002],
          borderColor:"#E0A33E", backgroundColor:"#E0A33E", tension:.35, pointRadius:2 } ] },
      options:{ responsive:true, maintainAspectRatio:false,
        plugins:{ legend:{ labels:{ boxWidth:10, font:{size:9} } } },
        scales:{ x:{ grid:{color:"#22252B"} }, y:{ grid:{color:"#22252B"} } } } });
    RS.cjs = function(){ ch.resize(); };
  
};

B["g2"] = async function(){

    await need("g2");
    var m = document.getElementById("g2-m"); m.innerHTML = "";
    var rows = [{"m":"1月","v":12},{"m":"3月","v":15},{"m":"5月","v":22},{"m":"7月","v":28},{"m":"9月","v":30},{"m":"11月","v":38}];
    var ch = new G2.Chart({ container:m, autoFit:true, theme:"dark" });
    ch.options({ type:"view", data:rows, autoFit:true,
      axis:{ x:{ title:false, labelFontSize:9 }, y:{ title:false, labelFontSize:9 } },
      children:[
        { type:"interval", encode:{ x:"m", y:"v" }, style:{ fill:"#63A6FF", radiusTopLeft:3, radiusTopRight:3 } },
        { type:"line", encode:{ x:"m", y:"v" }, style:{ stroke:"#F6C348", lineWidth:2 }, tooltip:false } ] });
    ch.render();
    RS.g2 = function(){ ch.forceFit && ch.forceFit(); };
  
};

B["bb"] = async function(){

    await need("billboard");
    var m = document.getElementById("bb-m"); m.innerHTML = "";
    var BB = window.bb || window.billboard;
    if (!BB) throw new Error("billboard 全局没挂上");
    var ch = BB.generate({ bindto:m, size:{ height:m.clientHeight },
      data:{ columns:[ ["播放量"].concat([12,15,22,28,30,38]),
                       ["互动"].concat([7,9,13,17,18,23]) ],
             types:{ 播放量:"area-spline", 互动:"bar" },
             colors:{ 播放量:"#63A6FF", 互动:"#4ED08A" } },
      axis:{ x:{ type:"category", categories:["1月","3月","5月","7月","9月","11月"] },
             y:{ tick:{ count:5, format:function(v){ return Math.round(v); } } } },
      grid:{ y:{ show:true } }, padding:{ top:8, right:10 } });
    RS.bb = function(){ ch.resize({ height:m.clientHeight }); };
  
};

B["pl"] = async function(){

    await need("plotly");
    var m = document.getElementById("pl-m");
    Plotly.newPlot(m, [
      { x:["1月","3月","5月","7月","9月","11月"], y:[12,15,22,28,30,38], type:"bar", name:"播放量", marker:{color:"#63A6FF"} },
      { x:["1月","3月","5月","7月","9月","11月"], y:[16.799999999999997,21,30.799999999999997,39.199999999999996,42,53.199999999999996], type:"scatter", mode:"lines+markers",
        name:"趋势", line:{color:"#F6C348", width:2}, marker:{size:4} } ], {
      paper_bgcolor:"#15161B", plot_bgcolor:"#15161B",
      font:{ color:"#8A93A0", size:9 },
      margin:{ l:34, r:10, t:22, b:28 },
      legend:{ orientation:"h", y:1.12, font:{size:9} },
      xaxis:{ gridcolor:"#22252B" }, yaxis:{ gridcolor:"#22252B" } },
      { responsive:true, displaylogo:false });
    RS.pl = function(){ Plotly.Plots.resize(m); };
  
};

B["rc"] = async function(){

    await need("recharts");
    var R = Recharts, React = R.React, ReactDOM = R.ReactDOM, e = React.createElement;
    var rows = [{"m":"1月","v":12,"u":7},{"m":"3月","v":15,"u":9},{"m":"5月","v":22,"u":13},{"m":"7月","v":28,"u":17},{"m":"9月","v":30,"u":18},{"m":"11月","v":38,"u":23}];
    ReactDOM.createRoot(document.getElementById("rc-m")).render(
      e(R.ResponsiveContainer, { width:"100%", height:"100%" },
        e(R.ComposedChart, { data:rows, margin:{ top:14, right:10, left:-18, bottom:0 } },
          e(R.CartesianGrid, { stroke:"#22252B" }),
          e(R.XAxis, { dataKey:"m", tick:{ fill:"#7A828D", fontSize:9 }, stroke:"#343841" }),
          e(R.YAxis, { tick:{ fill:"#7A828D", fontSize:9 }, stroke:"#343841" }),
          e(R.Tooltip, { contentStyle:{ background:"#0E0F13", border:"1px solid #23252C", fontSize:11 } }),
          e(R.Bar, { dataKey:"v", fill:"#63A6FF", radius:[3,3,0,0] }),
          e(R.Line, { type:"monotone", dataKey:"u", stroke:"#4ED08A", strokeWidth:2, dot:false }))));
  
};

B["cst"] = async function(){

    await need("chartist");
    var m = document.getElementById("cst-m"); m.innerHTML = "";
    var d = document.createElement("div");
    d.style.cssText = "width:100%;height:100%";
    m.appendChild(d);
    new Chartist.LineChart(d, {
      labels:["1月","3月","5月","7月","9月","11月"],
      series:[ [12,15,22,28,30,38], [7,8,12,15,17,21] ]
    }, { fullWidth:true, height:"100%", showArea:true,
         chartPadding:{ top:10, right:14, bottom:4, left:0 },
         axisX:{ showGrid:false } });
    var s = document.createElement("style");
    s.textContent = "#cst-m .ct-series-a .ct-line,#cst-m .ct-series-a .ct-point{stroke:#63A6FF}"
      + "#cst-m .ct-series-a .ct-area{fill:#63A6FF;fill-opacity:.16}"
      + "#cst-m .ct-series-b .ct-line,#cst-m .ct-series-b .ct-point{stroke:#4ED08A}"
      + "#cst-m .ct-series-b .ct-area{fill:#4ED08A;fill-opacity:.14}"
      + "#cst-m .ct-label{fill:#7A828D;font-size:8px}"
      + "#cst-m .ct-grid{stroke:#22252B}";
    document.head.appendChild(s);
  
};

B["xk"] = async function(){

    await need("xkcd");
    var m = document.getElementById("xk-m"); m.innerHTML = "<svg></svg>";
    var svg = m.querySelector("svg");
    svg.setAttribute("width", m.clientWidth); svg.setAttribute("height", m.clientHeight);
    new chartXkcd.Bar(svg, {
      title:"每周产出", xLabel:"", yLabel:"",
      data:{ labels:["一","二","三","四","五"], datasets:[{ data:[8,14,9,17,12] }] },
      options:{ yTickCount:3, dataColors:["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0"],
                fontFamily:"system-ui", backgroundColor:"transparent" } });
    m.style.background = "#F3F1EA";       // 手绘风是给浅底设计的，深底上完全看不见
    RS.xk = function(){};
  
};

B["lw"] = async function(){

    await need("lwcharts");
    var m = document.getElementById("lw-m"); m.innerHTML = "";
    var L = LightweightCharts;
    var ch = L.createChart(m, { width:m.clientWidth, height:m.clientHeight,
      layout:{ background:{ color:"#15161B" }, textColor:"#8A93A0", fontSize:9 },
      grid:{ vertLines:{ color:"#1D2026" }, horzLines:{ color:"#1D2026" } },
      rightPriceScale:{ borderColor:"#2A2E36" }, timeScale:{ borderColor:"#2A2E36" } });
    var s = ch.addSeries
      ? ch.addSeries(L.CandlestickSeries, { upColor:"#4ED08A", downColor:"#F2686B",
          borderVisible:false, wickUpColor:"#4ED08A", wickDownColor:"#F2686B" })
      : ch.addCandlestickSeries({ upColor:"#4ED08A", downColor:"#F2686B", borderVisible:false });
    var data = [], px = 100;
    for (var i = 0; i < 160; i++) {
      var o = px, c2 = o + (Math.sin(i/7)*3 + (i%5-2)*1.3);
      var h = Math.max(o,c2) + Math.abs(Math.cos(i))*1.6, l = Math.min(o,c2) - Math.abs(Math.sin(i*2))*1.6;
      var dt = new Date(Date.UTC(2026, 0, 1 + i));
      data.push({ time: dt.toISOString().slice(0,10), open:+o.toFixed(2), high:+h.toFixed(2),
                  low:+l.toFixed(2), close:+c2.toFixed(2) });
      px = c2;
    }
    s.setData(data); ch.timeScale().fitContent();
    RS.lw = function(){ ch.resize(m.clientWidth, m.clientHeight); ch.timeScale().fitContent(); };
  
};

B["dy"] = async function(){

    await need("dygraph");
    var m = document.getElementById("dy-m"); m.innerHTML = "";
    var rows = [], t = new Date(2026, 0, 1), v1 = 50, v2 = 30;
    for (var i = 0; i < 20000; i++) {
      v1 += (Math.random()-.5)*1.4; v2 += (Math.random()-.5)*1.1;
      rows.push([ new Date(t.getTime() + i*36e5), v1, v2 ]);
    }
    var g = new Dygraph(m, rows, { labels:["t","A 组","B 组"],
      colors:["#63A6FF","#4ED08A"], strokeWidth:1,
      gridLineColor:"#22252B", axisLineColor:"#2A2E36", axisLabelColor:"#7A828D",
      axisLabelFontSize:9, legend:"never", fillGraph:false,
      highlightCircleSize:3, rightGap:6 });
    m.style.background = "#15161B";
    RS.dy = function(){ g.resize(); };
  
};

B["wgl"] = async function(){

    var m = document.getElementById("wgl-m");
    m.innerHTML = '<div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start;'
      + 'justify-content:center;height:100%;padding:14px 16px;background:#15161B">'
      + '<div style="font:600 12px system-ui;color:#F2686B">这一个我没跑通</div>'
      + '<div style="font:11px/1.7 system-ui;color:#B2B8C1">v1.1.2 的 WebglPlot / WebglLinePlot 我用 canvas 和 WebGL2 上下文都试过，取不到 addLine。</div>'
      + '<div style="font:10px var(--mono);color:#7A828D">包本身没问题（协议 / 发版都合格，已内联在本页），'
      + '是我这一版的接入代码没写对。</div></div>';
  
};

B["vl"] = async function(){

    await need("vega","vegalite","vegaembed");
    var m = document.getElementById("vl-m"); m.innerHTML = "";
    var rows = [];
    for (var i = 0; i < 90; i++) rows.push({ d:i, v: 30 + Math.sin(i/9)*14 + (i%7)*1.6, g: i%3 ? "A" : "B" });
    vegaEmbed(m, {
      $schema:"https://vega.github.io/schema/vega-lite/v6.json",
      background:"#15161B", data:{ values:rows },
      width:"container", height: m.clientHeight - 40,
      mark:{ type:"point", filled:true, size:32, opacity:.85 },
      encoding:{
        x:{ field:"d", type:"quantitative", axis:{ title:null, labelFontSize:8 } },
        y:{ field:"v", type:"quantitative", axis:{ title:null, labelFontSize:8 } },
        color:{ field:"g", type:"nominal", scale:{ range:["#63A6FF","#4ED08A"] },
                legend:{ title:null, labelFontSize:8, orient:"top" } } },
      config:{ axis:{ gridColor:"#22252B", domainColor:"#2A2E36", labelColor:"#7A828D", tickColor:"#2A2E36" },
               view:{ stroke:null }, legend:{ labelColor:"#B2B8C1" } }
    }, { actions:false, renderer:"canvas" });
  
};

B["vg"] = async function(){

    await need("vega");
    var m = document.getElementById("vg-m"); m.innerHTML = "";
    var spec = { $schema:"https://vega.github.io/schema/vega/v5.json",
      width: m.clientWidth-70, height: m.clientHeight-48, padding:6,
      background:"#15161B",
      data:[{ name:"t", values:[{"c":"1月","v":12},{"c":"3月","v":15},{"c":"5月","v":22},{"c":"7月","v":28},{"c":"9月","v":30},{"c":"11月","v":38}] }],
      scales:[ { name:"x", type:"band", range:"width", domain:{data:"t",field:"c"}, padding:.18 },
               { name:"y", type:"linear", range:"height", nice:true, zero:true, domain:{data:"t",field:"v"} } ],
      axes:[ { orient:"bottom", scale:"x", labelColor:"#7A828D", labelFontSize:8, domainColor:"#2A2E36", tickColor:"#2A2E36" },
             { orient:"left", scale:"y", labelColor:"#7A828D", labelFontSize:8, domainColor:"#2A2E36",
               tickColor:"#2A2E36", grid:true, gridColor:"#22252B" } ],
      marks:[ { type:"rect", from:{data:"t"},
        encode:{ enter:{ x:{scale:"x",field:"c"}, width:{scale:"x",band:1},
                         y:{scale:"y",field:"v"}, y2:{scale:"y",value:0} },
                 update:{ fill:{value:"#63A6FF"} }, hover:{ fill:{value:"#F6C348"} } } } ] };
    new vega.View(vega.parse(spec), { renderer:"canvas", container:m, hover:true }).runAsync();
  
};

B["ag"] = async function(){

    await need("aggrid");
    var m = document.getElementById("ag-m"); m.innerHTML = "";
    m.className = "mount ag-theme-quartz-dark";
    var rows = [];
    for (var i = 1; i <= 5000; i++)
      rows.push({ id:i, 标题:"第 "+i+" 期", 播放:Math.round(Math.random()*9e4),
                  完播:(Math.random()*60+20).toFixed(1)+"%", 状态:["已发","待审","草稿"][i%3] });
    agGrid.createGrid(m, {
      columnDefs:[ {field:"id",width:70}, {field:"标题",flex:1}, {field:"播放",width:100,sort:"desc"},
                   {field:"完播",width:88}, {field:"状态",width:82} ],
      rowData: rows,
      defaultColDef:{ sortable:true, filter:true, resizable:true },
      rowHeight:26, headerHeight:28 });
  
};

B["tb"] = async function(){

    await need("tabulator");
    var m = document.getElementById("tb-m"); m.innerHTML = "";
    var rows = [];
    for (var i = 1; i <= 400; i++)
      rows.push({ id:i, name:"第 "+i+" 期", plays:Math.round(Math.random()*9e4),
                  rate:+(Math.random()*60+20).toFixed(1), st:["已发","待审","草稿"][i%3] });
    new Tabulator(m, { data:rows, height:"100%", layout:"fitColumns",
      columns:[ {title:"#", field:"id", width:56},
                {title:"标题", field:"name", editor:"input"},
                {title:"播放", field:"plays", width:92, sorter:"number"},
                {title:"完播 %", field:"rate", width:88, formatter:"progress",
                 formatterParams:{ min:0, max:100, color:["#F2686B","#E0A33E","#4ED08A"] }},
                {title:"状态", field:"st", width:78, editor:"list",
                 editorParams:{ values:["已发","待审","草稿"] }} ] });
  
};

B["s2"] = async function(){

    await need("s2");
    var m = document.getElementById("s2-m"); m.innerHTML = "";
    var data = [];
    ["华东","华北","华南"].forEach(function(prov){
      ["线上","线下"].forEach(function(ch){
        ["2025","2026"].forEach(function(y){
          data.push({ 区域:prov, 渠道:ch, 年份:y, 销售额:Math.round(Math.random()*900+120) });
        });
      });
    });
    var s2 = new S2.PivotSheet(m,
      { fields:{ rows:["区域","渠道"], columns:["年份"], values:["销售额"] }, data:data },
      { width:m.clientWidth, height:m.clientHeight,
        style:{ layoutWidthType:"colAdaptive", cellCfg:{ height:24 } },
        themeCfg:{ name:"dark" } });
    s2.setThemeCfg({ name:"dark" });
    s2.render();
    RS.s2 = function(){ s2.changeSheetSize(m.clientWidth, m.clientHeight); s2.render(false); };
  
};

B["bar"] = async function(){

    await need("jsbarcode");
    var m = document.getElementById("bar-m");
    m.innerHTML = '<div style="display:flex;flex-direction:column;gap:6px;align-items:center;'
      + 'justify-content:center;width:100%;height:100%;background:#fff">'
      + '<svg id="bar-a"></svg><svg id="bar-b"></svg></div>';
    JsBarcode("#bar-a", "WM-2026-0731", { format:"CODE128", height:44, fontSize:12, margin:4 });
    JsBarcode("#bar-b", "9787115428028", { format:"EAN13", height:38, fontSize:11, margin:4 });
  
};

B["ws"] = async function(){

    var m = document.getElementById("ws-m");
    m.innerHTML = '<div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start;'
      + 'justify-content:center;height:100%;padding:14px 16px;background:#15161B">'
      + '<div style="font:600 12px system-ui;color:#F2686B">这一个我没跑通</div>'
      + '<div style="font:11px/1.7 system-ui;color:#B2B8C1">CSP 挡外部音频，只能喂预算好的 peaks；v7 的 peaks + duration 离线路径我没画出波形。</div>'
      + '<div style="font:10px var(--mono);color:#7A828D">包本身没问题（协议 / 发版都合格，已内联在本页），'
      + '是我这一版的接入代码没写对。</div></div>';
  
};

B["kv"] = async function(){

    await need("konva");
    var m = document.getElementById("kv-m"); m.innerHTML = "";
    var W = m.clientWidth, H = m.clientHeight;
    var st = new Konva.Stage({ container:m, width:W, height:H });
    var ly = new Konva.Layer(); st.add(ly);
    ly.add(new Konva.Rect({ x:0, y:0, width:W, height:H, fill:"#15161B", listening:false }));
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0"];
    for (var i = 0; i < 5; i++) {
      var s = new Konva.Rect({ x:18+i*(W-70)/5, y:40+((i%2)*70), width:52, height:52,
        fill:CL[i], cornerRadius:8, draggable:true,
        shadowColor:"#000", shadowBlur:0, shadowOpacity:.5 });
      s.on("dragstart", function(){ this.shadowBlur(14); this.moveToTop(); });
      s.on("dragend", function(){ this.shadowBlur(0); });
      s.on("mouseenter", function(){ st.container().style.cursor = "grab"; });
      s.on("mouseleave", function(){ st.container().style.cursor = "default"; });
      ly.add(s);
    }
    ly.add(new Konva.Circle({ x:W/2, y:H-42, radius:24, fill:"#31d0c6", draggable:true }));
    RS.kv = function(){ st.size({ width:m.clientWidth, height:m.clientHeight }); };
  
};

B["fb"] = async function(){

    var m = document.getElementById("fb-m");
    m.innerHTML = '<div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start;'
      + 'justify-content:center;height:100%;padding:14px 16px;background:#15161B">'
      + '<div style="font:600 12px system-ui;color:#F2686B">这一个我没跑通</div>'
      + '<div style="font:11px/1.7 system-ui;color:#B2B8C1">v7 的 Canvas 建出来了、对象也 add 进去了，renderAll 之后画布仍是空的。</div>'
      + '<div style="font:10px var(--mono);color:#7A828D">包本身没问题（协议 / 发版都合格，已内联在本页），是我这一版的接入代码没写对。</div></div>';
  
};

B["px"] = async function(){

    await need("pixi");
    var m = document.getElementById("px-m"); m.innerHTML = "";
    var app = new PIXI.Application();
    var W = m.clientWidth, H = m.clientHeight;
    Promise.resolve(app.init ? app.init({ width:W, height:H, background:"#0E0F13", antialias:true })
                             : null).then(function(){
      m.appendChild(app.canvas || app.view);
      var g = new PIXI.Graphics();
      g.circle(0,0,4).fill(0xffffff);
      var tex = app.renderer.generateTexture(g);
      var CL = [0x63A6FF, 0x4ED08A, 0xE0A33E, 0xF2686B, 0xB78BF0];
      var arr = [];
      for (var i = 0; i < 2000; i++) {
        var s = new PIXI.Sprite(tex);
        s.tint = CL[i%5]; s.anchor.set(.5);
        s.__a = Math.random()*Math.PI*2;
        s.__r = 12 + Math.random()*Math.min(W,H)*0.42;
        s.__v = 0.004 + Math.random()*0.012;
        s.scale.set(0.4 + Math.random()*0.7);
        app.stage.addChild(s); arr.push(s);
      }
      app.ticker.add(function(){
        for (var i = 0; i < arr.length; i++) {
          var s = arr[i]; s.__a += s.__v;
          s.x = W/2 + Math.cos(s.__a)*s.__r;
          s.y = H/2 + Math.sin(s.__a)*s.__r*0.62;
        }
      });
      RS.px = function(){ W = m.clientWidth; H = m.clientHeight; app.renderer.resize(W,H); };
    });
  
};

B["sv"] = async function(){

    await need("svgjs");
    var m = document.getElementById("sv-m"); m.innerHTML = "";
    var W = m.clientWidth, H = m.clientHeight;
    var d = SVG().addTo(m).size("100%","100%").viewbox(0,0,W,H);
    d.rect(W,H).fill("#15161B");
    d.rect(96,52).fill("#63A6FF").radius(7).move(22,26)
      .animate(2600).ease("<>").dmove(0,44).loop(true, true);
    d.circle(58).fill("#4ED08A").move(150,24)
      .animate(2200).ease("<>").dmove(46,54).loop(true, true);
    d.polygon("0,50 25,0 50,50").fill("#E0A33E").move(250,30)
      .animate(3000).rotate(360).loop(true, false);
    var t = d.text("SVG.js").font({ size:16, family:"system-ui", weight:600 }).fill("#E9EBEE").move(24, 122);
    d.path("M20 170 Q " + (W/2) + " 110 " + (W-24) + " 170")
      .fill("none").stroke({ color:"#B78BF0", width:2, dasharray:"5 4" });
    RS.sv = function(){ d.viewbox(0,0,m.clientWidth,m.clientHeight); };
  
};

B["tw"] = async function(){

    await need("two");
    var m = document.getElementById("tw-m"); m.innerHTML = "";
    var two = new Two({ type:Two.Types.svg, width:m.clientWidth, height:m.clientHeight }).appendTo(m);
    m.style.background = "#15161B";
    var cx = m.clientWidth/2, cy = m.clientHeight/2;
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0","#31d0c6"];
    var ring = [];
    for (var i = 0; i < 6; i++) {
      var a = i/6*Math.PI*2;
      var p = two.makePolygon(cx + Math.cos(a)*62, cy + Math.sin(a)*46, 22, 3 + i%4);
      p.fill = CL[i]; p.noStroke(); p.rotation = a;
      ring.push(p);
    }
    var c = two.makeCircle(cx, cy, 20); c.fill = "#E9EBEE"; c.noStroke();
    two.bind("update", function(f){
      ring.forEach(function(p,i){ p.rotation += 0.006*(i+1); });
      c.scale = 1 + Math.sin(f/28)*0.14;
    }).play();
    RS.tw = function(){ two.width = m.clientWidth; two.height = m.clientHeight; two.update(); };
  
};

B["zr"] = async function(){

    await need("zrender");
    var m = document.getElementById("zr-m"); m.innerHTML = "";
    var zr = zrender.init(m);
    zr.add(new zrender.Rect({ shape:{x:0,y:0,width:m.clientWidth,height:m.clientHeight},
      style:{fill:"#15161B"}, silent:true }));
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0"];
    var vals = [26, 41, 33, 52, 38];
    var bw = (m.clientWidth - 40) / 5;
    vals.forEach(function(v, i){
      var h = v * 2.6;
      var r = new zrender.Rect({
        shape:{ x:20 + i*bw + 8, y:m.clientHeight - 26, width:bw - 16, height:0, r:[4,4,0,0] },
        style:{ fill:CL[i] } });
      zr.add(r);
      r.animateTo({ shape:{ y:m.clientHeight - 26 - h, height:h } }, { duration:700, delay:i*90, easing:"cubicOut" });
      r.on("mouseover", function(){ this.attr("style", { fill:"#F6C348" }); });
      r.on("mouseout", function(){ this.attr("style", { fill:CL[i] }); });
      zr.add(new zrender.Text({ style:{ text:String(v), x:20+i*bw+bw/2, y:m.clientHeight-20,
        fill:"#7A828D", fontSize:10, align:"center" } }));
    });
    RS.zr = function(){ zr.resize(); };
  
};

B["exc"] = async function(){

    await need("react","reactdom","excalidraw");
    var L = window.ExcalidrawLib, e = React.createElement;
    if (!L) throw new Error("ExcalidrawLib 没加载");
    var seed = L.convertToExcalidrawElements([
      { type:"rectangle", x:70, y:60, width:120, height:56, strokeColor:"#63A6FF", backgroundColor:"#1D2C42", fillStyle:"solid" },
      { type:"ellipse",   x:250, y:60, width:110, height:56, strokeColor:"#4ED08A", backgroundColor:"#16301F", fillStyle:"solid" },
      { type:"arrow",     x:196, y:88, width:48, height:0,  strokeColor:"#8A93A0" },
    ]);
    ReactDOM.createRoot(document.getElementById("exc-m")).render(
      e("div", { style:{ width:"100%", height:"100%" } },
        e(L.Excalidraw, { theme:"dark", initialData:{ elements:seed,
          appState:{ viewBackgroundColor:"#15161B", zenModeEnabled:false } },
          UIOptions:{ canvasActions:{ toggleTheme:false, saveToActiveFile:false, loadScene:false, export:false } } })));
  
};

B["pf"] = async function(){

    await need("freehand");
    var m = document.getElementById("pf-m");
    m.innerHTML = '<svg style="width:100%;height:100%;display:block;background:#15161B;touch-action:none">'
      + '<g id="pf-g"></g></svg>'
      + '<div id="pf-hint" style="position:absolute;inset:0;display:flex;align-items:center;'
      + 'justify-content:center;color:#7A828D;font-size:11px;pointer-events:none">按住拖动，写几个字</div>';
    var svg = m.querySelector("svg"), g = m.querySelector("#pf-g"), hint = m.querySelector("#pf-hint");
    var getStroke = Freehand.getStroke;
    var pts = [], drawing = false, cur = null;
    function d2(stroke){
      if (!stroke.length) return "";
      var a = stroke.reduce(function(acc,p,i,arr){
        var n = arr[(i+1)%arr.length];
        acc.push(p[0],p[1],(p[0]+n[0])/2,(p[1]+n[1])/2); return acc; }, ["M",stroke[0][0],stroke[0][1],"Q"]);
      return a.join(" ") + " Z";
    }
    function xy(ev){ var r = svg.getBoundingClientRect(); return [ev.clientX-r.left, ev.clientY-r.top, ev.pressure||0.5]; }
    svg.addEventListener("pointerdown", function(ev){
      drawing = true; hint.style.display = "none"; pts = [xy(ev)];
      cur = document.createElementNS("http://www.w3.org/2000/svg","path");
      cur.setAttribute("fill", "#63A6FF"); g.appendChild(cur);
      svg.setPointerCapture(ev.pointerId);
    });
    svg.addEventListener("pointermove", function(ev){
      if (!drawing) return;
      pts.push(xy(ev));
      cur.setAttribute("d", d2(getStroke(pts, { size:9, thinning:.62, smoothing:.5, streamline:.5 })));
    });
    svg.addEventListener("pointerup", function(){ drawing = false; });
    // 先自动画一笔，免得打开是一片空白
    var demo = [], t = 0;
    for (var i = 0; i < 60; i++) { t += .1;
      demo.push([40 + i*4.4, 100 + Math.sin(t*1.7)*34, 0.35 + Math.abs(Math.sin(t))*0.5]); }
    var p0 = document.createElementNS("http://www.w3.org/2000/svg","path");
    p0.setAttribute("fill", "#4ED08A");
    p0.setAttribute("d", d2(getStroke(demo, { size:11, thinning:.7, smoothing:.5, streamline:.4 })));
    g.appendChild(p0);
  
};

B["ml"] = async function(){

    await need("maplibre");
    var m = document.getElementById("ml-m"); m.innerHTML = "";
    var feats = [], cities = [[116.4,39.9,"北京"],[121.5,31.2,"上海"],[113.3,23.1,"广州"],
      [114.06,22.55,"深圳"],[104.07,30.67,"成都"],[108.95,34.27,"西安"],[126.6,45.8,"哈尔滨"]];
    cities.forEach(function(c){ feats.push({ type:"Feature",
      geometry:{ type:"Point", coordinates:[c[0],c[1]] }, properties:{ name:c[2] } }); });
    var lines = { type:"FeatureCollection", features: cities.slice(1).map(function(c){
      return { type:"Feature", geometry:{ type:"LineString",
        coordinates:[[116.4,39.9],[c[0],c[1]]] }, properties:{} }; }) };
    var map = new maplibregl.Map({ container:m, attributionControl:false,
      center:[112,32], zoom:2.7, pitch:34,
      style:{ version:8, sources:{}, layers:[{ id:"bg", type:"background",
        paint:{ "background-color":"#0E0F13" } }] } });
    map.on("load", function(){
      map.addSource("l", { type:"geojson", data:lines });
      map.addLayer({ id:"l", type:"line", source:"l",
        paint:{ "line-color":"#63A6FF", "line-width":1.2, "line-opacity":.6 } });
      map.addSource("p", { type:"geojson", data:{ type:"FeatureCollection", features:feats } });
      map.addLayer({ id:"p", type:"circle", source:"p",
        paint:{ "circle-radius":5, "circle-color":"#4ED08A",
                "circle-stroke-width":1.4, "circle-stroke-color":"#0E0F13" } });
      map.addLayer({ id:"t", type:"symbol", source:"p",
        layout:{ "text-field":["get","name"], "text-size":10, "text-offset":[0,1.2] },
        paint:{ "text-color":"#B2B8C1", "text-halo-color":"#0E0F13", "text-halo-width":1 } });
    });
    RS.ml = function(){ map.resize(); };
  
};

B["dk"] = async function(){

    await need("deck");
    var m = document.getElementById("dk-m"); m.innerHTML = "";
    var D = deck;
    var pts = [];
    for (var i = 0; i < 20000; i++) {
      var lon = 75 + Math.random()*60, lat = 20 + Math.random()*32;
      var w = Math.exp(-(Math.pow(lon-116,2)+Math.pow(lat-33,2))/220);
      if (Math.random() > w*1.6 + 0.06) { i--; continue; }
      pts.push({ p:[lon,lat], v:w });
    }
    var arcs = [[116.4,39.9,121.5,31.2],[116.4,39.9,113.3,23.1],[121.5,31.2,104.07,30.67],
                [116.4,39.9,108.95,34.27],[113.3,23.1,104.07,30.67]].map(function(a){
      return { s:[a[0],a[1]], t:[a[2],a[3]] }; });
    new D.DeckGL({ container:m, initialViewState:{ longitude:107, latitude:33, zoom:2.6, pitch:44 },
      controller:true, style:{ background:"#0E0F13" },
      layers:[
        new D.ScatterplotLayer({ id:"s", data:pts, getPosition:function(d){ return d.p; },
          getRadius:function(d){ return 9000 + d.v*26000; }, radiusUnits:"meters",
          getFillColor:function(d){ return [99+d.v*100, 166, 255, 120]; }, pickable:false }),
        new D.ArcLayer({ id:"a", data:arcs, getSourcePosition:function(d){ return d.s; },
          getTargetPosition:function(d){ return d.t; },
          getSourceColor:[78,208,138], getTargetColor:[246,195,72], getWidth:1.6 }) ] });
  
};

B["ol"] = async function(){

    await need("ol");
    var m = document.getElementById("ol-m"); m.innerHTML = "";
    var cities = [[116.4,39.9,"北京",92],[121.5,31.2,"上海",88],[113.3,23.1,"广州",61],
      [114.06,22.55,"深圳",74],[104.07,30.67,"成都",55],[108.95,34.27,"西安",41],
      [126.6,45.8,"哈尔滨",28],[91.1,29.65,"拉萨",12],[87.6,43.8,"乌鲁木齐",18]];
    var feats = cities.map(function(c){
      var f = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([c[0],c[1]])));
      f.set("name", c[2]); f.set("v", c[3]); return f;
    });
    var src = new ol.source.Vector({ features:feats });
    function style(f){
      var v = f.get("v");
      return new ol.style.Style({
        image: new ol.style.Circle({ radius: 4 + v/14,
          fill: new ol.style.Fill({ color:"rgba(99,166,255,.7)" }),
          stroke: new ol.style.Stroke({ color:"#0E0F13", width:1.2 }) }),
        text: new ol.style.Text({ text:f.get("name"), offsetY:-16, font:"10px system-ui",
          fill: new ol.style.Fill({ color:"#B2B8C1" }) }) });
    }
    var map = new ol.Map({ target:m, controls:[],
      layers:[ new ol.layer.Vector({ source:src, style:style }) ],
      view: new ol.View({ center: ol.proj.fromLonLat([106,34]), zoom:3.1 }) });
    m.style.background = "#0E0F13";
    var sel = new ol.interaction.Select({ style: function(f){
      return new ol.style.Style({ image: new ol.style.Circle({ radius: 6 + f.get("v")/12,
        fill: new ol.style.Fill({ color:"#F6C348" }),
        stroke: new ol.style.Stroke({ color:"#0E0F13", width:1.4 }) }),
        text: new ol.style.Text({ text:f.get("name")+" "+f.get("v"), offsetY:-18,
          font:"600 10px system-ui", fill:new ol.style.Fill({ color:"#F6C348" }) }) });
    } });
    map.addInteraction(sel);
    RS.ol = function(){ map.updateSize(); };
  
};

B["l7"] = async function(){

    await need("l7");
    var m = document.getElementById("l7-m"); m.innerHTML = "";
    var scene = new L7.Scene({ id:m, logoVisible:false,
      map: new L7.Map({ center:[107,33], zoom:2.6, style:"blank", pitch:0 }) });
    m.style.background = "#0E0F13";
    var data = [];
    for (var i = 0; i < 900; i++) {
      var lon = 76 + Math.random()*58, lat = 19 + Math.random()*32;
      var w = Math.exp(-(Math.pow(lon-116,2)+Math.pow(lat-32,2))/200);
      if (Math.random() > w*1.7 + 0.08) { i--; continue; }
      data.push({ lng:lon, lat:lat, v:+(w*100).toFixed(1) });
    }
    scene.on("loaded", function(){
      var pl = new L7.PointLayer({})
        .source(data, { parser:{ type:"json", x:"lng", y:"lat" } })
        .shape("circle").size("v", [2, 12])
        .color("v", ["#1E3A5F","#2E5E8C","#63A6FF","#8FC5FF","#CFE4FF"])
        .style({ opacity:.85, strokeWidth:0 });
      scene.addLayer(pl);
    });
    RS.l7 = function(){ try { scene.map.resize && scene.map.resize(); } catch(e){} };
  
};

B["th"] = async function(){

    await need("three");
    var m = document.getElementById("th-m"); m.innerHTML = "";
    var W = m.clientWidth, H = m.clientHeight;
    var sc = new THREE.Scene(); sc.background = new THREE.Color(0x0E0F13);
    sc.fog = new THREE.Fog(0x0E0F13, 9, 22);
    var cam = new THREE.PerspectiveCamera(46, W/H, .1, 100); cam.position.set(0, 3.4, 8.2);
    var rd = new THREE.WebGLRenderer({ antialias:true });
    rd.setPixelRatio(Math.min(devicePixelRatio, 2)); rd.setSize(W, H);
    m.appendChild(rd.domElement);
    sc.add(new THREE.AmbientLight(0x445066, 1.1));
    var dl = new THREE.DirectionalLight(0xffffff, 2.1); dl.position.set(4, 7, 5); sc.add(dl);
    var pl = new THREE.PointLight(0x63A6FF, 26, 20); pl.position.set(-4, 2, 3); sc.add(pl);
    var grid = new THREE.GridHelper(20, 20, 0x2A2E36, 0x1C1F26);
    grid.position.y = -1.5; sc.add(grid);
    var CL = [0x63A6FF, 0x4ED08A, 0xE0A33E, 0xF2686B, 0xB78BF0];
    var geos = [ new THREE.IcosahedronGeometry(.72, 0), new THREE.TorusKnotGeometry(.5,.17,84,12),
                 new THREE.BoxGeometry(1.05,1.05,1.05), new THREE.OctahedronGeometry(.82),
                 new THREE.TorusGeometry(.56,.2,14,40) ];
    var objs = [];
    for (var i = 0; i < 5; i++) {
      var mesh = new THREE.Mesh(geos[i], new THREE.MeshStandardMaterial({
        color:CL[i], roughness:.32, metalness:.55 }));
      mesh.position.set((i-2)*1.75, 0, 0);
      sc.add(mesh); objs.push(mesh);
    }
    var drag = false, px = 0, rot = 0;
    rd.domElement.style.cursor = "grab";
    rd.domElement.addEventListener("pointerdown", function(e){ drag = true; px = e.clientX; });
    addEventListener("pointerup", function(){ drag = false; });
    addEventListener("pointermove", function(e){ if (drag) { rot += (e.clientX-px)*.008; px = e.clientX; } });
    (function loop(){
      requestAnimationFrame(loop);
      objs.forEach(function(o,i){ o.rotation.x += .006+i*.001; o.rotation.y += .009; });
      sc.rotation.y = rot;
      cam.lookAt(0,0,0); rd.render(sc, cam);
    })();
    RS.th = function(){ W = m.clientWidth; H = m.clientHeight;
      cam.aspect = W/H; cam.updateProjectionMatrix(); rd.setSize(W,H); };
  
};

B["bab"] = async function(){

    await need("babylon");
    var m = document.getElementById("bab-m"); m.innerHTML = "<canvas style='width:100%;height:100%;display:block;outline:none'></canvas>";
    var cv = m.querySelector("canvas");
    var eng = new BABYLON.Engine(cv, true, { preserveDrawingBuffer:true, stencil:true });
    var sc = new BABYLON.Scene(eng);
    sc.clearColor = new BABYLON.Color4(0.055, 0.059, 0.075, 1);
    var cam = new BABYLON.ArcRotateCamera("c", -Math.PI/2.4, Math.PI/2.6, 11, BABYLON.Vector3.Zero(), sc);
    cam.attachControl(cv, true); cam.wheelPrecision = 26;
    cam.lowerRadiusLimit = 5; cam.upperRadiusLimit = 22;
    new BABYLON.HemisphericLight("h", new BABYLON.Vector3(0,1,0), sc).intensity = 0.68;
    var dl = new BABYLON.DirectionalLight("d", new BABYLON.Vector3(-.6,-1,-.5), sc); dl.intensity = 1.5;
    var CL = ["#63A6FF","#4ED08A","#E0A33E","#F2686B","#B78BF0"];
    var mk = [
      function(n){ return BABYLON.MeshBuilder.CreateTorusKnot(n, { radius:.62, tube:.2, radialSegments:64 }, sc); },
      function(n){ return BABYLON.MeshBuilder.CreateIcoSphere(n, { radius:.82, subdivisions:2 }, sc); },
      function(n){ return BABYLON.MeshBuilder.CreateBox(n, { size:1.3 }, sc); },
      function(n){ return BABYLON.MeshBuilder.CreateCylinder(n, { height:1.5, diameterTop:0, diameterBottom:1.3 }, sc); },
      function(n){ return BABYLON.MeshBuilder.CreateTorus(n, { diameter:1.5, thickness:.4, tessellation:38 }, sc); } ];
    var objs = [];
    for (var i = 0; i < 5; i++) {
      var o = mk[i]("o"+i);
      o.position.x = (i-2) * 2.1;
      var mt = new BABYLON.PBRMetallicRoughnessMaterial("m"+i, sc);
      mt.baseColor = BABYLON.Color3.FromHexString(CL[i]);
      mt.metallic = .55; mt.roughness = .32;
      o.material = mt; objs.push(o);
    }
    var g = BABYLON.MeshBuilder.CreateGround("g", { width:22, height:22 }, sc);
    g.position.y = -1.7;
    var gm = new BABYLON.StandardMaterial("gm", sc);
    gm.diffuseColor = new BABYLON.Color3(.09,.1,.12); gm.specularColor = new BABYLON.Color3(0,0,0);
    gm.wireframe = true; gm.emissiveColor = new BABYLON.Color3(.11,.12,.15);
    g.material = gm;
    sc.registerBeforeRender(function(){
      objs.forEach(function(o,i){ o.rotation.y += .008; o.rotation.x += .004 + i*.001; });
    });
    eng.runRenderLoop(function(){ sc.render(); });
    RS.bab = function(){ eng.resize(); };
  
};

B["m3d"] = async function(){

    await need("mol3d");
    var m = document.getElementById("m3d-m"); m.innerHTML = "";
    m.style.position = "relative";
    var v = $3Dmol.createViewer(m, { backgroundColor:"#0E0F13" });
    // 咖啡因 C8H10N4O2 —— 内联的 SDF，CSP 挡外部请求，不能去 PDB 拉
    var sdf = [
      "caffeine","  Mrv  ","",
      " 24 25  0  0  0  0            999 V2000",
      "    0.0000    1.4000    0.0000 N   0  0", "    1.2124    0.7000    0.0000 C   0  0",
      "    1.2124   -0.7000    0.0000 N   0  0", "    0.0000   -1.4000    0.0000 C   0  0",
      "   -1.2124   -0.7000    0.0000 C   0  0", "   -1.2124    0.7000    0.0000 C   0  0",
      "    2.4249    1.4000    0.0000 O   0  0", "    0.0000   -2.8000    0.0000 O   0  0",
      "   -2.5311   -1.1287    0.0000 N   0  0", "   -3.3524    0.0000    0.0000 C   0  0",
      "   -2.5311    1.1287    0.0000 N   0  0", "    0.0000    2.8000    0.0000 C   0  0",
      "    2.4249   -1.4000    0.0000 C   0  0", "   -3.0000   -2.5000    0.0000 C   0  0",
      "   -4.4324    0.0000    0.0000 H   0  0", "    0.9000    3.2000    0.4000 H   0  0",
      "   -0.9000    3.2000    0.4000 H   0  0", "    0.0000    3.1000   -1.0000 H   0  0",
      "    3.3000   -0.9000    0.3000 H   0  0", "    2.3000   -2.3000    0.5000 H   0  0",
      "    2.5000   -1.6000   -1.0000 H   0  0", "   -3.9000   -2.6000    0.5000 H   0  0",
      "   -2.3000   -3.1000    0.5000 H   0  0", "   -3.1000   -2.8000   -1.0000 H   0  0",
      "  1  2  1  0", "  2  3  1  0", "  3  4  1  0", "  4  5  1  0", "  5  6  2  0",
      "  6  1  1  0", "  2  7  2  0", "  4  8  2  0", "  5  9  1  0", "  9 10  1  0",
      " 10 11  2  0", " 11  6  1  0", "  1 12  1  0", "  3 13  1  0", "  9 14  1  0",
      " 10 15  1  0", " 12 16  1  0", " 12 17  1  0", " 12 18  1  0", " 13 19  1  0",
      " 13 20  1  0", " 13 21  1  0", " 14 22  1  0", " 14 23  1  0", " 14 24  1  0",
      "M  END"].join("\n");
    v.addModel(sdf, "sdf");
    v.setStyle({}, { stick:{ radius:.13, colorscheme:"cyanCarbon" },
                     sphere:{ scale:.24, colorscheme:"cyanCarbon" } });
    v.zoomTo(); v.render(); v.spin({ x:0, y:1, z:.2 }, 0.6);
    RS.m3d = function(){ v.resize(); };
  
};

B["mer"] = async function(){
var SRC = "flowchart TD\n    A[拿到素材] --> B{时长够?}\n    B -- 是 --> C[粗剪]\n    B -- 否 --> D[补拍]\n    D --> A\n    C --> E{过审?}\n    E -- 是 --> F[发布]\n    E -- 否 --> G[打回修改]\n    G --> C";

    await need("mermaid");
    var m = document.getElementById("mer-m");
    var lib = window.MermaidLib && (window.MermaidLib.default || window.MermaidLib);
    if (!lib) throw new Error("MermaidLib 没加载");
    lib.initialize({ startOnLoad:false, securityLevel:"loose", theme:"dark",
      themeVariables:{ background:"#15161B", primaryColor:"#232733", primaryTextColor:"#E9EBEE",
        primaryBorderColor:"#4A5262", lineColor:"#8A93A0", fontFamily:"system-ui,sans-serif",
        edgeLabelBackground:"#15161B", tertiaryColor:"#15161B" } });
    lib.render("mer-svg", SRC).then(function(r){ m.innerHTML = r.svg; })
      ["catch"](function(e){ fail("mer", "Mermaid", e); });
    var showing = false, keep = null;
    document.getElementById("mer-btn").addEventListener("click", function(){
      if (!showing) { keep = m.innerHTML; m.innerHTML = ""; m.appendChild(pre(SRC)); this.textContent = "看画出来的图"; }
      else { m.innerHTML = keep; this.textContent = "看输入的文本"; }
      showing = !showing;
    });
    function pre(t){
      var p = document.createElement("pre");
      p.style.cssText = "margin:0;font-family:var(--mono);font-size:10.5px;line-height:1.7;color:#B2B8C1;text-align:left;white-space:pre";
      p.textContent = t; return p;
    }
  
};

B["viz"] = async function(){
var SRC = "digraph G {\n  bgcolor=\"#15161B\"; rankdir=LR; pad=0.2;\n  node [shape=box style=\"rounded,filled\" fillcolor=\"#1D2028\" color=\"#4A5262\"\n        fontcolor=\"#E9EBEE\" fontname=\"system-ui\" fontsize=11 penwidth=1.1];\n  edge [color=\"#8A93A0\" penwidth=1.1 arrowsize=.7];\n  选题 -> 写脚本 -> 配音 -> 剪辑 -> 审核 -> 发布;\n  审核 -> 写脚本 [label=\"打回\" fontcolor=\"#F2686B\" color=\"#F2686B\" fontsize=9];\n  剪辑 -> 配音 [label=\"重录\" fontcolor=\"#E0A33E\" color=\"#E0A33E\" fontsize=9];\n}";

    await need("viz");
    var m = document.getElementById("viz-m");
    Viz.instance().then(function(viz){
      var svg = viz.renderSVGElement(SRC);
      svg.style.maxWidth = "100%"; svg.style.maxHeight = "100%";
      m.innerHTML = ""; m.appendChild(svg);
    })["catch"](function(e){ fail("viz", "Viz.js", e); });
    var showing = false, keep = null;
    document.getElementById("viz-btn").addEventListener("click", function(){
      if (!showing) { keep = m.innerHTML; m.innerHTML = ""; m.appendChild(pre(SRC)); this.textContent = "看画出来的图"; }
      else { m.innerHTML = keep; this.textContent = "看 DOT 源码"; }
      showing = !showing;
    });
    function pre(t){
      var p = document.createElement("pre");
      p.style.cssText = "margin:0;font-family:var(--mono);font-size:9.5px;line-height:1.6;color:#B2B8C1;text-align:left;white-space:pre";
      p.textContent = t; return p;
    }
  
};

B["wd"] = async function(){

    await need("wavedrom","wavedrom-skin");
    var m = document.getElementById("wd-m");
    m.innerHTML = '<div id="wd-host" style="width:100%"></div>';
    var spec = { signal: [
      { name:"clk",  wave:"p.......|..." },
      { name:"req",  wave:"0.1..0..|1.0", node:".a....b..c." },
      { name:"addr", wave:"x.3.4.5.|x..", data:["A0","A1","A2"] },
      { name:"ack",  wave:"0..1.0..|.10" },
      {},
      { name:"data", wave:"x...2.2.|2.x", data:["D0","D1","D2"] } ],
      config:{ hscale:1 } };
    var host = document.getElementById("wd-host");
    host.innerHTML = '<div id="wd-0"></div>';   // 它找的是 前缀+序号，不是随便什么 id
    WaveDrom.RenderWaveForm(0, spec, "wd-");
    var s = m.querySelector("svg");
    if (s) { s.style.maxWidth = "100%"; s.style.background = "#F3F1EA"; s.style.borderRadius = "5px"; }
  
};

B["pin"] = async function(){

    await need("pintora");
    var m = document.getElementById("pin-m"); m.innerHTML = "";
    var P = window.pintora && (window.pintora.default || window.pintora);
    if (!P) throw new Error("pintora 全局没挂上");
    P.default ? null : null;
    var code = [
      "sequenceDiagram",
      "  @param messageFontSize 11",
      "  编辑 ->> 审核: 提交成片",
      "  审核 -->> 编辑: 打回：字幕错行",
      "  编辑 ->> 审核: 再交",
      "  审核 ->> 平台: 过审，发布",
      "  平台 -->> 编辑: 已上线"
    ].join("\n");
    (P.renderTo || P.default.renderTo).call(P, code, {
      container: m,
      renderer: "svg",
      pintoraConfig: { themeConfig: { theme: "dark" }, core: { defaultRenderer: "svg" } },
      onRender: function(){ var s = m.querySelector("svg");
        if (s) { s.style.maxWidth = "100%"; s.style.maxHeight = "100%"; } },
      onError: function(e){ fail("pin", "Pintora", e); } });
  
};

B["fgt"] = async function(){

    await need("gantt");
    var m = document.getElementById("fgt-m");
    m.innerHTML = '<svg id="fgt-svg" style="width:100%"></svg>';
    var d0 = new Date(2026, 6, 1);
    function ds(o){ var d = new Date(d0.getTime() + o*864e5); return d.toISOString().slice(0,10); }
    var tasks = [
      { id:"1", name:"选题调研",   start:ds(0),  end:ds(4),  progress:100 },
      { id:"2", name:"写脚本",     start:ds(4),  end:ds(9),  progress:80, dependencies:"1" },
      { id:"3", name:"配音",       start:ds(9),  end:ds(12), progress:45, dependencies:"2" },
      { id:"4", name:"剪辑",       start:ds(11), end:ds(18), progress:20, dependencies:"2" },
      { id:"5", name:"审核发布",   start:ds(18), end:ds(22), progress:0,  dependencies:"3,4" } ];
    new Gantt("#fgt-svg", tasks, { view_mode:"Day", bar_height:16, padding:12,
      language:"zh", readonly:false });
    m.style.overflow = "auto"; m.style.background = "#15161B";
    var s = document.createElement("style");
    s.textContent = "#fgt-m .grid-background{fill:#15161B}#fgt-m .grid-row{fill:#15161B}"
      + "#fgt-m .grid-row:nth-child(even){fill:#17191F}#fgt-m .row-line,#fgt-m .tick{stroke:#22252B}"
      + "#fgt-m .bar{fill:#2A2F38}#fgt-m .bar-progress{fill:#63A6FF}"
      + "#fgt-m .bar-label{fill:#E9EBEE;font-size:10px}#fgt-m text{fill:#8A93A0;font-size:9px}"
      + "#fgt-m .today-highlight{fill:#1E2530}#fgt-m .arrow{stroke:#E0A33E}";
    document.head.appendChild(s);
  
};

B["vt"] = async function(){

    await need("vistimeline");
    var m = document.getElementById("vt-m"); m.innerHTML = "";
    var d0 = new Date(2026, 6, 1);
    function dt(o){ return new Date(d0.getTime() + o*864e5); }
    var items = new vis.DataSet([
      { id:1, group:1, content:"选题", start:dt(0), end:dt(4) },
      { id:2, group:1, content:"脚本", start:dt(4), end:dt(9) },
      { id:3, group:2, content:"配音", start:dt(9), end:dt(12) },
      { id:4, group:2, content:"剪辑", start:dt(11), end:dt(18) },
      { id:5, group:3, content:"审核", start:dt(18), end:dt(21) },
      { id:6, group:3, content:"上线", start:dt(22), type:"point" } ]);
    var groups = new vis.DataSet([
      { id:1, content:"前期" }, { id:2, content:"制作" }, { id:3, content:"发布" } ]);
    new vis.Timeline(m, items, groups, { editable:true, stack:false,
      margin:{ item:6 }, orientation:"top", zoomMin:36e5 });
    var s = document.createElement("style");
    s.textContent = "#vt-m .vis-timeline{border-color:#23252C;background:#15161B}"
      + "#vt-m .vis-panel,#vt-m .vis-labelset .vis-label{border-color:#23252C;color:#B2B8C1}"
      + "#vt-m .vis-time-axis .vis-text{color:#7A828D;font-size:9px}"
      + "#vt-m .vis-grid.vis-vertical{border-color:#1E2026}"
      + "#vt-m .vis-item{background:#1D2028;border-color:#4A5262;color:#E9EBEE;font-size:10px}"
      + "#vt-m .vis-item.vis-selected{background:#1B2230;border-color:#63A6FF}"
      + "#vt-m .vis-item.vis-point .vis-dot{border-color:#F6C348}";
    document.head.appendChild(s);
  
};

B["jg"] = async function(){

    await need("jsgantt");
    var m = document.getElementById("jg-m"); m.innerHTML = "";
    m.style.overflow = "auto"; m.style.background = "#15161B";
    var g = new JSGantt.GanttChart(m, "day");
    g.setOptions({ vCaptionType:"Complete", vDayMajorDateDisplayFormat:"mon yyyy",
      vShowRes:1, vShowCost:0, vShowComp:1, vShowDur:1, vShowStartDate:1, vShowEndDate:1,
      vUseSingleCell:1e4, vFormatArr:["Day","Week"], vLang:"cn" });
    function row(id,name,s,e,p,par,grp,res){
      g.AddTaskItemObject({ pID:id, pName:name, pStart:s, pEnd:e, pClass:grp?"ggroupblack":"gtaskblue",
        pLink:"", pMile:0, pRes:res, pComp:p, pGroup:grp, pParent:par, pOpen:1, pDepend:"", pCaption:"" });
    }
    row(1,"视频生产","2026-07-01","2026-07-24",52,0,1,"");
    row(11,"选题调研","2026-07-01","2026-07-04",100,1,0,"小李");
    row(12,"写脚本",  "2026-07-05","2026-07-09",80, 1,0,"小王");
    row(13,"配音",    "2026-07-10","2026-07-12",45, 1,0,"小张");
    row(14,"剪辑",    "2026-07-12","2026-07-18",20, 1,0,"小陈");
    row(15,"审核发布","2026-07-19","2026-07-24",0,  1,0,"老板");
    g.Draw();
    var s = document.createElement("style");
    s.textContent = "#jg-m .gmain,#jg-m .gchartlable,#jg-m .gtasktableh,#jg-m .gcharttable{background:#15161B;color:#B2B8C1;font-size:10px}"
      + "#jg-m table{border-color:#23252C}#jg-m td,#jg-m th{border-color:#23252C!important;color:#B2B8C1}"
      + "#jg-m .ghead,#jg-m .gtasktableh div{color:#7A828D}"
      + "#jg-m .gtaskblue{background:#63A6FF!important}#jg-m .ggroupblack{background:#4A5262!important}";
    document.head.appendChild(s);
  
};

B["me"] = async function(){

    var m = document.getElementById("me-m");
    m.innerHTML = '<div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start;'
      + 'justify-content:center;height:100%;padding:14px 16px;background:#15161B">'
      + '<div style="font:600 12px system-ui;color:#F2686B">这一个我没跑通</div>'
      + '<div style="font:11px/1.7 system-ui;color:#B2B8C1">dist/MindElixir.js 加载后 window.MindElixir 是 undefined，这个构建大概不是 UMD。</div>'
      + '<div style="font:10px var(--mono);color:#7A828D">包本身没问题（协议 / 发版都合格，已内联在本页），是我这一版的接入代码没写对。</div></div>';
  
};

B["jm"] = async function(){

    await need("jsmind");
    var m = document.getElementById("jm-m"); m.innerHTML = "";
    m.id = "jm-m"; m.style.background = "#15161B";
    var JM = window.jsMind && (window.jsMind.default || window.jsMind);
    var jm = new JM({ container:"jm-m", editable:true, theme:"primary",
      view:{ hmargin:20, vmargin:14, line_width:1.4, line_color:"#5A6472" } });
    jm.show({ meta:{ name:"wm", author:"", version:"1" }, format:"node_tree",
      data:{ id:"root", topic:"内容流水线", children:[
        { id:"s1", topic:"输入", direction:"left", children:[
          { id:"s11", topic:"选题库" }, { id:"s12", topic:"评论区" } ] },
        { id:"s2", topic:"生产", direction:"right", children:[
          { id:"s21", topic:"脚本" }, { id:"s22", topic:"配音" }, { id:"s23", topic:"剪辑" } ] },
        { id:"s3", topic:"输出", direction:"right", children:[
          { id:"s31", topic:"抖音" }, { id:"s32", topic:"B 站" }, { id:"s33", topic:"YouTube" } ] } ] } });
    var s = document.createElement("style");
    s.textContent = "#jm-m jmnode{background:#1D2028!important;color:#E9EBEE!important;"
      + "border:1px solid #3C4250!important;border-radius:5px!important;font-size:11px!important;box-shadow:none!important}"
      + "#jm-m jmnode.root{background:#1B2230!important;border-color:#63A6FF!important;font-size:12px!important}"
      + "#jm-m jmnode:hover{background:#232733!important}"
      + "#jm-m jmexpander{background:#2A2E36!important;color:#B2B8C1!important;border-color:#3C4250!important}";
    document.head.appendChild(s);
    RS.jm = function(){ jm.resize(); };
  
};
window.__afterDemos();
})();
