// a wrapper function for the entire eparse functionality
function eparse(input) {
  return _ASMATH(_RMWHITE(input));
}

/****************************** REMOVE WHITESPACE *****************************\
| remove equational whitespace to make parsing the equations alot easier for   |
| the rest of the code to parse it                                             |
\******************************************************************************/
function _RMWHITE (input) {
  var output = "";
  var inquote = 0;
  for (var i = 0; i < input.length; i++) {
    if (inquote == 1) {
      if (input[i]=='"') {
        inquote=0;
      }
      output+=input[i];
    } else if (inquote == 2) {
      if (input[i]=="'") {
        inquote=0;
      }
      output+=input[i];
    } else if (input[i] == '"') {
      inquote=1;
      output+='"';
    } else if (input[i] == "'") {
      inquote=2;
      output+="'"
    } else if (input[i] != " " && input[i] != "\t") {
      output+=input[i];
    }
  }
  return output;
}
  //////////////////////////////////////////////////////////////////////////////
 ///////////////////////////// ARITHIMATIC PARSERS ////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function _CALCULATEADDATOM(input,lastpoint,currentpoint,negativeSwitch) {
  var calculatedNumber;
      
  // check to see if the math functions need to be run again on the inside
  // of the block, or if the block can be passed on to the next function
  if (_INPAREN(input.substring(lastpoint,currentpoint))) {
    calculatedNumber = _ASMATH(input.substring(lastpoint+1,currentpoint-1));
  }
  else {
    calculatedNumber = _MDMATH(input.substring(lastpoint,currentpoint));
  }
  
  // change the sign of the number based on the negative switch
  if (negativeSwitch) {calculatedNumber = -calculatedNumber;}
  
  return calculatedNumber;
}

