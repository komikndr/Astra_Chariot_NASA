// Import the Three.js library
import * as THREE from "three";

// Create a vite app
const app = new Vite({
  mode: "development",
  build: {
    target: "esnext",
  },
});

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 500;

// Create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
});

// Create the sun
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(100, 128, 128),
  new THREE.MeshBasicMaterial({
    color: 0xffff00,
    shininess: 100,
  })
);
scene.add(sun);

// Create the planets
const planets = [
  {
    name: "Mercury",
    radius: 2440,
    distance: 57.91 * 10^6,
    color: 0xd8d8d8,
    texture: new THREE.TextureLoader().load("assets/mercury.jpg"),
  },
  {
    name: "Venus",
    radius: 6052,
    distance: 108.2 * 10^6,
    color: 0xffd700,
    texture: new THREE.TextureLoader().load("assets/venus.jpg"),
  },
  {
    name: "Earth",
    radius: 6371,
    distance: 149.6 * 10^6,
    color: 0x0000ff,
    texture: new THREE.TextureLoader().load("assets/earth.jpg"),
  },
  {
    name: "Mars",
    radius: 3390,
    distance: 227.9 * 10^6,
    color: 0x99d8bd,
    texture: new THREE.TextureLoader().load("assets/mars.jpg"),
  },
  {
    name: "Jupiter",
    radius: 69911,
    distance: 778.5 * 10^6,
    color: 0xffd700,
    texture: new THREE.TextureLoader().load("assets/jupiter.jpg"),
  },
  {
    name: "Saturn",
    radius: 58232,
    distance: 1429 * 10^6,
    color: 0xffd700,
    texture: new THREE.TextureLoader().load("assets/saturn.jpg"),
  },
  {
    name: "Uranus",
    radius: 25559,
    distance: 2870 * 10^6,
    color: 0x00ffff,
    texture: new THREE.TextureLoader().load("assets/uranus.jpg"),
  },
  {
    name: "Neptune",
    radius: 24764,
    distance: 4497 * 10^6,
    color: 0x00ffff,
    texture: new THREE.TextureLoader().load("assets/neptune.jpg"),
  },
];

for (const planet of planets) {
  const geometry = new THREE.SphereGeometry(planet.radius, 128, 128);
  const material = new THREE.MeshBasicMaterial({
    color: planet.color,
    shininess: 100,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = planet.distance * Math.cos(planet.name / 8);
  mesh.position.y = planet.distance * Math.sin(planet.name / 8);
  if (planet.texture) {
    mesh.material.map = planet.texture;
  }
  scene.add(mesh);
}

// Create a render loop
function animate() {
  requestAnimationFrame(animate);

  // Update the camera
  camera.position.x += 0.01;

  // Update the planets
  for (const planet of planets) {
    planet.position.x += 0.001;
  }

  // Render the scene
  renderer.render(scene, camera);
}

animate();
