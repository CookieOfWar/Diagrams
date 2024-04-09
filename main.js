const canvas = document.getElementById("canvas");
const ctx2 = canvas.getContext("2d");
const ctx3 = canvas.getContext("3d");
const inputField = document.getElementById("inpFunction");
var F = "x^2+3";

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
var scaleX = 50;
var scaleY = 50;

var xAxis = Math.round(canvasWidth / scaleX / 2) * scaleX;
var yAxis = Math.round(canvasHeight / scaleY / 2) * scaleY;

var mouseInCanvas = false;

const XGridOnly = false;

getEllips("4x^2-2xy+9y^2+6x+8y+1");

drawGrid();
drawDiagram("x^2+3");
function drawGrid() {
  ctx2.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx2.font = `${scaleX / 3}px Arial`;
  ctx2.textalign = "left";
  ctx2.textbaseline = "top";

  ctx2.strokeStyle = "rgba(97, 98, 99, 0.63)";
  ctx2.fillStyle = "black";

  for (let i = 0; i < canvasWidth; i += 1) {
    if ((i - xAxis) % scaleX == 0) {
      line(i, 0, i, canvasHeight);
      ctx2.fillText((i - xAxis) / scaleX, i, yAxis);
    }
  }
  for (let i = 0; i < canvasHeight; i += 1) {
    if ((i - yAxis) % scaleY == 0) {
      line(0, i, canvasWidth, i);
      ctx2.fillText((yAxis - i) / scaleY, xAxis, i);
    }
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
  if (/([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/.test(f)) {
    getEllips(f);
  }
  for (let i = 0; i <= canvasWidth; i += 1) {
    if (
      (XGridOnly
        ? (i - xAxis) % scaleX
        : i % (scaleX / 10) == 0 || XGridOnly
        ? (i - xAxis) % scaleX
        : i % (scaleX / 10) == NaN) &&
      i != 0
    ) {
      const x = (i - xAxis) / scaleX;

      let fTemp = f.slice(0);
      let temp = fTemp
        .replace(/(\d+)x/, "$1*x")
        .replace(/x/g, `${x}`)
        .replace("^", "**")
        .replace(/-([.0-9]+)\*\*/g, "(-$1)**")
        .replace(/-x\*\*/g, "(-x)**");

      const y = eval(temp);
      //console.log(y);
      if (y != Infinity && y != -Infinity) {
        ctx2.fillStyle = "red";
        ctx2.fillRect(x * scaleX + xAxis - 2, yAxis - scaleY * y - 2, 4, 4);
        if (i + (XGridOnly ? scaleX : scaleX / 10) <= canvasWidth) {
          let xTemp = (i + (XGridOnly ? scaleX : scaleX / 10) - xAxis) / scaleX;
          let yTemp = eval(temp.replace(`${x}`, `${xTemp}`));
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
  }
}

canvas.addEventListener("mousemove", (e) => {
  if (mouseInCanvas) {
    if (e.buttons & 1) {
      //console.log(e);
      xAxis += e.movementX;
      yAxis += e.movementY;
      drawGrid();
      drawDiagram(F);
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
    if (scaleX < 10) {
      scaleX += 1;
      scaleY += 1;
    } else {
      scaleX += 5;
      scaleY += 5;
    }
  }
  drawGrid();
  drawDiagram(F);
  console.log(scaleX, scaleY);
});

inputField.addEventListener("keyup", (e) => {
  //if (e.key == "Enter") {
  console.log(inputField.value);
  drawGrid();
  F = inputField.value;
  drawDiagram(inputField.value);
  //}
});

function getEllips(f) {
  const A = [
    [0, 0],
    [0, 0],
  ];
  A[0][0] = parseInt(f.match(
    /([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/
  )[1]);
  A[0][1] = A[1][0] = parseInt(f.match(
    /([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/
  )[2])/2;
  A[1][1] = parseInt(f.match(
    /([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/
  )[3]);
	console.log(A);

  if (Determinant(A) != 0) {
    let S = A[0][0] + A[1][1];
    let delta = Determinant(A);
		let nd = [[A[0][0], A[1][1], parseInt(f.match(/([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/)[4])/2], []]
  }
}

function Determinant(A) {
  var n = A.length,
    subA = [],
    detA = 0;

  if (n == 1) return A[0][0];

  if (n == 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];

  if (n == 3) {
    return (
      A[0][0] * A[1][1] * A[2][2] +
      A[0][1] * A[1][2] * A[2][0] +
      A[0][2] * A[1][0] * A[2][1] -
      (A[0][0] * A[1][2] * A[2][1] +
        A[0][1] * A[1][0] * A[2][2] +
        A[0][2] * A[1][1] * A[2][0])
    );
  }

  for (var i = 0; i < n; i++) {
    for (var h = 0; h < n - 1; h++) subA[h] = [];

    for (var a = 1; a < n; a++) {
      for (var b = 0; b < n; b++) {
        if (b < i) subA[a - 1][b] = A[a][b];
        else if (b > i) subA[a - 1][b - 1] = A[a][b];
      }
    }

    var sign = i % 2 == 0 ? 1 : -1;

    detA += sign * A[0][i] * Determinant(subA);
  }

  return detA;
}
