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
    this.xMaxTarget = this.width;
    this.xMin = 0;
    this.xMinTarget = 0;
    this.yMax = this.height;
    this.yMaxTarget = this.height;
    this.yMin = 0;
    this.yMinTarget = 0;
  }

  update(player) {
    switch (this.mode) {
      case Camera.MODE_FOLLOW:
        this.xMin = player.x - this.width / 2;
        this.xMax = this.xMin + this.width;
        this.yMin = player.y - this.height / 2;
        this.yMax = this.yMin + this.height;
        break;
      case Camera.MODE_SHIFT:
        if (this.isTransitioning) {
          this.xMin = this.xMinTarget > this.xMin ? this.xMin + (this.xMinTarget - this.xMin) * this.shiftSpeed : this.xMin - (this.xMin - this.xMinTarget) * this.shiftSpeed;
          this.xMax = this.xMaxTarget > this.xMax ? this.xMax + (this.xMaxTarget - this.xMax) * this.shiftSpeed : this.xMax - (this.xMax - this.xMaxTarget) * this.shiftSpeed;
          this.yMin = this.yMinTarget > this.yMin ? this.yMin + (this.yMinTarget - this.yMin) * this.shiftSpeed : this.yMin - (this.yMin - this.yMinTarget) * this.shiftSpeed;
          this.yMax = this.yMaxTarget > this.yMax ? this.yMax + (this.yMaxTarget - this.yMax) * this.shiftSpeed : this.yMax - (this.yMax - this.yMaxTarget) * this.shiftSpeed;
          if (Math.abs(this.xMin - this.xMinTarget) < 1 && Math.abs(this.yMin - this.yMinTarget) < 1) {
            this.xMin = this.xMinTarget;
            this.xMax = this.xMaxTarget;
            this.yMin = this.yMinTarget;
            this.yMax = this.yMaxTarget;
            this.isTransitioning = false;
          }
          return;
        }
        if (this.xMax - player.x < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.xMinTarget = this.xMin + this.width - 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + this.width;
        }
        if (player.x - this.xMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.xMinTarget = this.xMin - this.width + 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + this.width;
        }
        if (this.yMax - player.y < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin + this.height - 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + this.height;
        }
        if (player.y - this.yMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin - this.height + 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + this.height;
        }
    }
  }
}
