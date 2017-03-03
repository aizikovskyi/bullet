/* eslint-env browser */

class VideoEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.useCanvas = true;
    this.useBuffers = false;
    this.context = canvas.getContext('2d', { alpha: false });
    this.resizeObservers = [];
    this.playfieldWidth = 100;
    this.maxPlayfieldHeight = 180;
    this.minPlayfieldHeight = 130;

    // dummy values:
    this.offsetX = 0;  // offset values are in physical pixels, not playfield units
    this.offsetY = 0;
    this.scaleFactor = 1;
    this.playfieldHeight = 100;
    this.topBottomMargins = false;
    this.leftRightMargins = false;
  }

  updateSize() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    this.offsetX = 0;
    this.offsetY = 0;
    this.topBottomMargins = false;
    this.leftRightMargins = false;

    const widthScaleFactor = width / this.playfieldWidth;
    const naivePlayfieldHeight = height / widthScaleFactor;

    if (naivePlayfieldHeight > this.maxPlayfieldHeight) {
      this.topBottomMargins = true;
      this.playfieldHeight = this.maxPlayfieldHeight;
      this.offsetY = (height - (this.maxPlayfieldHeight * widthScaleFactor)) / 2;
      this.scaleFactor = widthScaleFactor;
    }
    else if (naivePlayfieldHeight < this.minPlayfieldHeight) {
      this.leftRightMargins = true;
      const heightScaleFactor = height / this.minPlayfieldHeight;
      this.playfieldHeight = this.minPlayfieldHeight;
      this.offsetX = (width - (this.playfieldWidth * heightScaleFactor)) / 2;
      this.scaleFactor = heightScaleFactor;
    }
    else {
      this.playfieldHeight = height / widthScaleFactor;
      this.scaleFactor = widthScaleFactor;
    }

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.translate(this.offsetX, this.offsetY);
    this.context.scale(this.scaleFactor, this.scaleFactor);
    this.clearCanvas();

    this.resizeObservers.forEach(callback => callback());
  }

  clearCanvas() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
    this.endFrame();
  }

  windowPointToGameCoords(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    const viewboxX = x - rect.left - this.offsetX;
    const viewboxY = y - rect.top - this.offsetY;
    let scaledViewboxX = viewboxX / this.scaleFactor;
    let scaledViewboxY = viewboxY / this.scaleFactor;

    if (scaledViewboxX < 0) scaledViewboxX = 0;
    if (scaledViewboxY < 0) scaledViewboxY = 0;
    if (scaledViewboxX > this.playfieldWidth) scaledViewboxX = this.playfieldWidth;
    if (scaledViewboxY > this.playfieldHeight) scaledViewboxY = this.playfieldHeight;

    return { x: scaledViewboxX, y: scaledViewboxY };
  }

  gamePointToWindowCoords(x, y) {
    const rect = this.canvas.getBoundingClientRect();
    x = x * this.scaleFactor + this.offsetX + rect.left;
    y = y * this.scaleFactor + this.offsetY + rect.top;
    return { x, y };
  }

  addResizeObserver(callback) {
    this.resizeObservers.push(callback);
  }

  removeResizeObserver(callback) {
    this.resizeObservers = this.resizeObservers.filter(obj => obj !== callback);
  }

  fontSizeForLabelHeight(height) {
    return `${height * 2}%`;
  }

  drawCircle(x, y, radius, color) {
    const helper = (context) => {
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      context.fill();
    };
    if (this.useCanvas) helper(this.context);
    if (this.useBuffers) helper(this.frameBufferContexts[this.currBufferIndex]);
  }

  showScore(text) {
    if (this.useCanvas) {
      this.context.textAlign = 'left';
      this.context.font = '3px Arial';
      this.context.fillStyle = 'yellow';
      this.context.fillText(text, 1, 4);
    }
  }

  showHighScore(text) {
    if (this.useCanvas) {
      this.context.textAlign = 'right';
      this.context.font = '3px Arial';
      this.context.fillStyle = 'yellow';
      this.context.fillText(text, 99, 4);
    }
  }

  startFrame() {
    if (this.useCanvas) {
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    }
    if (this.useBuffers) {
      this.frameBufferContexts[this.currBufferIndex].clearRect(0, 0, this.playfieldWidth, this.playfieldHeight);
    }
  }

  endFrame() {
    if (this.useCanvas) {
      if (this.leftRightMargins) {
        this.context.save();
        this.context.fillStyle = 'black';
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillRect(0, 0, this.offsetX, this.canvas.height);
        this.context.fillRect(this.canvas.width - this.offsetX, 0, this.offsetX, this.canvas.height);

        this.context.strokeStyle = '#777777';
        this.context.beginPath();
        this.context.moveTo(this.offsetX, this.offsetY);
        this.context.lineTo(this.offsetX, this.canvas.height - this.offsetY);
        this.context.moveTo(this.canvas.width - this.offsetX, this.offsetY);
        this.context.lineTo(this.canvas.width - this.offsetX, this.canvas.height - this.offsetY);
        this.context.stroke();

        this.context.restore();
      }

      if (this.topBottomMargins) {
        this.context.save();
        this.context.fillStyle = 'black';
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillRect(0, 0, this.canvas.width, this.offsetY);
        this.context.fillRect(0, this.canvas.height - this.offsetY, this.canvas.width, this.offsetY);

        this.context.strokeStyle = '#777777';
        this.context.beginPath();
        this.context.moveTo(this.offsetX, this.offsetY);
        this.context.lineTo(this.canvas.width - this.offsetX, this.offsetY);
        this.context.moveTo(this.offsetX, this.canvas.height - this.offsetY);
        this.context.lineTo(this.canvas.width - this.offsetX, this.canvas.height - this.offsetY);
        this.context.stroke();

        this.context.restore();
      }

      // Debug only: display the buffer on the main canvas
      if (this.compositeFrameBuffer) {
        this.context.save();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.scale(1 / this.frameBufferScaleFactor, 1 / this.frameBufferScaleFactor);
        this.context.drawImage(this.compositeFrameBuffer, 0, 10);
        this.context.restore();
      }
    }  // if (this.useCanvas)

    if (this.useBuffers) {
      // Generates a 'double' frame, where the current frame is superimposed over a ghost image of a past frame

      // Make sure that previous frame exists
      if (!this.frameBuffersFilled && this.currBufferIndex === (this.numBuffers - 1)) {
        this.frameBuffersFilled = true;
      }
      // Prepare the output buffer
      this.compositeFrameBufferContext.setTransform(1, 0, 0, 1, 0, 0);
      this.compositeFrameBufferContext.scale(this.frameBufferScaleFactor, this.frameBufferScaleFactor);
      this.compositeFrameBufferContext.fillStyle = 'green';
      this.compositeFrameBufferContext.fillRect(0, 0, this.playfieldWidth * 100, this.playfieldHeight * 100);


      // Place current frame in output buffer
      this.compositeFrameBufferContext.setTransform(1, 0, 0, 1, 0, 0);
      //this.compositeFrameBufferContext.scale(1 / this.frameBufferScaleFactor, 1 / this.frameBufferScaleFactor);
      this.compositeFrameBufferContext.drawImage(this.frameBuffers[this.currBufferIndex], 0, 0);

      // Place a semi-transparent version of past frame in output buffer, if it is available
      if (this.frameBuffersFilled) {
        this.compositeFrameBufferContext.globalAlpha = 0.4;
        const pastFrameBufferIndex = (this.currBufferIndex + 1) % this.numBuffers;
        this.compositeFrameBufferContext.drawImage(this.frameBuffers[pastFrameBufferIndex], 0, 0);
        this.compositeFrameBufferContext.globalAlpha = 1.0;
      }

      // At the very end, increment buffer counter
      this.currBufferIndex = (this.currBufferIndex + 1) % this.numBuffers;
    } // if (this.useBuffers)
  }


    // ************************************
    // FRAME BUFFER RELATED STUFF
    // ************************************

  initFrameBuffers() {
    this.numBuffers = 5;
    this.frameBufferScaleFactor = 0.5;
    const bufferWidth = this.frameBufferScaleFactor * this.playfieldWidth;
    const bufferHeight = this.frameBufferScaleFactor * this.minPlayfieldHeight;  // ensure AI doesn't go off-screen in some orientations
    this.frameBuffers = [];
    this.frameBufferContexts = [];
    this.frameBuffersFilled = false;
    for (let i = 0; i < this.numBuffers; i++) {
      const buffer = document.createElement('canvas');
      buffer.width = bufferWidth;
      buffer.height = bufferHeight;
      this.frameBuffers.push(buffer);
      const context = buffer.getContext('2d');
      context.scale(this.frameBufferScaleFactor, this.frameBufferScaleFactor);
      this.frameBufferContexts.push(context);
    }
    // compositeFrameBuffer is a superposition of two buffers to create a 'motion blur'
    // so it needs to be separate from the actual frame buffers
    this.compositeFrameBuffer = document.createElement('canvas');
    this.compositeFrameBuffer.width = bufferWidth;
    this.compositeFrameBuffer.height = bufferHeight;
    this.compositeFrameBufferContext = this.compositeFrameBuffer.getContext('2d');
    this.resetFrameBufferCounters();
  }

  resetFrameBufferCounters() {
    if (!this.frameBuffers) this.initFrameBuffers();
    this.currBufferIndex = 0;
    this.frameBuffersFilled = false;
  }
}
