/* eslint-env browser */

class CanvasInputEngine {
  constructor(canvas, videoEngine) {
    this.videoEngine = videoEngine;
    this.canvas = canvas;
    this.callbacks = { moveTowards: null, stopMoving: null };
    this.moving = false;
    this.activeTouchStack = [];

    canvas.addEventListener('mousedown', (evt) => {
      evt.preventDefault();
      this.moving = true;
      if (this.callbacks.moveTowards) {
        this.callbacks.moveTowards(videoEngine.windowPointToGameCoords(evt.clientX, evt.clientY));
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
        this.callbacks.moveTowards(videoEngine.windowPointToGameCoords(evt.clientX, evt.clientY));
      }
    });

    canvas.addEventListener('touchstart', (evt) => {
      evt.preventDefault();
      this.moving = true;
      const touch = evt.changedTouches[0];

      this.activeTouchStack.push({ id: touch.identifier, x: touch.clientX, y: touch.clientY });
      if (this.callbacks.moveTowards) {
        this.callbacks.moveTowards(videoEngine.windowPointToGameCoords(touch.clientX, touch.clientY));
      }
    });

    canvas.addEventListener('touchend', (evt) => {
      evt.preventDefault();
      for (let i = 0; i < evt.changedTouches.length; i++) {
        const touch = evt.changedTouches[i];
        if (this.activeTouchStack.length > 0) {
          if (this.activeTouchStack[this.activeTouchStack.length - 1].id === touch.identifier) {
            this.activeTouchStack.pop();
            if (this.activeTouchStack.length > 0) {
              if (this.callbacks.moveTowards) {
                const newLastTouch = this.activeTouchStack[this.activeTouchStack.length - 1];
                this.callbacks.moveTowards(videoEngine.windowPointToGameCoords(newLastTouch.x, newLastTouch.y));
              }
            } else {
              this.moving = false;
              if (this.callbacks.stopMoving) {
                this.callbacks.stopMoving();
              }
            }
          } else {
            this.activeTouchStack = this.activeTouchStack.filter(storedTouch => storedTouch.id !== touch.identifier);
          }
        }
      }
    });

    canvas.addEventListener('touchmove', (evt) => {
      evt.preventDefault();
      if (!this.moving) return;
      let lastTouchChanged = false;
      for (let i = 0; i < evt.changedTouches.length; i++) {
        const touch = evt.changedTouches[i];
        for (let j = 0; j < this.activeTouchStack.length; j++) {
          const storedTouch = this.activeTouchStack[j];
          if (touch.identifier === storedTouch.id) {
            storedTouch.x = touch.clientX;
            storedTouch.y = touch.clientY;
            if (j === this.activeTouchStack.length - 1) {
              lastTouchChanged = true;
            }
          }
        }
      }
      if (lastTouchChanged) {
        if (this.callbacks.moveTowards) {
          const storedTouch = this.activeTouchStack[this.activeTouchStack.length - 1];
          this.callbacks.moveTowards(videoEngine.windowPointToGameCoords(storedTouch.x, storedTouch.y));
        }
      }
    });
  }
}
