
/******************************** REDRAW FRAME ********************************\
| This function redraws the entire frame, it is a very usefull function and    |
| will soon be the only function that does any drawing at all, this way we     |
| we wont get any errors with visualizations                                   |
|------------------------------------------------------------------------------|
| This function may need to be re written (again) to provide a more coherient  |
| function, it is a bit confusing right now in my oppinion                     |
\******************************************************************************/

var selectedLabelColor = "rgb(190,190,190)";
var unselectedLabelColor = "rgb(240,240,240)";
var selectedCellColor = "rgb(250,255,250)";
var selectedCellOutlineColor = "rgb(0,200,0)";
var scrollbarEdgeColor = "rgb(100,100,100)";
var textColor = "rgb(0,0,0)";
var lineColor = "rgb(224,224,224)";

var labelFont = "12px sans-serif";

function redrawFrame() {
  //////////////////////////////////////////////////////////////////////////////
  // Resizeing
  //////////////////////////////////////////////////////////////////////////////

  // get the application
  var c_canvas = document.getElementById("application");

  // get the height offset of the application window / the height of the menu bar
  var menuHeight = document.getElementById("framecontain").offsetTop;
  
  // get the height and width of scrollbars
  var scrollbarDimentions = getScrollBarDimentions();
  scrollbarWidth = scrollbarDimentions[0];
  scrollbarHeight = scrollbarDimentions[1];

  // set the height of the application
  var containingFrame = document.getElementById("applicationDiv");
  var applicationHeight = window.innerHeight - menuHeight + "px";
  var applicationWidth = window.innerWidth - scrollbarWidth + "px";
  containingFrame.style.height = applicationHeight;
  containingFrame.style.width = applicationWidth;
  
  document.getElementById("scrollbar").style.height = window.innerHeight - menuHeight - labelCellHeight + "px";  
  document.getElementById("scrollbar").style.width = window.innerWidth - labelCellWidth + "px";
  document.getElementById("scrollbar").style.left = labelCellWidth + "px";
  document.getElementById("scrollbar").style.top = labelCellHeight + "px";
  
  document.getElementById("scrollsize").style.height = document.getElementById("scrollbar").offsetHeight * 2+ "px";
  document.getElementById("scrollsize").style.width  = document.getElementById("scrollbar").offsetWidth  * 2 + "px";
  
  c_canvas.height = window.innerHeight-menuHeight;
  c_canvas.width = window.innerWidth;

  
  //////////////////////////////////////////////////////////////////////////////
  // Drawing
  //////////////////////////////////////////////////////////////////////////////
  
  
  // get the context of the canvas so we can draw on it
  var context = c_canvas.getContext("2d");

  // draw the hilights color for the label cells
  context.fillStyle = unselectedLabelColor;  
  context.fillRect (0, 0, c_canvas.width,labelCellHeight);
  context.fillRect (0, 0, labelCellWidth,c_canvas.height);
 
  // Draw the backgroundcolor for selected cells
  var minx, maxx, miny, maxy;
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
  
  context.fillStyle = selectedCellColor;
  context.fillRect (minx,miny, maxx-minx, maxy-miny);
  
  // Hilight Selected Cell Labels
  context.fillStyle = selectedLabelColor;
  context.fillRect (minx,0,maxx-minx,labelCellHeight);
  context.fillRect (0,miny,labelCellWidth,maxy-miny);
  
  // Draw the border grid lines Lines  
  context.moveTo(0.5,0);
  context.lineTo(0.5,c_canvas.height);
  context.moveTo(0, 0.5);
  context.lineTo(c_canvas.width,0.5);
  
  // Draw the first two grid lines for the cell labels
  context.moveTo(labelCellWidth+0.5,0);
  context.lineTo(labelCellWidth+0.5,c_canvas.height);
  context.moveTo(0, labelCellHeight+0.5);
  context.lineTo(c_canvas.width,labelCellHeight+0.5);
  
  // Set the font and color for the cell labels
  context.font = labelFont;
  context.fillStyle = textColor;
  
  // Draw all the other Vertical Lines and column labels
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
  
  // Draw all the other Horizontal lines and row labels
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

  // Write the grid lines to the screen
  context.strokeStyle = lineColor;
  context.stroke();
  
  // draw border around muliple selected cells
  context.strokeStyle = selectedCellOutlineColor;
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
      
      // Parse the cell briefly to see how it needs to be displayed
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
  
  // Draw boxes to show the scrollbars impact more (just astetics)
  context.fillStyle = scrollbarEdgeColor;
  context.fillRect (c_canvas.width-scrollbarWidth-0.5,0.5,scrollbarWidth+1,c_canvas.height);
  context.fillRect (0,c_canvas.height-scrollbarHeight-0.5,c_canvas.width,scrollbarHeight+1);
}
