class SomeBasicStageController {
  rampedPhase(gameState, startTimeInSeconds, endTimeInSeconds, startProbability, endProbability, block) {
    const timeInSeconds = gameState.frame / gameState.fps;
    if (timeInSeconds >= startTimeInSeconds && timeInSeconds < endTimeInSeconds) {
      const normalizedTime = (timeInSeconds - startTimeInSeconds) / (endTimeInSeconds - startTimeInSeconds);
      const probability = (startProbability * (1 - normalizedTime)) + (endProbability * normalizedTime);
      if (Math.random() < probability) {
        block();
      }
    }
  }

  tick(gameState) {
    if (gameState.frame > 45 * gameState.fps) {
      gameState.status = 'finished';
      return;
    }
    this.rampedPhase(gameState, 0, 10, 0.1, 0.3, () => {
      const xPos = Math.round(Math.random() * gameState.fieldDimensions.width);

      const velocity = { x: Math.random() * 0.2 - 0.1, y: 1.2 + Math.random() };
      const newEnemy = new SimpleBullet(xPos, -10, velocity, gameState.frame, 'white');
      newEnemy.radius = Math.round(1 + Math.random() * 3);
      gameState.objects.push(newEnemy);
    });
    this.rampedPhase(gameState, 10, 40, 0.3, 0.1, () => {
      const xPos = Math.round(Math.random() * gameState.fieldDimensions.width);

      const velocity = { x: Math.random() * 0.2 - 0.1, y: 1.2 + Math.random() };
      const newEnemy = new SimpleBullet(xPos, -10, velocity, gameState.frame, 'white');
      newEnemy.radius = Math.round(1 + Math.random() * 3);
      gameState.objects.push(newEnemy);
    });
    this.rampedPhase(gameState, 20, 40, 0.0, 0.1, () => {
      const xPos = Math.round(Math.random() * gameState.fieldDimensions.width);
      const velocity = { x: 0, y: 0 };
      const newEnemy = new SimpleBullet(xPos, -10, velocity, gameState.frame, 'yellow');
      newEnemy.radius = 2;
      const newVelocity = newEnemy.unitVectorTowards(gameState.playerObject);
      newEnemy.velocity.x = newVelocity.x * 2;
      newEnemy.velocity.y = newVelocity.y * 2;
      gameState.objects.push(newEnemy);
    });
  }
}
