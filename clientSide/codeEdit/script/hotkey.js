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
/******************************************************************************\
| Copyright (c) 2012, Asher Glick                                              |
| All rights reserved.                                                         |
|                                                                              |
| Redistribution and use in source and binary forms, with or without           |
| modification, are permitted provided that the following conditions are met:  |
|                                                                              |
| * Redistributions of source code must retain the above copyright notice,     |
|   this list of conditions and the following disclaimer.                      |
| * Redistributions in binary form must reproduce the above copyright notice,  |
|   this list of conditions and the following disclaimer in the documentation  |
|   and/or other materials provided with the distribution.                     |
|                                                                              |
| THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"  |
| AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE    |
| IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE   |
| ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE    |
| LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR          |
| CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF         |
| SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS     |
| INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN      |
| CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)      |
| ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE   |
| POSSIBILITY OF SUCH DAMAGE.                                                  |
\******************************************************************************/

window.onload = function () {
  document.onkeypress = keypress;
  document.onclick = mouseclick;
  
  
  var code = document.getElementById("codeDoc").innerHTML="#define hello \" world\"\n#include &lt;iostream&gt;\nint main() {\n  cout << \"hello\" << hello << endl;\n\nwtf?\n }"
  backgroundFormat ();
}

var column = 0;
var line = 0;
  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////// USER EVENTS ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/********************************* ON KEYPRESS ********************************\
| this checks when a key is pressed, the two keys monitored right now are tab  |
| and enter because their behavior needs to be altered                         |
\******************************************************************************/
function keypress(e) {
  if (e.keyCode == 13) {
    // enter
    if (e.preventDefault) {
      e.preventDefault();
    }
    // find number of spaces
    newline();
    //printBeforeCursor("JJ");
    //setTimeout("getCursorPos()",0);
  }
  else if (e.keyCode == 9) {
    // TAB
    if (e.preventDefault) {
      e.preventDefault();
    }
    printBeforeCursor("  ");
    //alert("Tabbed");
    setTimeout("getCursorPos()",0);
  }
  
  // update position
  // run text hilighter
  
  else {
    setTimeout("getCursorPos()",0);
  }
}
/******************************* ON MOUSE CLICK *******************************\
| this funciton checks to see if the mouse click was on the code document, if  |
| it was then it runs the text box code                                        |
\******************************************************************************/
function mouseclick(e) {

  // if (the cursor is in the text box)
    setTimeout("getCursorPos()",0);
}

/*********************************** NEWLINE **********************************\
| This function handles the creation of new lines in the code document         |
\******************************************************************************/
function newline() {	
  /*var line = getLineText()
  var whitespace = "";
  while (line[whitespace] == " "){
    whitespace+=" ";
  }
  whitespace+="";
  printBeforeCursor(whitespace);*/
  printBeforeCursor("\n");
}
/******************************** GET LINE TEXT *******************************\
| This gets the fill line of text of where the cursor currently is, from the   |
| last break to the next break (or begining and end of the files)      
\******************************************************************************/
function getLineText() {
  var containor;
  if (window.getSelection) {
    var sel = window.getSelection();
    containor = sel.anchorNode;
  }
  alert(containor.nodeValue);
  return containor.nodeValue;
}

/***************************** PRINT BEFORE CURSOR ****************************\
| this function prints a number of characters before the cursor
\******************************************************************************/
function printBeforeCursor(text) {
  var startcontainor;
  var endcontainor;
  var startoffset;
  var endoffset;
  
  if (window.getSelection) {
    // this works to get the begining point but no end point ( thing to fix )
    var sel = window.getSelection();
    savespot = sel.anchorNode;
    saveoffset = sel.anchorOffset;
    saverange = sel.getRangeAt(0);
    
    endoffset = saverange.endOffset;
    startoffset = saverange.startOffset;
    
    endcontainor = saverange.endContainer;
    startcontainor = saverange.startContainer;
  }
  //alert( saverange.endOffset + "," + saverange.startOffset );
  
  
  savespot.nodeValue = savespot.nodeValue.substring(0, saveoffset) + text + savespot.nodeValue.substring(saveoffset);
  
  startoffset += 2;
  endoffset += 2;
  
  
  
  if (window.getSelection) {
    var sel = window.getSelection();
    var range = document.createRange();
    
    range.setStart(startcontainor,startoffset);
    range.setEnd(endcontainor,endoffset);
    
    sel.removeAllRanges();  
    sel.addRange(range);
    
    
    
    /*var sel = window.getSelection();
    alert ( saverange.endOffset + "," + saverange.startOffset );
    sel.removeAllRanges();
    sel.addRange(saverange);*/
  }
  
}

