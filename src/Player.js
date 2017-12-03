import { PLAYER_SPEED } from 'config/player';
import { setAttributes } from 'tools/object';
import MovingObject from 'MovingObject';

export default class Player extends MovingObject {
  static SPEED = PLAYER_SPEED;

  constructor(options) {
    super(options);
    this.speed = PLAYER_SPEED;
    setAttributes(this, options, ['speed'])
    this.registerKeyListeners();
  }

  registerKeyListeners() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  handleKeydown = (e) => {
    switch (e.keyCode) {
      case 37:
        this.isLeftPressed = true;
        this.vx = -this.speed;
        break;
      case 38:
        this.isUpPressed = true;
        this.vy = -this.speed;
        break;
      case 39:
        this.isRightPressed = true;
        this.vx = this.speed;
        break;
      case 40:
        this.isDownPressed = true;
        this.vy = this.speed;
        break;
      default:
        break;
    }
  }

  handleKeyup = (e) => {
    switch (e.keyCode) {
      case 37:
        this.isLeftPressed = false;
        this.vx = this.isRightPressed ? this.speed : 0;
        break;
      case 38:
        this.isUpPressed = false;
        this.vy = this.isDownPressed ? this.speed : 0;
        break;
      case 39:
        this.isRightPressed = false;
        this.vx = this.isLeftPressed ? -this.speed : 0;
        break;
      case 40:
        this.isDownPressed = false;
        this.vy = this.isUpPressed ? -this.speed : 0;
        break;
      default:
        break;
    }
  }
}
