# FrontDemo

**56 个前端开源图形库，按 13 个领域分类，每一个都在页面里真实运行。**

没有截图、没有还原图 —— 打开页面看到的每一张图，都是那个库当场画出来的。

## 在线看

启用 GitHub Pages 后地址是 <https://macromozilla.github.io/FrontDemo/>

## 收录判据

四条缺一不可，全部查 npm registry 实测（数据截至 2026-08-01）：

1. `npm` 装得到、能自己构建的**开源库**
2. **一年内发过版**
3. 仍在维护
4. 协议允许商用

被刷掉的典型：**Highcharts**（商用要买）、**ApexCharts / bpmn-js**（`SEE LICENSE IN LICENSE`，非标准开源协议）、**tldraw**（4.0 起生产要授权码）、**d3**（870 天没发版）、**Leaflet**（1170 天）、**Rough.js**（984 天）。

## 页面能做什么

- **两级筛选**：先挑领域，再勾能力（拖拽编辑 / 画连线 / 自动布局 / 万级元素 / WebGL / 撤销 / React 封装 / 中文文档…），表格和下面的 demo 同时收窄
- **自己挑**：每行一个勾选框，选中整行变蓝，可**一键复制成 Markdown 表格或纯文本清单**（存 localStorage，刷新还在）
- **一排 2/3/4/6 个**可切换
- demo 滚进视野才加载对应的库，所以首屏很快

## 目录

```
index.html              页面骨架
assets/css/page.css     全部页面样式
assets/css/vendor.css   各库自带样式表的合并
assets/js/data.js       ★ 唯一真源：库清单 / 领域 / 能力矩阵
assets/js/page.js       表格渲染、筛选、勾选复制、按需加载
assets/js/demos.js      56 段 demo，每个库一段
vendor/                 各库的浏览器构建（原样，未改动）
```

## 想加一个库

1. `assets/js/data.js` 的 `LIBS` 里加一条
2. `vendor/` 放进它的浏览器构建
3. `assets/js/demos.js` 里写一段：

```js
B["你的key"] = async function(){
  await need("vendor里的文件名");        // 多个依赖按顺序写，会串行加载
  var m = document.getElementById("你的key-m");
  // …在 m 里把图画出来
  RS["你的key"] = function(){ /* 改「一排几个」时重排尺寸 */ };
};
```

4. `index.html` 里加一张对应的卡片

## 已知没跑通的 5 个

页面上这几张卡片明写着「这一个我没跑通」+ 具体原因，包本身没问题：

| 库 | 卡在哪 |
|---|---|
| webgl-plot | 各种入口都拿不到 `addLine` |
| WaveSurfer.js | CSP 下只能喂预算好的 peaks，v7 离线路径画不出波形 |
| Fabric.js | v7 的 Canvas 建了、对象 add 了、`renderAll()` 后画布仍空 |
| perfect-freehand | 自动示例笔画没出来 |
| Mind Elixir | `dist/MindElixir.js` 加载后全局是 undefined，不是 UMD |

**其余 51 个全部真机验证出图**（Chromium headless 逐个引爆 + 截图肉眼复核）。

## 全部收录

### 流程图 / 节点编辑器（7）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| AntV X6 | `@antv/x6` | ★★★★★ | MIT | 2026-03-18 | 483 KB |
| React Flow | `@xyflow/react` | ★★★★★ | MIT | 2026-07-06 | 186 KB |
| Vue Flow | `@vue-flow/core` | ★★★★ | MIT | 2026-01-28 | 164 KB |
| JointJS | `@joint/core` | ★★★ | MPL-2.0 | 2026-07-27 | 462 KB |
| diagram-js | `diagram-js` | ★★★ | MIT | 2026-07-29 | 35 KB |
| Baklava.js | `baklavajs` | ★★★ | MIT | 2025-11-02 | 172 KB |
| maxGraph | `@maxgraph/core` | ★★ | Apache-2.0 | 2026-07-08 | 609 KB |

### 关系图 / 网络图（7）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| AntV G6 | `@antv/g6` | ★★★★ | MIT | 2026-05-08 | 1351 KB |
| Cytoscape.js | `cytoscape` | ★★★★ | MIT | 2026-06-02 | 425 KB |
| vis-network | `vis-network` | ★★★★ | Apache-2.0 / MIT | 2026-05-15 | 395 KB |
| force-graph | `force-graph` | ★★★★ | MIT | 2026-04-16 | 173 KB |
| Reagraph | `reagraph` | ★★★★ | Apache-2.0 | 2026-06-25 | 1391 KB |
| Sigma.js | `sigma` | ★★★ | MIT | 2026-04-30 | 155 KB |
| 3d-force-graph | `3d-force-graph` | ★★★ | MIT | 2026-04-05 | 1283 KB |

