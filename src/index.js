import {
  CAMERA_WIDTH,
  CAMERA_HEIGHT,
  CAMERA_SHIFT_SPEED
} from 'config/camera';
import Camera from 'Camera';
import CanvasObject from 'CanvasObject';
import Player from 'Player';
import WorldView from 'WorldView';
import World from 'World';

const canvas = document.getElementById('canvas');
canvas.height = CAMERA_HEIGHT;
canvas.width = CAMERA_WIDTH;
canvas.style.border = '1px solid black';

(function initialize() {
  const player = new Player({ x: 100, y: 100, width: 25, height: 25, vx: 0, vy: 0 });
  const world = new World(player);
  const walls = [[[10, 10], [2000, 10]], [[2000, 10], [2000, 1400]], [[2000, 1400], [10, 1400]], [[10, 1400], [10, 10]], [[400, 10], [400, 450]], [[400, 500], [400, 1400]], [[750, 10], [750, 900]], [[750, 950], [750, 1400]], [[1300, 10], [1300, 300]], [[1300, 350], [1300, 1400]], [[10, 700], [500, 700]], [[550, 700], [1050, 700]], [[1100, 700], [1500, 700]], [[1550, 700], [2000, 700]]];
  const camera = new Camera({ mode: Camera.MODE_SHIFT, width: CAMERA_WIDTH, height: CAMERA_HEIGHT, shiftSpeed: CAMERA_SHIFT_SPEED })
  world.buildWallsFromArray(walls);
  world.addObject(new CanvasObject({ x: 1860, y: 1300, width: 50, height: 50 }));
  const worldView = new WorldView(canvas, world, camera);
  window.worldView = worldView;

  worldView.start();
})();
