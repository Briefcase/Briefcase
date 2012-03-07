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
var menuStack = new Array();
var menuOpen = false;

var xmlText = "<XMLMenu>";
xmlText += '  <menu name="File" iconsrc="icons/action_forward.gif" version="normal">';
xmlText += '    <button name="save" function="save()" enabled="true" iconsrc="icons/action_save.gif" shortcutKey="Ctrl+S" version="normal"> </button>';
xmlText += '    <button name="load" function="load()" enabled="true" iconsrc="icons/action_back.gif" shortcutKey="Ctrl+L" version="normal"> </button>';
xmlText += '    <break></break>';
xmlText += '    <menu name="Feature Select" iconsrc="icons/action_go.gif" version="normal">';
xmlText += '      <button name="Feature One"   function="alert(\'one\')"   iconsrc="icons/flag_blue.gif" shortcutKey="Shft+Ctrl+1" version="normal"> </button>';
xmlText += '      <button name="Feature Two"   function="feature(\'two\')"   iconsrc="icons/flag_green.gif" shortcutKey="Shft+Ctrl+2" version="normal"> </button>';
xmlText += '      <button name="Feature Three" function="feature(\'three\')" iconsrc="icons/flag_orange.gif" shortcutKey="Shft+Ctrl+3" version="normal"> </button>';
xmlText += '      <button name="Feature Four"  function="feature(\'four\')"  iconsrc="icons/flag_red.gif" shortcutKey="Shft+Ctrl+4" version="normal"> </button>';
xmlText += '      <button name="Feature Five"  function="feature(\'five\')"  iconsrc="icons/flag_white.gif" shortcutKey="Shft+Ctrl+5" version="normal"> </button>';
xmlText += '   </menu>';
xmlText += '  </menu>';
xmlText += '  <menu name="Edit" iconsrc="" version="normal">';
xmlText += '    <button name="copy" function="copy()" iconsrc="icons/copy.gif" shortcutKey="Ctrl+S" version="normal"> </button>';
xmlText += '  </menu>';
xmlText += "</XMLMenu>";

window.onload = function () {
  menu = document.getElementById('TitleMenu');
  menu.setAttribute('class','mainMenu');
  menu.draggable = false;
  
  
  var pxml = $.parseXML(xmlText);
  var pxml = $(pxml).children();// break out of the global menu
  var tree = $(pxml);
  $(pxml).children().each(function() {attachDOMElements(this,menu);});
  

}

// attach dom elements attaches the last layer of xml children to the specified DOM object menu
function attachDOMElements(XMLTree,dommenu) {
  var element = document.createElement("div");
  var name = $(XMLTree).attr("name");
  
  if (XMLTree.nodeName == "menu") {
    var XMLChildren = $(XMLTree).children();
    var icon = "";
    var version = "normal";
    
    icon = $(XMLTree).attr("iconsrc");
    
    element = createMenu (name, XMLChildren, icon,version,dommenu);
  }
  else if (XMLTree.nodeName == "button") {
    var callbackFunction = "";
    var icon = "";
    var shortcutkey = "";
    var version = "normal";
    
    icon = $(XMLTree).attr("iconsrc");
    shortcutkey = $(XMLTree).attr("shortcutKey");
    // set the callback function to a parsed version of the xml's text
    callbackFunction = function() {
      try {
        eval($(XMLTree).attr("function"));
      }
      catch (err) {console.log(err)}
      // also close the menu
      closeMenusDownTo(menu);
      menuOpen = false;
    };
    
    
    element = createButton (name,callbackFunction,icon,shortcutkey,version);
  }
  else if (XMLTree.nodeName == "break") {
    element = createBreak();
  }
  else {
    alert('error found a ' + XMLTree.nodeName);
    return;
  }
  dommenu.appendChild(element);
  
}








function addMenuToStack(menu) {
  menuStack.push(menu);
}

document.onclick = hideMenus;
// hide all the menus when clicking outside
function hideMenus (event) {
  var overADiv = false;
  // check parent main menu
  if (isMouseOver(menu,event.pageX,event.pageY)) {overADiv = true;}
  // check all open sub menus
  for (menuItem in menuStack) {
    if (isMouseOver(menuStack[menuItem],event.pageX,event.pageY)) {
      overADiv = true;
      break;
    }
  }
  if (!overADiv) {
    closeMenusDownTo(menu);
    menuOpen = false;
  }
}

function closeMenusDownTo (menuItem) {
  while (menuStack.length > 0) {
    var entry = menuStack.pop();
    if (entry == menuItem) {
      menuStack.push(entry);
      break;
    }
    else {
      entry.style.display = 'none';
    }
  }
}

