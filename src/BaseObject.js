import { setAttributes } from 'tools/object';

export default class BaseObject {
  static lastID = 0;

  static nextID = function() {
    return ++BaseObject.lastID;
  }

  constructor(options) {
    setAttributes(this, options, ['x', 'y', 'width', 'height']);
    this.id = BaseObject.nextID();
  }

  draw(ctx, camera) {
    const { x, y, width, height } = this;
    if (camera) {
      if (!this.isInCamera(camera)) return;
      const { x: cameraX, y: cameraY } = this.getPositionInCamera(camera);
      ctx.fillRect(cameraX, cameraY, width, height);
      return;
    }
    ctx.fillRect(x, y, width, height);
  }

  containsPoint(point) {
    return !(point.x > this.x + this.width || point.x < this.x || point.y > this.y + this.height || point.y < this.y);
  }

  isInCamera(camera) {
    return this.x - this.width >= camera.xMin && this.x <= camera.xMax && this.y - this.height >= camera.yMin && this.y <= camera.yMax;
  }

  getPositionInCamera(camera) {
    if (!this.isInCamera(camera)) throw new Error('Object is out of camera view');
    return { x: this.x - camera.xMin, y: this.y - camera.yMin };
  }
}
