function eparse(input) {
  return _ASMATH(input);
}

//_ASMATH handles additions and subtractions in math
function _ASMATH(input) {
  var lastpoint = 0;
  var output = 0;
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
  else {output += addon;}
  return output;
}

function _MDMATH (input) {
  //alert("value found" + input);
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
