/**
 * Created by Dayu.Yue on 3/14/2015.
 */

var self = window;

var halfX = 450;
var halfY = 250;
var isTextOpen = 0;
var textReOrder = [];
var textSeed;
var mainNum = 360;
var randomNum = [0, 0, 0]; //random result --> 3 numbers.
var partNum = mainNum / 3;
var gap = 250;

var showLoop;
var numberLoop;

var canvas,
  context,
  particles = [],
  reOrder = [],
  maxHundredNum = 6,
  text = [],
  nextText = [[], []], //two statuses for the text
  shape = {},
  FPS = 60,
  type = ['circle', 'ovals', 'drop', 'ribbon'],
  currentLayout = 3, //decide the colors and the sharp
  status = 0,
  word = '码戏团',
  colors = [
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#702744', '#f98d00'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#702744', '#f98d00'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#e67e22', '#2c3e50'],
    ['#c0392b', '#ff7e15'],
    ['#1d75cf', '#3a5945'],
    ['#c0392b', '#ff7e15'],
    ['#702744', '#f98d00']
  ];

/*
 * Init the envirment
 */
function init() {
  var container = document.querySelector('.ip-slideshow');
  canvas = document.createElement('canvas');
  canvas.width = innerWidth;
  canvas.height = 700;
  container.appendChild(canvas);
  context = canvas.getContext('2d');
  randomOrder(reOrder, 0, mainNum);
  createParticles();
  showLoop = setInterval("showPic()", 1800);
  createText(word);
}

/*
 * Create particles
 */
function createParticles() {
  for (var quantity = 0, len = mainNum; quantity < len; quantity++) {
    var x, y, steps = Math.PI * 2 * quantity / len;
    x = canvas.width * 0.5 + 10 * Math.cos(steps);
    y = 180 + 10 * Math.sin(steps);
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    var color = colors[10][Math.floor(Math.random() * colors[10].length)];
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
 * Create text particles
 * @param index, seed
 */
function createTextParticles(seed) {
  for (var quantity = 0, len = seed; quantity < len; quantity++) {
    var radius = randomBetween(0, 12);
    var hasBorn = !(radius > 0 || radius < 12);
    var color = "#FFFFFF";
    text.push({
      x: canvas.width * 0.5,
      y: canvas.height - 100,
      hasBorn: hasBorn,
      ease: 0.04 + Math.random() * 0.06,
      bornSpeed: 0.07 + Math.random() * 0.07,
      alpha: 0,
      maxAlpha: 0.4 + Math.random() * 0.7,
      radius: radius,
      maxRadius: 12,
      color: color,
      interactive: false
    });
  }
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
      x = canvas.width / 2 - halfX + 2 * (i - heightNum) * halfX / weightNum ;
    } else if (i < 2 * heightNum + weightNum) {
      x = canvas.width / 2 + halfX;
      y = canvas.height / 2 - halfY + 2 * (i - heightNum - weightNum) * halfY / heightNum;
    } else {
      y = canvas.height / 2 - halfY;
      x = canvas.width / 2 - halfX + 2 * (i - 2 * heightNum - weightNum) * halfX / weightNum ;
    }
    textReOrder.push(i);
    nextText[1].push({
      x: x,
      y: y,
      orbit: randomBetween(15, 25),
      angle: 0
    });
  }
}

/*
 * Update the current text to a new one
 * @param index, str
 */
function createText(str) {
  context.font = '200px Lato, Arial, sans-serif';
  context.fillStyle = 'rgb(255, 255, 255)';
  context.textAlign = 'center';
  var strip = str.toUpperCase().split('').join(String.fromCharCode(8202));
  context.fillText(strip, canvas.width * 0.5, canvas.height - 50);
  var surface = context.getImageData(0, canvas.height - 250, canvas.width, 250);
  for (var width = 0; width < surface.width; width += 8) {
    for (var height = 0; height < surface.height; height += 4) {
      var color = surface.data[(height * surface.width * 4) + (width * 4) - 1];
      if (color === 255) {
        nextText[0].push({
          x: width,
          y: height + canvas.height - 250,
          orbit: randomBetween(1, 3),
          angle: 0
        });
      }
    }
  }
  clearWord();
  var seed = nextText[0].length;
  textSeed = seed;
  createTextParticles(seed);
  createTextFrame(seed);
}

/*
 * Main loop for this program.
 */
function loop() {
  clear();
  update();
  render();
  setTimeout(loop, 1000 / FPS);
}

/*
 * Clear the screen
 */
function clear() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function clearWord() {
  context.clearRect(0, canvas.height - 250, canvas.width, 250);
}

/*
 * Update transition.
 */
