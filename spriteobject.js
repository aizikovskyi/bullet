class MovingObject {

  constructor(x, y, initialVelocity) {
    this.x = x;
    this.y = y;
    this.velocity = { x: initialVelocity.x, y: initialVelocity.y };
    this.boundaryType = 0;
    this.radius = 0;
    this.deadly = false;
  }

  intersectsPoint(point) {
    const distanceSquared = ((point.x - this.x) ** 2) + ((point.y - this.y) ** 2);
    return distanceSquared <= this.radius ** 2;
  }

  moveAndUpdateVelocity(gameState) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  shouldRemain(gameState) {
    const fitsWidth = (this.x > -this.radius) && (this.x < gameState.fieldDimensions.width + this.radius);
    const fitsHeight = (this.y > -this.radius) && (this.y < gameState.fieldDimensions.height + this.radius);
    return fitsWidth && fitsHeight;
  }
}

class SimpleBullet extends MovingObject {
  constructor(x, y, initialVelocity, birthFrame) {
    super(x, y, initialVelocity, birthFrame);
    this.radius = 10;
    this.deadly = true;
  }
}

class PlayerObject extends MovingObject {
  constructor(x, y, initialVelocity, birthFrame) {
    super(x, y, initialVelocity, birthFrame);
    this.radius = 10;
  }

  moveTowards(targetPoint) {
    const x = targetPoint.x;
    const y = targetPoint.y;
    // dumb code for now. will be fixed later
    if (this.x < x) this.x += 3;
    if (this.x > x) this.x -= 3;
    if (this.y < y) this.y += 3;
    if (this.y > y) this.y -= 3;
  }
}
