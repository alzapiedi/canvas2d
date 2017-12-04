import { setAttributes } from 'tools/object';

export default class Camera {
  static MODE_FOLLOW = 'F';
  static MODE_SHIFT = 'S';
  static SHIFT_THRESHOLD = 75;
  static MODES = [Camera.MODE_FOLLOW, Camera.MODE_SHIFT];

  constructor(options) {
    if (!Camera.MODES.some(validMode => options.mode === validMode)) throw new Error('Invalid camera mode');
    setAttributes(this, options, ['width', 'height', 'mode', 'shiftSpeed']);
    this.isTransitioning = false;
    this.xMax = this.width;
    this.xMin = 0;
    this.yMax = this.height;
    this.yMin = 0;
    this.xMaxTarget = this.width;
    this.xMinTarget = 0;
    this.yMaxTarget = this.height;
    this.yMinTarget = 0;
  }

  update(player) {
    switch (this.mode) {
      case Camera.MODE_FOLLOW:
        this.moveToPlayer();
        break;
      case Camera.MODE_SHIFT:
        if (this.isTransitioning) {
          Math.abs(this.xMin - this.xMinTarget) < 1 && Math.abs(this.yMin - this.yMinTarget) < 1 ? this.endTransition() : this.transition();
          return;
        }
        if (this.xMax - player.x < Camera.SHIFT_THRESHOLD) this.startTransition('x', 1);
        if (player.x - this.xMin < Camera.SHIFT_THRESHOLD) this.startTransition('x', -1);
        if (this.yMax - player.y < Camera.SHIFT_THRESHOLD) this.startTransition('y', 1);
        if (player.y - this.yMin < Camera.SHIFT_THRESHOLD) this.startTransition('y', -1);
    }
  }

  moveToPlayer() {
    this.xMin = player.x - this.width / 2;
    this.xMax = this.xMin + this.width;
    this.yMin = player.y - this.height / 2;
    this.yMax = this.yMin + this.height;
  }

  startTransition(axis, dir) {
    this.isTransitioning = true;
    const dimension = axis === 'x' ? 'width' : 'height';
    this[`${axis}MinTarget`] = this[`${axis}Min`] + dir * ((this[dimension]) - (2 * Camera.SHIFT_THRESHOLD));
    this[`${axis}MaxTarget`] = this[`${axis}MinTarget`] + this[dimension];
  }

  transition() {
    this.xMin = this.xMinTarget > this.xMin ? this.xMin + (this.xMinTarget - this.xMin) * this.shiftSpeed : this.xMin - (this.xMin - this.xMinTarget) * this.shiftSpeed;
    this.xMax = this.xMaxTarget > this.xMax ? this.xMax + (this.xMaxTarget - this.xMax) * this.shiftSpeed : this.xMax - (this.xMax - this.xMaxTarget) * this.shiftSpeed;
    this.yMin = this.yMinTarget > this.yMin ? this.yMin + (this.yMinTarget - this.yMin) * this.shiftSpeed : this.yMin - (this.yMin - this.yMinTarget) * this.shiftSpeed;
    this.yMax = this.yMaxTarget > this.yMax ? this.yMax + (this.yMaxTarget - this.yMax) * this.shiftSpeed : this.yMax - (this.yMax - this.yMaxTarget) * this.shiftSpeed;
  }

  endTransition() {
    this.xMin = this.xMinTarget;
    this.xMax = this.xMaxTarget;
    this.yMin = this.yMinTarget;
    this.yMax = this.yMaxTarget;
    this.isTransitioning = false;
  }
}
