/* eslint-env browser */

class CanvasInputEngine {
  constructor(canvas, videoEngine) {
    this.videoEngine = videoEngine;
    this.canvas = canvas;
    this.callbacks = { moveTowards: null, stopMoving: null };
    this.moving = false;
    this.activeTouchId = null;

    canvas.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      this.moving = true;
      if (this.callbacks.moveTowards) {
        this.callbacks.moveTowards(videoEngine.canvasPointToGameCoords(evt.x, evt.y));
      }
    });

    canvas.addEventListener('mouseup', (evt) => {
      evt.preventDefault();
      this.moving = false;
      if (this.callbacks.stopMoving) {
        this.callbacks.stopMoving();
      }
    });

    canvas.addEventListener('mouseout', (evt) => {
      evt.preventDefault();
      this.moving = false;
      if (this.callbacks.stopMoving) {
        this.callbacks.stopMoving();
      }
    });

    canvas.addEventListener('mousemove', (evt) => {
      evt.preventDefault();
      if (this.moving && this.callbacks.moveTowards) {
        this.callbacks.moveTowards(videoEngine.canvasPointToGameCoords(evt.x, evt.y));
      }
    });

    canvas.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      this.moving = true;
      const touch = evt.changedTouches[0];
      this.activeTouch = touch.identifier;
      if (this.callbacks.moveTowards) {
        this.callbacks.moveTowards(videoEngine.canvasPointToGameCoords(touch.clientX, touch.clientY));
      }
    });

    canvas.addEventListener('touchend', (evt) => {
      evt.preventDefault();
      evt.changedTouches.forEach((touch) => {
        if (this.activeTouch === touch.identifier) {
          this.moving = false;
          this.activeTouch = null;
          if (this.callbacks.stopMoving) {
            this.callbacks.stopMoving();
          }
        }
      });
    });

    canvas.addEventListener('touchmove', (evt) => {
      evt.preventDefault();
      if (!this.moving) return;

      evt.changedTouches.forEach((touch) => {
        if (this.activeTouch === touch.identifier) {
          if (this.callbacks.moveTowards) {
            this.callbacks.moveTowards(videoEngine.canvasPointToGameCoords(touch.clientX, touch.clientY));
          }
        }
      });
    });
  }
}
