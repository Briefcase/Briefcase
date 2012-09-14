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

var JSONMenuObject = JSON.parse(JSONMenuString);


/*********************************** ON LOAD **********************************\
| The onload function grabs the div that the user created for the menu at the  |
| top of the screen and applies the css elements to it as well as makes it not |
| draggable so that it does not look odd if a user clicks and drags it. Then   |
| it begins iterating through the JSON object and assembeling the menu         |
\******************************************************************************/
$(document).ready(function () {
  "use strict";
  menu = document.getElementById('TitleMenu'); // TODO it may be better to create the div instead of having the user create it, or at least have the user specify what the name of the div is
  menu.setAttribute('class','mainMenu');
  menu.draggable = false;

  // Loop through all of the elements in the topmost array of the JSON object
  for (var element in JSONMenuObject) {
    attachDOMElements(JSONMenuObject[element], menu);
  }
});

/***************************** ATTACH DOM ELEMENTS ****************************\
| This function identifes a JSON Element and calls functions to create that    |
| type of menu object, then it appends the created object to the parent menu   |
| that was passed in along with the JSON object                                |
\******************************************************************************/
function attachDOMElements(JSONTree,dommenu) {
  var element = document.createElement("div");
  var name = JSONTree["name"];
  
  // Create A Menu Type Object
  if (JSONTree["type"] == "menu") {
    var JSONChildren = JSONTree["submenu"];
    var icon = JSONTree["iconsrc"];
    var version = "normal";

    element = createMenu (name, JSONChildren, icon,version,dommenu);
  }

  // Create a Item Type Object
  else if (JSONTree["type"] == "menuitem") {
    // Create the arguments for the Button Item
    var icon = JSONTree["iconsrc"];
    var shortcutkey = JSONTree["shortcut"] ;
    var version = "normal";
    
    // Create a callback function that closes the menu and runs the attached function
    var callbackFunction = function() {
      closeMenusDownTo(menu);
      menuOpen = false;

      try { eval(JSONTree["function"]); }
      catch (err) {console.log(err)}
    };
    
    // Create the buton element with all of the created attributes
    element = createButton (name,callbackFunction,icon,shortcutkey,version);
  }

  // Create a Break Type Object
  else if (JSONTree["type"] == "break") {
    element = createBreak();
  }

  // Display an error for an Unknown Type of Object
  else {
    alert('error found a ' + JSONTree["type"]);
    console.log(JSONTree);
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
//TODO change this to use the registered events not the onclick variable
document.onclick = hideMenus; 
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
/************************** CLOSE MENUS DOWN TO LEVEL *************************\
| This function will close all open menus that are children of the specified   |
| menuItem. This is used when scrolling through menus or opening and closing   |
| submenus via clicking on the menu button object                              |
\******************************************************************************/
function closeMenusDownTo (menuItem) {
  while (menuStack.length > 0) {
    var entry = menuStack.pop();
    if (entry == menuItem) {
      menuStack.push(entry);
      break;
    }
    else { entry.style.display = 'none'; }
  }
}

/******************************** IS MOUSE OVER *******************************\
| Is mouse over checks to see if the mouse is over a specified rectangular div |
| tag. The mouse x and mouse y values have to be inputed to the function to    |
| make sure that the div and the mouse poll have the same parent scope         |
\******************************************************************************/
function isMouseOver(divTag,mousex,mousey) {
  var maxX = divTag.offsetLeft + divTag.offsetWidth;
  var minX = divTag.offsetLeft;
  var maxY = divTag.offsetTop + divTag.offsetHeight;
  var minY = divTag.offsetTop;
  
  if (mousex < maxX && mousex > minX && mousey < maxY && mousey > minY) { return true }
  
  return false;
}
  //////////////////////////////////////////////////////////////////////////////
 /////////////////////////// MENU ELEMENT GENERATION //////////////////////////
//////////////////////////////////////////////////////////////////////////////


/********************************* CREATE ITEM ********************************\
/*************************** CORE ELEMENT GENERATION **************************\
| This function generates a core element for buttons and sub-menu buttons. The |
| HTML looks like the following when completed                                 |
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
| - JSONChildren: An array containing of the the menu's children nodes         |
| - icon: A src path to the image to be used as the menu button's icon         |
| - version: A 'TBD' variable just incase of new features                      |
| - topLevel: a div object that represents the parent, it is used to check to  |
|             see if the button is a main menu or a sub menu by checking its   |
|             value against 'menu'                                             | 
|                                                                              |
| The function first creates a new 'sub menu' div and fills it with its        |
| child buttons recursively.                                                   |
\******************************************************************************/
function createMenu (name, JSONChildren, icon, version, topLevel) {
  
  var generatedMenu = document.createElement('div');
  generatedMenu.setAttribute('class','subMenu');
  
  for (var child in JSONChildren) {
    attachDOMElements(JSONChildren[child],generatedMenu);
  }
  
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
| The button generation function creates a core element object then adds a     |
| slight modification to collapse the menu down to it's parent if it is being  |
| hilighted currently. This way we will not get menus that stack up all over   |
\******************************************************************************/
function createButton (name, callbackFunction, icon, shortcutKey, version) {
  var item = createItem(name,callbackFunction,icon,shortcutKey, version);
  item.onmouseover = function() {closeMenusDownTo(item.parentNode)};
  return item;
}
/****************************** BREAK GENERATION ******************************\
| A break is just a div with a css class attached. This function creates an    |
| empty div and attaches the "break" class to it                               |
\******************************************************************************/
function createBreak () {
  var element = document.createElement('div');
  element.setAttribute('class','break');
  return element;
}
