// Keeping track of frame numbers:
// In GameController, gameState starts with frame 0, and frame number gets incremented at the very end of tick().
// Meanwhile, draw() draws the state as it exists AFTER a certain frame, using object velocities to predict motion.

// The agent needs to make a decision on frame 0 (affecting its position on frame 1), which it can't do unless the
// frame has already been drawn.

// The simple solution to all this is to do nothing on frame 0, and start acting on frame 1 using frame-old data.
// We still need to ensure that draw() gets called right after tick(), or simply that frameDelta is turned off in draw().
// The latter would require duplicate calls to draw() if we are running the AI while also displaying it on screen
// (since on-screen draw() must use deltas to look smooth)

/*
Game loop timeline with player movement, async version:

Frame is N
tick(): player position is updated, using a velocity that arrived asynchronously.
tick(): object positions are updated. Object velocities for NEXT frame (N+1) are calculated.
tick(): Frame is incremented to N+1
[time passes]

Game loop timeline with AI movement, synchronous version:

Frame is N
draw(): current frame (N) is drawn
tick(): player velocity is updated using the frame we just drew
tick(): object positions are updated
tick(): Frame is incremented to N+1
[time passes]

*/

class Agent {
  constructor() {
    this.maxSpeed = 1.0;
  }
  movementTargetForState(state) {
    // move in a random direction
    const direction = Math.random() * Math.PI * 2;
    return new Point(this.maxSpeed * Math.cos(direction) + state.playerObject.x, this.maxSpeed * Math.sin(direction) + state.playerObject.y);
  }
}
