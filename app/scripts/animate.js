/**
 * Created by Yue Dayu on 2015/5/19.
 */

var self = window;

var halfX = 450;
var halfY = 250;
var reOrder = [];
var randomNum = [0, 0, 0];
var mainNum;
var partNum;
var currentLayout = 0;
var gap = 150;

var word = ['安可', 'ENCORE'];
var particles = []; //now position
var next = [[], [], []]; //0 安可 1 ENCORE 2 frame
var shape = {};

var canvas;
var context;

var FPS = 60;

/*
 * init the environment.
 */
function init() {
  var container = document.querySelector('.ip-slideshow');
  canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = 700;
  container.appendChild(canvas);
  context = canvas.getContext('2d');
  createText(200, 0);
  createText(110, 1);
  mainNum = max(next[0].length, next[1].length);
  console.log(mainNum);
  randomOrder(reOrder, 0, mainNum);
  partNum = mainNum / 3;
  createTextFrame(mainNum);
  createParticles();
}

function createParticles() {
  for (var quantity = 0, len = mainNum; quantity < len; quantity++) {
    var x, y, steps = Math.PI * 2 * quantity / len;
    x = next[0][quantity].x;
    y = next[0][quantity].y;
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    var color = '#ffffff';
    particles.push({
      x: x,
      y: y,
      hasBorn: hasBorn,
      ease: 0.04 + Math.random() * 0.06,
      bornSpeed: 0.03 + Math.random() * 0.10,
      alpha: 0,
      maxAlpha: 0.5 + Math.random() * 0.5,
      radius: radius,
      maxRadius: 12,
      color: color,
      angle: 0,
      steps: steps
    });
  }
  loop();
}

/*
 * Update the current text to a new one
 * @param index, str
 */
function createText(size, index) {
  context.font = size + 'px Lato, Arial, sans-serif';
  context.fillStyle = 'rgb(255, 255, 255)';
  context.textAlign = 'center';
  var strip = word[index].toUpperCase().split('').join(String.fromCharCode(8202));
  context.fillText(strip, canvas.width * 0.5, canvas.height * 0.5 + size * 0.5);
  var surface = context.getImageData(canvas.width * 0.5 - 300, canvas.height * 0.5 - size * 0.55, 600, size * 1.5);
  for (var width = 0; width < surface.width; width += (index == 0) ? 6 : 8) {
    for (var height = 0; height < surface.height; height += 4) {
      var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
      var radius = randomBetween(0, 12);
      var hasBorn = !(radius > 0 || radius < 12);
      if (color === 255) {
        next[index].push({
          x: width - 300 + canvas.width * 0.5,
          y: height - size * 0.55 + canvas.height * 0.5,
          angle: 0,
          hasBorn: hasBorn,
          ease: 0.04 + Math.random() * 0.06,
          bornSpeed: 0.03 + Math.random() * 0.10,
          alpha: 0,
          maxAlpha: 0.5 + Math.random() * 0.5,
          radius: radius,
          orbit: randomBetween(15, 25),
          maxRadius: 12
          //color: color
        });
      }
    }
  }
  context.clearRect(canvas.width * 0.5 - 300, canvas.height * 0.5 - size * 0.55, 600, size * 1.5);
}

function createTextFrame(seed) {
  var x;
  var y;
  var heightNum = seed / 5.236;
  var weightNum = heightNum * 1.618;
  for (var i = 0, len = seed; i < len; i++) {
    if (i < heightNum) {
      x = canvas.width / 2 - halfX;
      y = canvas.height / 2 - halfY + 2 * i * halfY / heightNum;
    } else if (i < heightNum + weightNum) {
      y = canvas.height / 2 + halfY;
      x = canvas.width / 2 - halfX + 2 * (i - heightNum) * halfX / weightNum;
    } else if (i < 2 * heightNum + weightNum) {
      x = canvas.width / 2 + halfX;
      y = canvas.height / 2 - halfY + 2 * (i - heightNum - weightNum) * halfY / heightNum;
    } else {
      y = canvas.height / 2 - halfY;
      x = canvas.width / 2 - halfX + 2 * (i - 2 * heightNum - weightNum) * halfX / weightNum;
    }
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    next[2].push({
      x: x,
      y: y,
      angle: 0,
      hasBorn: hasBorn,
      ease: 0.04 + Math.random() * 0.06,
      bornSpeed: 0.03 + Math.random() * 0.10,
      alpha: 0,
      maxAlpha: 0.5 + Math.random() * 0.5,
      radius: radius,
      maxRadius: 12
      //color: color
    });
  }
}

