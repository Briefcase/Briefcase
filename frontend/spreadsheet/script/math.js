function math_pow (base,exponent) {
  var output = base;
  for (var i = 1; i < exponent; i ++) {
    output = output*base;
  }
  return output;
}
