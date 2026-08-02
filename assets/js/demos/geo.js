/* Maps and geospatial. */
(function () {
"use strict";
var B = window.B;

/* Real cities, so the maps show something honest without fetching
   a single tile or remote dataset. */
var CITIES = [
  { name: "London",     lon: -0.1276, lat: 51.5072, pop: 8.9 },
  { name: "Paris",      lon: 2.3522,  lat: 48.8566, pop: 2.1 },
  { name: "Berlin",     lon: 13.4050, lat: 52.5200, pop: 3.6 },
  { name: "Madrid",     lon: -3.7038, lat: 40.4168, pop: 3.2 },
  { name: "Rome",       lon: 12.4964, lat: 41.9028, pop: 2.8 },
  { name: "Amsterdam",  lon: 4.9041,  lat: 52.3676, pop: 0.9 },
  { name: "Vienna",     lon: 16.3738, lat: 48.2082, pop: 1.9 },
  { name: "Prague",     lon: 14.4378, lat: 50.0755, pop: 1.3 },
  { name: "Warsaw",     lon: 21.0122, lat: 52.2297, pop: 1.8 },
  { name: "Copenhagen", lon: 12.5683, lat: 55.6761, pop: 0.6 },
  { name: "Stockholm",  lon: 18.0686, lat: 59.3293, pop: 1.0 },
  { name: "Lisbon",     lon: -9.1393, lat: 38.7223, pop: 0.5 },
  { name: "Dublin",     lon: -6.2603, lat: 53.3498, pop: 0.6 },
  { name: "Zurich",     lon: 8.5417,  lat: 47.3769, pop: 0.4 },
  { name: "Milan",      lon: 9.1900,  lat: 45.4642, pop: 1.4 },
  { name: "Barcelona",  lon: 2.1734,  lat: 41.3851, pop: 1.6 },
  { name: "Munich",     lon: 11.5820, lat: 48.1351, pop: 1.5 },
  { name: "Hamburg",    lon: 9.9937,  lat: 53.5511, pop: 1.9 },
  { name: "Brussels",   lon: 4.3517,  lat: 50.8503, pop: 1.2 },
  { name: "Budapest",   lon: 19.0402, lat: 47.4979, pop: 1.7 }
];

function cityPoints() {
  return {
    type: "FeatureCollection",
    features: CITIES.map(function (c) {
      return { type: "Feature", properties: { name: c.name, pop: c.pop },
               geometry: { type: "Point", coordinates: [c.lon, c.lat] } };
    })
  };
}
function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

/* --------------------------------------------------------- MapLibre GL JS */
B.ml = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  /* The style is written by hand — no tile server, no network. */
  var map = new maplibregl.Map({
    container: ctx.el,
    style: { version: 8, sources: {}, layers: [
      { id: "bg", type: "background", paint: { "background-color": T.stage } }
    ] },
    center: [8, 49], zoom: 3.6, pitch: 40, bearing: -14,
    attributionControl: false
  });
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

  await new Promise(function (res) { map.on("load", res); });
  if (ctx.dead()) { map.remove(); return; }

  var arcs = { type: "FeatureCollection", features: [] };
  for (var i = 0; i < CITIES.length - 1; i++) {
    var a = CITIES[i], b = CITIES[i + 1], line = [];
    for (var t = 0; t <= 24; t++) {
      var f = t / 24;
      line.push([a.lon + (b.lon - a.lon) * f, a.lat + (b.lat - a.lat) * f]);
    }
    arcs.features.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: line } });
  }

  map.addSource("cities", { type: "geojson", data: cityPoints() });
  map.addSource("arcs", { type: "geojson", data: arcs });

  map.addLayer({ id: "arc", type: "line", source: "arcs",
    paint: { "line-color": ctx.series(0), "line-width": 1.2, "line-opacity": .5 } });
  map.addLayer({ id: "halo", type: "circle", source: "cities",
    paint: { "circle-radius": ["interpolate", ["linear"], ["get", "pop"], 0, 10, 9, 42],
             "circle-color": ctx.series(0), "circle-opacity": .15 } });
  map.addLayer({ id: "dot", type: "circle", source: "cities",
    paint: { "circle-radius": ["interpolate", ["linear"], ["get", "pop"], 0, 3.5, 9, 11],
             "circle-color": ctx.series(1), "circle-stroke-color": T.stage, "circle-stroke-width": 1.5 } });

  var out = ctx.readout("drag to pan · scroll to zoom · right-drag to tilt");
  map.on("mouseenter", "dot", function (e) {
    map.getCanvas().style.cursor = "pointer";
    var p = e.features[0].properties;
    out("<b>" + p.name + "</b> · " + p.pop + "m people");
  });
  map.on("mouseleave", "dot", function () { map.getCanvas().style.cursor = ""; });
  map.on("move", function () {
    if (map.getCanvas().style.cursor) return;
    out("zoom <b>" + map.getZoom().toFixed(1) + "</b> · pitch <b>" + Math.round(map.getPitch()) +
        "°</b> · bearing <b>" + Math.round(map.getBearing()) + "°</b>");
  });

  ctx.range("pitch", { min: 0, max: 70, value: 40, fmt: function (v) { return v + "°"; } },
            function (v) { map.setPitch(v); });
  ctx.check("arcs", true, function (on) {
    map.setLayoutProperty("arc", "visibility", on ? "visible" : "none");
  });
  ctx.btn("Fly to Berlin", function () {
    map.flyTo({ center: [13.405, 52.52], zoom: 8, pitch: 55, bearing: 20, duration: 2200 });
  });
  ctx.btn("Europe", function () {
    map.flyTo({ center: [8, 49], zoom: 3.6, pitch: 40, bearing: -14, duration: 1800 });
  });

  ctx.onResize(function () { map.resize(); });
  ctx.onDestroy(function () { map.remove(); });
};

