function isVerticalWallIntersectingObject(wall, object) {
  for (let y = wall.start.y; wall.start.y < wall.finish.y ? y <= wall.finish.y : y >= wall.finish.y; wall.start.y > wall.finish.y ? y-- : y++) {
    if (objectContainsPoint(object, { x: wall.start.x, y })) {
      wall.setIntersectionPoint(object, { x: wall.start.x, y });
      return true;
    }
  }
  wall.clearIntersectionPoint(object);
  return false;
}

export function isWallIntersectingObject(wall, object) {
  if (object.x + object.width < wall.start.x && object.x + object.width < wall.finish.x) return false;
  if (object.x > wall.start.x && object.x > wall.finish.x) return false;
  if (object.y + object.height < wall.start.y && object.y + object.height < wall.finish.y) return false;
  if (object.y > wall.start.y && object.y > wall.finish.y) return false;
  if (wall.m === Infinity || wall.m === -Infinity) return isVerticalWallIntersectingObject(wall, object);

  for (let x = wall.start.x; wall.start.x < wall.finish.x ? x <= wall.finish.x : x >= wall.finish.x; wall.start.x > wall.finish.x ? x-- : x++) {
    if (objectContainsPoint(object, { x, y: wall.m * x + wall.b })) {
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
