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

var menu; // the object that is the original menu bar
var menuStack = []; // stores the stack of open menus
var menuOpen = false; // stores weather the menu is open or not 

/*********************************** ON LOAD **********************************\
| This function loads the XML from the web page 
\******************************************************************************/
$(document).ready(function () {
  "use strict";
  var xmlText = document.getElementById('xmlMenu').innerHTML; // read the XML  [[[TO BE CONVERTED IN TO JSON IN V2]]]
  
  menu = document.getElementById('TitleMenu'); // load the menu placeholder from the document
  menu.setAttribute('class','mainMenu'); // apply css elements
  menu.draggable = false; // prittify the menu when users mis-click
  alert(xmlText);
  var pxml = $.parseXML(xmlText);
  pxml = $(pxml).children();// break out of the global menu
  $(pxml).children().each(function() {attachDOMElements(this,menu);});
  
});

/***************************** ATTACH DOM ELEMENTS ****************************\
| Attaches the DOM Elements from the XMLTree variable to the dommenu variable  |
\******************************************************************************/
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
  else if (XMLTree.nodeName == "menuitem") {
    var callbackFunction = "";
    var icon = "";
    var shortcutkey = "";
    var version = "normal";
    
    icon = $(XMLTree).attr("iconsrc");
    shortcutkey = $(XMLTree).attr("shortcut");
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


/********************************* HIDE MENUS *********************************\
| This function checks to see if the mouse is over any menu item, if it is not |
| then it closes all of the menus                                              |
\******************************************************************************/
document.onclick = hideMenus; //TODO change this to use the registered events not the onclick variable
function hideMenus (event) {
  // check parent main menu 
  if (isMouseOver(menu,event.pageX,event.pageY)) {return}
  // check all open sub menus
  for (menuItem in menuStack) {
    if (isMouseOver(menuStack[menuItem],event.pageX,event.pageY)) {return}
  }
  // if the mouse is not over a menu, close the menus
  closeMenusDownTo(menu);
  menuOpen = false;
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
  
  
  if (x < maxX && x > minX && y < maxY && y > minY) { return true }
  
  return false;
}
  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////// MENU ELEMENT GENERATION //////////////////////////
//////////////////////////////////////////////////////////////////////////////
/********************************* CREATE ITEM ********************************\
/*************************** CORE ELEMENT GENERATION **************************\
| This function generates a core element for the menu, this includes buttons   |
| and sub-menu buttons. The HTML looks like the following when completed       |
|                                                                              |
|    <div class="menuButton">                                                  |
|      <div class="image">                                                     |
|        <img src="~imgsource~"></img>                                         |
|      </div>                                                                  |
|      <div class="name">~namesource~</div>                                    |
|      <div class="shortcutKey">~shortcutkeysource~</div>                      |
|    </div>                                                                    |
\******************************************************************************/
function createItem (name, callbackFunction, icon, shortcutKey, version) {
 
  // Create Item Element
  var element = document.createElement('div');
      element.setAttribute('class','menuButton');
      
  // Create Item's Name Element
  var nameDiv = document.createElement('div');
      nameDiv.setAttribute('class','name');
      nameDiv.innerHTML = name;
      
  // Create Item's Shortcut Key Element
  var shortcutKeyDiv = document.createElement('div');
      shortcutKeyDiv.setAttribute('class','shortcutKey');
      shortcutKeyDiv.innerHTML = shortcutKey;
      
  // Create Item's Icon Element
  var imageDiv = document.createElement('div');  
      imageDiv.setAttribute('class','image');
  if (icon != "") {
    var image = document.createElement('img');
    image.setAttribute('src',icon);
    imageDiv.appendChild(image);
  }
  
  // Add the Icon Name and Shortcut Elements to the Item Element
  element.appendChild(imageDiv);
  element.appendChild(nameDiv);
  element.appendChild(shortcutKeyDiv);
  
  // Set the callback function of the Element
  element.onclick = callbackFunction;
  
  // Return the newly created element
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
      generatedMenu.style.top = this.offsetTop+this.parentNode.offsetTop+"px";
      generatedMenu.style.left = this.offsetWidth+this.offsetLeft+this.parentNode.offsetLeft+"px";
    }
    else if (topLevel==menu) {
      generatedMenu.style.top = this.offsetTop+this.offsetHeight+this.parentNode.offsetTop+"px";
      generatedMenu.style.left = this.offsetLeft+this.parentNode.offsetLeft+"px";
    }
    // make it visable
    generatedMenu.style.display = 'inherit';
  };
  
  document.body.appendChild(generatedMenu);
  
  var toggleMenu = function() {
    if (topLevel == menu) {
      menuOpen = !menuOpen;
    }
    if (generatedMenu.style.display == 'none') {showMenu.call(this);}
    else {closeMenusDownTo(this.parentNode);}
  }
  
  var item = createItem(name,toggleMenu,icon,'&#9656',version );
  
  item.onmouseover = function() {
    if (generatedMenu.style.display == 'none') {
      closeMenusDownTo(this.parentNode);
      if (menuOpen) {
        showMenu.call(this);
      }
    }
    else {
      closeMenusDownTo(generatedMenu);
    }
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
