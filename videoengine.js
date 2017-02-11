/* eslint-env browser */

window.VideoEngine = (function makeVideoEngine() {
  let canvas;
  let ctx;
  let scaleFactor;
  let offsetX;
  let offsetY;
  let viewboxWidth = 300;
  let viewboxHeight = 400;

  function updateSize() {
    const width = canvas.width;
    const height = canvas.height;
    // console.log(`width: ${width}; height: ${height}`);
    // console.log(`viewboxWidth: ${viewboxWidth}; viewboxHeight: ${viewboxHeight}`);

    scaleFactor = Math.min(Math.floor(width / viewboxWidth),
                           Math.floor(height / viewboxHeight));

    // console.log(`scaleFactor: ${scaleFactor}`);

    if (scaleFactor === 0) {
      console.log('Error: viewbox doesn\'t fit');
      scaleFactor = 1;
    }
    offsetX = Math.round((width - (viewboxWidth * scaleFactor)) / 2);
    offsetY = Math.round((height - (viewboxHeight * scaleFactor)) / 2);
    // console.log(`offsetX: ${offsetX}; offsetY: ${offsetY}`);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.translate(offsetX, offsetY);
    ctx.scale(scaleFactor, scaleFactor);
  }

  function setViewbox(width, height) {
    viewboxWidth = width;
    viewboxHeight = height;
    updateSize();
  }

  function clearViewbox() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewboxWidth, viewboxHeight);
  }

  function initWithCanvas(canvasElt) {
    canvas = canvasElt;
    ctx = canvas.getContext('2d');
    updateSize();
  }

  function drawPixel(x, y) {
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 1, 1);
  }

  function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  function update() {
  }

  // this does not take scaling into account. must be resolved
  function canvasPointToGameCoords(x, y) {
    const rect = canvas.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  }

  return {
    initWithCanvas,
    clearViewbox,
    setViewbox,
    updateSize,
    drawPixel,
    drawCircle,
    update,
    canvasPointToGameCoords,
  };
}());
