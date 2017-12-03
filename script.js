const CAMERA_HEIGHT = 600;
const CAMERA_WIDTH = 800;
const CAMERA_SHIFT_SPEED = 0.2;
const PLAYER_SPEED = 0.31;
const WALL_THICKNESS = 2;

const canvas = document.getElementById('canvas');
canvas.height = CAMERA_HEIGHT;
canvas.width = CAMERA_WIDTH;
canvas.style.border = '1px solid black';

class CanvasObject {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;

    this.id = CanvasObject.nextID();
  }

  draw(ctx, camera) {
    const { x, y, width, height } = this;
    if (camera) {
      if(!this.isInCamera(camera)) return;
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
CanvasObject.lastID = 0;
CanvasObject.nextID = function() {
  return ++CanvasObject.lastID;
}

class MovingObject extends CanvasObject {
  constructor(options) {
    super(options);
    this.vx = options.vx;
    this.vy = options.vy;

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

class Player extends MovingObject {
  constructor(options) {
    super(options);
    this.speed = PLAYER_SPEED;
    this.registerKeyListeners();
  }

  registerKeyListeners() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    document.addEventListener('keyup', this.handleKeyup.bind(this));
  }

  handleKeydown(e) {
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

  handleKeyup(e) {
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

class Wall {
  constructor(options) {
    this.start = { x: options.startX, y: options.startY };
    this.finish = { x: options.finishX, y: options.finishY };
    this.thickness = WALL_THICKNESS;
    this.intersectionPoints = {};
  }

  draw(ctx, camera) {
    ctx.beginPath();
    if (camera) {
      if(!this.isInCamera(camera)) return;
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

class World {
  constructor(player) {
    this.objects = [];
    this.walls = [];
    this.player = player;
  }

  addObject(object) {
    this.objects.push(object);
  }

  addWall(wall) {
    this.walls.push(wall);
  }

  updateAndDrawObjects(ctx, camera, timeDelta) {
    this.objects.concat(this.player).forEach(object => {
      if (object.step) {
        this.walls.forEach(wall => {
          if (wall.isIntersecting(object)) {
            object.setBlockedDirectionsByPoint(wall.getObjectIntersectionPoint(object));
          }
          wall.resetIntersectionPoints();
        });
        this.objects.forEach(otherObject => {
          object.setBlockedDirectionsByObject(otherObject);
        });
        object.step(timeDelta);
      }
      object.draw(ctx, camera);
    });
  }

  drawWalls(ctx, camera) {
    this.walls.forEach(wall => wall.draw(ctx, camera));
  }

  buildWallsFromArray(arr) {
    arr.forEach(points => {
      this.addWall(new Wall({ startX: points[0][0], startY: points[0][1], finishX: points[1][0], finishY: points[1][1] }));
    });
  }
}

class WorldView {
  constructor(canvas, world, camera) {
    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.camera = camera;

    this.animate = this.animate.bind(this);
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate);
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.lastTime = time;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    if (this.camera) this.camera.update(this.world.player);
    this.world.drawWalls(this.ctx, this.camera);
    this.world.updateAndDrawObjects(this.ctx, this.camera, timeDelta);
    requestAnimationFrame(this.animate);
  }
}

class Camera {
  constructor(mode = Camera.MODE_SHIFT) {
    if (!Camera.MODES.some(validMode => mode === validMode)) throw new Error('Invalid camera mode');
    this.mode = mode;
    this.isTransitioning = false;
    this.xDelta = 0;
    this.yDelta = 0;
    this.xMax = CAMERA_WIDTH;
    this.xMaxTarget = CAMERA_WIDTH;
    this.xMin = 0;
    this.xMinTarget = 0;
    this.yMax = CAMERA_HEIGHT;
    this.yMaxTarget = CAMERA_HEIGHT;
    this.yMin = 0;
    this.yMinTarget = 0;
  }

  update(player) {
    switch (this.mode) {
      case Camera.MODE_FOLLOW:
        this.xMin = player.x - CAMERA_WIDTH / 2;
        this.xMax = this.xMin + CAMERA_WIDTH;
        this.yMin = player.y - CAMERA_HEIGHT / 2;
        this.yMax = this.yMin + CAMERA_HEIGHT;
        break;
      case Camera.MODE_SHIFT:
        if (this.isTransitioning) {
          this.xMin = this.xMinTarget > this.xMin ? this.xMin + ((this.xMinTarget - this.xMin) * CAMERA_SHIFT_SPEED) : this.xMin - ((this.xMin - this.xMinTarget) * CAMERA_SHIFT_SPEED);
          this.xMax = this.xMaxTarget > this.xMax ? this.xMax + ((this.xMaxTarget - this.xMax) * CAMERA_SHIFT_SPEED) : this.xMax - ((this.xMax - this.xMaxTarget) * CAMERA_SHIFT_SPEED);
          this.yMin = this.yMinTarget > this.yMin ? this.yMin + ((this.yMinTarget - this.yMin) * CAMERA_SHIFT_SPEED) : this.yMin - ((this.yMin - this.yMinTarget) * CAMERA_SHIFT_SPEED);
          this.yMax = this.yMaxTarget > this.yMax ? this.yMax + ((this.yMaxTarget - this.yMax) * CAMERA_SHIFT_SPEED) : this.yMax - ((this.yMax - this.yMaxTarget) * CAMERA_SHIFT_SPEED);
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
          this.xMinTarget = this.xMin + CAMERA_WIDTH - 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + CAMERA_WIDTH;
        }
        if (player.x - this.xMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.xMinTarget = this.xMin - CAMERA_WIDTH + 2 * Camera.SHIFT_THRESHOLD;
          this.xMaxTarget = this.xMinTarget + CAMERA_WIDTH;
        }
        if (this.yMax - player.y < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin + CAMERA_HEIGHT - 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + CAMERA_HEIGHT;
        }
        if (player.y - this.yMin < Camera.SHIFT_THRESHOLD) {
          this.isTransitioning = true;
          this.yMinTarget = this.yMin - CAMERA_HEIGHT + 2 * Camera.SHIFT_THRESHOLD;
          this.yMaxTarget = this.yMinTarget + CAMERA_HEIGHT;
        }
    }
  }
}

Camera.MODE_FOLLOW = 'F';
Camera.MODE_SHIFT = 'S';
Camera.SHIFT_THRESHOLD = 75;

Camera.MODES = [
  Camera.MODE_FOLLOW,
  Camera.MODE_SHIFT
];

(function initialize() {
  const player = new Player({ x: 100, y: 100, width: 25, height: 25, vx: 0, vy: 0 });
  const world = new World(player);
  const walls = [
    [[10, 10],[2000, 10]],
    [[2000, 10],[2000, 1400]],
    [[2000, 1400],[10, 1400]],
    [[10, 1400],[10, 10]],
    [[400, 10],[400, 450]],
    [[400, 500],[400,1400]],
    [[750, 10],[750,900]],
    [[750,950],[750,1400]],
    [[1300,10],[1300,300]],
    [[1300,350],[1300,1400]],
    [[10,700],[500, 700]],
    [[550,700],[1050, 700]],
    [[1100,700],[1500,700]],
    [[1550,700],[2000,700]]
  ];

  world.buildWallsFromArray(walls);
  world.addObject(new CanvasObject({ x: 1860, y: 1300, width: 50, height: 50 }));
  window.world = world;
  const worldView = new WorldView(canvas, world, new Camera());

  worldView.start();
})()
