// code written by Asher Glick



  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// INITILIZATION ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var data = new Array(); // the array that will store the values for the spreadsheet

// Width and height for the labled cells
var labelCellHeight = 18;
var labelCellWidth = 40;
// Cell width and height
var defaultCellHeight = 20;
var dynamicCellHeight = new Array();
var defaultCellWidth  = 110;
var dynamicCellWidth  = new Array();

//currently selected cells
var startSelectionX = 1;
var startSelectionY = 1;

var endSelectionX = 0;
var endSelectionY = 0;

// When using tab remember which column you started at when you hit enter
var tabReturnColumn = -1;

// function focus or bar focus, can focus be determined from the object, or can we use oninput instead of a time delay to sync the two bars (i think oninput will work)


/************************** INITILIZE EVENT FUNCTIONS *************************\
|
\******************************************************************************/
$(document).ready( function () {
  
  // size the window correctly
  resizeWindow();
  window.onresize = resizeWindow;
  
  // mouse events
  document.onmousedown = mousePress;
  document.getElementById('framecontain').onmouseup = mouseRelease;
  
  // general keyboard events (shortcut keys, etc.)
  document.onkeypress = keypress;
  
  
  // scrolling 
  document.getElementById("scrollbar").onscroll = resizeWindow;
  
  //init input box
  moveInputBox(1,1);
  setInputBoxValue(data["1,1"]);
  
  document.getElementById("inputbox").onfocus = function () {this.focused = true; inputBoxOnFocus();};
  document.getElementById("inputbox").onblur = function () {this.focused = false;};
  document.getElementById("inputbox").focused = false;
});
  

function keypress (event) {
  if (document.getElementById("inputbox").focused == false) {
    if (event.which == 8) {
      data[startSelectionX + ',' + startSelectionY] = "";
      document.getElementById("inputbox").value = "";
    }
    else {
      // TODO some more params to make sure ctrl and alt, etc are not pressed
      // or that if they are the event is carried through 
      focusInputBox();
      document.getElementById("inputbox").value = String.fromCharCode(event.charCode);
      //simulatekeypress(event.which);
    }
  }
}
function simulatekeypress(charCode) {
  var evt = document.createEvent("KeyboardEvent");
  evt.initKeyEvent ("keypress", true, true, window,
                    0, 0, 0, 0,
                    0, charCode) 
  var canceled = !document.getElementById("inputbox").dispatchEvent(evt);
  
  if(canceled) {
    // A handler called preventDefault
    //alert("canceled");
  } else {
    // None of the handlers called preventDefault
    //alert("not canceled");
  }
  //alert("simulated");
}


function moveInputBox (xcell,ycell) {
  var pixelx = getCellOffsetLeft(xcell,getScrollXCell());
  var pixely = getCellOffsetTop(ycell,getScrollYCell());
  var menuHeight = document.getElementById("framecontain").offsetTop;
  document.getElementById("datain").style.top  = pixely+menuHeight-0.5+"px";
  document.getElementById("datain").style.left = pixelx - 0.5 +"px";
  document.getElementById("datain").style.width = getCellWidth(xcell) - 2.5 + "px";
  document.getElementById("datain").style.height = getCellHeight(ycell) - 2.5 + "px";
  document.getElementById("datain").style.border = "2px solid green";
}
function setInputBoxValue(value) {
  if (value == undefined) value = "";
  document.getElementById("inputbox").value = value;
}

function focusInputBox() {
  document.getElementById("inputbox").focus();
}
function inputBoxOnFocus() {
  document.getElementById("inputCornerBox").style.display="none";
}
function blurInputBox() {
  document.getElementById("inputCornerBox").style.display="inline";
}


