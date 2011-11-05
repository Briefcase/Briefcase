var pageWidth = 10;
var pageHeight= 10;

var data = new Array();

var cellHeight = 18;
var cellWidth = 110;

var xdownClick;
var ydownClick;

var lastx = -1;
var lasty = -1;
var currentx = -1;
var currenty = -1;

function moveTextBox (xpos, ypos) {
  document.getElementById("datain").style.top = ypos + 'px';
  document.getElementById("datain").style.left = (xpos - 2.5) + 'px';
}


function keypress(e) {
  if (e.keyCode == 13) {
    context.clearRect ((currentx*cellWidth)+1,(currenty*cellHeight)+1,cellWidth-1,cellHeight-1);
    context.font = "12px sans-serif";
    
    data[lastx+','+lasty] = document.getElementById("inputbox").value;
    context.fillText(document.getElementById("inputbox").value,(lastx*cellWidth) +3 ,(lasty*cellHeight)+14);
  
  //Move Input Box
    moveTextBox(-100,-100);
    document.getElementById("inputbox").value = "";
    document.getElementById("inputbox").focus();
    lastx=-1;
    lasty=-1;
  }
}


function mouseDetect(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX;
    y = e.pageY;
  }
  else { 
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
  } 
  x -= document.getElementById("application").offsetLeft;
  y -= document.getElementById("application").offsetTop;
  
  x = ~~(x / cellWidth); // truncate using ~~ (IDK WHAT IT DOES THOUGH)
  y = ~~(y / cellHeight);
  
  var c_canvas = document.getElementById("application");
  var context = c_canvas.getContext("2d");
  
  currentx = x;
  currenty = y;
}


function clickHandler(e) {
  if (currentx != downx || currenty != downy) {
    return;
  }
  //alert(currentx);
  context = document.getElementById("application").getContext("2d");
  context.clearRect ((currentx*cellWidth)+1,(currenty*cellHeight)+1,cellWidth-1,cellHeight-1);
  context.font = "12px sans-serif";
  
  //
  if (data[currentx+','+currenty] != undefined || document.getElementById("inputbox").value != "") {
    data[lastx+','+lasty] = document.getElementById("inputbox").value;
  }  
  context.fillText(document.getElementById("inputbox").value,(lastx*cellWidth) +3 ,(lasty*cellHeight)+14);
  
  //Move Input Box
  moveTextBox((currentx*cellWidth),(currenty*cellHeight)-2.5);
  if (data[currentx+','+currenty] == undefined) {
    document.getElementById("inputbox").value = "";
  }
  else {
    document.getElementById("inputbox").value = data[currentx+','+currenty];
  }
  document.getElementById("inputbox").focus();
  lastx=currentx;
  lasty=currenty;
  
}


function resizedraw (e) {
  redrawFrame();
}
function redrawFrame() {
  var c_canvas = document.getElementById("application");


  c_canvas.height = window.innerHeight;
  c_canvas.width = window.innerWidth;


  var context = c_canvas.getContext("2d");


  // draw the grid lines
  for (var x = 0.5; x < c_canvas.width; x += 110) {
    context.moveTo(x,0);
    context.lineTo(x,c_canvas.height);
  }
  for (var y = 0.5; y < c_canvas.height; y += 18) {
    context.moveTo(0,y);
    context.lineTo(c_canvas.width,y);
  }

  // Write the changes to the screen
  context.strokeStyle = "#ddd";
  context.stroke();
}

function blockordrag() {
  downx = currentx;
  downy = currenty;
  // there are no drag formats yet
}


window.onload = function () {    
  redrawFrame()
  
  window.onresize = resizedraw;
  document.onmousedown = blockordrag;
  document.onmouseup = clickHandler;
  document.onmousemove = mouseDetect;
  document.onkeypress = keypress;
  
  moveTextBox(-100,-100);
}