/****************************** ADD SUBTRACT MATH *****************************\
| _ASMATH handles additions and subtractions in math
\******************************************************************************/
function _ASMATH(input) {
  var lastpoint = 0;
  var output;
  var first = true;
  var negativeSwitch = false;
  var parenCount = 0; // keep track of parenthasese
  var i = 0;
  
  // if the first number is negative skip the first character and set the
  // negative switch to true
  if (input[0]=='-') {
    i=1;
    lastpoint = 1;
    negativeSwitch = true;
  }
  
  for (; i < input.length; i++) {
    // If another addition or subtraction symbol is found outside parenthasese
    if ((input[i] == '+' || input[i] == '-') && parenCount == 0) {
      
      var calculatedNumber;
      
      calculatedNumber = _CALCULATEADDATOM(input,lastpoint,i,negativeSwitch);
      
      // modify the output number using the calculated number
      if (first) { output = calculatedNumber; first=false;}
      else {output += calculatedNumber}
      
      // check to see if the symbol that was just read is a subtraction sign
      negativeSwitch = (input[i] == '-');
      
      // make the next block start right after the + or - that was just read
      lastpoint = i+1;
    }
    // Ohterwise maintain a count of parenthathese
    else if (input[i] == '(') { parenCount++; }
    else if (input[i] == ')') { parenCount--; }
  }
  // parse the final block from the lastpoint to the end
  var calculatedNumber;
  if (_INPAREN(input.substring(lastpoint,input.length))) {
    calculatedNumber = _ASMATH (input.substring(lastpoint+1,input.length-1));
  }
  else{
    calculatedNumber = _MDMATH (input.substring(lastpoint,input.length));
  }
  
  if (negativeSwitch) {calculatedNumber = -calculatedNumber;}
  
  if (first) { output = calculatedNumber; first=false;}
  else {output += calculatedNumber;}
  
  return output;
}
/**************************** MULTIPLY DIVIDE MATH ****************************\
| This function breaks up all the multiplication and division symbols in the   |
| aritmatic and parses those blocks                                            |
\******************************************************************************/
function _MDMATH (input) {
  var output = 0;
  var lastpoint = 0;
  var parenCount = 0;
  var divideSwitch = false;
  var first = true;
  
  for (var i = 0; i < input.length; i++) {
    if ((input[i] == '*' || input[i] == '/') && !parenCount) {
      var calculatedNumber;
      if (_INPAREN(input.substring(lastpoint,i))) {
        calculatedNumber = _ASMATH (input.substring(lastpoint+1, i-1));
      }
      else {
        calculatedNumber = _ANALYZEATOM(input.substring(lastpoint,i));
      }
      
      if (divideSwitch) { output /= calculatedNumber; }
      else if (first) { output = calculatedNumber; first=false;}
      else {output *= calculatedNumber;}
      
      divideSwitch = (input[i] == '/');
      lastpoint = i+1;
    }
    else if (input[i] == '(') {parenCount++;}
    else if (input[i] == ')') {parenCount--;}
  }
  
  var calculatedNumber;
  if (_INPAREN(input.substring(lastpoint,input.length))){
    calculatedNumber = _ASMATH(input.substring(lastpoint+1,input.length-1));
  }
  else {
    calculatedNumber = _ANALYZEATOM(input.substring(lastpoint,input.length));
  }
  if (divideSwitch) output /= calculatedNumber;
  else if (first) {output = calculatedNumber; first=false;}
  else {output *= calculatedNumber;}
  return output;
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////// CHAR AND INT HELPER FUNCTIONS ///////////////////////
//////////////////////////////////////////////////////////////////////////////
/********************************** IS DIGIT **********************************\
| This function should only be passed one character of a string. It checks to  |
| see if that character is a number character (1234567890) or not and returns  |
| the result.                                                                  |
\******************************************************************************/
function isDigit (character) {
  return (typeof character == 'string' && character.length == 1 &&
          character.charCodeAt() >= 48 && character.charCodeAt() <= 57)
}

function isCapLetter (character) {
  return (typeof character == 'string' && character.length == 1 &&
          character.charCodeAt() >= 65 && character.charCodeAt() <= 90)
}

function letterValue (character) {
  return character.toUpperCase().charCodeAt() - 65;
}



  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////// ATOM PARSING HELPERS ////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/******************************* SPLIT ON COMMA *******************************\
| This function acts similarly to string.split(',') however it ignores commas  |
| that are within parenthathes
\******************************************************************************/
function _splitcomma (block) {
  var data = block.split(',');
  alert(data.length + " " + data + " " + block);
  var parenCount = 0;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] == '(') {
        parenCount++;
      }
      else if (data[i][j] == ')') {
        parenCount--;
      }
    }
    if (parenCount > 0) {
      data[i] += ',' + data.splice(i+1,1);
      parenCount = 0;
      i--;
    }
  }
  alert(data.length);
  return data;
}
/******************************* GET CELL VALUE *******************************\
| This function gets the value of a cell in the spreadsheet. It is a very      |
| simple function but allows for the code to be read more easily               |
\******************************************************************************/
function getCellValue (cell) {
  return data[cell];
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// ATOM PARSING ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/******************************** ANALYZE ATOM ********************************\
| the Analyse Atom function parses an element of the arithmatic and determines |
| if it is a function, a number, or a cell name                                |
\******************************************************************************/
function _ANALYZEATOM(input){
  // Input is a String
  if (_INQUOTES(input)) {
    return input.substring(1,input.length-1);
  }
  // Input is a Boolean
  if (input == "true"||input=="True"||input=="TRUE") return true;
  if (input == "false"||input=="False"||input=="FALSE") return false;
  // Input is a Function
  var functData = isFunction(input);
  if (functData != "false") {
    // Call the Function
    var parsed = _splitcomma (functData);
    var functionName = parsed.pop();
    if (window[functionName] == undefined) {
      alert("Function Not Found");
    }
    else {
      for (var i = 0; i < parsed.length; i++) {
        parsed[i] = eparse(parsed[i]);
      }
      return window[functionName].apply(this,parsed);
    }
  }
  // Input is a Cell Location
  var cellData = isCell(input)
  if (cellData != "false"){
    var cellValue = getCellValue(cellData);
    if (cellValue == undefined || cellValue == "") {
      alert("cell is undefined");
      return 0;
    }
    if (cellValue[0] == '=') {
      return eparse(cellValue.substring(1,cellValue.length));
    }
    return cellValue;
  }
  // Input is a Number
  return parseFloat(input);
}
/********************************* IS FUNCTION ********************************\
| Checks to see if an atom is a function, if it is this function returns a     |
| comma seperated string with the values for the function call and the         |
| arguments                                                                    |
\******************************************************************************/
function isFunction(atom) {
  if (atom[atom.length-1] == ')' && !isDigit(atom[0])) {
    // check for function
    var parencount = 0;
    var parenStart = -1;
    for (var i = 0; i < atom.length; i ++) {
      if (parencount == 0 && parenStart != -1){
        // ERROR
        return "false";
      }
      if (atom[i] == '(') {
        if (parenStart == -1) {
          parenStart = i;
        }
        parencount++;
      }
      else if (atom[i] == ')') {
        parencount--;
      }
    }
    if (parencount == 0) {
      var functionName = atom.substring(0,parenStart).split('.',-1);
      if (functionName.length == 1) {
        functionName[1]=functionName[0];
        functionName[0]='default';
      }
      if (functionName.length > 2) {
        alert("split failed badly");
      }
      var argumentList = atom.substring(parenStart+1,atom.length-1);
      if (argumentList.length != 0) {argumentList += ',';} // only put a comma if there are actual elements
      return argumentList + functionName[0]+'_'+functionName[1];
    }
  }
  else {
    return "false";
  }
}
/*********************************** IS CELL **********************************\
| A check to see if an atom is a cell name or not
\******************************************************************************/
function isCell (atom) {
  var atNumbers = false;
  var splitPosition = -1;
  if (atom[0] == '$') { // if the cell is an absolute cell value, ignore the $
    atom=atom.substring(1,atom.length);
  }
  if (!isCapLetter(atom[0])) {
    return "false";
  }
  for (var i = 0; i < atom.length; i++) {
    if (isCapLetter(atom[i]) && !atNumbers) {
      continue;
    }
    atNumbers=true;
    splitPosition = i;
    if (isDigit(atom[i])) {
      continue;
    }
    return "false";
  }
  // Convert Letters to numbers
  var letters = atom.substring(0,splitPosition);
  var resultingNumber = 0;
  for (var i = 0; i < letters.length; i++) {
    resultingNumber += Math.pow(26,i) * letterValue (letters[i]);
  }
  return (resultingNumber+','+atom.substring(splitPosition,atom.length));
}

  //////////////////////////////////////////////////////////////////////////////
 //////////////////////////////// ENCAPSULATORS ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/******************************* IN PARENTHESES *******************************\
| inparen checks to see if the atom is encapsulated in Parentheses, if so      |
| then the function returns true, if not the function returns false            |
\******************************************************************************/
function _INPAREN(atom) {
  var parentheseCount = 1;
  if (atom[0] == '(' && atom[atom.length-1] == ')') {
    for (var i = 1; i < atom.length-1; i++) {
      if (atom[i] == '(') parentheseCount++;
      else if (atom[i] == ')') parentheseCount--;
      // if pcount is zero then it is not just one big parenthase group
      if (parentheseCount == 0) return false;
    }
    return true;
  }
  return false;
}
/********************************** IN QUOTES *********************************\
| This function is very similar to resmath but it functions for quotes         |
| instead of Parentheses                                                       |
\******************************************************************************/
function _INQUOTES(atom) {
  if (atom.length < 2) {
    return false;
  }
  if ((atom[0] == '"' || atom[0]=="'") && (atom[atom.length-1] == '"' || atom[atom.length-1] == "'")) {
    // more tests may need to be in here, for quotes and parentheses inside each other
    return true;
  }
  return false;
}
