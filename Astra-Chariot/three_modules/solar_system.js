import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Create a scene
const scene = new THREE.Scene();

// Create a camera with isometric view
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sun-like sphere (the sun)
const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Function to create a planet
function createPlanet(radius, color, distance) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const planet = new THREE.Mesh(geometry, material);
    planet.distance = distance;
    scene.add(planet);
    return planet;
}

// Create Earth
const earth = createPlanet(0.3, 0x0000ff, 2);

// Create Mars
const mars = createPlanet(0.2, 0xff0000, 3.5);

// Set initial angles for faster rotation and revolution
let earthRotationAngle = 0;
let marsRotationAngle = 0;
let earthRevolutionAngle = 0;
let marsRevolutionAngle = 0;

// Create a function to animate the planets' rotation and revolution
function animatePlanets() {
    earthRotationAngle += 0.05; // Increase Earth's rotation speed
    marsRotationAngle += 0.03; // Increase Mars's rotation speed
    earthRevolutionAngle += 0.01; // Increase Earth's revolution speed
    marsRevolutionAngle += 0.008; // Increase Mars's revolution speed

    // Rotate Earth and Mars
    earth.rotation.y = earthRotationAngle;
    mars.rotation.y = marsRotationAngle;

    // Revolution of Earth and Mars around the Sun
    const earthX = earth.distance * Math.cos(earthRevolutionAngle);
    const earthZ = earth.distance * Math.sin(earthRevolutionAngle);
    earth.position.set(earthX, 0, earthZ);

    const marsX = mars.distance * Math.cos(marsRevolutionAngle);
    const marsZ = mars.distance * Math.sin(marsRevolutionAngle);
    mars.position.set(marsX, 0, marsZ);

    // Update the controls
    controls.update();

    requestAnimationFrame(animatePlanets);

    renderer.render(scene, camera);
}

// Create OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Function to create an orbital line
function createOrbitLine(distance) {
    const segments = 128; // Number of segments to create a smooth circle
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = distance * Math.cos(angle);
        const z = distance * Math.sin(angle);
        positions.push(x, 0, z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });
    return new THREE.Line(geometry, material);
}

// Create orbital lines for Earth and Mars
const earthOrbitLine = createOrbitLine(2);
scene.add(earthOrbitLine);

const marsOrbitLine = createOrbitLine(3.5);
scene.add(marsOrbitLine);

// Start the animation
animatePlanets();
