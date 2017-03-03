class EndlessStageController {
  constructor(startingTime, random) {
    if (startingTime) {
      this.startingTime = startingTime;
    }
    else {
      this.startingTime = 0;
    }
    this.random = random;
  }

  tick(gameState) {
    const gameTime = 1 + this.startingTime + gameState.frame / gameState.fps;
    const downSpeed = 1 + (gameTime / 300);

    if (this.random() > Math.pow(0.7, gameTime / 60)) {
      const xPos = Math.round(this.random() * gameState.fieldDimensions.width);

      const velocity = new Point((this.random() * 0.2 - 0.1) * (1 + (gameTime / 180)), downSpeed + this.random());
      const newEnemy = new SimpleBullet(xPos, -10, velocity, gameState.frame, 'white');
      newEnemy.radius = Math.round(1 + this.random() * 3);
      gameState.objects.push(newEnemy);
    }
  }
}
