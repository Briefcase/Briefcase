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
var tree = [["hello world","functiona"],["somethingElse","functionb"],["a third thing",[["or something else","functionc"],["one last thing","functiond"]]],["just for good measure","finalfunction"]];

window.onload = function () {
  menu = document.getElementById('TitleMenu');
  menu.draggable = false;
  //dropDown = document.getElementById('DropdownMenu');
  
  
  menu.style.width = "100%";
  menu.style.overflow = "hidden";
  menu.style.backgroundColor = "#F00";
  
  
  //menu.innerHTML = getNameDivs(tree);
  //menu.appendChild();
  
  getDOMMenu(menu,tree);
  //alert(tree);	
  //alert(displayTree(tree,"-"));
}


// this function should be renamed
function getDOMMenu(menuObject,remainingTree) {

  // find all the menu components at that level
  for (var i = 0; i < remainingTree.length; i++) {
  
    var element = createElement(remainingTree[i]);
    menuObject.appendChild(element);
  }
    
  return link;
}

// returns an element
function createElement (treeElement) {
  if (treeElement instanceof Array) {
    // break element
    if (treeElement.length == 0) {
      alert("I am a break");
    }

    else if (treeElement.length == 3) {
    // menu element (name,tree,icon,style)
      if (treeElement.length == 3 && treeElement[1] instanceof Array) {
        var link = document.createElement('div');
        link.setAttribute(
      }
      else {
        //assume anything else is a button
        // buttons (name,function,icon,enabled,style,shortcutkey)
        var link = document.createElement('div');
        link.setAttribute('class','menuButton');
        link.setAttribute('onclick', 'alert(\"'+treeElement[1]+'\");');
        link.innerHTML = treeElement[0]; // set name
        link.draggable = false;
        return link;
      }
    }
  }
  return null;
}


function getNameDivs(root) {
  var output = "";
  for (var i = 0; i < root.length; i++) {
    output += "<a class=\"menuButton\" href onclick=\"alert("+root[i][1]+")\">"+ root[i][0] + "</a>";
  }
  return output;
}
/*
function displayTree(root,offset) {
  var output = "";
  for (var i = 0; i < root.length; i++) {
    var funct
    if (root[i][1] instanceof Array) {
      funct = displayTree(root[i][1],offset+" - -");
    }
    else {
      funct = root[i][1];
    }
    output += "\n" + offset + root[i][0] + " --> " + funct;
  }
  return output;
}
*/

