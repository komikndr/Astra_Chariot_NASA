import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import App from "./App";

import { cameraConfig } from "./Config";

class Camera {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.canvas = this.app.canvas;

    this.buildPerspectiveCamera();
    this.buildOrthographicCamera();
    this.buildOrbitControl();
  }

  buildPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      cameraConfig.FOV,
      this.sizes.aspectRatio,
      cameraConfig.perspectiveNearField,
      cameraConfig.perspectiveFarField
    );

    this.scene.add(this.perspectiveCamera);
    this.perspectiveCamera.position.x = 121;
    this.perspectiveCamera.position.y = 14;
    this.perspectiveCamera.position.z = 40;
  }

  buildOrthographicCamera() {
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspectRatio * cameraConfig.Frustrum) / 2,
      (this.sizes.aspectRatio * cameraConfig.Frustrum) / 2,
      cameraConfig.Frustrum / 2,
      -cameraConfig.Frustrum / 2,
      cameraConfig.orthographicNearField,
      cameraConfig.orthographicFarField
    );
    this.scene.add(this.orthographicCamera);
  }

  buildOrbitControl() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspectRatio;
    this.perspectiveCamera.updateProjectionMatrix();

    this.orthographicCamera.left =
      (-this.sizes.aspectRatio * cameraConfig.Frustrum) / 2;
    this.orthographicCamera.right =
      (this.sizes.aspectRatio * cameraConfig.Frustrum) / 2;
    this.orthographicCamera.top = cameraConfig.Frustrum / 2;
    this.orthographicCamera.bottom = -cameraConfig.Frustrum / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}

export default Camera;
