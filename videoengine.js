class VideoEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.untransformedContext = canvas.getContext('2d');
    this.playfieldWidth = 100;
    this.maxPlayfieldHeight = 180;
    this.minPlayfieldHeight = 130;

    // dummy values:
    this.offsetX = 0;  // offset values are in canvas pixels!
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
    } else
    if (naivePlayfieldHeight < this.minPlayfieldHeight) {
      this.leftRightMargins = true;
      const heightScaleFactor = height / this.minPlayfieldHeight;
      this.playfieldHeight = this.minPlayfieldHeight;
      this.offsetX = (width - (this.playfieldWidth * heightScaleFactor)) / 2;
      this.scaleFactor = heightScaleFactor;
    } else {
      this.playfieldHeight = height / widthScaleFactor;
      this.scaleFactor = widthScaleFactor;
    }

    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, width, height);
    this.context.translate(this.offsetX, this.offsetY);
    this.context.scale(this.scaleFactor, this.scaleFactor);
  }

  clearCanvas() {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();
  }

  canvasPointToGameCoords(x, y) {
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
  drawCircle(x, y, radius, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.fill();
  }

  startFrame() {
    this.context.clearRect(0, 0, this.playfieldWidth, this.playfieldHeight);
  }

  endFrame() {
    if (this.leftRightMargins) {
      this.context.save();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.offsetX, this.canvas.height);
      this.context.clearRect(this.canvas.width - this.offsetX, 0, this.offsetX, this.canvas.height);

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
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.offsetY);
      this.context.clearRect(0, this.canvas.height - this.offsetY, this.canvas.width, this.offsetY);

      this.context.strokeStyle = '#777777';
      this.context.beginPath();
      this.context.moveTo(this.offsetX, this.offsetY);
      this.context.lineTo(this.canvas.width - this.offsetX, this.offsetY);
      this.context.moveTo(this.offsetX, this.canvas.height - this.offsetY);
      this.context.lineTo(this.canvas.width - this.offsetX, this.canvas.height - this.offsetY);
      this.context.stroke();
      
      this.context.restore();

    }
  }
}
