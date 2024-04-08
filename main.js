const canvas = document.getElementById("canvas");
const ctx2 = canvas.getContext("2d");
const ctx3 = canvas.getContext("3d");

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
var scaleX = 50;
var scaleY = 50;

var xAxis = Math.round(canvasWidth / scaleX / 2) * scaleX;
var yAxis = Math.round(canvasHeight / scaleY / 2) * scaleY;

var mouseInCanvas = false;

drawGrid();
drawDiagram("x^2+3");
function drawGrid() {
  ctx2.clearRect(0, 0, canvasWidth, canvasHeight);
  // xAxis = Math.round(canvasWidth / scaleX / 2) * scaleX;
  // yAxis = Math.round(canvasHeight / scaleY / 2) * scaleY;

  ctx2.font = `${scaleX / 3}px Arial`;
  ctx2.textalign = "left";
  ctx2.textbaseline = "top";

  ctx2.strokeStyle = "rgba(97, 98, 99, 0.63)";
  ctx2.fillStyle = "black";
  for (let i = 0; i < canvasWidth; i += scaleX) {
    line(i, 0, i, canvasHeight);
    ctx2.fillText((i - xAxis) / scaleX, i, yAxis);
  }
  for (let i = 0; i < canvasHeight; i += scaleY) {
    line(0, i, canvasWidth, i);
    ctx2.fillText((yAxis - i) / scaleY, xAxis, i);
  }

  ctx2.strokeStyle = "black";
  line(0, yAxis, canvasWidth, yAxis);
  line(xAxis, 0, xAxis, canvasHeight);
}

function line(from_x, from_y, to_x, to_y) {
  ctx2.beginPath();
  ctx2.moveTo(from_x, from_y);
  ctx2.lineTo(to_x, to_y);
  ctx2.closePath();
  ctx2.stroke();
}

canvas.addEventListener("mouseenter", () => {
  mouseInCanvas = true;
});
canvas.addEventListener("mouseleave", () => {
  mouseInCanvas = false;
});

/**
 * @param f string
 */
function drawDiagram(f) {
  for (let i = 0; i <= canvasWidth; i += 5) {
    const x = (i - xAxis) / scaleX;

    let fTemp = f.slice(0);
    let temp = fTemp
      .replace(/x/g, `${x}`)
      .replace("^", "**")
      .replace(/-([.0-9]+)\*\*/g, "(-$1)**")
      .replace(/-x\*\*/g, "(-x)**");

    // console.log(x, temp);
    const y = eval(temp);

    ctx2.fillStyle = "red";
    ctx2.fillRect(x * scaleX + xAxis - 2, yAxis - scaleY * y - 2, 4, 4);
    if (i + 5 <= canvasWidth) {
      let xTemp = (i + 5 - xAxis) / scaleX;
      let yTemp = Math.pow(xTemp, 2) + 3;
      ctx2.strokeStyle = "blue";
      line(
        x * scaleX + xAxis,
        yAxis - scaleY * y,
        xTemp * scaleX + xAxis,
        yAxis - scaleY * yTemp
      );
    }
  }
}

canvas.addEventListener("mousemove", (e) => {
  if (mouseInCanvas) {
    if (e.buttons & 1) {
      console.log(e);
      xAxis += e.movementX;
      yAxis += e.movementY;
      drawGrid();
      drawDiagram("x^2+3");
    }
  }
});
canvas.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    if (scaleX <= 10) {
      if (scaleX != 1) {
        scaleX -= 1;
        scaleY -= 1;
      }
    } else {
      scaleX -= 5;
      scaleY -= 5;
    }
  } else if (e.deltaY < 0) {
    if (scaleX <= 5) {
      scaleX += 1;
      scaleY += 1;
    } else {
      scaleX += 5;
      scaleY += 5;
    }
  }
  drawGrid();
  drawDiagram("x^2+3");
  console.log(scaleX, scaleY);
});
