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
  for (var i = 0; i < 100; i ++) {
    for (var j = 1; j < 5; j++) {
      data[j+","+i] = j+","+i;
    }
  }
  
  
  // size the window correctly
  resizeWindow();
  window.onresize = resizeWindow;
  
  // mouse events
  document.onmousedown = mousePress;
  document.getElementById('framecontain').onmouseup = mouseRelease;
  
  // general keyboard events (shortcut keys, etc.)
  //document.onkeypress = keypress;
  
  
  // scrolling 
  document.getElementById("scrollbar").onscroll = resizeWindow;
});
  


function moveInputBox (xcell,ycell) {
  var pixelx = getCellOffsetLeft(xcell,getScrollXCell());
  var pixely = getCellOffsetTop(ycell,getScrollYCell());
  var menuHeight = document.getElementById("framecontain").offsetTop;
  document.getElementById("datain").style.top  = pixely+menuHeight+"px";
  document.getElementById("datain").style.left = pixelx+"px";
}
function setInputBoxValue(value) {
  if (value == undefined) value = "";
  document.getElementById("inputbox").value = value;
}
function focusInputBox() {
  document.getElementById("inputbox").focus();
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// MOUSE EVENTS ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/********************************* MOUSE DOWN *********************************\
| 
\******************************************************************************/
function mousePress (event) {
  // nothing yet
  
}
/********************************** MOUSE UP **********************************\
|
\******************************************************************************/
function mouseRelease (event) {
  // nothing yet
  // for now assume a non drag
  var menuHeight = document.getElementById("framecontain").offsetTop;
  var celly = findCellFromY(event.pageY-menuHeight);
  var cellx = findCellFromX(event.pageX);
  if (celly < 1 || cellx < 1) return;
  setInputBoxValue(data[cellx+','+celly]);
  moveInputBox(cellx,celly);  
  focusInputBox();
}
/********************************* MOUSE MOVE *********************************\
| The mouse move function is only used for dragging 
\******************************************************************************/


/****************************** FIND CELL FROM Y ******************************\
| 
\******************************************************************************/
function findCellFromY (pixelY) {
  var offset = labelCellHeight;
  var cellCount = getScrollYCell();
  while (offset < pixelY) {
    offset+= getCellHeight(cellCount);
    if (offset >= pixelY) break;
    cellCount += 1;
  }
  return cellCount;
}
/****************************** FIND CELL FROM X ******************************\
|
\******************************************************************************/
function findCellFromX (pixelX) {
  var offset = labelCellWidth;
  var cellCount = getScrollXCell();
  while (offset < pixelX) {
    offset += getCellWidth(cellCount);
    if (offset >= pixelX) break;
    cellCount += 1;
  }
  return cellCount;
}

  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////// INTERFACE RESIZING /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/******************************** RESIZE WINDOW *******************************\
|
\******************************************************************************/
function resizeWindow () {
  // do all of the resizeing functions here
  //alert("resize");
  redrawFrame();
}
  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// CELL SIZE API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
function getCellWidth(xCoord) {
  //return (xCoord%50)+100;
  return defaultCellWidth;
}
function getCellHeight(yCoord) {
  //return (yCoord%10)+15;
  return defaultCellHeight;
}

function getCellOffsetLeft (xCoord, leftScreenOffset) {
  if (leftScreenOffset > xCoord) return -100;
  var offset = labelCellWidth;
  for (var i = leftScreenOffset; i < xCoord; i++) {
    offset += getCellWidth(i);
  }
  return offset;
}
/***************************** GET CELL OFFSET TOP ****************************\
| Get the number of pixels from the top that the current cell is at            |
\******************************************************************************/
function getCellOffsetTop ( yCoord, topScreenOffset) {
  if (topScreenOffset > yCoord) return -100;
  var offset = labelCellHeight;
  for (var i = topScreenOffset; i < yCoord; i++) {
    offset += getCellHeight(i);
  }
  return offset;
}
  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////////// SCROLL BAR API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**************************** GET SCROLL X POSITION ***************************\
| reading the scroll bar this returns the leftmost cell position
\******************************************************************************/
function getScrollXCell () {  
  var scrollX = document.getElementById("scrollbar").scrollLeft;
  return ~~(scrollX / defaultCellWidth)+1;
}

/**************************** GET SCROLL Y POSITION ***************************\
| reading the scroll bar this returns the topmost cell position
\******************************************************************************/
function getScrollYCell () {
  var scrollY = document.getElementById("scrollbar").scrollTop;
  return ~~(scrollY / defaultCellHeight)+1; 
}

/******************************* TO LETTER LABEL ******************************\
| This converts a number (starting at 1) to a letter or multi letter           |
| representation that can be used as an ID, if the number is greater then 26   |
| (Z) then multiple letters are use (AA, AB, AC, etc)                          |
\******************************************************************************/
function toLetterLabel(number) {
  number= number - 1;
  var output = "";
  while (number >= 26) {
    output = String.fromCharCode(65+number%26) + output;
    number = (number-+number%26) / 26 -1;
  }
  output = String.fromCharCode(65+number%26) + output;
  return output;
}

/******************************** REDRAW FRAME ********************************\
| This function redraws the entire frame, it is a very usefull function and    |
| will soon be the only function that does any drawing at all, this way we     |
| we wont get any errors with visualizations                                   |
\******************************************************************************/
function redrawFrame() {
  // get the application
  var c_canvas = document.getElementById("application");

  // get the height offset of the application window / the height of the menu bar
  var menuHeight = document.getElementById("applicationDiv").offsetTop;

  document.getElementById("framecontain").style.height = window.innerHeight - menuHeight + "px";
  document.getElementById("framecontain").style.width = window.innerWidth + "px";
  
  document.getElementById("scrollbar").style.height = window.innerHeight - menuHeight + "px";  
  
  document.getElementById("scrollsize").style.height = document.getElementById("scrollbar").offsetHeight * 2+ "px";
  document.getElementById("scrollsize").style.width  = document.getElementById("scrollbar").offsetWidth  * 2 + "px";
  
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
  //Vertical lines
  var integerx = getScrollXCell();
  var currentWidth = labelCellWidth+0.5;
  while (currentWidth < c_canvas.width) {
    currentWidth += getCellWidth(integerx);
    // draw vertical line
    context.moveTo(currentWidth,0);
    context.lineTo(currentWidth,c_canvas.height);   
    //draw column label
    var columnLabel =   toLetterLabel(integerx);
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
  
  
  for (var x = getScrollXCell(); x < integerx; x++) {
    for (var y = getScrollYCell(); y < integery; y++) {
      
      var leftTextOffset = getCellOffsetLeft(x,getScrollXCell()) + 3;
	    var topTextOffset  = getCellOffsetTop (y,getScrollYCell()) + 14;
      
      var cellValue = data[x+','+y];
      
      if (cellValue == undefined) continue;
      
      if (cellValue[0]=='=') {
	      // if the cell needs to be evaluated
        context.fillText(eparse(cellValue.substring(1,cellValue.length)), leftTextOffset ,topTextOffset);
      }
      else {
        // if the cell does not need to be evaluated
        context.fillText(cellValue,leftTextOffset ,topTextOffset);
      }
    }
  }
  
  // CRAP CODE
  // draw all the text, this may need to be redone as well, as a gird search instead of a hash search, to prevcent all data from being red
  /*for (var i in data) {
	  coordPair = i.split(',');
	  x_pos=parseInt(coordPair[0]);
	  y_pos=parseInt(coordPair[1]);
	  
	  //ignore things that are off the screen
    if (x_pos > integerx) continue;
    if (y_pos > integery) continue;	  
	  
	  // get the offset
	  var leftTextOffset = getCellOffsetLeft(x_pos,getScrollXCell()) + 3;
	  var topTextOffset  = getCellOffsetTop (y_pos,getScrollYCell()) + 14;
	  
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
  }*/
}
