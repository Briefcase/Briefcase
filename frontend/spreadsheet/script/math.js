function math_pow (base,exponent) {
  var output = base;
  for (var i = 1; i < exponent; i ++) {
    output = output*base;
  }
  return output;
}

function default_sum() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i];
  }
  return output;
}

function math_max() {
  var maximum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    if (maximum < arguments[i]){
      maximum = arguments[i];
    }
  }
  return maximum;
}

function math_min() {
  var minimum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    if (minimum > arguments[i]) {
      minimum = arguments[i];
    }
  }
  return minimum;
}
