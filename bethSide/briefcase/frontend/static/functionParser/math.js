////////////////////////////////////////////////////////////////////////////////
function math_pow (base,exponent) {
  var output = base;
  for (var i = 1; i < exponent; i ++) {
    output = output*base;
  }
  return output;
}
////////////////////////////////////////////////////////////////////////////////
//statistical

// Alternate Arguments:
// Example:
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
function math_average() {
  var sum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    sum+=arguments[i];
  }
  return sum/arguments.length;
}
// standard deviation
function math_stdev() {
  var average = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    average+=arguments[i];
  }
  average = average/arguments.length;
  var deviation = 0;
  for (var i = 0; i < arguments.length; i++) {
    deviation+=(arguments[i]-average)*(arguments[i]-average);
  }
  return Math.sqrt(deviation/arguments.length);
}
function math_sum() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i];
  }
  return output;
}
function math_sumsq() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i]*arguments[i];
  }
  return output;
}
function math_product() {
  var output = arguments[0];
  for (var i =1; i < arguments.length; i++){
    output *= arguments[i];
  }
  return output;
}
////////////////////////////////////////////////////////////////////////////////
// simple unary functions
function math_abs(number) {
  return Math.abs(number);
}
function math_sqrt(number) {
  return Math.sqrt(number);
}
function math_quotient(numerator,denomenator) {
  return Math.floor(numerator/denomenator);
}
function math_mod(numerator,denomenator) {
  return numerator%denomenator;
}
function math_exp(number) {
  return Math.exp(number);
}
function math_ln(number) {
  return Math.log(number);
}
// rounding
function math_round(number) {
  return Math.round(number);
}
function math_round_up(number) {
  return Math.ceil(number);
}
function math_round_down(number) {
  return Math.floor(number);
}
// angle conversion
function math_degree(radian) {
  return radian * (180/Math.PI)
}
function math_radian(radian) {
  return degree * (Math.PI/180)
}
// even/odd
function math_iseven(number) {
  return Math.floor(number/2)==number/2;
}
function math_isodd(number) {
  return (Math.floor(number/2)+0.5==number/2);
}
////////////////////////////////////////////////////////////////////////////////
// trig functions
function math_sin(number) {
  return Math.sin(number);
}
function math_cos(number) {
  return Math.cos(number);
}
function math_tan(number) {
  return Math.tan(number);
}
function math_cot(number) {
  return 1/Math.tan(number);
}
function math_sec(number) {
  return 1/Math.cos(number);
}
function math_csc(number) {
  return 1/Math.sin(number);
}
// inverse trig functions
function math_asin(number) {
  return Math.asin(number);
}
function math_acos(number) {
  return Math.acos(number);
}
function math_atan(number) {
  return Math.atan(number);
}
function math_atan2(a,b) {
  return Math.atan2(a,b);
}
function math_acot(number) {
  return Math.acot(1/number);
}
function math_asec(number) {
  return Math.acos(1/number);
}
function math_acsc(number) {
  return Math.asin(1/number);
}
// hyperbolic functions
function math_sinh(number) {
  return 0.5*(Math.exp(number)-Math.exp(-number));
}
function math_cosh(number) {
  return 0.5*(Math.exp(number)+Math.exp(-number));
}
function math_tanh(number) {
  return (Math.exp(2*number)-1)/(Math.exp(2*number)+1);
}
// inverse hyperbolic functions
function math_asinh(number) {
  return Math.log(number+Math.sqrt(1+number*number));
}
function math_acosh(number) {
  return Math.log(number+Math.sqrt(number+1)*Math.sqrt(number-1));
}
function math_atanh(number) {
  return (Math.log(1+number)-Math.log(1-number))/2
}

////////////////////////////////////////////////////////////////////////////////
// constants
function math_pi() {
  return Math.PI;
}
function math_e() {
  return Math.E;
}

////////////////////////////////////////////////////////////////////////////////
function debug_zachClapper(){
  return ":(";
}
////////////////////////////////////////////////////////////////////////////////
//other unary functions
function math_fib(x) {
  var nums = new Array(0,1);
  while (x > 1) {
    nums[0] = nums[0] + nums[1];
    nums[1] = nums[0] + nums[1];
    x-=2;
  }
  return nums[x];
}
////////////////////////////////////////////////////////////////////////////////
//random
function math_random(){
  switch( arguments.length ){
  //arg[0] = max
  case 1:
    return Math.random() * arguments[0];
    break;
  //arg[0] = min; arg[1] = max;
  case 2:
    return Math.random() * (arguments[1]-arguments[0]) + arguments[0];
  default:
    return Math.random();
  }
}

////////////////////////////////////////////////////////////////////////////////
function default_sum() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i];
  }
  return output;
}
function default_if(expression, iftrue, iffalse) {
  if (expression) {
    return iftrue;
  }
  return iffalse;
}
function default_and() {
  for (var i=0; i<arguments.length; ++i) {
    if (arguments[i]==false || arguments[i]==0 || arguments[i] == "") return false;
  }
  return true;
}
function default_or() {
  var ret = false;
  for (var i=0; i<arguments.length && ret==false; ++i) {
    ret = ret || arguments[i];
  }
  // force return type to be bool
  if (ret) {
    return true;
  }
  return false;
}
function default_not(x) {
  return !x;
}
function default_equal() {
  for (var i=1; i<arguments.length; ++i) {
    if (arguments[0]!=arguments[i]) {
      return false;
    }
  }
  return true;
}