/*
 * Update transition.
 */
function updataTransition() {
  switch (currentLayout) {
    case 0: //show the numbers
      [].forEach.call(particles, function (particle, index) {
        var i = Math.floor(3 * index / mainNum);
        var newIndex = Math.floor(index - i * partNum);
        switch (randomNum[i]) {
          case 0: //number 0
            var step = Math.PI * 2 * reOrder[newIndex] / partNum;
            shape.x = canvas.width * 0.5 + 85 * Math.cos(step);
            shape.y = canvas.height * 0.5 + 140 * Math.sin(step);
            break;
          case 1: //number 1
            if (reOrder[newIndex] < (partNum / 2)) {
              shape.x = canvas.width * 0.5 + 1;
              shape.y = canvas.height / 2 - 140 + 280 * (reOrder[newIndex] / partNum);
            } else {
              shape.x = canvas.width * 0.5 - 1;
              shape.y = canvas.height / 2 + 140 - ((reOrder[newIndex] - (partNum / 2)) / partNum) * 280;
            }
            break;
          case 2: //number 2
            if (reOrder[newIndex] < partNum * (87 / 200)) {
              var steps = Math.PI * 5 / 4 * reOrder[newIndex] / (partNum * (87 / 200));
              shape.x = canvas.width * 0.5 - 85 * Math.cos(steps);
              shape.y = canvas.height * 0.5 - 60 - 85 * Math.sin(steps);
            } else if (reOrder[newIndex] < partNum * (156 / 200)) {
              shape.x = canvas.width * 0.5 + 60 - 145 * (reOrder[newIndex] - partNum * (87 / 200)) / (partNum * (69 / 200));
              shape.y = canvas.height * 0.5 - 5 + 147 * (reOrder[newIndex] - partNum * (87 / 200)) / (partNum * (69 / 200));
            } else {
              shape.x = canvas.width * 0.5 - 85 + 170 * (reOrder[newIndex] - partNum * (156 / 200)) / (partNum * (44 / 200));
              shape.y = canvas.height * 0.5 + 140;
            }
            break;
          case 3: //number 3
            if (reOrder[newIndex] < (partNum * 93 / 200)) {
              var steps = Math.PI * 5 / 4 * reOrder[newIndex] / (partNum * 93 / 200) - Math.PI / 4;
              shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
              shape.y = canvas.height * 0.5 - 70 - 65 * Math.cos(steps);
            } else {
              var steps = Math.PI * 5 / 4 * (reOrder[newIndex] - (partNum * 93 / 200)) / (partNum * 107 / 200);
              shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
              shape.y = canvas.height * 0.5 + 70 - 75 * Math.cos(steps);
            }
            break;
          case 4: //number 4
            if (reOrder[newIndex] < (partNum * 76 / 200)) {
              shape.x = 50 + canvas.width * 0.5;
              shape.y = 280 * reOrder[newIndex] / (partNum * 76 / 200) + canvas.height * 0.5 - 140;
            } else if (reOrder[newIndex] < (partNum * 127 / 200)) {
              shape.y = canvas.height * 0.5 + 43;
              shape.x = canvas.width * 0.5 - 93 + 186 * (reOrder[newIndex] - (partNum * 76 / 200)) / (partNum * 51 / 200);
            } else {
              shape.x = canvas.width * 0.5 + 50 - 143 * (reOrder[newIndex] - (partNum * 127 / 200)) / (partNum * 73 / 200);
              shape.y = canvas.height * 0.5 - 140 + 187 * (reOrder[newIndex] - (partNum * 127 / 200)) / (partNum * 73 / 200);
            }
            break;
          case 5: //number 5
            if (reOrder[newIndex] < (partNum * 46 / 200)) {
              shape.y = canvas.height * 0.5 - 140;
              shape.x = canvas.width * 0.5 - 75 + 150 * reOrder[newIndex] / (partNum * 46 / 200);
            } else if (reOrder[newIndex] < (partNum * 86 / 200)) {
              shape.x = canvas.width * 0.5 - 75;
              shape.y = canvas.height * 0.5 - 140 + 100 * (reOrder[newIndex] - (partNum * 46 / 200)) / (partNum * 40 / 200);
            } else if (reOrder[newIndex] < (partNum * 109 / 200)) {
              shape.y = canvas.height * 0.5 - 40;
              shape.x = canvas.width * 0.5 - 75 + 75 * (reOrder[newIndex] - (partNum * 86 / 200)) / (partNum * 23 / 200);
            } else {
              var steps = Math.PI * 19 / 14 * (reOrder[newIndex] - (partNum * 109 / 200)) / (partNum * 91 / 200);
              shape.x = canvas.width * 0.5 + 90 * Math.sin(steps);
              shape.y = canvas.height * 0.5 + 50 - 90 * Math.cos(steps);
            }
            break;
          case 6: //number 6
            if (reOrder[newIndex] < (partNum * 60 / 200)) {
              var steps = Math.PI * reOrder[newIndex] / (partNum * 60 / 200);
              shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
              shape.y = canvas.height * 0.5 - 55 - 85 * Math.sin(steps);
            } else if (reOrder[newIndex] < (partNum * 80 / 200)) {
              shape.x = canvas.width * 0.5 - 85;
              shape.y = canvas.height * 0.5 - 55 + 110 * (reOrder[newIndex] - (partNum * 60 / 200)) / (partNum * 20 / 200);
            } else {
              var steps = Math.PI * 2 * (reOrder[newIndex] - (partNum * 80 / 200)) / (partNum * 120 / 200);
              shape.x = canvas.width * 0.5 + 85 * Math.sin(steps);
              shape.y = canvas.height * 0.5 + 55 + 85 * Math.cos(steps);
            }
            break;
          case 7: //number 7
            if (reOrder[newIndex] < (partNum * 70 / 200)) {
              shape.y = canvas.height * 0.5 - 140;
              shape.x = canvas.width * 0.5 - 85 + 170 * reOrder[newIndex] / (partNum * 70 / 200);
            } else {
              shape.x = canvas.width * 0.5 + 85 - 100 * (reOrder[newIndex] - (partNum * 70 / 200)) / (partNum * 130 / 200);
              shape.y = canvas.height * 0.5 - 140 + 280 * (reOrder[newIndex] - (partNum * 70 / 200)) / (partNum * 130 / 200);
            }
            break;
          case 8: //number 8
            if (reOrder[newIndex] < (partNum * 92 / 200)) {
              var steps = Math.PI * 2 * reOrder[newIndex] / (partNum * 92 / 200);
              shape.x = canvas.width * 0.5 + 65 * Math.sin(steps);
              shape.y = canvas.height * 0.5 - 75 + 65 * Math.cos(steps);
            } else {
              var steps = Math.PI * 2 * (reOrder[newIndex] - (partNum * 92 / 200)) / (partNum * 108 / 200);
              shape.x = canvas.width * 0.5 + 75 * Math.sin(steps);
              shape.y = canvas.height * 0.5 + 65 + 75 * Math.cos(steps);
            }
            break;
          case 9: //number 9
            if (reOrder[newIndex] < (partNum * 60 / 200)) {
              var steps = Math.PI * reOrder[newIndex] / (partNum * 60 / 200);
              shape.x = canvas.width * 0.5 + 85 * Math.cos(steps);
              shape.y = canvas.height * 0.5 + 55 + 85 * Math.sin(steps);
            } else if (reOrder[newIndex] < (partNum * 80 / 200)) {
              shape.x = canvas.width * 0.5 + 85;
              shape.y = canvas.height * 0.5 + 55 - 110 * (reOrder[newIndex] - (partNum * 60 / 200)) / (partNum * 20 / 200);
            } else {
              var steps = Math.PI * 2 * (reOrder[newIndex] - (partNum * 80 / 200)) / (partNum * 120 / 200);
              shape.x = canvas.width * 0.5 + 85 * Math.sin(steps);
              shape.y = canvas.height * 0.5 - 55 + 85 * Math.cos(steps);
            }
            break;
        }
        shape.x *= 0.6;
        shape.x += canvas.width * 0.2;
        shape.y *= 0.6;
        shape.y += 144;
        shape.x += (i - 1) * gap;
        particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
        particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
        particle.angle += 0.08;
      });
      break;
    default:
      [].forEach.call(particles, function (particle, index) {
        particle.x += (next[currentLayout - 1][index].x - particle.x) * 0.08;
        particle.y += (next[currentLayout - 1][index].y - particle.y) * 0.08;
        particle.angle += 0.08;
      });
      break;
  }
}

