var savedFile;
/************************************ SAVE ************************************\
|
\******************************************************************************/
function save() {
  var output = "{";
  for (var i in data) {
    output += JSON.stringify(i) + ":" + JSON.stringify(data[i]) + ',';
  }
  output = output.slice(0, -1)+ "}";
  // send ajax request
  var xmlhttp;
  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  }
  else {
    alert("FAILED TO CREATE OBJECT");
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.redyState == 4 && xmlhttp.status == 200) {
      alert (xmlhttp.responseText);
    }
  }
  xmlhttp.open("GET","/spreadsheet/save",true);
  xmlhttp.send();
  //xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  //xmlhttp.send(output);
  
  // save to a local variable, probably not needed in the end
  savedFile = output;
}
/************************************ LOAD ************************************\
|
\******************************************************************************/
function load() {
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
}
