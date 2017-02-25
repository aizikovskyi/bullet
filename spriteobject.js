class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  vectorTowards(point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    return new Point(dx, dy);
  }

  unitVectorTowards(point) {
    const dx = point.x - this.x;
    const dy = point.y - this.y;
    const length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (length === 0) return new Point(0, 0);
    return new Point(dx / length, dy / length);
  }

  distanceFromOrigin() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  distanceToPoint(point) {
    return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
  }

  scaleBy(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }
}

class MovingObject extends Point {

  constructor(x, y, initialVelocity) {
    super(x, y);
    this.velocity = new Point(initialVelocity.x, initialVelocity.y);
    this.boundaryType = 0;
    this.radius = 0;
    this.deadly = false;
    this.color = 'blue';
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
}

class SimpleBullet extends MovingObject {
  constructor(x, y, initialVelocity, birthFrame, color) {
    super(x, y, initialVelocity, birthFrame);
    this.radius = 3;
    this.deadly = true;
    this.color = color;
  }
}

class ExplosionParticle extends SimpleBullet {
  static createExplosion(origObject, gameState) {
    for (let i = 0; i < 35; i++) {
      // create a random length vector in a random direction
      const maxVel = 0.5;
      const randomDir = Math.random() * 2 * Math.PI;
      const len = Math.random() * maxVel;
      const velDeltaX = len * Math.cos(randomDir);
      const velDeltaY = len * Math.sin(randomDir);
      const vel = new Point((origObject.velocity.x / 3) + velDeltaX, (origObject.velocity.y / 3) + velDeltaY);
      const newParticle = new ExplosionParticle(origObject.x, origObject.y, vel, gameState.frame, 'red');
      gameState.objects.push(newParticle);
    }
  }
  constructor(x, y, initialVelocity, birthFrame, color) {
    super(x, y, initialVelocity, birthFrame, color);
    this.radius = 0.4;
  }
  shouldRemain(gameState) {
    if (gameState.frame - this.birthFrame > gameState.fps) {
      return false;
    }
    return super.shouldRemain(gameState);
  }
}

class PlayerObject extends MovingObject {
  constructor(x, y, birthFrame) {
    const initialVelocity = new Point(0, 0);
    super(x, y, initialVelocity, birthFrame);
    this.radius = 1;
    // ACCEL:
    // this.maxSpeed = 2;
    // this.accel = 0.3;
    // this.maxAccel = 0.5;
    // NO ACCEL:
    this.maxSpeed = 1.0;
  }

  moveTowards(targetPoint) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (targetPoint) {
      if (this.distanceToPoint(targetPoint) < this.maxSpeed) {
        // If we are close enough to target point, just move directly onto it.
        // This ensures we don't oscillate around it, which looks stupid
        this.velocity = this.vectorTowards(targetPoint);
      }
      else {
        // ACCEL:
        // const curSpeed = this.velocity.distanceFromOrigin();
        // const accel = 0.2 + (curSpeed / 6);
        //
        // const newLoc = new Point(this.x + this.velocity.x, this.y + this.velocity.y);
        // const vector = newLoc.unitVectorTowards(targetPoint);
        // const newVel = new Point(this.velocity.x + vector.x * accel, this.velocity.y + vector.y * accel);
        // const newSpeed = newVel.distanceFromOrigin();
        // if (newSpeed > this.maxSpeed) {
        //   newVel.scaleBy(this.maxSpeed / newSpeed);
        // }
        // this.velocity = newVel;

        // NO ACCEL:
        this.velocity = this.unitVectorTowards(targetPoint);
        this.velocity.scaleBy(this.maxSpeed);
      }
    }
    else {
      // ACCEL:
      // this.velocity.scaleBy(Math.max(0, (this.velocity.distanceFromOrigin() - this.maxAccel) / this.velocity.distanceFromOrigin()));

      // NO ACCEL:
      this.velocity.x = 0;
      this.velocity.y = 0;
    }
  }
}
