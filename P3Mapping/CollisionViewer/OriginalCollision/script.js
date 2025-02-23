/* filepath: /c:/Users/marzi/Documents/GitHub/FizzySD.github.io/P3Mapping/CollisionViewer/OriginalCollision/script.js */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("fileInput");
const imageInput = document.getElementById("imageInput");
let backgroundImage = new Image();
backgroundImage.src = "ref.png";

let points = [];

imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      backgroundImage.src = e.target.result;
      backgroundImage.onload = function () {
        drawPoints(points);
      };
    };
    reader.readAsDataURL(file);
  }
});

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      console.log("Dati letti:", data);

      const numPoints = data[0] | (data[1] << 8);
      console.log("Numero di punti:", numPoints);

      points = [];
      for (let i = 4; i < data.length; i += 4) {
        const x = data[i] | (data[i + 1] << 8);
        const y = data[i + 2] | (data[i + 3] << 8);
        points.push({ x, y });
      }
      console.log("Punti letti:", points);

      drawPoints(points);
    };
    reader.onerror = function (e) {
      console.error("Errore nella lettura del file:", e);
    };
    reader.readAsArrayBuffer(file);
  }
});

const fileUrl = "./nav_vec.dat";

loadFile();
function loadFile() {
  fetch(fileUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Errore nel caricamento del file");
      }
      return response.arrayBuffer();
    })
    .then((buffer) => {
      const data = new Uint8Array(buffer);
      console.log("Dati letti:", data);

      const numPoints = data[0] | (data[1] << 8);
      console.log("Numero di punti:", numPoints);

      points = [];
      for (let i = 4; i < data.length; i += 4) {
        const x = data[i] | (data[i + 1] << 8);
        const y = data[i + 2] | (data[i + 3] << 8);
        points.push({ x, y });
      }
      console.log("Punti letti:", points);

      drawPoints(points);
    })
    .catch((error) => console.error("Errore nel caricamento del file:", error));
}

function drawPoints(points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = new Image();
  img.src = backgroundImage.src;
  img.onload = function () {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 472;

    ctx.fillStyle = "red";
    ctx.font = "12px Arial";
    points.forEach((point, index) => {
      const scaledX = point.x * scaleX;
      const scaledY = point.y * scaleY;
      ctx.fillRect(scaledX, scaledY, 3, 3);
      ctx.fillText(`P${index}`, scaledX + 5, scaledY - 5);
    });
  };
  img.onerror = function (e) {
    console.error("Errore nel caricamento dell'immagine di sfondo:", e);
  };
}

function drawLine() {
  const point1Index = parseInt(document.getElementById("point1").value, 10);
  const point2Index = parseInt(document.getElementById("point2").value, 10);

  if (
    point1Index < 0 ||
    point1Index >= points.length ||
    point2Index < 0 ||
    point2Index >= points.length
  ) {
    alert("Indici dei punti non validi!");
    return;
  }

  const scaleX = canvas.width / 640;
  const scaleY = canvas.height / 472;

  const point1 = {
    x: points[point1Index].x * scaleX,
    y: points[point1Index].y * scaleY,
  };
  const point2 = {
    x: points[point2Index].x * scaleX,
    y: points[point2Index].y * scaleY,
  };

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
}

function clearLines() {
  drawPoints(points);
}

function showCoordinates() {
  const pointIndex = parseInt(document.getElementById("pointSelect").value, 10);

  if (pointIndex < 0 || pointIndex >= points.length) {
    alert("Indice del punto non valido!");
    return;
  }

  const point = points[pointIndex];
  alert(`Coordinate del punto ${pointIndex}: (${point.x}, ${point.y})`);
}