import { setAttributes } from 'tools/object';

export default class Door {
  constructor(options) {
    setAttributes(this, options, ['x', 'y', 'width']);
    this.rOffset = 0;
    this.rTarget = 0;
  }

  swing(degrees) {
    this.rTarget = degrees * Math.PI / 180;
  }
}
