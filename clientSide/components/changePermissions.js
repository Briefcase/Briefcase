alert("changepermissions");
function sendChangedata(fileid,ispublic,userviewlist,userallowedlist) {
  var output = "";
  var serverURL = "/spreadsheet/changesettings";
  for (var i in messageVariables) {
    output += "&"+i+"="+messageVariables[i];
  }    
  
  $.ajax({
    type: "POST",
    url: serverURL,
		data: output,
		dataType: "html",
		success: function(data){
        console.log("AJAX Sucess: "+data);
        callback();
		},
		error: function (xhr, ajaxOptions, thrownError){// not my code this function is
                    console.log("AJAX FAILURE:"+xhr.status);
                    console.log("AJAX FAILURE:"+thrownError);
                }    
  });
}

function getPermissions() {
  alert('get permissions');
  var splitPath = decodeURIComponent(window.location.href).split('?')[1].split('&');
  
  username = splitPath[0];
  filename = splitPath[1];
  
  if (username==null || username=="") {return;}
  if (filename==null || filename=="") {return;}  
  
  var output = "&fileid="+fileid;
  var serverURL = "/spreadsheet/returnsettings"; 
  $.ajax({
    type: "POST",
    url: serverURL,
		data: output,
		dataType: "html",
		success: function(data){
        console.log("AJAX (get permissions) Sucess: "+data);
        callback();
		},
		error: function (xhr, ajaxOptions, thrownError){// not my code this function is
                    console.log("AJAX FAILURE:"+xhr.status);
                    console.log("AJAX FAILURE:"+thrownError);
                }    
  });
}
