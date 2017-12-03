import { WALL_THICKNESS } from 'config/wall';
import { setAttributes } from 'tools/object';
import CanvasObject from 'CanvasObject';

export default class Wall {
  constructor(options) {
    this.thickness = WALL_THICKNESS;
    setAttributes(this, options, ['start', 'finish', 'thickness']);
    this.intersectionPoints = {};
  }

  draw(ctx, camera) {
    ctx.beginPath();
    if (camera) {
      if (!this.isInCamera(camera)) return;
      const { start, finish } = this.getPositionInCamera(camera);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(finish.x, finish.y);
    } else {
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.finish.x, this.finish.y);
    }
    ctx.lineWidth = this.thickness;
    ctx.stroke();
  }

  get m() {
    if (this._m) return this._m;
    return this._m = (this.finish.y - this.start.y) / (this.finish.x - this.start.x);
  }

  get b() {
    if (this._b) return this._b;
    return this._b = this.start.y - this.start.x * this.m;
  }

  isInCamera(camera) {
    return this.isIntersecting(new CanvasObject({
      x: camera.xMin,
      y: camera.yMin,
      width: camera.xMax - camera.xMin,
      height: camera.yMax - camera.yMin
    }));
  }

  isIntersecting(object) {
    if (object.x + object.width < this.start.x && object.x + object.width < this.finish.x) return false;
    if (object.x > this.start.x && object.x > this.finish.x) return false;
    if (object.y + object.height < this.start.y && object.y + object.height < this.finish.y) return false;
    if (object.y > this.start.y && object.y > this.finish.y) return false;
    for (let x = this.start.x; this.start.x < this.finish.x ? x <= this.finish.x : x >= this.finish.x; this.start.x > this.finish.x ? x-- : x++) {
      if (object.containsPoint({ x, y: this.m * x + this.b })) {
        this.intersectionPoints[object.id] = { x: this.m === 0 ? x + object.width / 2 : x, y: this.m * x + this.b };
        return true;
      }
    }
    this.intersectionPoints[object.id] = undefined;
    return false;
  }

  getPositionInCamera(camera) {
    if (!this.isInCamera(camera)) throw new Error('Wall is out of camera view');
    return {
      start: { x: this.start.x - camera.xMin, y: this.start.y - camera.yMin },
      finish: { x: this.finish.x - camera.xMin, y: this.finish.y - camera.yMin }
    };
  }

  getObjectIntersectionPoint(object) {
    if (!this.intersectionPoints[object.id]) throw new Error('Object is not intersecting wall');
    return this.intersectionPoints[object.id];
  }

  resetIntersectionPoints() {
    this.intersectionPoints = {};
  }
}
