/******************************************************************************\
|                                     ,,                                       |
|                    db             `7MM                                       |
|                   ;MM:              MM                                       |
|                  ,V^MM.    ,pP"Ybd  MMpMMMb.  .gP"Ya `7Mb,od8                |
|                 ,M  `MM    8I   `"  MM    MM ,M'   Yb  MM' "'                |
|                 AbmmmqMA   `YMMMa.  MM    MM 8M""""""  MM                    |
|                A'     VML  L.   I8  MM    MM YM.    ,  MM                    |
|              .AMA.   .AMMA.M9mmmP'.JMML  JMML.`Mbmmd'.JMML.                  |
|                                                                              |
|                                                                              |
|                                ,,    ,,                                      |
|                     .g8"""bgd `7MM    db        `7MM                         |
|                   .dP'     `M   MM                MM                         |
|                   dM'       `   MM  `7MM  ,p6"bo  MM  ,MP'                   |
|                   MM            MM    MM 6M'  OO  MM ;Y                      |
|                   MM.    `7MMF' MM    MM 8M       MM;Mm                      |
|                   `Mb.     MM   MM    MM YM.    , MM `Mb.                    |
|                     `"bmmmdPY .JMML..JMML.YMbmd'.JMML. YA.                   |
|                                                                              |
\******************************************************************************/

// the data contained within the cell
var data = new Array();
// predefined sizes for cells (soon to be arrays or something similar)
var cellHeight = 18;
var cellWidth = 110;
// maintain cell offsets for scroling
var offsetx = 1;
var offsety = 1;
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


/******************************** MOVE TEXT BOX *******************************\
| This function will take in a cell number in the x position and a cell number |
| in the y postion and will move and resise the text box accordingly           |
\******************************************************************************/
function moveTextBox (xpos, ypos) {
  document.getElementById("datain").style.top = ypos + document.getElementById("application").offsetTop - document.getElementById("framecontain").scrollTop + 'px';
  document.getElementById("datain").style.left = (xpos - 2.5) - document.getElementById("framecontain").scrollLeft + 'px';
}
/********************************* ON KEYPRESS ********************************\
| This function is the keypress handler, it handles every keypress made, then  |
| splits them up and reacts differently depending on which key was pressed     |
\******************************************************************************/
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
    setTimeout("document.getElementById('inputbox').focus();",0);
  }
  // sync the input box and the function box on keypress
  setTimeout("delaySync()",0);
  
}
// Gaa, this feels so hackish makeing it delay for 0 before syncing, but it works
/********************************* DELAY SYNC *********************************\
| This funtion syncs the text box and the function box so that they display    |
| the same thing, it is called after every keypress using setTimeout() with a  |
| timeout of 0. This method feels very hackish but I have not found a better   |
| way to sync the boxes the moment after the key is pressed instead of right   |
| when the key is pressed                                                      |
\******************************************************************************/
function delaySync(){
  // Sync Function box and text box
  if (functionfocus) {
    document.getElementById("inputbox").value = document.getElementById("functionbox").value;
  }
  else if (textfocus) {
    document.getElementById("functionbox").value = document.getElementById("inputbox").value;
  }
}
/******************************** MOUSE DETECT ********************************\
|////////////////////////////// TO BE DEPRECATED //////////////////////////////|
| The mouse detect function is used to detect which cell the mouse is          |
| currently over. It is called whenever the mouse is moved. I know for sure    |
| that this is not the best way to keep track of the mouse position however at |
| this point when all the cells are the same size it is not too much of a cost |
| to pay for simplicity                                                        |
\******************************************************************************/
function mouseDetect(e) {
  var x;
  var y;
  if (e.pageX || e.pageY) { 
    x = e.pageX + document.getElementById("framecontain").scrollLeft;
    y = e.pageY + document.getElementById("framecontain").scrollTop;
  }
  else { 
    x = e.clientX + document.getElementById("framecontain").scrollLeft + document.body.scrollLeft + document.documentElement.scrollLeft; 
    y = e.clientY + document.getElementById("framecontain").scrollTop + document.body.scrollTop + document.documentElement.scrollTop; 
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
/******************************** CLICK HANDLER *******************************\
| The click handler function is run whenever the mouse is clicked (onclick)    |
| It handles moving the text box and writing the value of the previoss cell to |
| the hash table and to the canvas element                                     |
\******************************************************************************/
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

  document.getElementById("framecontain").style.height = window.innerHeight - 30 + "px";
  document.getElementById("framecontain").style.width = window.innerWidth + "px";
  
  c_canvas.height = window.innerHeight*2;
  c_canvas.width = window.innerWidth*2;


  var context = c_canvas.getContext("2d");


  // draw the grid lines
  for (var x = 0.5; x < c_canvas.width; x += cellWidth) {
    context.moveTo(x,0);
    context.lineTo(x,c_canvas.height);
  }
  for (var y = 0.5; y < c_canvas.height; y += cellHeight) {
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
  // draw the row lables
  for (var i = 0; i < c_canvas.height/cellHeight; i++) {
    //context.fillText(i,
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

function appScroll() {
  moveTextBox((lastx*cellWidth),(lasty*cellHeight)-2.5);
  document.getElementById("application").style.left = document.getElementById("framecontain").scrollLeft + 'px';
}

window.onload = function () {    
  redrawFrame(); // draw the frame
  window.onresize = redrawFrame; // redraw the frame on resize
  document.onmousedown = blockordrag; // be able to handle click and drag
  document.onmouseup = clickHandler; // detect if it is a click or a drag
  document.onmousemove = mouseDetect; // easy way to maintain mouse position
  document.onkeypress = keypress; // keyboard shortcuts
  document.getElementById("framecontain").onscroll = appScroll;
  moveTextBox(-100,-100);
}