/****************************** BACKGROUND FORMAT *****************************\
| this function runs through and makes sure that everything is formatted in    |
| same manner for, that way
\******************************************************************************/
function backgroundFormat (){
  var savespot;
  var saveoffset;
  
  var saveRange;

  // Save the current cursor anchor position in node-offset form
  if (window.getSelection) {
    
    // this works to get the begining point but no end point
    var sel = window.getSelection();
    savespot = sel.anchorNode;
    saveoffset = sel.anchorOffset;
    
    /*var sel = window.getSelection().getRangeAt(0);
    savespot = sel.startContainer;
    saveoffset = sel.startOffset;*/
  }
  // Dont return the curser to a break
  if (savespot == codeNode()) {
    savespot = codeChildren()[saveoffset];
    saveoffset = 0;
  }
  
  // GET THE DOCUMENT IN QUESTION
  var nodes = codeChildren();
  var sampleNode = nodes[0];
  var lastElement = "";
  for (var i = 0; i < nodes.length; i++) {
    // If the object is not a text object do not search it
    
    
    if (nodes[i].toString() == "[object HTMLBRElement]" && lastElement == "[object HTMLBRElement]") {
      var emptyText = document.createTextNode("");
      codeNode().insertBefore(emptyText, nodes[i]);
      i++;
    }
    
    //Clean up the extranious Text objects and make sure two are not in a row
    if (nodes[i].toString() == "[object Text]" && lastElement == "[object Text]") {
      nodes[i-1].nodeValue += nodes[i].nodeValue;
      codeNode().removeChild(nodes[i]);
      i-=2;
      lastElement = "";
      continue;
    }
    
    lastElement = nodes[i].toString();  
    
    if (nodes[i].toString() != "[object Text]") continue;
    
    // Split text objects on newlines seperated by a break
    while (nodes[i].nodeValue.indexOf("\n") != -1) {
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
    }
    
    // Replace non-breaking spaces with spaces
    nodes[i].nodeValue = nodes[i].nodeValue.replace("&nbsp;"," ");
  }



  // Dont return the curser to a break
  if (savespot.toString() == "[object HTMLBRElement]") {
    savespot = previousNode(savespot);
    saveoffset = savespot.length;
  }
  
  // Place the cursor once again
  if (window.getSelection) {
    var sel = window.getSelection();
    var range = document.createRange();
    
    range.setStart(savespot,saveoffset);
    range.collapse(true);
    
    sel.removeAllRanges();  
    sel.addRange(range);
    
  }
}

function nodeIndex(node) {
  var list = node.parentNode.childNodes;
  for (var i = 0; i < list.length; i++) {
    if (list[i] == node) {
      return i;
    }
  }
}
function previousNode(node) {
  return node.parentNode.childNodes[nodeIndex(node)-1];
}
/******************************** CODECHILDREN ********************************\
| A simple function to return the children of the <pre> that contains the code |
\******************************************************************************/
function codeChildren () {
  return document.getElementById("codeDoc").childNodes;
}
function codeNode() {
  return document.getElementById("codeDoc");
}
/********************************** FOCUSCODE *********************************\
| A simple function to bring focus to the code block
\******************************************************************************/
function focusCode() {
  document.getElementById("codeDoc").focus();
}
function getFullString(node) {
  if (node.toString() == "");
}
/***************************** GET CURSOR POSITION ****************************\
| the cursor position (via column and line) are obtained and set to the line   |
| and collumn variables                                                        |
\******************************************************************************/
function getCursorPos() {
  backgroundFormat();
  var cursorPos;
  if (window.getSelection) {
    var selObj = window.getSelection();
    var selRange = selObj.getRangeAt(0);
    column = selObj.anchorOffset;
    line =  findNode(selObj.anchorNode.parentNode.childNodes, selObj.anchorNode) / 2 + 1;
    ///displayLineInfo();
  }
}
/********************************** FIND NODE *********************************\
|----------------------------------DEPRECATION---------------------------------|
| does some stuff, needs to be revisited                                       |
\******************************************************************************/
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