/* ---------------------------------------------------------------- Leaflet */
B.leaflet = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var map = L.map(ctx.el, { center: [49, 8], zoom: 4, attributionControl: false, preferCanvas: true });
  ctx.el.style.background = T.stage;

  var grid = L.layerGroup().addTo(map);
  for (var lat = -80; lat <= 80; lat += 10) {
    L.polyline([[lat, -180], [lat, 180]], { color: T.grid, weight: 1, interactive: false }).addTo(grid);
  }
  for (var lon = -180; lon <= 180; lon += 10) {
    L.polyline([[-80, lon], [80, lon]], { color: T.grid, weight: 1, interactive: false }).addTo(grid);
  }

  var markers = L.layerGroup().addTo(map);
  CITIES.forEach(function (c) {
    L.circleMarker([c.lat, c.lon], {
      radius: 5 + c.pop * .9, color: T.stage, weight: 1.5,
      fillColor: ctx.series(0), fillOpacity: .85
    })
    .bindPopup("<b>" + c.name + "</b><br>" + c.pop + "m people")
    .bindTooltip(c.name, { direction: "top", offset: [0, -6] })
    .addTo(markers);
  });

  var region = L.polygon([[55.7, -0.1], [52.5, 13.4], [48.2, 16.4], [45.5, 9.2], [48.9, 2.4]], {
    color: ctx.series(4), weight: 2, fillOpacity: .12, dashArray: "5 4"
  }).bindPopup("A polygon — every shape can carry a popup").addTo(map);

  var out = ctx.readout("pan and zoom, then click a marker");
  map.on("click", function (e) {
    out("clicked <b>" + e.latlng.lat.toFixed(3) + ", " + e.latlng.lng.toFixed(3) + "</b>");
  });

  ctx.check("graticule", true, function (on) { on ? grid.addTo(map) : grid.remove(); });
  ctx.check("region", true, function (on) { on ? region.addTo(map) : region.remove(); });
  ctx.btn("Fit markers", function () {
    map.fitBounds(L.featureGroup(markers.getLayers()).getBounds(), { padding: [40, 40] });
  });

  ctx.onResize(function () { map.invalidateSize(); });
  ctx.onDestroy(function () { map.remove(); });
};

