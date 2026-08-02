/* 3D and WebGL. */
(function () {
"use strict";
var B = window.B;

/* --------------------------------------------------------------- Three.js */
B.th = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(ctx.el.clientWidth, ctx.el.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  ctx.el.appendChild(renderer.domElement);
  renderer.domElement.style.display = "block";

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(T.stage);
  scene.fog = new THREE.Fog(T.stage, 16, 46);

  var camera = new THREE.PerspectiveCamera(45, ctx.el.clientWidth / ctx.el.clientHeight, .1, 200);
  camera.position.set(9, 7, 12);
  camera.lookAt(0, .6, 0);

  /* Lighting is the whole point here — there are no textures anywhere. */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, .55));
  var key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(7, 12, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -14; key.shadow.camera.right = 14;
  key.shadow.camera.top = 14; key.shadow.camera.bottom = -14;
  scene.add(key);
  var rim = new THREE.PointLight(new THREE.Color(ctx.series(4)), 60, 40);
  rim.position.set(-7, 4, -6);
  scene.add(rim);

  var floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 64),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(T.panel), roughness: .95, metalness: 0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.4;
  floor.receiveShadow = true;
  scene.add(floor);

  var group = new THREE.Group();
  scene.add(group);

  var geoms = [
    new THREE.IcosahedronGeometry(1.15, 0),
    new THREE.TorusKnotGeometry(.78, .27, 128, 20),
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.OctahedronGeometry(1.25, 0),
    new THREE.TorusGeometry(.9, .34, 24, 64),
    new THREE.ConeGeometry(1.05, 2, 32),
    new THREE.DodecahedronGeometry(1.2, 0),
    new THREE.SphereGeometry(1.15, 48, 32)
  ];
  var meshes = [];
  geoms.forEach(function (g, i) {
    var a = (i / geoms.length) * Math.PI * 2;
    var m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
      color: new THREE.Color(ctx.series(i)), roughness: .32, metalness: .55
    }));
    m.position.set(Math.cos(a) * 4.6, 0, Math.sin(a) * 4.6);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    meshes.push(m);
  });

  var centre = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 1),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(T.ink), roughness: .12, metalness: .92,
                                     flatShading: true })
  );
  centre.castShadow = true;
  group.add(centre);

  /* A small orbit control, written by hand so the demo stays one file. */
  var drag = false, px = 0, py = 0, yaw = .4, pitch = .48, dist = 15, auto = true;
  ctx.on(renderer.domElement, "pointerdown", function (e) {
    drag = true; px = e.clientX; py = e.clientY;
    renderer.domElement.setPointerCapture(e.pointerId);
  });
  ctx.on(renderer.domElement, "pointermove", function (e) {
    if (!drag) return;
    yaw -= (e.clientX - px) * .006;
    pitch = Math.max(-.2, Math.min(1.35, pitch + (e.clientY - py) * .005));
    px = e.clientX; py = e.clientY;
  });
  ctx.on(renderer.domElement, "pointerup", function () { drag = false; });
  ctx.on(renderer.domElement, "wheel", function (e) {
    e.preventDefault();
    dist = Math.max(7, Math.min(34, dist + e.deltaY * .012));
  }, { passive: false });

  var spin = 1, wire = false, frames = 0, last = performance.now();
  var out = ctx.readout("");

  ctx.raf(function (dt) {
    if (auto && !drag) yaw += .0022 * spin * (dt / 16);
    group.rotation.y += .0015 * spin * (dt / 16);
    meshes.forEach(function (m, i) {
      m.rotation.x += .006 * spin * (1 + i * .1);
      m.rotation.y += .004 * spin;
      m.position.y = Math.sin(performance.now() * .0011 + i) * .5;
    });
    centre.rotation.y -= .004 * spin;

    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist,
                        Math.sin(pitch) * dist,
                        Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);

    frames++;
    var now = performance.now();
    if (now - last > 600) {
      out("<b>" + renderer.info.render.triangles.toLocaleString() + "</b> triangles · <b>" +
          Math.round(frames * 1000 / (now - last)) + " fps</b> · shadows and PBR materials, no textures");
      frames = 0; last = now;
    }
  });

  ctx.check("auto-orbit", true, function (v) { auto = v; });
  ctx.check("wireframe", false, function (v) {
    wire = v;
    meshes.concat([centre]).forEach(function (m) { m.material.wireframe = v; });
  });
  ctx.range("speed", { min: 0, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { spin = v / 10; });

  ctx.onResize(function () {
    camera.aspect = ctx.el.clientWidth / ctx.el.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(ctx.el.clientWidth, ctx.el.clientHeight);
  });
  ctx.onDestroy(function () {
    renderer.dispose();
    geoms.forEach(function (g) { g.dispose(); });
    renderer.domElement.remove();
  });
};

