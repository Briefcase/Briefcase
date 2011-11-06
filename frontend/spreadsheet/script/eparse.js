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
  for (; i < input.length(); i++) {
    if ((input[i] == '+' || input[i] == '-') && parenCount == 0) {
      // parse block
      var addon;
      if (_RESMATH(input.substring(lastpoint,i))) {
        addon = _ASMATH(input.substring(lastpoint+1,i-1);
      }
      else {
        addon = _MDMATH(input.substring(lastpoint,i);
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
  if (_RESMATH(input.substring(lastpoint,input.length()-1))) {
    addon = _ASMATH (input.substring(lastpoint+1,input.length()-2));
  }
  else{
    addon = _MDMATH (input.substring(lastpoint,input.length()-1));
  }
  
  if (negativeSwitch) {output -= addon;}
  else {output += addon;}
  return output;
}

