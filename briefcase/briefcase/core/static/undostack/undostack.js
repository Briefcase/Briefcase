// How does the undo stack work?
// How will it be the same for all other functions
// A map of values to be changed
// 
//
//
//
//
//
//
//
//
//
//

var undoStack = [];
var redoStack = [];

var _undoFunction;
var _redoFunction;

function initilizeUndoStack(undoFunction, redoFunction) {
	_undoFunction = undoFunction;
	_redoFunction = redoFunction;
}

function setUpdate() {
	
}

function putIntoStack(objects) {
	undoStack.put
}

function undo() {

}

function redo() {

}