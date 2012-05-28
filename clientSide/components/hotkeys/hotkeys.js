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
/******************************************************************************\
| The purpose of hotkey.js is to have a library that hotkeys can be bound to,  |
| where each hotkey combination is linked to a function. Multiple scripts will |
| be able to use it and not have to deal with overwriting each other's         |
| interrupt functions                                                          |
\******************************************************************************/
var _HOT_KEY_UP_LIST_ = new Array();
var _HOT_KEY_DOWN_LIST_ = new Array();

var regKeysReverse={48: "0",49: "1",50: "2",51: "3",52: "4",53: "5",54: "6",55: "7",56: "8",57: "9",59: ";",61: "=",65: "A",66: "B",67: "C",68: "D",69: "E",70: "F",71: "G",72: "H",73: "I",74: "J",75: "K",76: "L",77: "M",78: "N",79: "O",80: "P",81: "Q",82: "R",83: "S",84: "T",85: "U",86: "V",87: "W",88: "X",89: "Y",90: "Z"};
var regKeys={"0": 48,"1": 49,"2": 50,"3": 51,"4": 52,"5": 53,"6": 54,"7": 55,"8": 56,"9": 57,";": 59,"=": 61,"A": 65,"B": 66,"C": 67,"D": 68,"E": 69,"F": 70,"G": 71,"H": 72,"I": 73,"J": 74,"K": 75,"L": 76,"M": 77,"N": 78,"O": 79,"P": 80,"Q": 81,"R": 82,"S": 83,"T": 84,"U": 85,"V": 86,"W": 87,"X": 88,"Y": 89,"Z": 90};
var specialKeys={"Tab": 9,"Backspace": 8,"F1": 112,"F2": 113,"F3": 114,"F4": 115,"F5": 116,"F6": 117,"F7": 118,"F8": 119,"F9": 120,"F10": 121,"F11": 122,"F12": 123,"Enter": 13,"Esc": 27,"PrintScreen": 42,"ScrollLock": 145,"Pause": 19,"Insert": 45,"Delete": 46,"Home": 36,"End": 35,"PageUp": 33,"PageDown": 34,"CapsLock": 20,"Up": 38,"Down": 40,"Left": 37,"Right": 39,"`": 192,"-": 109,"[": 219,"]": 221,"\\": 220,"'": 222,",": 188,".": 190,"/": 191,"Space": 32};
var specialKeysReverse={9: "Tab",8: "Backspace",112: "F1",113: "F2",114: "F3",115: "F4",116: "F5",117: "F6",118: "F7",119: "F8",120: "F9",121: "F10",122: "F11",123: "F12",13: "Enter",27: "Esc",42: "PrintScreen",145: "ScrollLock",19: "Pause",45: "Insert",46: "Delete",36: "Home",35: "End",33: "PageUp",34: "PageDown",20: "CapsLock",38: "Up",40: "Down",37: "Left",39: "Right",192: "`",109: "-",219: "[",221: "]",220: "\\",222: "'",188: ",",190: ".",191: "/",32: "Space"};
var modKeysReverse = {16: "Shift",17: "Ctrl",18: "Alt",224: "Alt"};

//Key class for creating key objects
var KeyObject = function (value) {
  this.shiftKey = false;
  this.metaKey = false;
  this.altKey = false;
  this.ctrlKey = false;
  this.keyCode = 0;
  this.charCode = 0;
  this.string = function () {
    var output = "";
    var char;//= String.fromCharCode(this.keyCode)+"("+this.keyCode+")"; 
    char = regKeysReverse[this.keyCode];
    char = char==undefined?specialKeysReverse[this.keyCode]:char;
    char = char==undefined?(modKeysReverse[this.keyCode]==undefined?this.keyCode:""):char;
    if (this.shiftKey) {output += "Shift+";}
    if (this.ctrlKey) {output += "Ctrl+";}
    if (this.altKey) {output += "Alt+";}
    if (this.metaKey) {output += "Meta+";}
    output += char;
    return output;
  }
  
  // parse the input value
  if (typeof(value) == 'string') {
    alert("stringman!");
  }
  else if (value.toString() == '[object KeyboardEvent]') {
    this.charCode = value.charCode;
    this.keyCode = value.keyCode;
    this.altKey = value.altKey;
    this.ctrlKey = value.ctrlKey;
    this.shiftKey = value.shiftKey;
  }
  else {
    console.log("Error, " + value.toString() + " is not a valid keytype");
  }
}
// Shift + Ctrl + Alt + Mod + Del

// add a 
function addKeyDown(hotkey,functioncall) {
  
}
function addKeyUp(hotkey,functioncall) {
  
}

document.onkeydown = function (event) {
  
}
document.onkeyup = function (event) {
}
