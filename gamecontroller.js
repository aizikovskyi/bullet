class GameController {
  constructor(videoEngine, canvasInputEngine, menuEngine) {
    this.videoEngine = videoEngine;
    this.canvasInputEngine = canvasInputEngine;
    this.menuEngine = menuEngine;
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
      playerObject: new PlayerObject(50, 120, { x: 0, y: 0 }, 0),
      fieldDimensions: { width: 100, height: 180 },
      objects: [],
      frame: 0,
      fps: 30,
      lastFrame: -1,
      lastFrameDate: Date.now(),
      status: 'running',        // 'running', 'paused', 'finished'
      playerStatus: 'invulnerable',    // 'alive', 'dead', 'invulnerable'
      playerInput: {
        movementTarget: null,
        movementActive: false,
      },
      eventListeners: {},
    };
    return gameState;
  }

  static stageControllerForStage(stage) {
    return new EndlessStageController();
  }

  startGame() {
    const fullscreenItem = MenuEngine.menuItem('TOGGLE FULLSCREEN', false, () => {
      toggleFullScreen();
    });
    const startGameItem = MenuEngine.menuItem('START GAME', true, () => {
      this.startStage(1);
    });
    this.menuEngine.showMenu([fullscreenItem, startGameItem]);
  }

  startStage(stage) {
    this.gameState = GameController.emptyGameState();
    this.stageController = GameController.stageControllerForStage(stage);
    this.videoEngine.clearCanvas();

    this.mainLoopInterval = window.setInterval(() => this.mainLoop(), 1000 / this.gameState.fps);
    this.drawLoop();
    this.menuEngine.showMessage(`STAGE ${stage} BEGIN`, 3);
  }

  mainLoop() {
    // for now, tick and draw are called together. In principle they can be called separately.
    if (this.gameState.status === 'finished') {
      window.clearInterval(this.mainLoopInterval);
      if (this.gameState.playerStatus === 'dead') {
        this.startGame();
      } else {
        this.startStage(1);
      }
    }
    this.tick();
  }

  drawLoop() {
    if (this.gameState.status === 'finished') return;

    this.draw();
    window.requestAnimationFrame(() => this.drawLoop());
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
    } else {
      this.gameState.playerObject.moveTowards(null);
    }

    // Then, for each enemy object:
    this.gameState.objects.forEach((obj) => {
      // Move the object, calculate new velocity
      obj.moveAndUpdateVelocity(this.gameState);

      // Check for collision and adjust player status accordingly
      if (obj.deadly && this.gameState.playerStatus === 'alive' &&
          obj.intersectsPoint(this.gameState.playerObject)) {
        this.gameState.playerStatus = 'dead';
        this.gameState.lastFrame = this.gameState.frame + 30;
      }
    });

    // Check if objects can be removed
    this.gameState.objects = this.gameState.objects.filter(obj => obj.shouldRemain(this.gameState));

    // Create new objects if any
    this.stageController.tick(this.gameState);

    // increment frame number
    this.gameState.frame += 1;
    this.gameState.lastFrameDate = Date.now();

    // finally, end the game if needed
    if (this.gameState.frame === this.gameState.lastFrame) {
      this.gameState.status = 'finished';
    }
  }

  draw() {
    const timeDelta = Date.now() - this.gameState.lastFrameDate;
    const frameDelta = timeDelta * this.gameState.fps / 1000;
    if (frameDelta > 2) {
      // the game was paused? user switched to a different app?
      // either way, we can't draw from such stale data
      return;
    }
    this.videoEngine.startFrame();
    this.gameState.objects.forEach((obj) => {
      const adjustedX = obj.x + (obj.velocity.x * frameDelta);
      const adjustedY = obj.y + (obj.velocity.y * frameDelta);
      this.videoEngine.drawCircle(adjustedX, adjustedY, obj.radius, obj.color);
    });
    if (this.gameState.playerStatus !== 'dead') {
      const adjustedPlayerX = this.gameState.playerObject.x + (this.gameState.playerObject.velocity.x * frameDelta);
      const adjustedPlayerY = this.gameState.playerObject.y + (this.gameState.playerObject.velocity.y * frameDelta);
      this.videoEngine.drawCircle(adjustedPlayerX, adjustedPlayerY, this.gameState.playerObject.radius, 'red');
    }
    this.videoEngine.endFrame();
  }
}
