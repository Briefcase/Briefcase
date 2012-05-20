
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
  
  context.fillStyle = "rgb(250,255,250)";
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
    var small = startSelectionX;
    var big = endSelectionX;
    if (small > big) {small = endSelectionX;big = startSelectionX;}
    minx = getCellOffsetLeft(small);
    maxx = getCellOffsetLeft(big)  + getCellWidth(big);
  }
  
  if (endSelectionY < 0) {
    miny = labelCellHeight;
    maxy = c_canvas.height;
  }
  else {
    var small = startSelectionY;
    var big = endSelectionY;
    if (small > big) {small = endSelectionY; big = startSelectionY;};
    miny = getCellOffsetTop(small);
    maxy = getCellOffsetTop(big) + getCellHeight(big);
  }
  
  context.fillRect (minx,miny, maxx-minx, maxy-miny);
  
  // hilight active cell
  context.fillStyle = "rgb(190,190,190)";
  context.fillRect (minx,0,maxx-minx,labelCellHeight);
  context.fillRect (0,miny,labelCellWidth,maxy-miny);
  
  
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
  
  // draw border around muliple selected cells
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
