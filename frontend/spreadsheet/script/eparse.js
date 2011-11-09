// a wrapper function
function eparse(input) {
  return _ASMATH(_RMWHITE(input));
}

//remove equational whitespace
function _RMWHITE (input) {
  var output = "";
  var inquote = false;
  for (var i = 0; i < input.length; i++) {
    if ((input[i] == "'" || input[i] == '"')) {
      inquote = !inquote;
    }
    if (input[i] != " " || inquote == true) {
      output+=input[i];
    }
  }
  return output;
}

//_ASMATH handles additions and subtractions in math
function _ASMATH(input) {
  var lastpoint = 0;
  var output;
  var first = true;
  var negativeSwitch = false;
  var parenCount = 0; // keep track of parenthasese
  var i = 0;
  // if the first number is negative
  if (input[0]=='-') {
    negativeSwitch = true;
    i=1;
    lastpoint = 1; 
  }
  for (; i < input.length; i++) {
    if ((input[i] == '+' || input[i] == '-') && parenCount == 0) {
      // parse block
      var addon;
      if (_RESMATH(input.substring(lastpoint,i))) {
        addon = _ASMATH(input.substring(lastpoint+1,i-1));
      }
      else {
        addon = _MDMATH(input.substring(lastpoint,i));
      }
      
      // add or subtract result
      if (negativeSwitch) {output -= addon;}
      else if (first) { output = addon; first=false;}
      else {output += addon}
      
      // check to see if the symbol is a subtraction sign
      negativeSwitch = (input[i] == '-');
      // make the next block start after the symbol
      lastpoint = i+1;
    }
    else if (input[i] == '('){
      parenCount++;
    }
    else if (input[i] == ')'){
      parenCount--;
    }
  }
  // parse the final block, lastpoint to end
  var addon;
  if (_RESMATH(input.substring(lastpoint,input.length))) {
    addon = _ASMATH (input.substring(lastpoint+1,input.length-1));
  }
  else{
    addon = _MDMATH (input.substring(lastpoint,input.length));
  }
  
  if (negativeSwitch) {output -= addon;}
  else if (first) { output = addon; first=false;}
  else {output += addon;}
  return output;
}
// MD math handles multiplication and division
function _MDMATH (input) {
  var output = 0;
  var lastpoint = 0;
  var parenCount = 0;
  var divideSwitch = false;
  var first = true;
  
  for (var i = 0; i < input.length; i++) {
    if ((input[i] == '*' || input[i] == '/') && !parenCount) {
      var addon;
      if (_RESMATH(input.substring(lastpoint,i))) {
        addon = _ASMATH (input.substring(lastpoint+1, i-1));
      }
      else {
        addon = _FIND(input.substring(lastpoint,i));
      }
      
      if (divideSwitch) { output /= addon; }
      else if (first) { output = addon; first=false;}
      else {output *= addon;}
      
      divideSwitch = (input[i] == '/');
      lastpoint = i+1;
    }
    else if (input[i] == '(') {parenCount++;}
    else if (input[i] == ')') {parenCount--;}
  }
  
  var addon;
  if (_RESMATH(input.substring(lastpoint,input.length))){
    addon = _ASMATH(input.substring(lastpoint+1,input.length-1));
  }
  else {
    addon = _FIND(input.substring(lastpoint,input.length));
  }
  if (divideSwitch) output /= addon;
  else if (first) {output = addon; first=false;}
  else {output *= addon;}
  return output;
}

function isDigit(character) {
  return (character == '1' ||
          character == '2' ||
          character == '3' ||
          character == '4' ||
          character == '5' ||
          character == '6' ||
          character == '7' ||
          character == '8' ||
          character == '9' ||
          character == '0');
}

function isFunction(block) {
  if (block[block.length-1] == ')' && !isDigit(block[0])) {
    // check for function
    var parencount = 0;
    var parenStart = -1;
    for (var i = 0; i < block.length; i ++) {
      if (parencount == 0 && parenStart != -1){
        // ERROR
        return "false";
      }
      if (block[i] == '(') {
        if (parenStart == -1) {
          parenStart = i;
        }
        parencount++;
      }
      else if (block[i] == ')') {
        parencount--;
      }
    }
    if (parencount == 0) {
      var functionName = block.substring(0,parenStart).split('.',-1);
      if (functionName.length == 1) {
        functionName[1]=functionName[0];
        functionName[0]='default';
      }
      if (functionName.length > 2) {
        alert("split failed badly");
      }
      return block.substring(parenStart+1,block.length-1) + ',' + functionName[0]+'_'+functionName[1];
    }
  }
  else {
    return "false";
  }
}
////////////////////////////////////////////////////////////////////////////////
// the find function parses an element of the arithmatic and determines if it //
// is a function, a number, or a cell name                                    //
////////////////////////////////////////////////////////////////////////////////
function _FIND(input){
  // a string
  if (_INQUOTES(input)) {
    return input.substring(1,input.length-1);
  }
  // a function
  var functData = isFunction(input);
  if (functData != "false") {
    // call function
    var parsed = functData.split(',');
    var functionName = parsed.pop();
    if (window[functionName] == undefined) {
      alert("Function Not Found");
    }
    else {
      return window[functionName].apply(this,parsed);
    }
  }
  // A string
  return parseInt(input);
}

function _RESMATH(block) {
  var pcout = 1;
  if (block[0] == '(' && block[block.length-1] == ')') {
    for (var i = 1; i < block.length-1; i++) {
      if (block[i] == '(') pcout++;
      else if (block[i] == ')') pcout--;
      // if pcount is zero then it is not just one big parenthase group
      if (pcout == 0) return false;
    }
    return true;
  }
  return false;
}
function _INQUOTES(block) {
  if (block.length < 2) {
    return false;
  }
  if ((block[0] == '"' || block[0]=="'") && (block[block.length-1] == '"' || block[block.length-1] == "'")) {
    // more tests may need to be in here
    return true;
  }
  return false;
}