function updataTransition() {
  [].forEach.call(particles, function (particle, index) {
    switch (currentLayout) {
      case 0: //show the numbers
        var i = Math.floor(3 * index / mainNum);
        var newIndex = (index - i * partNum);
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
              shape.y = canvas.height / 2 + 140 - ((reOrder[newIndex]  - (partNum / 2)) / partNum) * 280;
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
        shape.x += (i - 1) * gap;
        break;
      case 1: //ready for action
        shape.x = canvas.width * 0.5 + 100 * (-Math.sin(reOrder[index]));
        shape.y = canvas.height * 0.5 + 60 * (Math.sin(reOrder[index])) * Math.cos(reOrder[index]);
        break;
      case 2: //circle
        shape.x = canvas.width * 0.5 + 140 * Math.sin(particle.steps);
        shape.y = 180 + 140 * Math.cos(particle.steps);
        break;
      case 3: //ovals
        var limit, steps;
        limit = (mainNum * 0.5) - 1;
        steps = Math.PI * 2 * reOrder[index] / limit;
        // First oval
        if (reOrder[index] < [].slice.call(particles, 0, limit).length) {
          shape.x = canvas.width * 0.5 + 80 * Math.cos(steps);
          shape.y = 180 + 140 * Math.sin(steps);
        }
        // Second oval
        else {
          limit = (particles.length * 0.5);
          shape.x = canvas.width * 0.5 + 140 * Math.cos(steps);
          shape.y = 180 + 80 * Math.sin(steps);
        }
        break;
      case 4: //drop
        shape.x = canvas.width * 0.5 + 90 * (1 - Math.sin(reOrder[index])) * Math.cos(reOrder[index]);
        shape.y = 320 + 140 * (-Math.sin(reOrder[index]) - 1);
        break;
      case 5: //ribbon
        shape.x = canvas.width * 0.5 + 90 * (Math.sin(reOrder[index])) * Math.cos(reOrder[index]);
        shape.y = 320 + 140 * (-Math.sin(reOrder[index]) - 1);
        break;
      default:
        break;
    }
    particle.x += ((shape.x + Math.cos(particle.angle) * 5) - particle.x) * 0.08;
    particle.y += ((shape.y + Math.sin(particle.angle) * 5) - particle.y) * 0.08;
    particle.angle += 0.08;
  });
  /* --- Text --- */
  [].forEach.call(nextText[isTextOpen], function (particle, index) {
    text[textReOrder[index]].x += ((particle.x + Math.cos(particle.angle + index) * particle.orbit) - text[textReOrder[index]].x) * 0.15;
    text[textReOrder[index]].y += ((particle.y + Math.sin(particle.angle + index) * particle.orbit) - text[textReOrder[index]].y) * 0.15;
    particle.angle += 0.08;
  });
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
        var i = Math.floor(3 * index / mainNum);
        if (currentLayout == 0) {
          particle.color = colors[randomNum[i]][Math.floor(Math.random() * colors[currentLayout].length)];
        } else {
          particle.color = colors[currentLayout + 9][Math.floor(Math.random() * colors[currentLayout].length)];
        }
        particle.hasBorn = false;
      }
    } else {
      particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === particle.maxRadius)
        particle.hasBorn = true;
    }
  });
  [].forEach.call(text, function (particle, index) {
    particle.alpha += (particle.maxAlpha - particle.alpha) * 0.05;
    if (particle.hasBorn) {
      particle.radius += (0 - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === 0)
        particle.hasBorn = false;
    }
    if (!particle.hasBorn) {
      particle.radius += (particle.maxRadius - particle.radius) * particle.bornSpeed;
      if (Math.round(particle.radius) === particle.maxRadius)
        particle.hasBorn = true;
    }
  });
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
  [].forEach.call(text, function (particle, index) {
    context.save();
    context.globalAlpha = particle.alpha;
    context.fillStyle = 'rgb(255, 255, 255)';
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function randomBetween(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min));
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

function max(num1, num2) {
  return (num1 > num2) ? num1 : num2;
}

window.onload = init;

function showPic() {
  if (status == 0) {
    currentLayout++;
    randomOrder(reOrder, 0, mainNum);
    if (currentLayout < 2) {
      currentLayout = 3;
    }
    if (currentLayout > 5) {
      currentLayout = 2;
    }
  }
}

function randomNumberArray() {
  randomNum[0] = randomBetween(0, maxHundredNum);
  randomNum[1] = randomBetween(0, 9);
  if (randomNum[1] == randomNum[0]) {
    randomNum[1] = randomBetween(0, 9);
  }
  randomNum[2] = randomBetween(0, 9);
  if (randomNum[2] == randomNum[1]) {
    randomNum[2] = randomBetween(0, 9);
  }
}

$("body").keydown(function(event){
  console.log(event.which);
  if (event.which == 32) {
    if (status == 0) {
      status++;
      randomOrder(textReOrder, 0, textSeed);
      randomOrder(reOrder, 0, mainNum);
      isTextOpen = 1;
      currentLayout = 1;
      clearInterval(showLoop);
    } else if (status != 2) {
      clearInterval(numberLoop);
      status = 0;
      randomOrder(textReOrder, 0, textSeed);
      isTextOpen = 0;
      showPic();
      showLoop = setInterval("showPic()", 1800);
    }
  } else if (event.which == 13) {
    if (status == 1) {
      showNum();
      numberLoop = setInterval("showNum()", 500);
      currentLayout = 0;
      status = 2;
    } else if (status == 2) {
      clearInterval(numberLoop);
      status = 3;
    } else if (status == 3) {
      status = 1;
      currentLayout = 1;
    }
  }
});

function showNum() {
  for (var i = 0; i < 3; i++) {
    randomOrder(reOrder, i * partNum, (i + 1) * partNum);
  }
  randomNumberArray();
}
