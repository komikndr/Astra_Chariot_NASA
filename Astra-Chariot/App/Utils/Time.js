import { EventEmitter } from "events";

import { timeConfig } from "../Config";

class Time extends EventEmitter {
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = timeConfig.frameTime;

    this.update();
  }

  update() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.emit("update");
    window.requestAnimationFrame(() => this.update());
  }
}

export default Time