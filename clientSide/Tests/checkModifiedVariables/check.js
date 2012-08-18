//console.log(window.onload);

onload = function () {alert("Not Loaded")};
onload = function () {alert("Loaded")};


// You probably dont want to have two onloads being set
window._onload = [];
window._onload.push(window.onload);
window.onload=function(){for(a in _onload) {_onload[a]()}}
Object.defineProperty(window,"onload",{get:function()){return this._onload},set:function(n){this._onload.push(n);}});

// Lets add a few more onloads to test the process
onload = function () {alert("Loaded2")};
onload = function () {alert("Loaded3")};

console.log("ONLOAD:" + window.onload);