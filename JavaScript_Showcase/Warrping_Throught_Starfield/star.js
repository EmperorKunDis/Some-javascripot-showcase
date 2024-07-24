/* This is Object "Star" withthese three funkctions: constructor ( creating object ), update 
( move starts from middle of monitor behind ship ), show ( thes draw start tu object ) */

class Star {

  constructor() {
    this.x = random(-width, width);       // Thanks this is starting point of stars more middle 
    this.y = random(-height, height);      
    this.z = random(width);               // than 16:9 monitors resolution is here Z-width when is monitor more upside than wide it makes more reslistic feelings.
    this.pz = this.z;
  }

  update() {
    this.z = this.z - speed;
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
