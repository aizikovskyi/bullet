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
    const distanceSquared = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return distanceSquared <= Math.pow(this.radius, 2);
  }

  moveAndUpdateVelocity(gameState) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  shouldRemain(gameState) {
    const fitsWidth = (this.x > -this.radius) && (this.x < gameState.fieldDimensions.width + this.radius);
    const fitsHeight = /* (this.y > -this.radius) && */ (this.y < gameState.fieldDimensions.height + this.radius);
    return fitsWidth && fitsHeight;
  }

  unitVectorTowards(point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    //if (dx <= this.radius && dy <= this.radius) return { x: 0, y: 0 };
    const length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (length === 0) return { x: 0, y: 0 };
    return { x: dx / length, y: dy / length };
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
    this.radius = 1;
  }

  moveTowards(targetPoint) {
    const vector = this.unitVectorTowards(targetPoint);
    this.x += vector.x * 3;
    this.y += vector.y * 3;
    // if (vector.y < 0) {
    //   this.y += vector.y * 4;
    // } else {
    //   this.y += vector.y * 2;
    // }
  }
}
