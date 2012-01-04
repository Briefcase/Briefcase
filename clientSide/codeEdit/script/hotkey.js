window.onload = function () {
  document.onkeypress = keypress;
}

var column = 0;
var line = 0;



function keypress(e) {
  if (e.keyCode == 13) {
    // enter
    // find number of spaces
    var code = document.getElementById("codeDoc").innerHTML;
    var lines = code.split('\n');
    //alert('enter');
  }
  if (e.keyCode == 9) {
    // TAB
    if (e.preventDefault) {
      e.preventDefault();
    }
    printBeforeCursor("  ");
  }
  
  // update position
  // run text hilighter
  
  
  setTimeout("getCursorPos()",0);
}

function printBeforeCursor(text) {
  
}


function getCursorPosition () {
  var selObj = window.getSelection();
  column = selObj.anchorOffset;
  
  displayLineInfo();
  
  var range = document.createRange();
  
  var startNode = document.getElementById("codeDoc");
  var startOffset = 0;
  range.setStart(startNode,startOffset);
  
  var endNode = selObj;
  var endOffset = 0;
  range.setEnd(endNode,endOffset);
}

function displayLineInfo() {
  document.getElementById('footerinfo').innerHTML = "Column: "+column+" Line: "+line;
}

















/******************************** SANITY PARSE ********************************\
| This function goes through and parses the code doing all the important thigs |
| like code hilighing and deomination managing (\n vs <br> and &nbsp; vs " "   |
| as well as moving the cursor position when nessassary                        |
\******************************************************************************/
function sanityParse (){
  var savespot;
  var saveoffset;
  if (window.getSelection) {
    var sel = window.getSelection();
    savespot = sel.anchorNode;
    saveoffset = sel.anchorOffset;
    
    //alert(sel.anchorOffset);
    
    
    
    
    
  }
  /*else if (document.selection) {
    var textRange = document.body.createTextRange();
    textRange.moveToElementText(element);
    textRange.select();
  }*/




  // GET THE DOCUMENT IN QUESTION
  var nodes = codeChildren();
  var sampleNode = nodes[0];
  //alert(sampleNode == nodes[0]);
  for (var i = 0; i < nodes.length; i++) {
    //alert(nodes[i]);
    if (nodes[i].toString() != "[object Text]") continue;
    // RUN THROUGH THE REPLACEMENTS
    //alert ("node");
    while (nodes[i].nodeValue.indexOf("\n") != -1) {
      //alert("found newline");
      var tempv = nodes[i].nodeValue;
      var second = tempv.substring(tempv.indexOf("\n")+1,tempv.length);
      tempv = tempv.substring(0,tempv.indexOf("\n"));
      nodes[i].nodeValue = tempv;
      // create a new break element
      var newBR = document.createElement('br');
      // Create a new text node filled with the remainder of the text
      var newTXT = document.createTextNode(second);
      
      // set the new text element equal to the remainder of the string
      nodes[i].parentNode.appendChild(newBR);
      nodes[i].parentNode.appendChild(newTXT);
      
      //alert(nodes);
    }
    nodes[i].nodeValue = nodes[i].nodeValue.replace("&nbsp;"," ");
  }

  
  // set the cursor position after all the effort
  if (window.getSelection) {
    var sel = window.getSelection();
    var range = document.createRange();
    
    range.setStart(savespot,saveoffset);
    range.collapse(true);
    
    sel.removeAllRanges();  
    sel.addRange(range);
    
  }
  
}

/******************************** CODECHILDREN ********************************\
| 
\******************************************************************************/
function codeChildren () {
  return document.getElementById("codeDoc").childNodes;
}
function focusCode() {
  document.getElementById("codeDoc").focus();
}

/***************************** GET CURSOR POSITION ****************************\
| the cursor position (via column and line) are obtained and set to the line   |
| and collumn variables                                                        |
\******************************************************************************/
function getCursorPos() {
  sanityParse();
  var cursorPos;
  if (window.getSelection) {
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    column = selObj.anchorOffset;
    line =  findNode(selObj.anchorNode.parentNode.childNodes, selObj.anchorNode) / 2 + 1;
    displayLineInfo();
  }
}

function findNode(list, node) {
  var retval = -1;
  var nodes = "";
  var lines = 0;
  for (var i = 0; i < list.length; i++) {
    
    //alert(list[i].toString());
    
    var nodename = list[i].toString();
    nodes += nodename;
    if (nodename == "[object Text]") {
      nodename = list[i].nodeValue;
      if (i == 2) {
        //list[i].style.color="#FF0000";
      }
      //nodename= "<br />" + showchildren(list[i],2);
    }
    else if (nodename == "[object HTMLPreElement]") {
      nodename= "<br />" + showchildren(list[i],2);
    }
    else {
      nodename = "";
    }
    if (list[i] == node) {
      retval = i;
      nodes+="*";
    }
    nodes += nodename;
    nodes += '<br />';
  }
  document.getElementById("extrainfo").innerHTML = nodes;
  return retval;
}

function showchildren (parent, indent) {
  var list = parent.childNodes;
  var output = "";
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < indent; j++) {
      output += "&nbsp;";
    }
    output+=list[i].toString();
    if (column == i) {
      output+="*";
    }
    output+="<br />";
  }
  return output;
}



