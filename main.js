const canvas = document.getElementById("canvas");
const ctx2 = canvas.getContext("2d");
const ctx3 = canvas.getContext("3d");
const inputField = document.getElementById("inpFunction");
var F = "13x^2+18xy+37y^2-26x-18y-27";

const canvasWidth = canvas.clientWidth;
const canvasHeight = canvas.clientHeight;
var scaleX = 50;
var scaleY = 50;

var xAxis = Math.round(canvasWidth / scaleX / 2) * scaleX;
var yAxis = Math.round(canvasHeight / scaleY / 2) * scaleY;

var mouseInCanvas = false;

var snapButton = document.getElementById("Snapping");
var snapParam = document.getElementById("snapParam");
var XGridOnly = false;

const exampleButton = document.getElementById("Example");
const STEP = 5;

// getEllips("13x^2+18xy+37y^2-26x-18y-27");

drawGrid();
// drawDiagram("x^2+3");
drawDiagram("13x^2+18xy+37y^2-26x-18y-27");
inputField.value = "13x^2+18xy+37y^2-26x-18y-27";

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

exampleButton.addEventListener("click", () => {
	F = "13x^2+18xy+37y^2-26x-18y-27";
	inputField.value = "13x^2+18xy+37y^2-26x-18y-27";
	drawGrid();
	drawDiagram(F);
});

snapButton.addEventListener("click", () => {
  XGridOnly = !XGridOnly;
  snapParam.textContent = XGridOnly;
  if (XGridOnly) {
    snapParam.style.color = "rgb(83, 232, 60)";
  } else {
    snapParam.style.color = "rgb(232, 60, 60)";
  }
  drawGrid();
  drawDiagram(F);
});

/**
 * @param f string
 */