### 通用图表（8）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| ECharts | `echarts` | ★★★★★ | Apache-2.0 | 2026-05-19 | 1096 KB |
| Chart.js | `chart.js` | ★★★★★ | MIT | 2025-10-13 | 204 KB |
| AntV G2 | `@antv/g2` | ★★★★ | MIT | 2026-01-06 | 1058 KB |
| billboard.js | `billboard.js` | ★★★★ | MIT | 2026-07-06 | 440 KB |
| Plotly.js | `plotly.js-basic-dist-min` | ★★★★ | MIT | 2026-07-03 | 1094 KB |
| Recharts | `recharts` | ★★★★ | MIT | 2026-07-25 | 578 KB |
| Chartist | `chartist` | ★★★ | MIT / WTFPL | 2025-09-30 | 37 KB |
| chart.xkcd | `chart.xkcd` | ★★★ | MIT | 2026-06-16 | 152 KB |

### 高性能 / 大数据（3）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Lightweight Charts | `lightweight-charts` | ★★★★★ | Apache-2.0 | 2026-04-24 | 192 KB |
| Dygraphs | `dygraphs` | ★★★★ | MIT | 2026-07-27 | 127 KB |
| webgl-plot | `webgl-plot` | ★★★ | MIT | 2026-02-16 | 79 KB |

### 可视化语法（2）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Vega-Lite | `vega-lite` | ★★★★★ | BSD-3-Clause | 2026-04-24 | 245 KB |
| Vega | `vega` | ★★★★ | BSD-3-Clause | 2026-07-22 | 504 KB |

### 表格 / 透视（5）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| AG Grid | `ag-grid-community` | ★★★★★ | MIT | 2026-07-22 | 1896 KB |
| Tabulator | `tabulator-tables` | ★★★★ | MIT | 2026-06-23 | 436 KB |
| AntV S2 | `@antv/s2` | ★★★★ | MIT | 2026-06-10 | 1105 KB |
| JsBarcode | `jsbarcode` | ★★★★ | MIT | 2026-01-07 | 65 KB |
| WaveSurfer.js | `wavesurfer.js` | ★★★★ | BSD-3-Clause | 2026-07-17 | 42 KB |

### 2D 画布引擎（6）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Konva | `konva` | ★★★★★ | MIT | 2026-04-30 | 182 KB |
| Fabric.js | `fabric` | ★★★★★ | MIT | 2026-05-18 | 292 KB |
| PixiJS | `pixi.js` | ★★★★★ | MIT | 2026-06-04 | 779 KB |
| SVG.js | `@svgdotjs/svg.js` | ★★★★ | MIT | 2026-07-19 | 90 KB |
| Two.js | `two.js` | ★★★ | MIT | 2025-12-22 | 199 KB |
| ZRender | `zrender` | ★★★ | BSD-3-Clause | 2026-05-04 | 215 KB |

### 白板 / 手绘（2）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Excalidraw | `@excalidraw/excalidraw` | ★★★★ | MIT | 2026-04-20 | 1200 KB |
| perfect-freehand | `perfect-freehand` | ★★★★ | MIT | 2026-02-01 | 5 KB |

### 地图 / 地理（4）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| MapLibre GL | `maplibre-gl` | ★★★★★ | BSD-3-Clause | 2026-07-30 | 1032 KB |
| deck.gl | `deck.gl` | ★★★★★ | MIT | 2026-07-16 | 1608 KB |
| OpenLayers | `ol` | ★★★★ | BSD-2-Clause | 2026-07-27 | 1019 KB |
| AntV L7 | `@antv/l7` | ★★★★ | MIT | 2026-07-13 | 1434 KB |

### 3D / WebGL（3）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Three.js | `three` | ★★★★★ | MIT | 2026-07-01 | 654 KB |
| Babylon.js | `@babylonjs/core` | ★★★★ | Apache-2.0 | 2026-07-30 | 7598 KB |
| 3Dmol.js | `3dmol` | ★★★★ | BSD-3-Clause | 2026-05-22 | 525 KB |

### 文本出图（4）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Mermaid | `mermaid` | ★★★★★ | MIT | 2026-06-25 | 3497 KB |
| Viz.js (Graphviz) | `@viz-js/viz` | ★★★★ | MIT | 2026-06-03 | 1372 KB |
| WaveDrom | `wavedrom` | ★★★★ | MIT | 2026-07-08 | 39 KB |
| Pintora | `@pintora/standalone` | ★★★ | MIT | 2025-12-03 | 582 KB |

### 甘特 / 时间轴（3）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Frappe Gantt | `frappe-gantt` | ★★★★ | MIT | 2026-02-25 | 47 KB |
| vis-timeline | `vis-timeline` | ★★★★ | Apache-2.0 / MIT | 2026-07-15 | 414 KB |
| jsGantt Improved | `jsgantt-improved` | ★★★ | ISC | 2026-04-13 | 234 KB |

### 思维导图（2）

| 库 | npm | 推荐 | 协议 | 最后发版 | 体积 |
|---|---|---|---|---|---|
| Mind Elixir | `mind-elixir` | ★★★★ | MIT | 2026-07-12 | 114 KB |
| jsMind | `jsmind` | ★★★ | BSD-3-Clause | 2025-12-15 | 50 KB |

## 许可

本仓库自己的代码（`index.html` / `assets/`）为 MIT。

`vendor/` 下是各库的官方构建，**原样收录、未作改动**，各自适用其原协议（见上表）。
它们的著作权归各自作者所有，本仓库仅为演示用途聚合。
