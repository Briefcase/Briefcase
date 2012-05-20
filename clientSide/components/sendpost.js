// This function sends a post message to the server
function sendpost(serverURL, messageVariables, callback) {
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
        callback();
		},
		error: function (xhr, ajaxOptions, thrownError){// not my code this function is
                    console.log("AJAX FAILURE:"+xhr.status);
                    console.log("AJAX FAILURE:"+thrownError);
                }    
  });
}

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
