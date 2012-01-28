/*
*/
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
/********************************* MATH - POW  ********************************\
| Alternate Arguments:                                                         |
| Example: math.pow(2,3) returns 8                                             |
| Summary: This is the exponential function, you take the first number and you |
|   raise it to the exponent of the second number                              |
\******************************************************************************/
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
/********************************* MATH - MIN *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_min() {
  var minimum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    if (minimum > arguments[i]) {
      minimum = arguments[i];
    }
  }
  return minimum;
}
/* MATH - AVERAGE *\
|
\******************/
function math_average() {
  // this used to have a comment
  var sum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    sum+=arguments[i];
  }
  return sum/arguments.length;
}
// standard deviation
/******************************* MATH - AVERAGE *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_average() {
  // this used to have a comment
  var sum = arguments[0];
  for (var i = 1; i < arguments.length; i++) {
    sum+=arguments[i];
  }
  return sum/arguments.length;
}
// standard deviation
/********************************* MATH - SUM *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sum() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i];
  }
  return output;
}
/******************************** MATH - SUMSQ ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sumsq() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i]*arguments[i];
  }
  return output;
}
/******************************* MATH - PRODUCT *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_product() {
  var output = arguments[0];
  for (var i =1; i < arguments.length; i++){
    output *= arguments[i];
  }
  return output;
}
////////////////////////////////////////////////////////////////////////////////
// simple unary functions
/********************************* MATH - ABS *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_abs(number) {
  return Math.abs(number);
}
/********************************* MATH - SQRT ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sqrt(number) {
  return Math.sqrt(number);
}
/******************************* MATH - QUOTIENT ******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_quotient(numerator,denomenator) {
  return Math.floor(numerator/denomenator);
}
/********************************* MATH - MOD *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_mod(numerator,denomenator) {
  return numerator%denomenator;
}
/********************************* MATH - EXP *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_exp(number) {
  return Math.exp(number);
}
/********************************** MATH - LN *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_ln(number) {
  return Math.log(number);
}
// rounding
/******************************** MATH - ROUND ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_round(number) {
  return Math.round(number);
}
/******************************* MATH - ROUND_UP ******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_round_up(number) {
  return Math.ceil(number);
}
/****************************** MATH - ROUND_DOWN *****************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_round_down(number) {
  return Math.floor(number);
}
// angle conversion
/******************************** MATH - DEGREE *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_degree(radian) {
  return radian * (180/Math.PI)
}
/******************************** MATH - RADIAN *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_radian(radian) {
  return degree * (Math.PI/180)
}
// even/odd
/******************************** MATH - ISEVEN *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_iseven(number) {
  return Math.floor(number/2)==number/2;
}
/******************************** MATH - ISODD ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_isodd(number) {
  return (Math.floor(number/2)+0.5==number/2);
}
////////////////////////////////////////////////////////////////////////////////
// trig functions
/********************************* MATH - SIN *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sin(number) {
  return Math.sin(number);
}
/********************************* MATH - COS *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_cos(number) {
  return Math.cos(number);
}
/********************************* MATH - TAN *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_tan(number) {
  return Math.tan(number);
}
/********************************* MATH - COT *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_cot(number) {
  return 1/Math.tan(number);
}
/********************************* MATH - SEC *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sec(number) {
  return 1/Math.cos(number);
}
/********************************* MATH - CSC *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_csc(number) {
  return 1/Math.sin(number);
}
// inverse trig functions
/********************************* MATH - ASIN ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_asin(number) {
  return Math.asin(number);
}
/********************************* MATH - ACOS ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_acos(number) {
  return Math.acos(number);
}
/********************************* MATH - ATAN ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_atan(number) {
  return Math.atan(number);
}
/******************************** MATH - ATAN2 ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_atan2(a,b) {
  return Math.atan2(a,b);
}
/********************************* MATH - ACOT ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_acot(number) {
  return Math.acot(1/number);
}
/********************************* MATH - ASEC ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_asec(number) {
  return Math.acos(1/number);
}
/********************************* MATH - ACSC ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_acsc(number) {
  return Math.asin(1/number);
}
// hyperbolic functions
/********************************* MATH - SINH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_sinh(number) {
  return 0.5*(Math.exp(number)-Math.exp(-number));
}
/********************************* MATH - COSH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_cosh(number) {
  return 0.5*(Math.exp(number)+Math.exp(-number));
}
/********************************* MATH - TANH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_tanh(number) {
  return (Math.exp(2*number)-1)/(Math.exp(2*number)+1);
}
// inverse hyperbolic functions
/******************************** MATH - ASINH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_asinh(number) {
  return Math.log(number+Math.sqrt(1+number*number));
}
/******************************** MATH - ACOSH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_acosh(number) {
  return Math.log(number+Math.sqrt(number+1)*Math.sqrt(number-1));
}
/******************************** MATH - ATANH ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_atanh(number) {
  return (Math.log(1+number)-Math.log(1-number))/2
}

////////////////////////////////////////////////////////////////////////////////
// constants
/********************************** MATH - PI *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_pi() {
  return Math.PI;
}
/********************************** MATH - E **********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function math_e() {
  return Math.E;
}

////////////////////////////////////////////////////////////////////////////////
/***************************** DEBUG - ZACHCLAPPER ****************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function debug_zachClapper(){
  return ":(";
}
////////////////////////////////////////////////////////////////////////////////
//other unary functions
/********************************* MATH - FIB *********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
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
/******************************** MATH - RANDOM *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
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
/******************************** DEFAULT - SUM *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function default_sum() {
  var output = 0;
  for (var i =0; i < arguments.length; i++){
    output += arguments[i];
  }
  return output;
}
/******************************** DEFAULT - IF ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function default_if(expression, iftrue, iffalse) {
  if (expression) {
    return iftrue;
  }
  return iffalse;
}
/******************************** DEFAULT - AND *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function default_and() {
  for (var i=0; i<arguments.length; ++i) {
    if (arguments[i]==false || arguments[i]==0 || arguments[i] == "") return false;
  }
  return true;
}
/******************************** DEFAULT - OR ********************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
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
/******************************** DEFAULT - NOT *******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function default_not(x) {
  return !x;
}
/******************************* DEFAULT - EQUAL ******************************\
| Alternate Arguments:
| Example:
| Summary:
|
\******************************************************************************/
function default_equal() {
  for (var i=1; i<arguments.length; ++i) {
    if (arguments[0]!=arguments[i]) {
      return false;
    }
  }
  return true;
}