function isMouseOver(divTag,x,y) {
  var maxX = divTag.offsetLeft + divTag.offsetWidth;
  var minX = divTag.offsetLeft;
  var maxY = divTag.offsetTop + divTag.offsetHeight;
  var minY = divTag.offsetTop;
  
  
  if (x < maxX && x > minX && y < maxY && y > minY) {
    return true;
  }
  
  return false;
}
  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////// MENU ELEMENT GENERATION //////////////////////////
//////////////////////////////////////////////////////////////////////////////
/********************************* CREATE ITEM ********************************\
/*************************** CORE ELEMENT GENERATION **************************\
|
\******************************************************************************/
function createItem (name, callbackFunction, icon, shortcutKey, version) {
  var element = document.createElement('div');
  element.setAttribute('class','menuButton');
  //name
  var nameDiv = document.createElement('div');
  nameDiv.setAttribute('class','name');
  nameDiv.innerHTML = name;
  // shortcut
  var shortcutKeyDiv = document.createElement('div');
  shortcutKeyDiv.innerHTML = shortcutKey;
  shortcutKeyDiv.setAttribute('class','shortcutKey');
  // icon
  var imageWrapper = document.createElement('div');  
  imageWrapper.setAttribute('class','image');
  if (icon != "") {
    var image = document.createElement('img');
    image.setAttribute('src',icon);
    imageWrapper.appendChild(image);
  }
  
  element.appendChild(imageWrapper);
  element.appendChild(nameDiv);
  element.appendChild(shortcutKeyDiv);
  
  element.onclick = callbackFunction;
  
  return element;
}

/******************************* MENU GENERATION ******************************\
| This function generates a sub menu item.                                     |
| - Name: A string containing the title of the button                          |
| - XMLChildren: An XML segment containing of the the menu's children nodes    |
| - icon: A src path to the image to be used as the menu button's icon         |
| - version: A 'TBD' variable just incase of new features                      |
| - topLevel: a div object that represents the parent, it is used to check to  |
|             see if the button is a main menu or a sub menu by checking its   |
|             value against 'menu'                                             | 
|                                                                              |
| The function first creates a new 'sub menu' div and fills it with its        |
| child buttons recursively.                                                   |
\******************************************************************************/
function createMenu (name, XMLChildren, icon, version, topLevel) {
  
  var generatedMenu = document.createElement('div');
  generatedMenu.setAttribute('class','subMenu');
  
  $(XMLChildren).each(function() {attachDOMElements(this,generatedMenu)});  
  
  generatedMenu.style.display = 'none';
  var showMenu = function() {

    // Add the menu to the stack of open menus
    addMenuToStack(generatedMenu);
    //determine offset of top left corner of the menu
    if (topLevel!=menu) {
      generatedMenu.style.top = this.offsetTop+this.parentNode.offsetTop;
      generatedMenu.style.left = this.offsetWidth+this.offsetLeft+this.parentNode.offsetLeft;
    }
    else if (topLevel==menu) {
      generatedMenu.style.top = this.offsetTop+this.offsetHeight+this.parentNode.offsetTop;
      generatedMenu.style.left = this.offsetLeft+this.parentNode.offsetLeft;
    }
    // make it visable
    generatedMenu.style.display = 'inherit';
  };
  
  document.body.appendChild(generatedMenu);
  
  var toggleMenu = function() {
    if (topLevel == menu) {
      menuOpen = !menuOpen;
    }
    if (generatedMenu.style.display == 'none') {alert('delay');showMenu.call(this);}
    else {closeMenusDownTo(this.parentNode);}
  }
  
  var item = createItem(name,toggleMenu,icon,'&#9656',version);
  
  item.onmouseover = function() {
    //if (menuOpen) {
      if (generatedMenu.style.display == 'none') {
        closeMenusDownTo(this.parentNode);
        //if (menuOpen) {
          showMenu.call(this);
        //}
      }
      else {
        closeMenusDownTo(generatedMenu);
      }
    //}
  };
  
  return item;
}
/****************************** BUTTON GENERATION *****************************\
|
\******************************************************************************/
function createButton (name, callbackFunction, icon, shortcutKey, version) {
  var item = createItem(name,callbackFunction,icon,shortcutKey, version);
  item.onmouseover = function() {closeMenusDownTo(item.parentNode)};
  return item;
}
/****************************** BREAK GENERATION ******************************\
|
\******************************************************************************/
function createBreak () {
  var element = document.createElement('div');
  element.setAttribute('class','break');
  return element;
}
