import MovingObject from 'MovingObject';
import Wall from 'Wall';

export default class World {
  constructor(player) {
    this._objects = [];
    this._walls = [];
    this.player = player;
  }

  addObject(object) {
    this._objects.push(object);
  }

  addWall(wall) {
    this._walls.push(wall);
  }

  setPlayer(player) {
    this.player = player;
  }

  update(ctx, camera, timeDelta) {
    this.updateMovingObjects(timeDelta);
    this.draw(ctx, camera);
  }

  updateMovingObjects(timeDelta) {
    this.movingObjects.forEach(object => {
      this.walls.filter(wall => wall.isIntersecting(object)).forEach(wall => this.handleWallIntersection(object, wall));
      this.objects.forEach(otherObject => object.setBlockedDirectionsByObject(otherObject));
      object.step(timeDelta);
    });
  }

  handleWallIntersection(object, wall) {
    object.setBlockedDirectionsByPoint(wall.getObjectIntersectionPoint(object));
  }

  draw(ctx, camera) {
    this.objectsToRender.forEach(object => object.draw && object.draw(ctx, camera));
  }

  buildWallsFromArray(arr) {
    arr.forEach(points => {
      this.addWall(new Wall({ start: { x: points[0][0], y: points[0][1] }, finish: { x: points[1][0], y: points[1][1] } }));
    });
  }

  get objects() {
    return this._objects;
  }

  get movingObjects() {
    return this._objects.filter(object => object instanceof MovingObject).concat(this.player);
  }

  get objectsToRender() {
    return this._objects.concat(this.walls).concat(this.player)
  }

  get walls() {
    return this._walls;
  }
}