function drawDiagram(f) {
  if (
    /([+-]?\d+)x\^2([+-]\d+)xy([+-]\d+)y\^2([+-]\d+)x([+-]\d+)y([+-]\d+)/.test(
      f
    )
  ) {
    F = f;
    let ellipsParams = getEllips(f);
    drawEllipse(
      ellipsParams[0],
      ellipsParams[1],
      ellipsParams[2],
      ellipsParams[3],
      ellipsParams[4],
      ellipsParams[5]
    );
    return;
  }
  for (
    let i = xAxis - canvasWidth;
    i <= canvasWidth;
    i += XGridOnly ? scaleX : (STEP * scaleX) / 20
  ) {
    if (
      true ||
      ((XGridOnly ? (i - xAxis) % scaleX == 0 : i % (scaleX / STEP) == 0) &&
        i != 0)
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

      if (y != Infinity && y != -Infinity) {
        ctx2.fillStyle = "red";
        ctx2.fillRect(x * scaleX + xAxis - 2, yAxis - scaleY * y - 2, 4, 4);
        if (i + (XGridOnly ? scaleX : scaleX / STEP) <= canvasWidth) {
          let xTemp =
            (i + (XGridOnly ? scaleX : (scaleX * STEP) / 20) - xAxis) / scaleX;
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
});

inputField.addEventListener("keyup", (e) => {
  let blackList = ["Backspace", "Shift", "+", "-", "Control", "^"];
  if (!blackList.includes(e.key)) {
    console.log(e.key);
    drawGrid();
    F = inputField.value;
    if (inputField.value == "") {
      F = "13x^2+18xy+37y^2-26x-18y-27";
      drawDiagram(F);
    } else {
      drawDiagram(inputField.value);
    }
  }
});

function getEllips(f) {
  let baseA = parseInt(
    f.match(
      /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
    )[1]
  );
  let baseB =
    parseInt(
      f.match(
        /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
      )[2]
    ) / 2;
  let baseC = parseInt(
    f.match(
      /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
    )[3]
  );
  let baseD =
    parseInt(
      f.match(
        /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
      )[4]
    ) / 2;
  let baseE =
    parseInt(
      f.match(
        /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
      )[5]
    ) / 2;
  let baseF = parseInt(
    f.match(
      /([+-]?[.0-9]+)x\^2([+-][.0-9]+)xy([+-][.0-9]+)y\^2([+-][.0-9]+)x([+-][.0-9]+)y([+-][.0-9]+)/
    )[6]
  );

  const A = [
    [0, 0],
    [0, 0],
  ];
  A[0][0] = baseA;
  A[0][1] = A[1][0] = baseB;
  A[1][1] = baseC;

  if (Determinant(A) != 0) {
    // Finding S, delata and nD

    let S = A[0][0] + A[1][1];
    let delta = Determinant(A);

    let nA = [
      [baseA, baseB, baseD],
      [baseB, baseC, baseE],
      [baseD, baseE, baseF],
    ];
    let nD = Determinant(nA);

    // Finding a1, c1 and f1

    let f1 = nD / delta;
    let temp = Math.sqrt(S ** 2 - 4 * delta);
    let a1 = (S - temp) / 2;
    let c1 = S - a1;

    let equation = `${a1}x^2 + ${c1}y^2 + ${f1}`;
    equation = equation
      .replaceAll(" ", "")
      .replaceAll("+-", "-")
      .replaceAll("-+", "-");

    equation = equation.replace(
      /([+-]?[.0-9]+)x\^2([+-]+[.0-9]+)y\^2([+-]+[.0-9]+)/,
      (parseInt(
        equation.match(/([+-]?[.0-9]+)x\^2([+-]+[.0-9]+)y\^2([+-]+[.0-9]+)/)[1]
      ) *
        -1) /
        parseInt(
          equation.match(
            /([+-]?[.0-9]+)x\^2([+-]+[.0-9]+)y\^2([+-]+[.0-9]+)/
          )[3]
        ) +
        "x^2" +
        "+" +
        (parseInt(
          equation.match(
            /([+-]?[.0-9]+)x\^2([+-]+[.0-9]+)y\^2([+-]+[.0-9]+)/
          )[2]
        ) *
          -1) /
          parseInt(
            equation.match(
              /([+-]?[.0-9]+)x\^2([+-]+[.0-9]+)y\^2([+-]+[.0-9]+)/
            )[3]
          ) +
        "y^2"
    );
    equation = equation
      .replaceAll(" ", "")
      .replaceAll("+-", "-")
      .replaceAll("-+", "-");

    // Finding a and b (semiaxis)

    temp = equation.match(/([+-]?[.0-9]+)x\^2([+-][.0-9]+)y\^2/)[1];
    let a, b;

    if (temp[0] != "-") {
      a = Math.sqrt(temp);
    } else {
      a = Math.sqrt(temp.slice(1));
    }

    temp = equation.match(/([+-]?[.0-9]+)x\^2([+-][.0-9]+)y\^2/)[2];
    if (temp[0] != "-") {
      b = Math.sqrt(temp);
    } else {
      b = Math.sqrt(temp.slice(1));
    }

    a = 1 / a;
    b = 1 / b;

    // Finding x0 and y0
    let y0 = parseInt(
      ((baseD * baseB) / baseA - baseE) / (baseB ** 2 / baseA - baseC)
    );
    let x0 = parseInt(
      ((baseB * baseE) / baseC - baseD) / (baseA - baseB ** 2 / baseC)
    );

    // Finding rotation angle of the new coordinate system

    let newAngle = Math.atan((2 * baseB) / (baseA - baseC)) / 2;

    // Returning sizes (a, b), start point (x0, y0) and angle of the new coordinate system (newAngle)
    return [a, b, x0, y0, newAngle, equation];
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

function drawEllipse(a, b, x0, y0, angle, f) {
  for (
    let i = 0 + xAxis - a * scaleX;
    i <= 0 + xAxis + a * scaleX;
    i += XGridOnly ? scaleX : STEP
  ) {
    if (
      true ||
      ((XGridOnly ? (i - xAxis) % scaleX == 0 : i % (scaleX / STEP) == 0) &&
        i != 0)
    ) {
      let groups = f.match(/([+-]?)([.0-9]+)x\^2([+-]+[.0-9]+)y\^2/);

      let fTemp = `Math.sqrt(Math.abs((1-x**2*${groups[1]}${groups[2]})/(${groups[3]})))`;
      let x = (i - xAxis) / scaleX;
      let temp = fTemp
        .replace(/(\d+)x/, "$1*x")
        .replace("^", "**")
        .replace(/x/g, `${x}`)
        .replace(/--([.0-9]+)\*\*/g, "-(-$1)**")
        .replace(/-([.0-9]+\*\*2)/, "-($1)");

      let y = eval(temp);

      x = x * Math.cos(angle) + y * -Math.sin(angle);
      y = x * Math.sin(angle) + y * Math.cos(angle);

      ctx2.fillStyle = "red";
      ctx2.fillRect(
        (x + x0) * scaleX + xAxis - 2,
        yAxis - scaleY * (y + y0) - 2,
        4,
        4
      );

      x = (i - xAxis) / scaleX;
      y = -eval(temp);
      x = x * Math.cos(angle) + y * -Math.sin(angle);
      y = x * Math.sin(angle) + y * Math.cos(angle);
      ctx2.fillRect(
        (x + x0) * scaleX + xAxis - 2,
        yAxis - scaleY * (y + y0) - 2,
        4,
        4
      );

      if (i + (XGridOnly ? scaleX : scaleX / STEP) <= x0 + xAxis + a * scaleX) {
        x = (i - xAxis) / scaleX;
        y = eval(temp);
        x = x * Math.cos(angle) + y * -Math.sin(angle);
        y = x * Math.sin(angle) + y * Math.cos(angle);

        let xTemp = (i + (XGridOnly ? scaleX : scaleX / STEP) - xAxis) / scaleX;
        temp = fTemp
          .replace(/(\d+)x/, "$1*x")
          .replace("^", "**")
          .replace(/x/g, `${xTemp}`)
          .replace(/--([.0-9]+)\*\*/g, "-(-$1)**")
          .replace(/-([.0-9]+\*\*2)/, "-($1)");

        let yTemp = eval(temp);

        xTemp = xTemp * Math.cos(angle) + yTemp * -Math.sin(angle);
        yTemp = xTemp * Math.sin(angle) + yTemp * Math.cos(angle);

        ctx2.strokeStyle = "blue";
        line(
          (x + x0) * scaleX + xAxis,
          yAxis - scaleY * (y + y0),
          (xTemp + x0) * scaleX + xAxis,
          yAxis - scaleY * (yTemp + y0)
        );

        x = (i - xAxis) / scaleX;
        temp = fTemp
          .replace(/(\d+)x/, "$1*x")
          .replace("^", "**")
          .replace(/x/g, `${x}`)
          .replace(/--([.0-9]+)\*\*/g, "-(-$1)**")
          .replace(/-([.0-9]+\*\*2)/, "-($1)");

        y = -eval(temp);
        x = x * Math.cos(angle) + y * -Math.sin(angle);
        y = x * Math.sin(angle) + y * Math.cos(angle);
        xTemp = (i + (XGridOnly ? scaleX : scaleX / STEP) - xAxis) / scaleX;
        temp = fTemp
          .replace(/(\d+)x/, "$1*x")
          .replace("^", "**")
          .replace(/x/g, `${xTemp}`)
          .replace(/--([.0-9]+)\*\*/g, "-(-$1)**")
          .replace(/-([.0-9]+\*\*2)/, "-($1)");

        yTemp = -eval(temp);
        xTemp = xTemp * Math.cos(angle) + yTemp * -Math.sin(angle);
        yTemp = xTemp * Math.sin(angle) + yTemp * Math.cos(angle);
        line(
          (x + x0) * scaleX + xAxis,
          yAxis - scaleY * (y + y0),
          (xTemp + x0) * scaleX + xAxis,
          yAxis - scaleY * (yTemp + y0)
        );
      }
    }
  }
}
