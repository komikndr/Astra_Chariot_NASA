import * as THREE from "three";

import App from "./App";

import { cameraConfig } from "./Config";

class Camera {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;

    this.buildPerspectiveCamera();
    this.buildOrthographicCamera();
  }

  buildPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      cameraConfig.FOV,
      this.sizes.aspectRatio,
      cameraConfig.perspectiveNearField,
      cameraConfig.perspectiveFarField
    );

    this.scene.add(this.perspectiveCamera);
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

  update() {}
}

export default Camera;