/* ---------------------------------------------------------------- deck.gl */
B.dk = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var s = 91;
  var r = function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
  var points = [];
  for (var i = 0; i < 20000; i++) {
    var c = CITIES[Math.floor(r() * CITIES.length)];
    points.push({ position: [c.lon + (r() - .5) * 4.2, c.lat + (r() - .5) * 3.0], weight: r() });
  }
  var arcs = [];
  for (var j = 0; j < CITIES.length; j++) {
    for (var k = j + 1; k < CITIES.length; k += 4) {
      arcs.push({ from: [CITIES[j].lon, CITIES[j].lat], to: [CITIES[k].lon, CITIES[k].lat] });
    }
  }

  var c0 = hexToRgb(ctx.series(0)), c1 = hexToRgb(ctx.series(1)), c3 = hexToRgb(ctx.series(3));
  var mode = "scatter";

  var deckgl = new deck.DeckGL({
    container: ctx.el,
    initialViewState: { longitude: 8, latitude: 49, zoom: 3.5, pitch: 42, bearing: -12 },
    controller: true,
    parameters: { clearColor: [0, 0, 0, 0] },
    layers: []
  });
  ctx.el.style.background = T.stage;

  function layers() {
    var out = [];
    if (mode === "scatter") {
      out.push(new deck.ScatterplotLayer({
        id: "pts", data: points,
        getPosition: function (d) { return d.position; },
        getRadius: function (d) { return 900 + d.weight * 2600; },
        getFillColor: function (d) { return c0.concat([90 + d.weight * 120]); },
        radiusUnits: "meters"
      }));
    } else {
      out.push(new deck.HexagonLayer({
        id: "hex", data: points,
        getPosition: function (d) { return d.position; },
        radius: 26000, elevationScale: 260, extruded: true, coverage: .88,
        colorRange: [c0.concat([120]), c0, c1, c3, hexToRgb(ctx.series(4)), hexToRgb(ctx.series(2))]
      }));
    }
    out.push(new deck.ArcLayer({
      id: "arcs", data: arcs,
      getSourcePosition: function (d) { return d.from; },
      getTargetPosition: function (d) { return d.to; },
      getSourceColor: c1.concat([170]), getTargetColor: c3.concat([170]),
      getWidth: 1.4, greatCircle: true
    }));
    return out;
  }
  deckgl.setProps({ layers: layers() });

  ctx.select("layer", [{ v: "scatter", t: "ScatterplotLayer" }, { v: "hex", t: "HexagonLayer (3D)" }],
             function (v) { mode = v; deckgl.setProps({ layers: layers() }); }, "scatter");
  ctx.btn("Top-down", function () {
    deckgl.setProps({ initialViewState: { longitude: 8, latitude: 49, zoom: 3.5,
                                          pitch: 0, bearing: 0, transitionDuration: 900 } });
  });
  ctx.readout("<b>" + points.length.toLocaleString() + "</b> points and <b>" + arcs.length +
              "</b> great-circle arcs, all on the GPU");

  ctx.onDestroy(function () { deckgl.finalize(); });
};

/* ------------------------------------------------------------ OpenLayers */
B.ol = async function (ctx) {
  var T = ctx.T;
  ctx.tall();
  var fromLonLat = ol.proj.fromLonLat;

  function style(feature, selected) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 5 + feature.get("pop") * 1.1,
        fill: new ol.style.Fill({ color: selected ? ctx.series(3) : ctx.series(0) }),
        stroke: new ol.style.Stroke({ color: T.stage, width: 1.6 })
      }),
      text: new ol.style.Text({
        text: feature.get("name"), offsetY: -16, font: "11px " + T.mono,
        fill: new ol.style.Fill({ color: selected ? T.ink : T.muted })
      })
    });
  }

  var source = new ol.source.Vector({
    features: CITIES.map(function (c) {
      return new ol.Feature({ geometry: new ol.geom.Point(fromLonLat([c.lon, c.lat])),
                              name: c.name, pop: c.pop });
    })
  });

  var map = new ol.Map({
    target: ctx.el,
    layers: [
      new ol.layer.Graticule({
        strokeStyle: new ol.style.Stroke({ color: T.grid, width: 1 }),
        showLabels: false, wrapX: false
      }),
      new ol.layer.Vector({ source: source, style: function (f) { return style(f, false); } })
    ],
    view: new ol.View({ center: fromLonLat([8, 49]), zoom: 4 }),
    controls: ol.control.defaults.defaults({ attribution: false })
  });
  ctx.el.style.background = T.stage;

  var select = new ol.interaction.Select({ style: function (f) { return style(f, true); } });
  map.addInteraction(select);

  var out = ctx.readout("click any circle — that is the Select interaction on a vector layer");
  select.on("select", function (e) {
    var f = e.selected[0];
    out(f ? "selected <b>" + f.get("name") + "</b> · " + f.get("pop") + "m people" : "selection cleared");
  });

  /* Drawing and measuring: the GIS half of OpenLayers. */
  var drawSource = new ol.source.Vector();
  map.addLayer(new ol.layer.Vector({
    source: drawSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({ color: ctx.series(4), width: 2 }),
      fill: new ol.style.Fill({ color: ctx.series(4) + "22" })
    })
  }));

  var draw = null;
  ctx.select("tool", [{ v: "none", t: "select" }, { v: "Polygon", t: "draw polygon" },
                      { v: "LineString", t: "draw line" }], function (v) {
    if (draw) { map.removeInteraction(draw); draw = null; }
    select.setActive(v === "none");
    if (v === "none") return;
    draw = new ol.interaction.Draw({ source: drawSource, type: v });
    map.addInteraction(draw);
    draw.on("drawend", function (e) {
      var g = e.feature.getGeometry();
      if (v === "Polygon") {
        out("area <b>" + Math.round(ol.sphere.getArea(g) / 1e6).toLocaleString() + " km²</b> — measured on the sphere");
      } else {
        out("length <b>" + Math.round(ol.sphere.getLength(g) / 1000).toLocaleString() + " km</b>");
      }
    });
  }, "none");
  ctx.btn("Clear drawings", function () { drawSource.clear(); });

  ctx.onResize(function () { map.updateSize(); });
  ctx.onDestroy(function () { map.setTarget(null); });
};

