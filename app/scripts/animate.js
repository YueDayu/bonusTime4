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
var currentLayout = 1;
var gap = 150;

var word = ['安可', 'ENCORE'];
var particles = []; //now position
var next = [[], [], []]; //0 安可 1 ENCORE 2 frame
var shape = {};

var canvas;
var context;

var FPS = 60;

var maxHundredNum = 8;

var colors = [['#ffffff', '#f7d838'],
            ['#f7d838', '#fee5d1'],
            ['#9dcdb5', '#fee5d1'],
            ['#eb484f', '#fee5d1']];

/*
 * init the environment.
 */
function init() {
  setInitStatus();
  randomCardId();
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
        var newIndex = (index - Math.floor(i * partNum));
        newIndex %= Math.floor(partNum);
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
        particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.16;
        particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.16;
        particle.angle += 0.08;
      });
      break;
    default:
      [].forEach.call(particles, function (particle, index) {
        if (particle.hasOwnProperty('x')) {
          particle.x += (next[currentLayout - 1][reOrder[index]].x + Math.cos(particle.angle) * 5 - particle.x) * 0.08;
          particle.y += (next[currentLayout - 1][reOrder[index]].y + Math.sin(particle.angle) * 5 - particle.y) * 0.08;
          particle.angle += 0.08;
        }
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
        switch(currentLayout) {
          case 0:
            var i = Math.floor(3 * index / mainNum);
            if (i == 1) {
              particle.color = colors[1][Math.floor(Math.random() * colors[1].length)];
            } else {
              particle.color = colors[2][Math.floor(Math.random() * colors[0].length)];
            }
            break;
          case 1:
          case 2:
            particle.color = colors[0][Math.floor(Math.random() * colors[0].length)];
            break;
          case 3:
            particle.color = colors[3][Math.floor(Math.random() * colors[0].length)];
            break;
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
  var res = Math.floor((Math.random() * (max - min + 1) + min));
  if (res == max) {
    var res = Math.floor((Math.random() * (max - min + 1) + min));
    if (res == max) {
      res -= 1;
    }
  }
  return res;
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
    randomOrder(reOrder, 0, next[1].length);
    for (var i = 0; i < (next[2].length - next[1].length); i++) {
      particles.pop();
    }
  } else if (currentLayout == 2 && toLayout != 2) {
    randomOrder(reOrder, 0, mainNum);
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
  } else {
    randomOrder(reOrder, 0, mainNum);
  }
  if (toLayout == 0) {
    showNum();
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

function showNum() {
  if (currentLayout != 0) return;
  for (var i = 0; i < 2; i++) {
    randomOrder(reOrder, Math.floor(i * partNum), Math.floor((i + 1) * partNum));
  }
  randomOrder(reOrder, Math.floor(2 * partNum), mainNum);
  randomNumberArray();
}

function randomNumberArray() {
  randomNum[0] = randomBetween(0, maxHundredNum);
  randomNum[1] = randomBetween(0, 10);
  if (randomNum[1] == randomNum[0]) {
    randomNum[1] = randomBetween(0, 10);
  }
  randomNum[2] = randomBetween(0, 10);
  if (randomNum[2] == randomNum[1] || randomNum[2] == randomNum[0]) {
    randomNum[2] = randomBetween(0, 10);
  }
}

var isCardShow = [false, false, false, false, false, false, false, false];
var showCardId = [2, 3, 4, 5, 6, 7, 8, 9];

function hasClassName(inElement, inClassName) {
  var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
  return regExp.test(inElement.className);
}

function addClassName(inElement, inClassName) {
  if (!hasClassName(inElement, inClassName)) {
    inElement.className = [inElement.className, inClassName].join(' ');
  }
}

function removeClassName(inElement, inClassName) {
  if (hasClassName(inElement, inClassName)) {
    var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)', 'g');
    var curClasses = inElement.className;
    inElement.className = curClasses.replace(regExp, ' ');
  }
}

function moveToPosition() {
  for (var i = 0; i < 8; i++) {
    var e = document.getElementById("card" + i);
    removeClassName(e, "card-over");
    removeClassName(e, "to-center-card" + i);
    addClassName(e, "to-position-card" + i);
    removeClassName(e, "card-pic-center");
    addClassName(e, "position-card" + i);
  }
  setTimeout(function() {
    for (var i = 0; i < 8; i++) {
      var e = document.getElementById("card" + i);
      removeClassName(e, "to-position-card" + i);
    }
  }, 2010);
  setTimeout(function() {
    cardOverInOrder(0, 0);
  }, 1900);
}

function cardOverInOrder(index, status) {
  if (index < 8) {
    cardOver(index, status);
    setTimeout(function() {
      cardOverInOrder(index + 1, status);
    }, 50);
    setTimeout(function() {
      var e = document.getElementById("card" + index);
      removeClassName(e, "card-over");
    }, 1050);
  }
}

function cardOver(index, status) {
  var element = document.getElementById("card" + index);
  removeClassName(element, "to-center-card" + index);
  removeClassName(element, "to-position-card" + index);
  addClassName(element, "card-over");
  setTimeout(function() {
    if (status == 0) {
      if (isCardShow[index]) {
        element.src = "../images/" + showCardId[index] + ".png";
      } else {
        element.src = "../images/card-word" + index + ".png";
      }
    } else if (status == 1) {
      element.src = "../images/card.png";
    } else if (status == 2) {
      isCardShow[index] = true;
      element.src = "../images/" + showCardId[index] + ".png";
      setTimeout(function() {
        var e = document.getElementById("card" + index);
        removeClassName(e, "card-over");
      }, 1050);
    } else {
      element.src = "../images/1.png";
    }
  }, 500);
}

function moveToCenter() {
  cardOverInOrder(0, 1);
  setTimeout(function() {
    for (var i = 0; i < 8; i++) {
      var e = document.getElementById("card" + i);
      removeClassName(e, "card-over");
      removeClassName(e, "to-position-card" + i);
      addClassName(e, "to-center-card" + i);
      removeClassName(e, "position-card" + i);
      addClassName(e, "card-pic-center");
    }
    setTimeout(function() {
      for (var i = 0; i < 8; i++) {
        var e = document.getElementById("card" + i);
        removeClassName(e, "to-center-card" + i);
      }
    }, 1510);
  }, 1400);
}

function finalOver() {
  for (var i = 0; i < 7; i++) {
    var e = document.getElementById("card" + i);
    addClassName(e, "hide");
  }
  cardOver(7, 3);
  setTimeout(function() {
    var e = document.getElementById("card7");
    removeClassName(e, "card-over");
  }, 1050);
}

function finalBack() {
  cardOver(7, 1);
  setTimeout(function() {
    var e = document.getElementById("card7");
    removeClassName(e, "card-over");
    for (var i = 0; i < 7; i++) {
      e = document.getElementById("card" + i);
      removeClassName(e, "hide");
    }
  }, 1050);
}

function randomCardId() {
  var temp = 0;
  for (var i = 7; i >= 0; i--) {
    var index = randomBetween(0, i + 1);
    temp = showCardId[i];
    showCardId[i] = showCardId[index];
    showCardId[index] = temp;
  }
  console.log(showCardId);
}
