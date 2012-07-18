/* 
 * Original TextareaDecorator.js
 * written by Colin Kuebler 2012
 * Part of LDT, dual licensed under GPLv3 and MIT
 * Builds and maintains a styled output layer under a textarea input layer
 */

function TextareaDecorator(output, textarea, parser ){
	/* INIT */
	var api = this;
	
	// coloring algorithm
	var color = function( input, output, parser ){
	  var d = new Date();
    var startTime = d.getTime();
    
    
		var oldTokens = output.childNodes;
		var newTokens = parser.tokenize(input);
		
		d = new Date();
    var tokenizerTime = d.getTime();
		
		
		//alert("Tokens| New:"+newTokens.length+" Old: "+oldTokens.length);
		
		
		var firstDiff, lastDiffNew, lastDiffOld;
		// find the first difference
		for( firstDiff = 0; firstDiff < newTokens.length && firstDiff < oldTokens.length; firstDiff++ )
			if( newTokens[firstDiff] !== oldTokens[firstDiff].textContent ) break;
			
	  d = new Date();
    var firstDiffTime = d.getTime();
    var firstDiffSave = firstDiff;
			
		// trim the length of output nodes to the size of the input
		while( newTokens.length < oldTokens.length )
			output.removeChild(oldTokens[firstDiff]);
		// find the last difference
		for( lastDiffNew = newTokens.length-1, lastDiffOld = oldTokens.length-1; firstDiff < lastDiffOld; lastDiffNew--, lastDiffOld-- )
			if( newTokens[lastDiffNew] !== oldTokens[lastDiffOld].textContent ) break;
		
		d = new Date();
    var lastDiff = d.getTime();
    var lastDiffNewSave = lastDiffNew;
    var lastDiffOldSave = lastDiffOld;
    
    
		// update modified spans
		for( ; firstDiff <= lastDiffOld; firstDiff++ ){
			oldTokens[firstDiff].className = parser.identify(newTokens[firstDiff]);
			oldTokens[firstDiff].textContent = oldTokens[firstDiff].innerText = newTokens[firstDiff];
		}
		
		d = new Date();
    var updateTime = d.getTime();
		
		// add in modified spans
		for( var insertionPt = oldTokens[firstDiff] || null; firstDiff <= lastDiffNew; firstDiff++ ){
			var span = document.createElement("span");
			span.className = parser.identify(newTokens[firstDiff]);
			span.textContent = span.innerText = newTokens[firstDiff];
			output.insertBefore( span, insertionPt );
			
		}
		
		d = new Date();
    var endTime = d.getTime();
    
    
    /*alert("Tokenized In:    "+(tokenizerTime-startTime)     + "ms\n" +
          "FirstDiff In ("+firstDiffSave+"):    "+(firstDiffTime-tokenizerTime) + "ms\n" +
          "Last Diff In ("+lastDiffNew+","+lastDiffOld+"):    "+(lastDiff-firstDiffTime)      + "ms\n" +
          "Update Color In: "+(updateTime-lastDiff)         + "ms\n" +
          "New Color In:    "+(endTime-updateTime)+"ms");/**/
	};
	
	var sanitizeEscapes = function(input) {
	  input = input.replace(/&lt;?/g,"<");
	  input = input.replace(/&gt;?/g,">");
	  input = input.replace(/&amp;?/g,"&");
	  //return input.replace(/&lt;?/g,"<").replace(/&gt;?/g,">").replace(/&amp;?/g,"&");
	  return input;
	}

	api.input = textarea;
	api.output = output;
	api.update = function(){
		var input = textarea.innerHTML;
		//alert(input);
		input = sanitizeEscapes(input);
		/*input = input.replace(/&lt;?/g,"<").replace(/&gt;?/g,">").replace(/&amp;?/g,"&");
		*/
		//input = input.replace(/<br>/g,"\n");
		if( input ){
			color( input, output, parser );
			// determine the best size for the textarea
			var lines = input.split('\n');
			// find the number of columns
			var maxlen = 0, curlen;
			for( var i = 0; i < lines.length; i++ ){
				// calculate the width of each tab
				var tabLength = 0, offset = -1;
				while( (offset = lines[i].indexOf( '\t', offset+1 )) > -1 ){
					tabLength += 7 - (tabLength + offset) % 8;
				}
				var curlen = lines[i].length + tabLength;
				// store the greatest line length thus far
				maxlen = maxlen > curlen ? maxlen : curlen;
			}
			textarea.cols = maxlen + 1;
			textarea.rows = lines.length + 1;
		} else {
			// clear the display
			output.innerHTML = '';
			// reset textarea rows/cols
			textarea.cols = textarea.rows = 1;
		}
	};
  
  
  // Set all the event for when the TextDecorator should update the hilighting
	textarea.onpaste = 
	textarea.oncut = 
	textarea.onkeydown = function() {setTimeout(function() {api.update()},0)};

	
	// initial highlighting
	api.update();

	return api;
};