/*
 * Update the particles
 */
function update() {
  updataTransition();
  [].forEach.call(particles, function (particle, index) {
    particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
    if (particle.hasBorn) {
      particle.radius += (0 - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === 0) {
        //var i = Math.floor(3 * index / mainNum);
        if (currentLayout == 0) {
          //particle.color = colors[randomNum[i]][Math.floor(Math.random() * colors[currentLayout].length)];
        } else {
          //particle.color = colors[currentLayout + 9][Math.floor(Math.random() * colors[currentLayout].length)];
        }
        particle.hasBorn = false;
      }
    } else {
      particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === particle.maxRadius)
        particle.hasBorn = true;
    }
  });
}

/*
 * Clear the screen
 */
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/*
 * get a random number between min and max.
 */
function randomBetween(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min));
}

function max(num1, num2) {
  return (num1 > num2) ? num1 : num2;
}

/*
 * Render the particles.
 */
function render() {
  [].forEach.call(particles, function (particle, index) {
    context.save();
    context.globalAlpha = particle.alpha;
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function loop() {
  clear();
  update();
  render();
  setTimeout(loop, 1000 / FPS);
}

window.onload = init;

function changeStatus(toLayout) {
  toLayout %= 4;
  if (toLayout == 2 && currentLayout != 2) {
    for (var i = 0; i < (next[2].length - next[1].length); i++) {
      particles.pop();
    }
  } else if (currentLayout == 2 && toLayout != 2) {
    for (var i = 0; i < (next[2].length - next[1].length); i++) {
      var x, y;
      x = canvas.width * 0.5;
      y = canvas.height * 0.5;
      var radius = randomBetween(0, 12);
      var hasBorn = !(radius > 0 || radius < 12);
      var color = '#ffffff';
      particles.push({
        x: x,
        y: y,
        hasBorn: hasBorn,
        ease: 0.04 + Math.random() * 0.06,
        bornSpeed: 0.03 + Math.random() * 0.10,
        alpha: 0,
        maxAlpha: 0.5 + Math.random() * 0.5,
        radius: radius,
        maxRadius: 12,
        color: color,
        angle: 0
      });
    }
  }
  currentLayout = toLayout;
}

function randomOrder(array, a, n) {
  var index = 0;
  for (var i = a; i < n; i++) {
    array[i] = i;
  }
  for (var i = n; i > a; i--) {
    index = randomBetween(a, i);
    var temp = array[index];
    array[index] = array[i - 1];
    array[i - 1] = temp;
  }
}
