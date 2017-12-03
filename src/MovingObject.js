import { setAttributes } from 'tools/object';
import BaseObject from 'BaseObject';

export default class MovingObject extends BaseObject {
  constructor(options) {
    super(options);
    setAttributes(this, options, ['vx', 'vy']);
    this.blockedDirections = {};
  }

  step(timeDelta) {
    if (this.vx > 0) this.x = this.blockedDirections.right ? this.x : this.x + this.vx * timeDelta;
    if (this.vx < 0) this.x = this.blockedDirections.left ? this.x : this.x + this.vx * timeDelta;
    if (this.vy > 0) this.y = this.blockedDirections.down ? this.y : this.y + this.vy * timeDelta;
    if (this.vy < 0) this.y = this.blockedDirections.up ? this.y : this.y + this.vy * timeDelta;
    this.blockedDirections = {};
  }

  getNextPosition(timeDelta) {
    return { x: this.x + this.vx * timeDelta, y: this.y + this.vy * timeDelta };
  }

  setBlockedDirectionsByPoint(intersectionPoint) {
    if (Math.abs(intersectionPoint.x - 5 < this.x) && this.vx <= 0) this.blockedDirections.left = true;
    if (Math.abs(intersectionPoint.x + 5 > this.x + this.width) && this.vx >= 0) this.blockedDirections.right = true;
    if (Math.abs(intersectionPoint.y - 5 < this.y) && this.vy <= 0) this.blockedDirections.up = true;
    if (Math.abs(intersectionPoint.y + 5 > this.y + this.height) && this.vy >= 0) this.blockedDirections.down = true;
  }

  setBlockedDirectionsByObject(object) {
    if (object.id === this.id) return;
    if (Math.abs(object.x - (this.x + this.width)) < 5 && !(this.y + this.height < object.y || this.y > object.y + object.height)) this.blockedDirections.right = true;
    if (Math.abs(object.x + object.width - this.x) < 5 && !(this.y + this.height < object.y || this.y > object.y + object.height)) this.blockedDirections.left = true;
    if (Math.abs(object.y - (this.y + this.height)) < 5 && !(this.x + this.width < object.x || this.x > object.x + object.width)) this.blockedDirections.down = true;
    if (Math.abs(object.y + object.height - this.y) < 5 && !(this.x + this.width < object.x || this.x > object.x + object.width)) this.blockedDirections.up = true;
  }
}
