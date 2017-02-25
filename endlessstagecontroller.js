class EndlessStageController {
  constructor(startingTime) {
    if (startingTime) {
      this.startingTime = startingTime;
    }
    else {
      this.startingTime = 0;
    }
  }

  tick(gameState) {
    const gameTime = 1 + this.startingTime + gameState.frame / gameState.fps;
    const downSpeed = 1 + (gameTime / 300);

    if (Math.random() > Math.pow(0.7, gameTime / 60)) {
      const xPos = Math.round(Math.random() * gameState.fieldDimensions.width);

      const velocity = new Point((Math.random() * 0.2 - 0.1) * (1 + (gameTime / 180)), downSpeed + Math.random());
      const newEnemy = new SimpleBullet(xPos, -10, velocity, gameState.frame, 'white');
      newEnemy.radius = Math.round(1 + Math.random() * 3);
      gameState.objects.push(newEnemy);
    }
  }
}
