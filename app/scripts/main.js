function checkout() {
  var e = document.getElementById("card0");
  if (hasClassName(e, "position-card0")) {
    moveToCenter();
  } else {
    moveToPosition();
  }
  //showNum();
  //changeStatus(currentLayout + 1);
}

var test = 0;
function checkout2() {
  finalBack();
}

function checkout3() {
  showNum();
  finalOver();
}

function checkout4() {
  changeStatus(currentLayout + 1);
}

var status = 0;
var actionLoop;
var layout = 1;
var isNumRun = false;

var table = [81, 87, 69, 82, 65, 83, 68, 70];

function switchBetweenWords() {
  layout = 3 - layout;
  changeStatus(layout);
}

function setInitStatus() {
  clearInterval(actionLoop);
  changeStatus(layout);
  actionLoop = setInterval("switchBetweenWords()", 2000);
}

function changeNum() {
  clearInterval(actionLoop);
  changeStatus(0);
  showNum();
  isNumRun = true;
  actionLoop = setInterval("showNum()", 200);
}

function stopNum() {
  isNumRun = false;
  clearInterval(actionLoop);
}

function openCards() {
  changeStatus(3);
  moveToPosition();
}

function seclectCard(index) {
  cardOver(index, 2);
}

function selectToOrigin() {
  moveToCenter();
  setTimeout(function() {
    setInitStatus();
  }, 2500);
  //setInitStatus();
}

function mainCardOver() {
  finalOver();
  $("#show").hide();
}

function mainToOrigin() {
  finalBack();
  setInitStatus();
  setTimeout(function() {
    $("#show").show();
  }, 500);
}

function getPosition(num) {
  for (var i = 0; i < 8; i++) {
    if (table[i] == num) {
      return i;
    }
  }
  return -1;
}

function isIntable(num) {
  for (var i = 0; i < 8; i++) {
    if (table[i] == num) {
      return true;
    }
  }
  return false;
}

$("body").keydown(function(event){
  var key = event.which;
  console.log(key);
  console.log(status);
  if (status == 0) {
    if (key == 13) {
      changeNum();
      status = 1;
    }
  } else if (status == 1) {
    if (key == 13) {
      if (isNumRun) {
        stopNum();
      } else {
        changeNum();
      }
    }
    if (!isNumRun) {
      if (key == 81) {
        openCards();
        status = 2;
      } else if (key == 32) {
        mainCardOver();
        status = 3;
      }
    }
  } else if (status == 2) {
    if (isIntable(key)) {
      seclectCard(getPosition(key));
    } else if (key == 32) {
      selectToOrigin();
      status = 0;
    }
  } else if (status == 3) {
    if (key == 32) {
      mainToOrigin();
      status = 0;
    }
  }
});