function syncFunctionBar() {
  document.getElementById("functionbox").value = document.getElementById("inputbox").value;
  data[startSelectionX + "," +startSelectionY] = document.getElementById("inputbox").value;
}
function syncInputBox() {
  document.getElementById("inputbox").value = document.getElementById("functionbox").value;
  data[startSelectionX+","+startSelectionY] = document.getElementById("functionbox").value;
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
  
  //TODO these need to be actual drag values, in comparison with the mousepress functions
  var dragx = cellx;
  var dragy = celly;
  
  
  if (celly < 1 || cellx < 1) {
    if (celly < 1) {
      celly = getScrollYCell();
      dragy = -1;
    }
    if (cellx < 1) {
      cellx = getScrollXCell();
      dragx = -1;
    }
  }
  
  // if the cell is allready selected
  if (celly == startSelectionY && cellx == startSelectionX && dragx == endSelectionX && dragy == endSelectionY) return;
  
  
  setInputBoxValue(data[cellx+','+celly]);
  moveInputBox(cellx,celly);
  blurInputBox();
  startSelectionX = cellx;
  startSelectionY = celly;
  
  endSelectionX = dragx;
  endSelectionY = dragy;
  
  redrawFrame();
}
/********************************* MOUSE MOVE *********************************\
| The mouse move function is only used for dragging 
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
  resizeFunctionBar();
}
/***************************** RESIZE FUNCTION BAR ****************************\
| This function resizes the function bar that is under the menu bar so that it |
| occupies the full length of the screen while not passing the edge of the     |
| screen to avoid scroll bars from being created                               |
\******************************************************************************/
function resizeFunctionBar() {
  var leftOffset = document.getElementById("functionbox").offsetLeft;
  var pageWidth = window.innerWidth;
  document.getElementById("functionbox").style.width = pageWidth - leftOffset + "px";
}
  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// CELL SIZE API ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/******************************* GET CELL WIDTH *******************************\
|
\******************************************************************************/
function getCellWidth(xCoord) {
  //return (xCoord%50)+100;
  return defaultCellWidth;
}
/******************************* GET CELL HEIGHT ******************************\
|
\******************************************************************************/
function getCellHeight(yCoord) {
  //return (yCoord%10)+15;
  if (yCoord == 10) return 2*defaultCellHeight;
  return defaultCellHeight;
}
  //////////////////////////////////////////////////////////////////////////////
 ////////////////////////////// CELL POSITION API /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/**************************** GET CELL OFFSET LEFT ****************************\
