import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualization') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Define planet data in JSON format
const planetData = [
    {
        name: 'Sun',
        radius: 1, // Larger radius for the sun
        color: 0xffff00,
        distance: 0, // Sun is at the center
        rotationSpeed: 0.01, // Adjust as needed
        revolutionSpeed: 0, // Sun doesn't revolve
        orbitAngle: 0,
        rotationAngle: 0,
    },
    {
        name: 'Earth',
        radius: 0.3,
        color: 0x0000ff,
        distance: 2,
        rotationSpeed: 0.05,
        revolutionSpeed: 0.01,
        orbitAngle: 0,
        rotationAngle: 0,
    },
    {
        name: 'Mars',
        radius: 0.2,
        color: 0xff0000,
        distance: 3.5,
        rotationSpeed: 0.03,
        revolutionSpeed: 0.008,
        orbitAngle: Math.PI / 4, 
        rotationAngle: 0,
    },
    {
        name: 'Benus',
        radius: 0.4,
        color: 0xa154f8,
        distance: 5,
        rotationSpeed: 0.03,
        revolutionSpeed: 0.008,
        orbitAngle: Math.PI / 4,
        rotationAngle: 0,
    },
    // Add more planet data as needed
];

// Create planets based on JSON data
const planets = planetData.map((data) => {
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: data.color });
    const planet = new THREE.Mesh(geometry, material);
    planet.distance = data.distance;
    planet.name = data.name;
    planet.orbitAngle = data.orbitAngle;
    scene.add(planet);
    return planet;
});

function animate() {
    requestAnimationFrame(animate);

    planetData.forEach((data, index) => {
        data.rotationAngle += data.rotationSpeed;
        planets[index].rotation.y = data.rotationAngle;

        data.orbitAngle += data.revolutionSpeed;
        const x = data.distance * Math.cos(data.orbitAngle);
        const z = data.distance * Math.sin(data.orbitAngle);
        planets[index].position.set(x, 0, z);
    });

    controls.update();
    renderer.render(scene, camera);
}

// Add Sun
const sunGeometry = new THREE.SphereGeometry(planetData[0].radius, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: planetData[0].color });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.2;
controls.zoomSpeed = 0.5;

// Set the initial camera position and look at the sun
camera.position.set(0, 0, 5); // Adjust the distance as needed
camera.lookAt(sun.position);

animate();
