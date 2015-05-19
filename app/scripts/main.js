console.log('\'Allo \'Allo!');

function hasClassName(inElement, inClassName)
{
  var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
  return regExp.test(inElement.className);
}

function addClassName(inElement, inClassName)
{
  if (!hasClassName(inElement, inClassName)) {
    inElement.className = [inElement.className, inClassName].join(' ');
  }
}

function removeClassName(inElement, inClassName)
{
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
    }, 1100);
  }
}

function cardOver(index, status) {
  var element = document.getElementById("card" + index);
  removeClassName(element, "to-center-card" + index);
  removeClassName(element, "to-position-card" + index);
  addClassName(element, "card-over");
  setTimeout(function() {
    if (status == 0) {
      element.src = "../images/card-word" + index + ".png";
    } else if (status == 1) {
      element.src = "../images/card.png";
    } else {
      //TODO
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
  }, 1400);
}

function checkout() {
  var e = document.getElementById("card0");
  if (hasClassName(e, "position-card0")) {
    moveToCenter();
  } else {
    moveToPosition();
  }
}
