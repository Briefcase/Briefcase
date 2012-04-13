// code written by Asher Glick, dont fuck with it



  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// INITILIZATION ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var data = new Array(); // the array that will store the values for the spreadsheet

// Width and height for the labled cells
var labelCellHeight = 18;
var labelCellWidth = 40;
// Cell width and height
var defaultCellHeight = 18;
var dynamicCellHeight = new Array();
var defaultCellWidth  = 110;
var dynamicCellWidth  = new Array();

// does there need to be a scrolling offset? or can it just be read from the scroll bars

// When using tab remember which column you started at when you hit enter
var tabReturnColumn = -1;

// function focus or bar focus, can focus be determined from the object, or can we use oninput instead of a time delay to sync the two bars (i think oninput will work)


/************************** INITILIZE EVENT FUNCTIONS *************************\
|
\******************************************************************************/
$(document).ready( function () {
  // size the window correctly
  resizeWindow();
  window.onresize = resizeWindow();
  
  // mouse events
  document.onmousedown = mousePress;
  document.onmouseup = mouseRelease;
  
  // general keyboard events (shortcut keys, etc.)
  document.onkeypress = keypress;
});

  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////// INTERFACE RESIZING /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/******************************** RESIZE WINDOW *******************************\
|
\******************************************************************************/
function resizeWindow () {
  // do all of the resizeing functions here
  redrawFrame();
}
  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// CELL SIZE API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function getCellWidth(xCoord) {
  return xCoord;
  //return defaultCellWidth;
}
function getCellHeight(yCoord) {
  return yCoord;
  //return defaultCellHeight;
}

  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////////// SCROLL BAR API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**************************** GET SCROLL X POSITION ***************************\
|
\******************************************************************************/
function getScrollX () {  
  return 0;
}
/**************************** GET SCROLL Y POSITION ***************************\
|
\******************************************************************************/
function getScrollY () {
  return 0;
}


/******************************** REDRAW FRAME ********************************\
| This function redraws the entire frame, it is a very usefull function and    |
| will soon be the only function that does any drawing at all, this way we     |
| we wont get any errors with visualizations                                   |
\******************************************************************************/
function redrawFrame() {
  alert("redrawing");
  // get the application
  var c_canvas = document.getElementById("application");

  // 
  document.getElementById("framecontain").style.height = window.innerHeight - 30 + "px";
  document.getElementById("framecontain").style.width = window.innerWidth + "px";
  
  c_canvas.height = window.innerHeight;
  c_canvas.width = window.innerWidth;

  
  // get the context of the canvas so we can draw on it
  var context = c_canvas.getContext("2d");

  // Draw the first two grid lines for the cell labels
  context.moveTo(labelCellWidth+0.5,0);
  context.lineTo(labelCellWidth+0.5,c_canvas.height);
  context.moveTo(0, labelCellHeight+0.5);
  context.lineTo(c_canvas.width,labelCellHeight+0.5);
  
  
  //Draw the other Grid lines
  //Vvertical lines
  var integerx = ~~(getScrollX() / defaultCellWidth);
  var currentWidth = labelCellWidth+0.5;
  while (currentWidth < c_canvas.width) {
    currentWidth += getCellWidth(integerx);
    context.moveTo(currentWidth,0);
    context.lineTo(currentWidth,c_canvas.height);
    integerx+=1;
  }
  
  // Horizontal Lines
  var integery = ~~(getScrollY() / defaultCellHeight);
  var currentHeight = labelCellHeight+0.5;
  while (currentHeight < c_canvas.height) {
    currentHeight += getCellHeight(integery);
    context.moveTo(0,currentHeight);
    context.lineTo(c_canvas.width,currentHeight);
    integery += 1;
  }
  
  /*
  for (var x = 0.5; x < c_canvas.width; x += cellWidth) {
    context.moveTo(x,0);
    context.lineTo(x,c_canvas.height);
  }
  for (var y = 0.5; y < c_canvas.height; y += cellHeight) {
    context.moveTo(0,y);
    context.lineTo(c_canvas.width,y);
  }
  */

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
  
  // draw the row lables
  for (var i = 1; i < c_canvas.height/cellHeight; i++) {
    context.fillText(i, 3, (i*cellHeight+14));
  }
  // draw the column lables
  for (var i = 1; i < c_canvas.width/cellWidth; i++) {
    context.fillText(i,(i*cellWidth+3),14);
  }
}
