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
  alert(output);
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
