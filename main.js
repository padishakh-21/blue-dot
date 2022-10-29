var output = document.getElementById("output");

var c = document.getElementById("c");
var ctx = c.getContext("2d");

var cw = c.width = 450,
  cx = cw / 2;
var ch = c.height = 450,
  cy = ch / 2;
var rad = Math.PI / 180;

var stopped = true;
var beadsRy = [];

var delta = 0,
  x, y, t;
var layers = 6;
var nCusped = 5; // n cusped hypocycloid
var l = 1; // l for hsl

function Bead(a, b, t, delta, color) {
  if (l < 100) {
    l += .5;
  }
  this.R = randomIntFromInterval(1, 15); //witness
  this.r = this.R + 1; // bead radius
  this.t = t;
  this.a = a; //radius 1 for the hypocycloid
  this.b = b; //radius 2 for the hypocycloid
  this.delta = delta;
  this.hue = 200;
  this.l = l;
  this.phi = this.t * rad;
  this.x = cx + (a - b) * Math.cos(this.phi) + b * Math.cos(this.delta + (a - b) / b * this.phi);
  this.y = cy + (a - b) * Math.sin(this.phi) - b * Math.sin(this.delta + (a - b) / b * this.phi);
}

function createBeads() {
  for (var i = 0; i < layers; i++) {
    var a = 50 + 30 * i,
      b = a / nCusped;
    for (var t = 1; t <= 360; t += 10) {
      var o = new Bead(a, b, t, delta + i * 5, 180 - a);
      beadsRy.push(o);
      drawBead(o);
    }
  }
}

function drawBead(o) {
  ctx.fillStyle = "hsl(" + o.hue + ",99%," + o.l + "%)"
  ctx.beginPath();
  ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
  ctx.fill();
}

function updateBeads() {

  ctx.clearRect(0, 0, cw, ch);
  for (var i = 0; i < beadsRy.length; i++) {
    var o = beadsRy[i];
    o.t += .25;
    o.phi = o.t * rad;
    o.r = o.R * Math.abs(Math.sin(o.phi)) + 1;
    o.delta += .025;
    o.x = cx + (o.a - o.b) * Math.cos(o.phi) + o.b * Math.cos(o.delta + (o.a - o.b) / o.b * o.phi);
    o.y = cy + (o.a - o.b) * Math.sin(o.phi) - o.b * Math.sin(o.delta + (o.a - o.b) / o.b * o.phi);
    drawBead(o);

  }
  requestId = window.requestAnimationFrame(updateBeads);

}
createBeads();
//ctx.globalCompositeOperation = "difference";

function start() {
  requestId = window.requestAnimationFrame(updateBeads);
  stopped = false;
}

function stopAnim() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
  }
  stopped = true;
}

window.addEventListener("load", start(), false);
c.addEventListener("click", function() {
  (stopped == true) ? start(): stopAnim();
}, false);

function randomIntFromInterval(mn, mx) {
  return Math.floor(Math.random() * (mx - mn + 1) + mn);
}