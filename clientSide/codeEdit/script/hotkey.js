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

// This is a modification of the LDT Text hilighter. A slightly heavier program
// with more useful features like indentation and automatic indentation

// After the v3 overhaul it will also contain methods for hilighting the line
// you are on as well as line numbers


/*********************************** ONLOAD ***********************************\
|
\******************************************************************************/
window.onload = function () {
  document.onkeydown = keypress;
  
  var code = document.getElementById("codeDoc").innerHTML="#include &lt;iostream&gt;\nusing namespace std;\nint main() {\n\tcout << \"Hello World\" << endl;\n}";
  
  // Get the text input box and the coloured output box
  var textInput = document.getElementById("codeDoc");
  var textOutput = document.getElementById("displayDoc");
  
  // Start the decorator
	decorator = new TextareaDecorator(textOutput, textInput, parser );
}

var column = 0;
var line = 0;
var undoStack;



  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////////// USER EVENTS ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/********************************* ON KEYPRESS ********************************\
| this checks when a key is pressed, the two keys monitored right now are tab  |
| and enter because their behavior needs to be altered                         |
\******************************************************************************/
function keypress(e) {
  if (e.keyCode == 13) {
    // Prevent the default actions of the enter key
    if (e.preventDefault) { e.preventDefault(); }

    // Set the newline character
    newline();
  }
  else if (e.keyCode == 9) {
    // Prevent the default action of the Tab key
    if (e.preventDefault) {
      e.preventDefault();
    }
    insertTextAtCursor("	");
    insertTextAtCursor("");
  }
  else if (e.keyCode  == 38) {
    // up arrow
  }
  else if (e.keyCode == 40) {
    //down arrow
  }
  
  //TODO//
  // the removeBrTags should be more optimized and not run on every keypress
  // but it should be run before the text hilighter run, that way it will
  // capture all the object. This will be retured to after the new method
  // of line input is complete
  removeBrTags();
}


/****************************** REMOVE BREAK TAGS *****************************\
|
\******************************************************************************/
function removeBrTags() {
  var inputText = document.getElementById("codeDoc");
  var children = inputText.childNodes;
  var textChildren = "";
  for (var i = 0; i < children.length; i++) {
    if (children[i] == "[object HTMLBRElement]") {
      inputText.replaceChild(document.createTextNode("\n"), children[i]);
    }
  }
  
  //beginning work with divs (bad code because of the newline split
  fillExtendedTextInDivs();
}

function fillExtendedTextInDivs() {
  var inputbox = document.getElementById("codeDoc");
  var children = inputbox.childNodes;
  for (var i = 0; i < children.length; i++) {
    if (children[i] != "[object HTMLDivElement]") {
      for (i++; i < children.length; i++) {
        if (children[i] == "[object HTMLDivElement]") {
          
        }
      }
      break;
    }
  }
}


/**************************** INSERT TEXT AT CURSOR ***************************\
|
\******************************************************************************/
function insertTextAtCursor(text) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            var tempRange = document.createTextNode(text);
        
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( tempRange );
            range.setStart(tempRange,text.length);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}


/****************************** CREATE A NEW LINE *****************************\
|
\******************************************************************************/
function newline () {
	var space = findLastNewline();
  insertTextAtCursor("\n");
  insertTextAtCursor(space);// used to move the cursor to the next line
  
  
}

/****************************** FIND LAST NEWLINE *****************************\
|
\******************************************************************************/
function findLastNewline() {
	var currentchar = "";
	var sel = window.getSelection();
	var range = sel.getRangeAt(0);
	var currentTextNode = range.startContainer;
	var currentIndex = range.startOffset-1;
	
	var whiteSpaceReturn = "";
		
	//make sure that the selected element is a valid text element
	var parent = document.getElementById("codeDoc");
	if (currentTextNode == parent) {
	  currentTextNode = parent.childNodes[currentIndex];
	  if (currentTextNode == null) return ""; // corner case, if there are no elements
	  currentIndex = currentTextNode.nodeValue.length-1; 
	}
		
	//if the node is empty traverse to the previous node
	while (currentIndex == -1) {
		//alert("reached the end of the node:"+currentTextNode.nodeValue);
		currentTextNode = currentTextNode.previousSibling;
		if (currentTextNode == null) return "";
		currentIndex = currentTextNode.nodeValue.length-1;
	} 

	while (currentTextNode.nodeValue[currentIndex] != '\n') {
		if (currentTextNode.nodeValue[currentIndex] == ' ' || currentTextNode.nodeValue[currentIndex] == '	') {
		  whiteSpaceReturn = currentTextNode.nodeValue[currentIndex] + whiteSpaceReturn;
		}
		else {
		  whiteSpaceReturn = "";
		}
		currentIndex--;
		
		//traverse to the previous node while the node is empty
		while (currentIndex == -1) {
		  //alert("reached the end of the node:"+currentTextNode.nodeValue);
		  currentTextNode = currentTextNode.previousSibling;
		  //alert("!"+currentTextNode);
		  if (currentTextNode == null) return "";
		  currentIndex = currentTextNode.nodeValue.length-1;
		}
	}
	//alert(":" + whiteSpaceReturn + ":");
	return whiteSpaceReturn;
}