/* ------------------------------------------------------------- Babylon.js */
B.bab = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var cv = ctx.mk("canvas");
  cv.style.cssText = "width:100%;height:100%;display:block;outline:none;touch-action:none";
  ctx.el.appendChild(cv);

  var engine = new BABYLON.Engine(cv, true, { preserveDrawingBuffer: true, stencil: true });
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color4.FromHexString(T.stage + "ff");

  var camera = new BABYLON.ArcRotateCamera("cam", -Math.PI / 2.4, Math.PI / 3, 16,
                                           BABYLON.Vector3.Zero(), scene);
  camera.attachControl(cv, true);
  camera.lowerRadiusLimit = 7;
  camera.upperRadiusLimit = 34;
  camera.wheelDeltaPercentage = .012;

  /* An environment texture is what makes PBR look like PBR. */
  var env = BABYLON.CubeTexture.CreateFromPrefilteredData
    ? null : null;
  var hemi = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
  hemi.intensity = .55;
  var dir = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(-1, -2, -1), scene);
  dir.position = new BABYLON.Vector3(8, 14, 8);
  dir.intensity = 2.4;
  var shadow = new BABYLON.ShadowGenerator(1024, dir);
  shadow.useBlurExponentialShadowMap = true;
  shadow.blurKernel = 24;

  var ground = BABYLON.MeshBuilder.CreateDisc("ground", { radius: 16, tessellation: 64 }, scene);
  ground.rotation.x = Math.PI / 2;
  ground.position.y = -2.2;
  ground.receiveShadows = true;
  var gm = new BABYLON.PBRMetallicRoughnessMaterial("gm", scene);
  gm.baseColor = BABYLON.Color3.FromHexString(T.panel);
  gm.roughness = .96; gm.metallic = 0;
  ground.material = gm;

  var meshes = [];
  var makers = [
    function () { return BABYLON.MeshBuilder.CreateTorusKnot("k", { radius: .9, tube: .3, radialSegments: 96 }, scene); },
    function () { return BABYLON.MeshBuilder.CreateIcoSphere("i", { radius: 1.2, subdivisions: 3 }, scene); },
    function () { return BABYLON.MeshBuilder.CreateBox("b", { size: 1.9 }, scene); },
    function () { return BABYLON.MeshBuilder.CreateCylinder("c", { height: 2.2, diameter: 1.7 }, scene); },
    function () { return BABYLON.MeshBuilder.CreateTorus("t", { diameter: 2.2, thickness: .6, tessellation: 48 }, scene); },
    function () { return BABYLON.MeshBuilder.CreatePolyhedron("p", { type: 3, size: 1 }, scene); }
  ];
  makers.forEach(function (make, i) {
    var m = make();
    var a = (i / makers.length) * Math.PI * 2;
    m.position = new BABYLON.Vector3(Math.cos(a) * 5, 0, Math.sin(a) * 5);
    var mat = new BABYLON.PBRMetallicRoughnessMaterial("m" + i, scene);
    mat.baseColor = BABYLON.Color3.FromHexString(ctx.series(i));
    mat.metallic = .7; mat.roughness = .25;
    m.material = mat;
    shadow.addShadowCaster(m);
    meshes.push(m);
  });

  var spin = 1, frames = 0, last = performance.now();
  var out = ctx.readout("");
  scene.registerBeforeRender(function () {
    meshes.forEach(function (m, i) {
      m.rotation.y += .008 * spin;
      m.rotation.x += .004 * spin * (1 + i * .12);
      m.position.y = Math.sin(performance.now() * .001 + i) * .6;
    });
    camera.alpha += .0016 * spin;
  });
  engine.runRenderLoop(function () {
    scene.render();
    frames++;
    var now = performance.now();
    if (now - last > 600) {
      out("<b>" + Math.round(engine.getFps()) + " fps</b> · " + scene.meshes.length +
          " meshes with PBR materials and soft shadows");
      frames = 0; last = now;
    }
  });

  ctx.range("speed", { min: 0, max: 30, value: 10, fmt: function (v) { return (v / 10).toFixed(1) + "×"; } },
            function (v) { spin = v / 10; });
  ctx.check("wireframe", false, function (v) {
    meshes.forEach(function (m) { m.material.wireframe = v; });
  });
  ctx.btn("Reset camera", function () {
    camera.alpha = -Math.PI / 2.4; camera.beta = Math.PI / 3; camera.radius = 16;
  });

  ctx.onResize(function () { engine.resize(); });
  ctx.onDestroy(function () { engine.stopRenderLoop(); scene.dispose(); engine.dispose(); });
};

