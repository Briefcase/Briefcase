// This function sends a post message to the server


function sendpost(serverURL, messageVariables) {
  var output = "";
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
		},
		error: function (xhr, ajaxOptions, thrownError){// not my code this function is
                    console.log("AJAX FAILURE:"+xhr.status);
                    console.log("AJAX FAILURE:"+thrownError);
                }    
  });
}