|
\******************************************************************************/
function getCellOffsetLeft (xCoord) {
  var leftScreenOffset = getScrollXCell();
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
function getCellOffsetTop (yCoord) {
  var topScreenOffset = getScrollYCell();
  if (topScreenOffset > yCoord) return -100;
  var offset = labelCellHeight;
  for (var i = topScreenOffset; i < yCoord; i++) {
    offset += getCellHeight(i);
  }
  return offset;
}
/****************************** FIND CELL FROM Y ******************************\
| 
\******************************************************************************/
function findCellFromY (pixelY) {
  var offset = labelCellHeight;
  var cellCount = getScrollYCell();
  if (offset > pixelY) return -1;
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
  if (offset > pixelX) return -1;
  while (offset < pixelX) {
    offset += getCellWidth(cellCount);
    if (offset >= pixelX) break;
    cellCount += 1;
  }
  return cellCount;
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
|------------------------------------------------------------------------------|
| This function may need to be re written (again) to provide a more coherient  |
| function, it is a bit confusing right now in my oppinion                     |
\******************************************************************************/
function redrawFrame() {
  // get the application
  var c_canvas = document.getElementById("application");

  // get the height offset of the application window / the height of the menu bar
  var menuHeight = document.getElementById("applicationDiv").offsetTop;

  document.getElementById("framecontain").style.height = window.innerHeight - menuHeight + "px";
  document.getElementById("framecontain").style.width = window.innerWidth + "px";
  
  document.getElementById("scrollbar").style.height = window.innerHeight - menuHeight - labelCellHeight + "px";  
  document.getElementById("scrollbar").style.width = window.innerWidth - labelCellWidth + "px";
  document.getElementById("scrollbar").style.left = labelCellWidth + "px";
  document.getElementById("scrollbar").style.top = labelCellHeight + menuHeight + "px";
  
  document.getElementById("scrollsize").style.height = document.getElementById("scrollbar").offsetHeight * 200+ "px";
  document.getElementById("scrollsize").style.width  = document.getElementById("scrollbar").offsetWidth  * 200 + "px";
  
  c_canvas.height = window.innerHeight;
  c_canvas.width = window.innerWidth;

  
  // get the context of the canvas so we can draw on it
  var context = c_canvas.getContext("2d");

  // draw the hilights color for the label cells
  context.fillStyle = "rgb(240,240,240)";  
  context.fillRect (0, 0, c_canvas.width,labelCellHeight);
  context.fillRect (0, 0, labelCellWidth,c_canvas.height);
 
  //draw the hilights for multiple selected cells
  
  context.fillStyle = "rgb(220,255,220)";
  //if (endSelectionX == -1) endSelectionX = startSelectionX;
  //if (endSelectionY == -1) endSelectionY = startSelectionY;
  
  
  var minx = 50;
  var maxx = 200;
  var miny = 50;
  var maxy = 200;
  
  
  if (endSelectionX < 0) {
    minx = labelCellWidth;
    maxx = c_canvas.width;
  }
  else {
    minx = getCellOffsetLeft(startSelectionX);
    maxx = minx + getCellWidth(startSelectionX);
  }
  
  if (endSelectionY < 0) {
    miny = labelCellHeight;
    maxy = c_canvas.height;
  }
  else {
    miny = getCellOffsetTop(startSelectionY);
    maxy = miny + getCellHeight(startSelectionY);
  }
  
  context.fillRect (minx,miny, maxx-minx, maxy-miny);
  
  
  
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
  context.fillStyle = "rgb(0,0,0)";
  //Draw the other Grid lines
  //Vertical lines
  var integerx = getScrollXCell();
  var currentWidth = labelCellWidth+0.5;
  while (currentWidth < c_canvas.width) {
    if (integerx == startSelectionX) {  
      // draw the hilights color for the active cell and column
      context.fillStyle = "rgb(190,190,190)";
      context.fillRect (currentWidth,0,getCellWidth(integerx), labelCellHeight);
      context.fillStyle = "rgb(0,0,0)";
    }
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
    if (integery == startSelectionY) {  
      // draw the hilights color for the active cell and column
      context.fillStyle = "rgb(190,190,190)";
      context.fillRect (0,currentHeight,labelCellWidth, getCellHeight(integery));
      context.fillStyle = "rgb(0,0,0)";
    }
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
  
  context.strokeStyle = "rgb(0,200,0)";
  context.strokeRect(minx+0.5,miny+0.5,maxx-minx,maxy-miny); 
  
  // write in all of the datapoints
  for (var x = getScrollXCell(); x < integerx; x++) {
    for (var y = getScrollYCell(); y < integery; y++) {
      
      var leftTextOffset = getCellOffsetLeft(x) + 3;
	    var topTextOffset  = getCellOffsetTop (y) + 14;
      
      var cellValue = data[x+','+y];
      
      if (cellValue == undefined) continue;
      
      //to remove overflow
      var nextCell = data[x+1+','+y];
      
      if (cellValue[0]=='=') {
	      // if the cell needs to be evaluated
	      if (nextCell == undefined) context.fillText(eparse(cellValue.substring(1,cellValue.length)), leftTextOffset ,topTextOffset);
        else context.fillText(eparse(cellValue.substring(1,cellValue.length)), leftTextOffset ,topTextOffset, getCellWidth(x));
      }
      else {
        // if the cell does not need to be evaluated
        if (nextCell == undefined) context.fillText(cellValue,leftTextOffset ,topTextOffset);
        else context.fillText(cellValue,leftTextOffset ,topTextOffset, getCellWidth(x));
      }
    }
  }
}
