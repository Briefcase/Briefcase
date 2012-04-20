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
  //resizeWindow();
  window.onresize = resizeWindow();
  
  // mouse events
  document.onmousedown = mousePress;
  document.onmouseup = mouseRelease;
  
  // general keyboard events (shortcut keys, etc.)
  document.onkeypress = keypress;
});

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// MOUSE EVENTS ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/********************************* MOUSE DOWN *********************************\
| 
\******************************************************************************/
/********************************** MOUSE UP **********************************\
|
\******************************************************************************/
/********************************* MOUSE MOVE *********************************\
| The mouse move function is only used for drawing 
\******************************************************************************/


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
  return (xCoord%50)+50;
  //return defaultCellWidth;
}
function getCellHeight(yCoord) {
  return (yCoord%10)+15;
  //return defaultCellHeight;
}

function getCellOffsetLeft (xCoord, leftScreenOffset) {
  
}
function getCellOffsetTop ( yCoord, topScreenOffset) {
  
}
  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////////// SCROLL BAR API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**************************** GET SCROLL X POSITION ***************************\
| reading the scroll bar this returns the leftmost cell position
\******************************************************************************/
function getScrollXCell () {  
  var scollX = 0;
  return ~~(scrollX / defaultCellWidth)+1;
}

/**************************** GET SCROLL Y POSITION ***************************\
| reading the scroll bar this returns the topmost cell position
\******************************************************************************/
function getScrollYCell () {
  var scrollY = 0;
  return ~~(scrollY / defaultCellHeight)+1; 
}

/******************************* TO LETTER LABEL ******************************\
| This converts a number (starting at 1) to a letter or multi letter           |
| representation that can be used as an ID                                     |
\******************************************************************************/
function toLetterLabel(number) {
  return String.fromCharCode(64+number);
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

  // Draw the border Lines
  context.moveTo(0.5,0);
  context.lineTo(0.5,c_canvas.height);
  context.moveTo(0, 0.5);
  context.lineTo(c_canvas.width,0.5);
  
  // Draw the first two grid lines for the cell labels
  context.moveTo(labelCellWidth+0.5,0);
  context.lineTo(labelCellWidth+0.5,c_canvas.height);
  context.moveTo(0, labelCellHeight+0.5);
  context.lineTo(c_canvas.width,labelCellHeight+0.5);
  
  context.font = "12px sans-serif";
  
  //Draw the other Grid lines
  //Vvertical lines
  var integerx = getScrollXCell();
  var currentWidth = labelCellWidth+0.5;
  while (currentWidth < c_canvas.width) {
    currentWidth += getCellWidth(integerx);
    // draw vertical line
    context.moveTo(currentWidth,0);
    context.lineTo(currentWidth,c_canvas.height);   
    //draw column label
    var columnLabel = toLetterLabel(integerx);
    var labelWidth = context.measureText(columnLabel).width;
    var xPosition = currentWidth-((getCellWidth(integerx)+labelWidth)/2)
    var yPosition = 14;
    context.fillText(columnLabel,xPosition,yPosition);
    integerx+=1;
  }
  
  // Horizontal Lines
  var integery = getScrollYCell();
  var currentHeight = labelCellHeight+0.5;
  while (currentHeight < c_canvas.height) {
    currentHeight += getCellHeight(integery);
    
    //draw horizontal Line
    context.moveTo(0,currentHeight);
    context.lineTo(c_canvas.width,currentHeight);
    
    //draw Row Label
    var assumedTextHeight = 10;
    var rowLabel = integery;
    var labelWidth = context.measureText(rowLabel).width;
    var xPosition = (labelCellWidth - labelWidth)/2;
    var yPosition = currentHeight-(getCellHeight(integery)/2)+(assumedTextHeight/2);
    context.fillText(rowLabel,xPosition,yPosition);
    
    integery += 1;
  }

  // Write the changes to the screen
  context.strokeStyle = "#ddd";
  context.stroke();
  
  // draw all the text
  for (var i in data) {
	  coordPair = i.split(',');
	  x_pos=parseInt(coordPair[0]);
	  y_pos=parseInt(coordPair[1]);
	  
	  
	  var leftTextOffset = getCellOffsetLeft(x_pos,getScrollXCell()) + 3;
	  var topTextOffset  = getcellOffsetTop (y_pos,getScrollYCell()) + 14;
	  
	  // if the text box is not on the screen, skip it
	  if (leftTextOffset < 0 || leftTextOffset > c_canvas.width || topTextOffset < 0 || topTextOffset > c_canvas.height) continue;
	  
	  if (data[i][0]=='=') {
	    // if the cell needs to be evaluated
      context.fillText(eparse(data[i].substring(1,data[i].length)), leftTextOffset ,topTextOffset);
    }
    else {
      // if the cell does not need to be evaluated
      context.fillText(data[i],leftTextOffset ,topTextOffset);
    }
  }
}