/* --------------------------------------------------------------- 3Dmol.js */
B.m3d = async function (ctx) {
  var T = ctx.T;
  ctx.tall();

  var host = ctx.mk("div");
  host.style.cssText = "position:absolute;inset:0";
  ctx.el.appendChild(host);

  var viewer = $3Dmol.createViewer(host, { backgroundColor: T.stage });

  /* A real PDB fragment — 3Dmol parses it, nothing here is drawn by hand. */
  var pdb = [
    "ATOM      1  N   MET A   1      -8.901   4.127  -0.555  1.00 11.99           N",
    "ATOM      2  CA  MET A   1      -8.608   3.135  -1.618  1.00 11.85           C",
    "ATOM      3  C   MET A   1      -7.221   2.458  -1.897  1.00 11.68           C",
    "ATOM      4  O   MET A   1      -6.632   2.626  -2.974  1.00 11.75           O",
    "ATOM      5  CB  MET A   1      -9.437   1.881  -1.341  1.00 12.32           C",
    "ATOM      6  CG  MET A   1     -10.884   2.209  -1.030  1.00 12.85           C",
    "ATOM      7  SD  MET A   1     -11.865   0.712  -0.708  1.00 13.30           S",
    "ATOM      8  CE  MET A   1     -13.406   1.437  -0.191  1.00 13.24           C",
    "ATOM      9  N   LYS A   2      -6.719   1.698  -0.932  1.00 11.51           N",
    "ATOM     10  CA  LYS A   2      -5.409   1.056  -1.080  1.00 11.30           C",
    "ATOM     11  C   LYS A   2      -5.415   0.023  -2.196  1.00 11.14           C",
    "ATOM     12  O   LYS A   2      -6.398  -0.716  -2.371  1.00 11.20           O",
    "ATOM     13  CB  LYS A   2      -5.000   0.360   0.229  1.00 11.42           C",
    "ATOM     14  N   VAL A   3      -4.325  -0.017  -2.954  1.00 10.98           N",
    "ATOM     15  CA  VAL A   3      -4.185  -0.980  -4.043  1.00 10.79           C",
    "ATOM     16  C   VAL A   3      -3.437  -2.228  -3.575  1.00 10.61           C",
    "ATOM     17  O   VAL A   3      -2.360  -2.146  -2.980  1.00 10.60           O",
    "ATOM     18  CB  VAL A   3      -3.476  -0.362  -5.264  1.00 10.85           C",
    "ATOM     19  N   PHE A   4      -4.006  -3.390  -3.848  1.00 10.45           N",
    "ATOM     20  CA  PHE A   4      -3.390  -4.671  -3.503  1.00 10.32           C",
    "ATOM     21  C   PHE A   4      -2.706  -5.222  -4.755  1.00 10.19           C",
    "ATOM     22  O   PHE A   4      -3.234  -5.159  -5.867  1.00 10.24           O",
    "ATOM     23  CB  PHE A   4      -4.442  -5.653  -2.979  1.00 10.38           C",
    "ATOM     24  N   GLY A   5      -1.512  -5.760  -4.560  1.00 10.06           N",
    "ATOM     25  CA  GLY A   5      -0.747  -6.328  -5.660  1.00  9.96           C",
    "ATOM     26  C   GLY A   5       0.206  -7.418  -5.208  1.00  9.87           C",
    "ATOM     27  O   GLY A   5       0.658  -7.407  -4.061  1.00  9.91           O",
    "ATOM     28  N   ARG A   6       0.529  -8.371  -6.076  1.00  9.78           N",
    "ATOM     29  CA  ARG A   6       1.442  -9.454  -5.734  1.00  9.70           C",
    "ATOM     30  C   ARG A   6       2.826  -8.976  -5.310  1.00  9.63           C",
    "ATOM     31  O   ARG A   6       3.499  -9.625  -4.507  1.00  9.66           O",
    "ATOM     32  CB  ARG A   6       1.573 -10.418  -6.916  1.00  9.75           C",
    "END"
  ].join("\n");

  viewer.addModel(pdb, "pdb");

  var styles = {
    "sticks": { stick: { radius: .16, colorscheme: "Jmol" } },
    "spheres": { sphere: { scale: .32, colorscheme: "Jmol" } },
    "ball and stick": { stick: { radius: .12 }, sphere: { scale: .22, colorscheme: "Jmol" } },
    "cartoon": { cartoon: { color: "spectrum" } },
    "line": { line: { linewidth: 2 } }
  };

  function apply(name) {
    viewer.setStyle({}, styles[name]);
    viewer.render();
  }
  apply("ball and stick");
  viewer.zoomTo();
  viewer.render();

  var spinning = true;
  viewer.spin("y", .6);

  ctx.select("representation", Object.keys(styles), apply, "ball and stick");
  ctx.check("spin", true, function (v) {
    spinning = v;
    viewer.spin(v ? "y" : false, .6);
  });
  ctx.check("surface", false, function (v) {
    if (v) viewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: .68, color: ctx.series(0) });
    else viewer.removeAllSurfaces();
    viewer.render();
  });
  ctx.btn("Fit", function () { viewer.zoomTo(); viewer.render(); });
  ctx.readout("<b>32 atoms</b> parsed straight from PDB text — drag to rotate, scroll to zoom");

  ctx.onResize(function () { viewer.resize(); });
  ctx.onDestroy(function () { viewer.spin(false); viewer.clear(); });
};

})();
