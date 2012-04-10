// code written by Asher Glick, dont fuck with it



  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// INITILIZATION ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

var data = new Array(); // the array that will store the values for the spreadsheet

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
