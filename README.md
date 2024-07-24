<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <script>
    class Star {
      constructor() {
        this.x = random(-width, width); // Starting point of stars is more centered
        this.y = random(-height, height);
        this.z = random(width); // Z-width makes it more realistic on wider screens
        this.pz = this.z;
      }
      update() {
        this.z -= speed;
        if (this.z < 1) {
          this.z = width;
          this.x = random(-width, width);
          this.y = random(-height, height);
          this.pz = this.z;
        }
      }
      show() {
        fill(255);
        noStroke();
        let sx = map(this.x / this.z, 0, 1, 0, width);
        let sy = map(this.y / this.z, 0, 1, 0, height);
        let r = map(this.z, 0, width, 4, 0);
        let px = map(this.x / this.pz, 0, 1, 0, width);
        let py = map(this.y / this.pz, 0, 1, 0, height);
        this.pz = this.z;
        stroke(255);
        strokeWeight(r);
        line(px, py, sx, sy);
      }
    }

    let stars = [];
    let speed;

    function setup() {
      createCanvas(640, 360);
      for (let i = 0; i < 2500; i++) {
        stars[i] = new Star();
      }
    }

    function draw() {
      speed = map(mouseX, 0, width, 0, 50);
      background(0);
      translate(width / 2, height / 2);
      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].show();
      }
    }
  </script>
</body>
</html>
