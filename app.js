/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = __webpack_require__(11);

class CanvasObject {

  constructor(options) {
    (0, _object.setAttributes)(this, options, ['x', 'y', 'width', 'height']);
    this.id = CanvasObject.nextID();
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
exports.default = CanvasObject;
CanvasObject.lastID = 0;

CanvasObject.nextID = function () {
  return ++CanvasObject.lastID;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = __webpack_require__(11);

var _CanvasObject = __webpack_require__(0);

var _CanvasObject2 = _interopRequireDefault(_CanvasObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MovingObject extends _CanvasObject2.default {
  constructor(options) {
    super(options);
    (0, _object.setAttributes)(this, options, ['vx', 'vy']);
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
exports.default = MovingObject;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _camera = __webpack_require__(3);

var _Camera = __webpack_require__(4);

var _Camera2 = _interopRequireDefault(_Camera);

var _CanvasObject = __webpack_require__(0);

var _CanvasObject2 = _interopRequireDefault(_CanvasObject);

var _Player = __webpack_require__(5);

var _Player2 = _interopRequireDefault(_Player);

var _WorldView = __webpack_require__(7);

var _WorldView2 = _interopRequireDefault(_WorldView);

var _World = __webpack_require__(8);

var _World2 = _interopRequireDefault(_World);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const canvas = document.getElementById('canvas');
canvas.height = _camera.CAMERA_HEIGHT;
canvas.width = _camera.CAMERA_WIDTH;
canvas.style.border = '1px solid black';

(function initialize() {
  const player = new _Player2.default({ x: 100, y: 100, width: 25, height: 25, vx: 0, vy: 0 });
  const world = new _World2.default(player);
  const walls = [[[10, 10], [2000, 10]], [[2000, 10], [2000, 1400]], [[2000, 1400], [10, 1400]], [[10, 1400], [10, 10]], [[400, 10], [400, 450]], [[400, 500], [400, 1400]], [[750, 10], [750, 900]], [[750, 950], [750, 1400]], [[1300, 10], [1300, 300]], [[1300, 350], [1300, 1400]], [[10, 700], [500, 700]], [[550, 700], [1050, 700]], [[1100, 700], [1500, 700]], [[1550, 700], [2000, 700]]];
  const camera = new _Camera2.default({ mode: _Camera2.default.MODE_SHIFT, width: _camera.CAMERA_WIDTH, height: _camera.CAMERA_HEIGHT, shiftSpeed: _camera.CAMERA_SHIFT_SPEED });
  world.buildWallsFromArray(walls);
  world.addObject(new _CanvasObject2.default({ x: 1860, y: 1300, width: 50, height: 50 }));
  const worldView = new _WorldView2.default(canvas, world, camera);
  window.worldView = worldView;

  worldView.start();
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const CAMERA_HEIGHT = exports.CAMERA_HEIGHT = 600;
const CAMERA_WIDTH = exports.CAMERA_WIDTH = 800;
const CAMERA_SHIFT_SPEED = exports.CAMERA_SHIFT_SPEED = 0.2;

exports.default = {
  CAMERA_HEIGHT,
  CAMERA_WIDTH,
  CAMERA_SHIFT_SPEED
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _object = __webpack_require__(11);

class Camera {

  constructor(options) {
    if (!Camera.MODES.some(validMode => options.mode === validMode)) throw new Error('Invalid camera mode');
    (0, _object.setAttributes)(this, options, ['width', 'height', 'mode', 'shiftSpeed']);
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
exports.default = Camera;
Camera.MODE_FOLLOW = 'F';
Camera.MODE_SHIFT = 'S';
Camera.SHIFT_THRESHOLD = 75;
Camera.MODES = [Camera.MODE_FOLLOW, Camera.MODE_SHIFT];

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _player = __webpack_require__(6);

var _object = __webpack_require__(11);

var _MovingObject = __webpack_require__(1);

var _MovingObject2 = _interopRequireDefault(_MovingObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Player extends _MovingObject2.default {

  constructor(options) {
    super(options);

    this.handleKeydown = e => {
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
    };

    this.handleKeyup = e => {
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
    };

    this.speed = _player.PLAYER_SPEED;
    (0, _object.setAttributes)(this, options, ['speed']);
    this.registerKeyListeners();
  }

  registerKeyListeners() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

}
exports.default = Player;
Player.SPEED = _player.PLAYER_SPEED;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const PLAYER_SPEED = exports.PLAYER_SPEED = 0.31;

exports.default = {
  PLAYER_SPEED
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class WorldView {
  constructor(canvas, world, camera) {
    this.animate = time => {
      const timeDelta = time - this.lastTime;
      this.lastTime = time;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      if (this.camera) this.camera.update(this.world.player);
      this.world.update(this.ctx, this.camera, timeDelta);
      requestAnimationFrame(this.animate);
    };

    this.ctx = canvas.getContext('2d');
    this.world = world;
    this.camera = camera;
  }

  start() {
    this.lastTime = 0;
    requestAnimationFrame(this.animate);
  }

}
exports.default = WorldView;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MovingObject = __webpack_require__(1);

var _MovingObject2 = _interopRequireDefault(_MovingObject);

var _Wall = __webpack_require__(9);

var _Wall2 = _interopRequireDefault(_Wall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class World {
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
      this.walls.filter(wall => wall.isIntersecting(object)).forEach(wall => object.setBlockedDirectionsByPoint(wall.getObjectIntersectionPoint(object)));
      this.objects.forEach(otherObject => object.setBlockedDirectionsByObject(otherObject));
      object.step(timeDelta);
    });
  }

  draw(ctx, camera) {
    this.objectsToRender.forEach(object => object.draw(ctx, camera));
  }

  buildWallsFromArray(arr) {
    arr.forEach(points => {
      this.addWall(new _Wall2.default({ start: { x: points[0][0], y: points[0][1] }, finish: { x: points[1][0], y: points[1][1] } }));
    });
  }

  get objects() {
    return this._objects;
  }

  get movingObjects() {
    return this._objects.filter(object => object instanceof _MovingObject2.default).concat(this.player);
  }

  get objectsToRender() {
    return this.player ? this._objects.concat(this._walls).concat(this.player) : this._objects.concat(this._walls);
  }

  get walls() {
    return this._walls;
  }
}
exports.default = World;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wall = __webpack_require__(10);

var _object = __webpack_require__(11);

var _CanvasObject = __webpack_require__(0);

var _CanvasObject2 = _interopRequireDefault(_CanvasObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Wall {
  constructor(options) {
    this.thickness = _wall.WALL_THICKNESS;
    (0, _object.setAttributes)(this, options, ['start', 'finish', 'thickness']);
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
    return this.isIntersecting(new _CanvasObject2.default({
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
exports.default = Wall;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
const WALL_THICKNESS = exports.WALL_THICKNESS = 2;

exports.default = {
  WALL_THICKNESS
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAttributes = setAttributes;
function setAttributes(context, options, keys) {
  keys.forEach(key => {
    if (options[key] !== undefined) context[key] = options[key];
  });
}

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map