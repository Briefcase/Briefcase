var savedFile;


  // DJANGO CSRF (cross site request forgery)
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

/************************************ SAVE ************************************\
|
\******************************************************************************/
function save() {
  var output = "{";
  for (var i in data) {
    output += JSON.stringify(i) + ":" + JSON.stringify(data[i]) + ',';
  }
  output = output.slice(0, -1)+ "}";  
  
  var serverURL = "/spreadsheet/save";
  $.ajax({
    type: "POST",
    url: serverURL,
		data: output,
		dataType: "html",
		success: function(data){
        alert (data);
		},
		error: function(html){alert("error: "+html)}
  });
  
  
  // save to a local variable, probably not needed in the end
  savedFile = output;
}
/************************************ LOAD ************************************\
|
\******************************************************************************/
function load() {
  var serverURL = "/spreadsheet/load";
  $.ajax({
    type: "POST",
    url: serverURL,
		data: "gIVE THE FIEL OR LII KLIL YUO",
		dataType: "html",
		success: function(savedData) {
		  savedFile = savedData;
		  alert(savedFile);
      var test = JSON.parse(savedFile);
      delete data;
      
      for (i in data) {
        delete data[i];
      }
      
      for (i in test) {
        //alert(i+"("+test[i]+")");
        data[i] = test[i];
      }
      redrawFrame();
		},
		error: function(html){alert("error: "+html)}
  });
}
