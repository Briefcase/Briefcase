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

// the saved data file (TO BE DEPRECATED)
var savedFile;

/********************************* DJANGO CSRF ********************************\
| The django CSRF code is to prevent what is called 'cross site forgery' when  |
| sending and receving ajax data from the client. This has apparently become a |
| concern for some web developers, so we have added it in to comply with the   |
| django server's request to do so                                             |
\******************************************************************************/
$(document).ajaxSend(function(event, xhr, settings) {
  function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  function sameOrigin(url) {
      // url could be relative or scheme relative or absolute
      var host = document.location.host; // host + port
      var protocol = document.location.protocol;
      var sr_origin = '//' + host;
      var origin = protocol + sr_origin;
      // Allow absolute or scheme relative URLs to same origin
      return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
          (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
          // or any other URL that isn't scheme relative or absolute i.e relative.
          !(/^(\/\/|http:|https:).*/.test(url));
  }
  function safeMethod(method) {
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
      xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
  }
});

/********************************** AUTO SAVE *********************************\
| The autosave function is a function that will be run every time the client   |
| wishes to update the server about what it has changed, as well as request    |
| new data from the server about what other users have changed.                |
| I beleve that it is currently broken :(                                      |
\******************************************************************************/
var waiting = false;
var fullCellBuffer = {};
var currentCellName = "";
var currentCellValue = "";

var time

function autosave() {
  //console.log("WAITING FOR UPDATE: "+ JSON.stringify(fullCellBuffer));
  // This code only deals with single cell edits, not multi cell edits
  var currentCell = startSelectionX + ',' + startSelectionY;
  //console.log(spreadsheetCells[currentCell]);
  if (currentCellName == currentCell) {
    currentCellValue = spreadsheetCells[currentCell];
    //console.log("SAME CELL CHANGE" + currentCellName + ":" + currentCellValue);
  }

  else {
    if (currentCellName != "") {
      fullCellBuffer[currentCellName] = currentCellValue;
    }
    currentCellName = currentCell;
    currentCellValue = spreadsheetCells[currentCellName];
    //console.log("MOVE CELL CHANGE");
  }

  
}

window.setInterval(repeatingSave,100);

function repeatingSave(){
  var currentCell = startSelectionX + ',' + startSelectionY;
  if (currentCellName != "") {
    fullCellBuffer[currentCellName] = currentCellValue;
  }
  currentCellName = "";//currentCell;
  currentCellValue = "";//spreadsheetCells[currentCellName];

  console.log("Autosaving: " + JSON.stringify(fullCellBuffer));

  //var cell = JSON.stringify(startSelectionX+','+startSelectionY);
  var fileid = getFileId();
  output = {"id":fileid,"spreadsheetcells":JSON.stringify(fullCellBuffer)};
  var serverURL = "/spreadsheet/autosave/";

  if (waiting == false) {
    waiting = true;
    fullCellBuffer = {};
    $.ajax({
      type: "POST",
      url: serverURL,
  		data: output,
  		dataType: "html",
  		success: function(data){
        //alert (data);
        waiting=false;
        //console.log("Receving: " + data);
        data = data.replace(/\}\{/ig,"}{|}{"); ///////////// THIS LINE NEEDS TO CHANGE LATER
        //console.log("Replaced: " + data);
        changes = data.split("{|}");
        //console.log("Split: " + data);
        for (change in changes){
          //changes[change] = changes[change].replace(/&quot;/ig,'"');
          changes[change] = changes[change].replace(/'/ig,'"');
          //console.log("Changed Cell: "+changes[change]);
          var changedCells = JSON.parse(changes[change]);
          //console.log("Parsed Change: "+changedCells);
          for (cell in changedCells){
            //console.log("Parsing: " + cell + " as " + changedCells[cell]);
            spreadsheetCells[cell] = changedCells[cell];
          }
        }
        redrawFrame();
  		},
  		error: function (xhr, ajaxOptions, thrownError){
        waiting=false;
        //console.log("Receving:" + xhr.status)
        //alert(xhr.status);
        //alert(thrownError);
      }
    });
  }
  delete fullCellBuffer;
}

/************************************ SAVE ************************************\
| this function saves the document by parsing the hash table into a json file  |
| then sending it over ajax to the server                                      |
\******************************************************************************/
function devsave() {
  var fileid = getFileId();
  var output = {"id":fileid,"spreadsheetcells":JSON.stringify(spreadsheetCells)};
  var output 
  console.log(output);  
  var serverURL = "/spreadsheet/devsave/";
  $.ajax({
    type: "POST",
    url: serverURL,
		data: output,
		dataType: "html",
		success: function(data){
        console.log("Returning Data: " + data);
        //alert (data);
		},
		error: function(error){
      /*var errors = "";
      for (element in error) {
        errors += element + "\n";
      }
      alert("error: "+errors);
      */
      alert("Error: " + error.statusCode());
    }
  });
  
  
  // save to a local variable, probably not needed in the end
  savedFile = output;
}

function getFileId() {
  var uri = decodeURIComponent(window.location.href);
  var urisplit = uri.split('/');
  var fileid = urisplit[urisplit.length-1];
  if (fileid == "") fileid = urisplit[urisplit.length-2];
  return fileid;
}

/*********************************** LOAD 2 ***********************************\
| The load2 function is called when the page loads, this is the second version |
| of the load function and is certianly not the last. It needs to be revised   |
| to only send JSON data                                                       |
\******************************************************************************/
function load2() {

  var serverURL = "/spreadsheet/load/";

  var fileid = getFileId();

  var postData = {"id":fileid};
  
  //alert(postData["id"]);

  $.ajax({
    type: "POST",
    url: serverURL,
		data: postData,
		dataType: "html",
		success: function(savedData) {
      console.log(savedData);
		  savedFile = savedData;
      var test = JSON.parse(savedFile);
      delete spreadsheetCells;
      
      for (i in spreadsheetCells) {
        delete spreadsheetCells[i];
      }
      
      for (i in test) {
        spreadsheetCells[i] = test[i];
      }
      redrawFrame();
		},
		error: function(jqXHR, textStatus, errorThrown){alert("error: "+jqXHR+":"+textStatus+":"+errorThrown)}
  });
}

/************************************ LOAD ************************************\
| This is the load function, it takes the file and loads it into memory. This  |
| needs to be tested for memory leaks                                          |
\******************************************************************************/
/*
function load() {
  var serverURL = "/spreadsheet/load";
  
  
  var name = prompt("Filename:","");
  if (name==null || name=="") {return;}
  
  
  $.ajax({
    type: "POST",
    url: serverURL,
		data: "filename="+name,
		dataType: "html",
		success: function(savedData) {
		  savedFile = savedData;
      var test = JSON.parse(savedFile);
      delete spreadsheetCells;
      
      for (i in spreadsheetCells) {
        delete spreadsheetCells[i];
      }
      
      for (i in test) {
        spreadsheetCells[i] = test[i];
      }
      redrawFrame();
		},
		error: function(html){alert("error: "+html)}
  });
}*/
