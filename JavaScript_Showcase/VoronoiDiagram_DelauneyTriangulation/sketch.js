// Coding Train / Daniel Shiffman
// Weighted Voronoi Stippling
// https://thecodingtrain.com/challenges/181-image-stippling

// All of the points
let points = [];
let originalPoints = [];
// Global variables for geometry
let delaunay, voronoi;
// Image
let emperorKunDis;

// Variables to store mouse position
let mousePos;

function preload() {
  emperorKunDis = loadImage(`assets/meOnRealIronThrone.jpg`);
}

function setup() {
  createCanvas(emperorKunDis.width, emperorKunDis.height);
  for (let i = 0; i < 5000; i++) {
    let x = random(width);
    let y = random(height);
    let col = emperorKunDis.get(x, y);
    if (random(100) > brightness(col)) {
      let point = createVector(x, y);
      points.push(point);
      originalPoints.push(point.copy()); // Store original position
    } else {
      i--;
    }
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
  //noLoop();
}

function draw() {
  background(0);
  mousePos = createVector(mouseX, mouseY); // Update mouse position

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  let centroids = new Array(cells.length);
  let weights = new Array(cells.length).fill(0);
  let counts = new Array(cells.length).fill(0);
  let avgWeights = new Array(cells.length).fill(0);
  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }

  emperorKunDis.loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let index = (i + j * width) * 4;
      let r = emperorKunDis.pixels[index + 0];
      let g = emperorKunDis.pixels[index + 1];
      let b = emperorKunDis.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1 - bright / 255;
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      counts[delaunayIndex]++;
    }
  }

  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    } else {
      centroids[i] = points[i].copy();
    }
  }

  for (let i = 0; i < points.length; i++) {
    points[i].lerp(centroids[i], 1);
  }

  for (let i = 0; i < points.length; i++) {
    let v = points[i];
    if (mousePos.dist(v) < 100) {
      // Apply repulsion force if within 100 pixels
      let direction = p5.Vector.sub(v, mousePos).normalize();
      let distance = mousePos.dist(v);
      let repulsionStrength = map(distance, 0, 100, 10, 0); // Stronger repulsion when closer
      v.add(direction.mult(repulsionStrength));
    } else {
      // Gradually return points to their original positions
      v.lerp(originalPoints[i], 0.02); // Adjust the factor to control speed of return
    }

    // Get the color from the image and convert it to grayscale
    let col = emperorKunDis.get(v.x, v.y);
    let gray = (red(col) + green(col) + blue(col)) / 3;

    // Invert the grayscale color
    let invertedGray = 255 - gray;
    let invertedColor = color(invertedGray, invertedGray, invertedGray);

    stroke(invertedColor);
    let sw = map(avgWeights[i], 0, maxWeight * 2, 1, 14, true);
    strokeWeight(sw);
    point(v.x, v.y);
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, width, height]);
}

// Calculate Delaunay triangulation from p5.Vectors
function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
