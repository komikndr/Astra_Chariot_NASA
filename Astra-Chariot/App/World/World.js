import * as THREE from "three";
import App from "../App.js";

import Sol  from "./Sol.js";
// import Controls from "./Controls.js";
import { EventEmitter } from "events";

export default class World extends EventEmitter {
    constructor() {
        super();
        this.app = new App();
        this.sizes = this.app.sizes;
        this.scene = this.app.scene;
        this.canvas = this.app.canvas;
        this.camera = this.app.camera;
        this.resources = this.app.resources;
        this.theme = this.app.theme;

        this.resources.on("ready", () => {
            // this.environment = new Environment();
            // this.floor = new Floor();
            this.sol = new Sol();
            // this.controls = new Controls();
            this.emit("worldready");
        });

        // this.theme.on("switch", (theme) => {
        //     this.switchTheme(theme);
        // });

        // this.sizes.on("switchdevice", (device) => {
        //     this.switchDevice(device);
        // });
    }

    // switchTheme(theme) {
    //     if (this.environment) {
    //         this.environment.switchTheme(theme);
    //     }
    // }

    // switchDevice(device) {
    //     if (this.controls) {
    //         this.controls.switchDevice(device);
    //     }
    // }

    resize() {}

    update() {
        if (this.sol) {
            this.sol.update();
        }
        if (this.controls) {
            this.controls.update();
        }
    }
}