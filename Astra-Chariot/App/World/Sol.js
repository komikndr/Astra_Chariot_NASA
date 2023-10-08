import * as THREE from "three";
import App from "../App.js";
import ModelTreeViewer from "../Utils/ModelTreeViewer.js";
import { orbitalSpeedDict } from "./SolConfig.js";

export default class Sol {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.resources = this.app.resources;
    this.time = this.app.time;
    this.sol = this.resources.items.sol;
    this.actualSol = this.sol.scene;
    this.solChildren = {};
    this.planets = []; 
    this.orbitalSpeed = 0.01;     this.initialPositionsRelativeToSun = [];

    this.setModel();
    // this.setAnimation();
    // this.onMouseMove();
  }
  rotatePlanetTowardSun(planet) {
    const direction = new THREE.Vector3();
    direction.subVectors(this.sun.position, planet.position).normalize();

    const up = new THREE.Vector3(0, 0, 1);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(up, direction);

    planet.setRotationFromQuaternion(quaternion);
  }
  setModel() {
    this.actualSol.children.forEach((child) => {
      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name === "Son") {
        this.sun = child; // Assign the sun object
      } else {
        this.planets.push(child); // Store the planets in the array
        const initialPositionRelativeToSun = new THREE.Vector3();
        initialPositionRelativeToSun.subVectors(
          child.position,
          this.sun.position
        );
        this.initialPositionsRelativeToSun.push(initialPositionRelativeToSun);
      }

      if (child instanceof THREE.Group) {
        child.children.forEach((groupchild) => {
          console.log(groupchild.material);
          groupchild.castShadow = true;
          groupchild.receiveShadow = true;
        });
      }
    });

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Color, Intensity
    this.directionalLight.position.set(200, 1, 70); // Position the light
    this.actualSol.add(this.directionalLight);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 3);
    this.actualSol.add(this.ambientLight);

    // rectLight.add(rectLightHelper);
    // console.log(this.room);

    this.scene.add(this.actualSol);
    this.actualSol.scale.set(0.11, 0.11, 0.11);
    console.log(this.planets)
  }

  resize() {}

  update() {
    this.planets.forEach((planet, index) => {

      planet.rotation.y +=0.0001
      const initialPosition = this.initialPositionsRelativeToSun[index].clone();
      const angle = orbitalSpeedDict[planet.name]; 
      initialPosition.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);


      // Set the new position relative to the sun
      planet.position.copy(this.sun.position.clone().add(initialPosition));
      this.initialPositionsRelativeToSun[index] = initialPosition; // Update the initial position vector
    });
  }
}
