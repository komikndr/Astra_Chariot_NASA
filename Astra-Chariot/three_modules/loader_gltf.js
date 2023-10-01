import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import GUI from 'lil-gui'

let camera, scene, renderer, directionalLight;

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

init();
render();

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
  folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
  folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
  folder.open();
}


function init() {
  const container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
  camera.position.set(-1.8, 0.6, 2.7);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x333333); // Set a background color (optional)
  
  // Add a directional light
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Color, Intensity
  directionalLight.position.set(1, 1, 1); // Position the light
  scene.add(directionalLight);

  const gui = new GUI();
  gui.addColor(new ColorGUIHelper(directionalLight, 'color'), 'value').name('color');
  gui.add(directionalLight, 'intensity', 0, 1, 0.01);
  
  const helper = new THREE.DirectionalLightHelper(directionalLight); 
  scene.add(helper);

  makeXYZGUI(gui, directionalLight.position, 'position', updateLight);
  makeXYZGUI(gui, directionalLight.target.position, 'target', updateLight);

  function updateLight() {
    directionalLight.target.updateMatrixWorld();
    helper.update();
  }

  // Model
  const loader = new GLTFLoader().setPath('../3d_asset/');
  loader.load('low_poly_planet.glb', function (gltf) {
    scene.add(gltf.scene);
    console.log(dumpObject(scene).join('\n'))
    render();
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); // use if there is no animation loop
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set(0, 0, -0.2);
  controls.update();

  window.addEventListener('resize', onWindowResize);
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

function animate() {
  requestAnimationFrame(animate);
  render();
}


animate();