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
|                                 ,,    ,,                                     |
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
var menu;
var dropDown;
var xmlText = "";
xmlText += '<menu name="File" iconsrc="" version="normal">';
xmlText += '  <button name="save" function="save()" enabled="true" iconsrc="save.png" shortcutKey="Ctrl+S" version="normal"> </button>';
xmlText += '  <button name="load" function="load()" enabled="true" iconsrc="load.png" shortcutKey="Ctrl+L" version="normal"> </button>';
xmlText += '  <break></break>';
xmlText += '  <menu name="Feature Select" iconsrc="gear.png" version="normal">';
xmlText += '    <button name="Feature One"   function="feature(\'one\')"   iconsrc="levelone.png" shortcutKey="Shft+Ctrl+1" version="normal"> </button>';
xmlText += '    <button name="Feature Two"   function="feature(\'two\')"   iconsrc="leveltwo.png" shortcutKey="Shft+Ctrl+2" version="normal"> </button>';
xmlText += '    <button name="Feature Three" function="feature(\'three\')" iconsrc="leveltwo.png" shortcutKey="Shft+Ctrl+3" version="normal"> </button>';
xmlText += '    <button name="Feature Four"  function="feature(\'four\')"  iconsrc="leveltwo.png" shortcutKey="Shft+Ctrl+4" version="normal"> </button>';
xmlText += '    <button name="Feature Five"  function="feature(\'five\')"  iconsrc="leveltwo.png" shortcutKey="Shft+Ctrl+5" version="normal"> </button>';
xmlText += '  </menu>';
xmlText += '</menu>';

window.onload = function () {

  menu = document.getElementById('TitleMenu');
  menu.draggable = false;
  menu.style.width = "100%";
  menu.style.overflow = "hidden";
  menu.style.backgroundColor = "#F00";
  
  
  var pxml = $.parseXML(xmlText);
  var tree = $(pxml);

  $(pxml).children().each(function() {attachDOMElements(menu,this);});
  

}


function attachDOMElements(menuObject,XMLTree) {
  var element;
  alert($(XMLTree).attr("name"));
  if (XMLTree.nodeName == "menu") {
    alert("menu");
  }
  else if (XMLTree.nodeName == "button") {
    alert("button");
  }
  else if (XMLTree.nodeName == "break") {
    element = createBreak();
    alert("break!");
  }
  else {
    return;
  }
  menuObject.appendChild(element);
  
  /*
  $(this).children().each(function () {
    alert("->"+$(this).attr("name")+":"+this.nodeName);
  });*/
}

// returns an element
function createButton (name, callbackFunction, icon, shortcutKey, version) {
  //alert($(treeElement).attr( "name" ));  
}


function createMenu (name, XMLChildren, icon, version) {
  createButton(name,[generatedfunction],icon,'▸',version);
}

function createBreak () {
  var element = document.createElement('div');
  element.setAttribute('class','break');
  return element;
}
