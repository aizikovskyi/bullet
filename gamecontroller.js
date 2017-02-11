class SomeBasicStageController {
  tick(gameState) {
    if (Math.random() < 0.1) {
      const xPos = Math.round(Math.random() * gameState.fieldDimensions.width);
      const velocity = { x: 0, y: 10 };
      const newEnemy = new SimpleBullet(xPos, 0, velocity, gameState.frame);
      gameState.objects.push(newEnemy);
    }
  }
}

class GameController {
  constructor(videoEngine, canvasInputEngine) {
    this.videoEngine = videoEngine;
    this.canvasInputEngine = canvasInputEngine;
    this.gameState = null;
    this.stageController = null;
    this.mainLoopInterval = null;
    this.canvasInputEngine.callbacks.moveTowards = (point) => {
      if (this.gameState) {
        this.gameState.playerInput.movementActive = true;
        this.gameState.playerInput.movementTarget = point;
      }
    };
    this.canvasInputEngine.callbacks.stopMoving = () => {
      if (this.gameState) {
        this.gameState.playerInput.movementActive = false;
      }
    };
  }

  static emptyGameState() {
    const gameState = {
      playerObject: new PlayerObject(150, 300, { x: 0, y: 0 }, 0),
      fieldDimensions: { width: 300, height: 400 },
      objects: [],
      frame: 0,
      lastFrame: -1,
      status: 'running',        // 'paused', 'finished'
      playerStatus: 'alive',    // 'dead', 'invulnerable'
      playerInput: {
        movementTarget: null,
        movementActive: false,
      },
      eventListeners: {},
    };
    return gameState;
  }

  static stageControllerForStage(stage) {
    return new SomeBasicStageController();
  }

  startStage(stage) {
    this.gameState = GameController.emptyGameState();
    this.stageController = GameController.stageControllerForStage(stage);
    this.videoEngine.clearViewbox();

    this.mainInterval = window.setInterval(() => this.mainLoop(), 1000 / 30);
  }

  mainLoop() {
    // for now, tick and draw are called together. In principle they can be called separately.
    if (this.gameState.status === 'finished') {
      window.clearInterval(this.mainLoopInterval);
    }
    this.tick();
    this.draw();
  }

  tick() {
    // This is the main game loop, except for the drawing code.
    // In pseudocode:
    // Ensure the game is running.
    // Move the player object according to input
    // Then, for each enemy object:
    //   Move the object, calculate new velocity
    //   Check for collision and adjust player status accordingly
    //   Check if the object can be removed
    // Create new objects if any
    // increment frame number
    // finally, end the game if needed


    // and again, with code:

    // Ensure the game is running.
    if (this.gameState.status !== 'running') return;

    // Move the player object according to input
    if (this.gameState.playerInput.movementActive) {
      this.gameState.playerObject.moveTowards(this.gameState.playerInput.movementTarget);
    }

    // Then, for each enemy object:
    this.gameState.objects.forEach((obj) => {
      // Move the object, calculate new velocity
      obj.moveAndUpdateVelocity(this.gameState);

      // Check for collision and adjust player status accordingly
      if (obj.deadly && this.gameState.playerStatus === 'alive' &&
          obj.intersectsPoint(this.gameState.playerObject)) {
        // BOOM!
        this.gameState.playerStatus = 'dead';
        this.gameState.lastFrame = this.gameState.frame + 30;
      }
    });

    // Check if objects can be removed
    this.gameState.objects.filter(obj => obj.shouldRemain(this.gameState));

    // Create new objects if any
    this.stageController.tick(this.gameState);

    // increment frame number
    this.gameState.frame += 1;

    // finally, end the game if needed
    if (this.gameState.frame === this.gameState.lastFrame) {
      this.gameState.status = 'finished';
    }
  }

  draw() {
    this.videoEngine.clearViewbox();
    this.gameState.objects.forEach((obj) => {
      this.videoEngine.drawCircle(Math.round(obj.x), Math.round(obj.y), obj.radius, 'white');
    });
    if (this.gameState.playerStatus !== 'dead') {
      this.videoEngine.drawCircle(Math.round(this.gameState.playerObject.x), Math.round(this.gameState.playerObject.y), 3, 'red');
    }
    this.videoEngine.update();
  }


}