/* ---------------------------------------------------------------- AntV L7 */
B.l7 = async function (ctx) {
  ctx.tall();
  var scene = new L7.Scene({
    id: ctx.el,
    map: new L7.Map({ style: "dark", center: [8, 49], zoom: 3.4, pitch: 30 }),
    logoVisible: false
  });

  await new Promise(function (res) { scene.on("loaded", res); });
  if (ctx.dead()) { scene.destroy(); return; }

  var layer = new L7.PointLayer({ blend: "additive" })
    .source(cityPoints())
    .shape("circle")
    .size("pop", [8, 34])
    .color("pop", [ctx.series(0), ctx.series(1), ctx.series(2), ctx.series(3)])
    .style({ opacity: .85, strokeWidth: 1, stroke: "#ffffff" });
  scene.addLayer(layer);

  var out = ctx.readout("a GPU point layer over L7's own dark basemap");
  layer.on("click", function (e) {
    out("clicked <b>" + e.feature.properties.name + "</b> · " + e.feature.properties.pop + "m people");
  });

  ctx.select("shape", ["circle", "square", "triangle", "hexagon"], function (v) {
    layer.shape(v); scene.render();
  }, "circle");
  ctx.range("pitch", { min: 0, max: 60, value: 30, fmt: function (v) { return v + "°"; } },
            function (v) { scene.setPitch(v); });

  ctx.onDestroy(function () { scene.destroy(); });
};

/* ---------------------------------------------------------------- Turf.js */
B.turf = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var map = L.map(ctx.el, { center: [49, 8], zoom: 4.4, attributionControl: false, preferCanvas: true });
  ctx.el.style.background = T.stage;

  var pts = turf.featureCollection(CITIES.map(function (c) {
    return turf.point([c.lon, c.lat], { name: c.name, pop: c.pop });
  }));

  /* Turf does the geometry; Leaflet only draws the answers. */
  var hull = turf.convex(pts);
  var centroid = turf.centroid(pts);

  L.geoJSON(hull, { style: { color: ctx.series(4), weight: 2, dashArray: "5 4", fillOpacity: .05 } }).addTo(map);
  L.geoJSON(pts, {
    pointToLayer: function (f, ll) {
      return L.circleMarker(ll, { radius: 4, color: T.stage, weight: 1,
                                  fillColor: T.muted, fillOpacity: .9 })
              .bindTooltip(f.properties.name, { direction: "top", offset: [0, -5] });
    }
  }).addTo(map);
  L.circleMarker([centroid.geometry.coordinates[1], centroid.geometry.coordinates[0]], {
    radius: 6, color: T.stage, weight: 2, fillColor: ctx.series(3), fillOpacity: 1
  }).bindTooltip("turf.centroid()").addTo(map);

  var radiusKm = 320, buffer = null, probe = null, line = null;
  var out = ctx.readout("");

  function update(lonlat) {
    var p = turf.point(lonlat);
    [buffer, probe, line].forEach(function (l) { if (l) map.removeLayer(l); });

    var buf = turf.buffer(p, radiusKm, { units: "kilometers" });
    buffer = L.geoJSON(buf, { style: { color: ctx.series(0), weight: 1.6, fillOpacity: .1 } }).addTo(map);
    probe = L.circleMarker([lonlat[1], lonlat[0]], {
      radius: 5, color: T.stage, weight: 2, fillColor: ctx.series(0), fillOpacity: 1 }).addTo(map);

    var inside = pts.features.filter(function (f) { return turf.booleanPointInPolygon(f, buf); });
    var nearest = turf.nearestPoint(p, pts);
    var dist = turf.distance(p, nearest, { units: "kilometers" });
    line = L.polyline([[lonlat[1], lonlat[0]],
                       [nearest.geometry.coordinates[1], nearest.geometry.coordinates[0]]],
                      { color: ctx.series(1), weight: 2, dashArray: "4 3" }).addTo(map);

    out("<b>" + inside.length + "</b> cities in the buffer · nearest <b>" + nearest.properties.name +
        "</b> at <b>" + Math.round(dist) + " km</b> · in hull: <b>" +
        (turf.booleanPointInPolygon(p, hull) ? "yes" : "no") + "</b>");
  }
  update([8, 49]);
  map.on("mousemove", function (e) { update([e.latlng.lng, e.latlng.lat]); });

  ctx.range("buffer radius", { min: 60, max: 900, step: 20, value: 320,
                               fmt: function (v) { return v + " km"; } },
            function (v) { radiusKm = v; update([map.getCenter().lng, map.getCenter().lat]); });
  ctx.label("buffer · convex hull · nearest point · point-in-polygon");

  ctx.onResize(function () { map.invalidateSize(); });
  ctx.onDestroy(function () { map.remove(); });
};

})();
