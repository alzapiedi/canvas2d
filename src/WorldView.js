export default class WorldView {
  constructor(canvas, world, camera) {
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.camera = camera;
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate);
  }

  animate = (time) => {
    const timeDelta = time - this.lastTime;
    this.lastTime = time;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.camera) this.camera.update(this.world.player);
    this.world.update(this.ctx, this.camera, timeDelta);
    requestAnimationFrame(this.animate);
  }
}
