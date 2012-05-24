function sendChangedata(fileid,ispublic,adduserviewlist,removeuserviewlist,adduserallowedlist,removeuserallowedlist) {
  // false = 0
  // true = 1
  var output = "";
  
  // THESE ARE SOME TEST VALUES
  var splitPath = decodeURIComponent(window.location.href).split('?')[1].split('&');
  filename = splitPath[1];
  if (filename==null || filename=="") {return;}  
  fileid = filename;
  
  ispublic = "False";
  adduserviewlist = JSON.stringify([]);
  removeuserviewlist = JSON.stringify([]);
  adduserallowedlist = JSON.stringify(["a"]);
  removeuserallowedlist = JSON.stringify([]);
  //
  
  output += "&fileid="+fileid;
  output += "&publicbool="+ispublic;
  output += "&newviewlist="+adduserviewlist;
  output += "&deleteviewlist="+removeuserviewlist;
  output += "&newallowedlist="+adduserallowedlist;
  output += "&deleteallowedlist="+removeuserallowedlist;
  
  alert(output);
  
  var serverURL = "/spreadsheet/changesettings";
  
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
  var splitPath = decodeURIComponent(window.location.href).split('?')[1].split('&');
  
  username = splitPath[0];
  filename = splitPath[1];
  
  if (username==null || username=="") {return;}
  if (filename==null || filename=="") {return;}  
  
  var output = "&fileid="+filename;
  var serverURL = "/spreadsheet/returnsettings"; 
  $.ajax({
    type: "POST",
    url: serverURL,
		data: output,
		dataType: "html",
		success: function(data){
        console.log("AJAX (get permissions) Sucess: "+data);
        var parsedPermissions = JSON.parse(data);
        var testOutput = "Public: "+parsedPermissions["publicbool"] + "\n" + "Modify Users:\n";
        for (user in parsedPermissions["allowedlist"]) {
          testOutput += " - " + parsedPermissions["allowedlist"][user] + "\n";
        }
        testOutput += "View Users:   "+parsedPermissions["viewlist"];
        alert(testOutput);
		},
		error: function (xhr, ajaxOptions, thrownError){// not my code this function is
                    console.log("AJAX FAILURE:"+xhr.status);
                    console.log("AJAX FAILURE:"+thrownError);
                }    
  });
}
