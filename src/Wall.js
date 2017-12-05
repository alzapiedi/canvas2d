import { WALL_THICKNESS } from 'config/wall';
import { setAttributes } from 'tools/object';
import { calculateEndpoint, isWallIntersectingObject } from 'tools/math';
import BaseObject from 'BaseObject';

export default class Wall {
  constructor(options) {
    this.thickness = WALL_THICKNESS;
    this.doors = [];
    this.wallSections = [];
    setAttributes(this, options, ['start', 'finish', 'thickness', 'parent']);
    this.intersectionPoints = {};
  }

  draw(ctx, camera) {
    if (this.wallSections.length === 0) return this.drawWallSection(this, ctx, camera);
    this.wallSections.forEach(wallSection => this.drawWallSection(wallSection, ctx, camera));
    this.doors.forEach(this.drawDoor);
  }

  drawWallSection(wall, ctx, camera) {
    ctx.beginPath();
    if (camera) {
      if (!wall.isInCamera(camera)) return;
      const { start, finish } = wall.getPositionInCamera(camera);
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(finish.x, finish.y);
      // console.log(`[${start.x,start.y}] [${finish.x, finish.y}]`)
    } else {
      ctx.moveTo(wall.start.x, wall.start.y);
      ctx.lineTo(wall.finish.x, wall.finish.y);
    }
    ctx.lineWidth = wall.thickness;
    ctx.stroke();
  }

  drawDoor = (door) => {

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
    return this.isIntersecting({
      x: camera.xMin,
      y: camera.yMin,
      width: camera.xMax - camera.xMin,
      height: camera.yMax - camera.yMin
    });
  }

  isIntersecting(object) {
    if (this.doors.length === 0) return isWallIntersectingObject(this, object);
    return this.wallSections.some(wallSection => isWallIntersectingObject(wallSection, object));
  }

  setIntersectionPoint(object, point) {
    this.parent ? this.parent.intersectionPoints[object.id] = point : this.intersectionPoints[object.id] = point;
  }

  clearIntersectionPoint(object) {
    delete this.intersectionPoints[object.id];
  }

  getPositionInCamera(camera) {
    if (!this.isInCamera(camera)) throw new Error('Wall#getPositionInCamera: Wall is out of camera view');
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

  addDoor(door) {
    this.doors.push(door);
    this.updateWallSections();
  }

  updateWallSections() {
    if (this.m === Infinity || this.m === -Infinity) return this.updateVerticalWallSections();
    const { x, y } = this.start;
    const wallSections = [];
    let start = { x, y };
    let finish, endpoint, previousDoorEndpoint;
    this.doors.sort((door1, door2) => door2.x < door1.x).forEach((door, idx) => {
      previousDoorEndpoint = endpoint
      endpoint = door.endpoint ? door.endpoint : calculateEndpoint({ x: door.x, y: door.y }, this.m, door.width);
      door.setEndpoint(endpoint);
      if (idx === 0) return wallSections.push(new Wall({ start, finish: { x: door.x, y: door.y }, parent: this}));
      wallSections.push({ start: previousDoorEndpoint ? previousDoorEndpoint : endpoint, finish: { x: door.x, y: door.y }});
    });
    wallSections.push(new Wall({ start: endpoint, finish: { x: this.finish.x, y: this.finish.y } }));
    this.wallSections = wallSections;
  }
}
