import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let camera, scene, renderer, AmbientLight, directionalLight, controls;

init();
render();

function dumpObject(obj, lines = [], isLast = true, prefix = "") {
  const localPrefix = isLast ? "└─" : "├─";
  lines.push(
    `${prefix}${prefix ? localPrefix : ""}${obj.name || "*no-name*"} [${
      obj.type
    }]`
  );
  const newPrefix = prefix + (isLast ? "  " : "│ ");
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.25,
    10
  );
  camera.position.set(-1.8, 0.6, 2.7);

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#DEFEFF'); // Set a background color (optional)

  AmbientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color, Intensity
  AmbientLight.position.set(1, 1, 1); // Position the light
  scene.add(AmbientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.7); // Color, Intensity
  directionalLight.castShadow = true;
  directionalLight.position.set(100, 100, 100); // Position the light
  directionalLight.shadow.bias = -0.004;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  const cam = directionalLight.shadow.camera;
  cam.near = 1;
  cam.far = 2000;
  cam.left = -1500;
  cam.right = 1500;
  cam.top = 1500;
  cam.bottom = -1500;
  // Model
  const loader = new GLTFLoader().setPath("../3d_asset/");
  loader.load("low_poly_planet.glb", function (gltf) {
    scene.add(gltf.scene);
    console.log(dumpObject(scene).join("\n"));
    scene.traverse((obj) => {
      if (obj.castShadow !== undefined) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    render();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enable = true;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.25;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function render() {
  renderer.render(scene, camera);
}
