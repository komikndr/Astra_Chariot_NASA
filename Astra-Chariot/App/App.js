// Code smell warning :this interface class almost become god object
import * as THREE from "three";

import Renderer from "./Renderer";
import Camera from "./Camera";
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Assets from "./Utils/Assets";

class App {
  static instance;
  constructor(canvas) {
    if (App.instance) {
      return App.instance;
    }
    App.instance = this;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.time = new Time();
    this.renderer = new Renderer();

    this.time.on("update", () => {
      this.update();
    });

    this.sizes.on("resize", () => {
      this.resize();
    });
  }
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }
  update() {
    this.camera.update();

    this.renderer.update();
  }
}

export default App;
