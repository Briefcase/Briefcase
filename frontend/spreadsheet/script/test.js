// the data contained within the cell
var data = new Array();
// predefined sizes for cells (soon to be arrays or something)
var cellHeight = 18;
var cellWidth = 110;
// detecting if the mouse is clicking or dragging
var xdownClick;
var ydownClick;
// maintaining the position of the mouse
var lastx = -1;
var lasty = -1;
var currentx = -1;
var currenty = -1;

var rowBegin = -1; // used in conjunction with tabbing and enter hotkeys

// maintain which textbox has focus
var functionfocus = false;
var textfocus = false;

function functionOnFocus() { functionfocus = true; }
function functionOnBlur() { functionfocus = false; }
function textboxOnFocus() { textfocus = true; }
function textboxOnBlur() { textfoucs = false; }

function moveTextBox (xpos, ypos) {
  document.getElementById("datain").style.top = ypos + document.getElementById("application").offsetTop + 'px';
  document.getElementById("datain").style.left = (xpos - 2.5) + 'px';
}

function keypress(e) {
  if (e.keyCode == 13) {
    // Enter is pressed
    data[lastx+','+lasty] = document.getElementById("inputbox").value;
    finishInput(); // scans the input and displays a result
    
    //Move Input Box
    lasty++;
    lastx = rowBegin;
    moveTextBox((lastx*cellWidth),(lasty*cellHeight)-2.5);
    if (data[lastx+','+lasty] == undefined) {
      document.getElementById("inputbox").value = "";
    }
    else {
      document.getElementById("inputbox").value = data[lastx+','+lasty];
    }
    document.getElementById("inputbox").focus();
  }
  if (e.keyCode == 9) {
    
    //tab is pressed
    data[lastx+','+lasty] = document.getElementById("inputbox").value;
    finishInput(); // scans the input and displays a result
    //Move Input Box
    if (e.shiftKey) {
      lastx--;
    }
    else {
      lastx++;
    }
    moveTextBox((lastx*cellWidth),(lasty*cellHeight)-2.5);
    if (data[lastx+','+lasty] == undefined) {
      document.getElementById("inputbox").value = "";
    }
    else {
      document.getElementById("inputbox").value = data[lastx+','+lasty];
    }
    setTimeout("document.getElementById('inputbox').focus()",0);
  }
  // sync the input box and the function box on keypress
  setTimeout("delaySync()",0);
}
// Gaa, this feels so hackish makeing it delay for 1 before syncing, but it works
function delaySync(){
  // Sync Function box and text box
  if (functionfocus) {
    document.getElementById("inputbox").value = document.getElementById("functionbox").value;
  }
  else if (textfocus) {
    document.getElementById("functionbox").value = document.getElementById("inputbox").value;
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
  
  if (x > 0) {
    x = ~~(x / cellWidth); // truncate using ~~ (IDK WHAT IT DOES THOUGH)
  }
  else {
    x = x = ~~(x / cellWidth)-1;
  }
  if (y > 0) {
    y = ~~(y / cellHeight);
  }
  else{
    y = ~~(y / cellHeight)-1;
  }
  
  currentx = x;
  currenty = y;
} 

function clickHandler(e) {
  // if a person is dragging their mouse over multiple frames dont select the
  // last one thir mouse is over
  if (currentx != downx || currenty != downy) {
    return;
  } 
  // if a mouse is above or to the left of the spreadsheet, dont create a box
  if (currentx < 0 || currenty < 0) {
    return;
  } 
  // Dont redo this function if clicking on the same square
  if (currentx == lastx && currenty == lasty) {
    return;
  }
  //
  if (data[lastx+','+lasty] != undefined || document.getElementById("inputbox").value != "") {
    data[lastx+','+lasty] = document.getElementById("inputbox").value;
  }  
  
  finishInput();
  
  //Move Input Box
  moveTextBox((currentx*cellWidth),(currenty*cellHeight)-2.5);
  if (data[currentx+','+currenty] == undefined) {
    document.getElementById("inputbox").value = "";
  }
  else {
    document.getElementById("inputbox").value = data[currentx+','+currenty];
  }
  document.getElementById("functionbox").value = document.getElementById("inputbox").value;
  document.getElementById("inputbox").focus();
  lastx=currentx;
  lasty=currenty;
  rowBegin = currentx;
}

function redrawFrame() {
  var c_canvas = document.getElementById("application");


  c_canvas.height = window.innerHeight - 100;
  c_canvas.width = window.innerWidth-50;


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
  
  // draw all the text
  for (var i in data) {
	  coordPair = i.split(',');
	  x_pos=parseInt(coordPair[0]);
	  y_pos=parseInt(coordPair[1]);
	  
	  context.font = "12px sans-serif";
	  
	  if (data[i][0]=='=') {
      context.fillText(eparse(data[i].substring(1,data[i].length)),(x_pos*cellWidth) +3 ,(y_pos*cellHeight)+14);
    }
    else {
      context.fillText(data[i],(x_pos*cellWidth) +3 ,(y_pos*cellHeight)+14);
    }
  }
}

function blockordrag() {
  downx = currentx;
  downy = currenty;
  // there are no drag formats yet
}

//detects changes
function finishInput() {
  var equation = document.getElementById("inputbox").value;
  var c_canvas = document.getElementById("application");
  var context = c_canvas.getContext("2d");
  context.clearRect ((lastx*cellWidth)+1,(lasty*cellHeight)+1,cellWidth-1,cellHeight-1);
  context.font = "12px sans-serif";
  if (equation[0]=='=') {
    context.fillText(eparse(equation.substring(1,equation.length)),(lastx*cellWidth) +3 ,(lasty*cellHeight)+14);
  }
  else {
    context.fillText(document.getElementById("inputbox").value,(lastx*cellWidth) +3 ,(lasty*cellHeight)+14);
  }
}

window.onload = function () {    
  redrawFrame(); // draw the frame
  window.onresize = redrawFrame; // redraw the frame on resize
  document.onmousedown = blockordrag; // be able to handle click and drag
  document.onmouseup = clickHandler; // detect if it is a click or a drag
  document.onmousemove = mouseDetect; // easy way to maintain mouse position
  document.onkeypress = keypress; // keyboard shortcuts
  
  moveTextBox(-100,-100);
}
