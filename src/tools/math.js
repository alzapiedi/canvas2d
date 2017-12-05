function isVerticalWallIntersectingObject(wall, object, tolerance) {
  for (let y = wall.start.y; wall.start.y < wall.finish.y ? y <= wall.finish.y : y >= wall.finish.y; wall.start.y > wall.finish.y ? y-- : y++) {
    if (objectContainsPoint(object, { x: wall.start.x, y })) {
      wall.setIntersectionPoint(object, { x: wall.start.x, y });
      return true;
    }
  }
  wall.clearIntersectionPoint(object);
  return false;
}

export function isWallIntersectingObject(wall, object, tolerance = 10) {
  if (object.x + object.width + tolerance < wall.start.x && object.x + object.width + tolerance < wall.finish.x) return false;
  if (object.x - tolerance > wall.start.x && object.x - tolerance > wall.finish.x) return false;
  if (object.y + object.height + tolerance < wall.start.y && object.y + object.height + tolerance < wall.finish.y) return false;
  if (object.y - tolerance > wall.start.y && object.y - tolerance > wall.finish.y) return false;
  if (wall.m === Infinity || wall.m === -Infinity) return isVerticalWallIntersectingObject(wall, object, tolerance);

  for (let x = wall.start.x; wall.start.x < wall.finish.x ? x <= wall.finish.x : x >= wall.finish.x; wall.start.x > wall.finish.x ? x-- : x++) {
    if (objectContainsPoint(object, { x: x + tolerance, y: wall.m * x + wall.b + tolerance })) {
      wall.setIntersectionPoint(object, { x: wall.m === 0 ? x + object.width / 2 : x, y: wall.m * x + wall.b });
      return true;
    }
  }
  wall.clearIntersectionPoint(object);
  return false;
}

export function objectContainsPoint(object, point) {
  return !(point.x > object.x + object.width || point.x < object.x || point.y > object.y + object.height || point.y < object.y);
}

export function calculateEndpoint(start, m, distance) {
  const { x, y } = start;
  const angle = Math.atan(m);
  return { x: x + distance * Math.cos(angle), y: y + distance * Math.sin(angle) };
}
