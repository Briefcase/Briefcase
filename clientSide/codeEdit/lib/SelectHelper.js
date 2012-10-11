/* SelectHelper.js
 * written by Colin Kuebler 2012
 * Part of LDT, dual licensed under GPLv3 and MIT
 * Convenient utilities for cross browser textarea selection manipulation
 */

function reverseString(s){
	return s.split("").reverse().join("");
}

var SelectHelper = {
	add: function( element ){
		element.insertAtCursor = element.createTextRange ?
			// IE version
			function(x){
				document.selection.createRange().text = x;
			} :
			// standards version
			function(x){
				var s = element.selectionStart,
					e = element.selectionEnd,
					v = element.value;

                //This is for Chrome
                var event = document.createEvent('TextEvent');
                if( event.initTextEvent ){
                    element.setSelectionRange( 0, element.value.length );
                    event.initTextEvent("textInput", true, true, null, v.substring(0, s) + x + v.substring(e));
                    element.dispatchEvent(event);
                }
                //This is for Firefox
                else{
                    element.value = v.substring(0, s) + x + v.substring(e);
                }

				s += x.length;
				element.setSelectionRange(s, s);
			};

        element.tabSelection = function(){
            var s = element.selectionStart,
                e = element.selectionEnd,
                v = element.value;
            //Change s to beginning of selected line
            if( v[s] !== '\n' ){
                if( v.substring( 0, s ).indexOf('\n') !== -1 ){
                    s -= reverseString( v.substring( 0, s ) ).indexOf('\n') + 1;
                }
                else{
                    s = 0;
                }
            }
            var newText = v.substring( s, e ).replace(/\n/g, "\n\t");
            if( !s ){
                newText = '\t' + newText;
            }
            //This is for Chrome
            var event = document.createEvent('TextEvent');
            if( event.initTextEvent ){
                element.setSelectionRange( 0, element.value.length );
                event.initTextEvent("textInput", true, true, null, v.substring(0, s) + newText + v.substring(e));
                element.dispatchEvent(event);
            }
            //This is for Firefox
            else{
                element.value = v.substring(0, s) + newText + v.substring(e);
            }
            e = s + newText.length;
            //Change e to end of selected line
            v = element.value;
            if( v[e] !== '\n' ){
                if( v.substring( e ).indexOf( '\n' ) !== -1 ){
                    e += v.substring( e ).indexOf( '\n' );
                }
                else{
                    e = v.length;
                }
            }
            element.setSelectionRange( s, e );
        };

        element.untabSelection = function(){
            var s = element.selectionStart,
                e = element.selectionEnd,
                v = element.value;
            //Change s to beginning of selected line
            if( v[s] !== '\n' ){
                if( v.substring( 0, s ).indexOf('\n') !== -1 ){
                    s -= reverseString( v.substring( 0, s ) ).indexOf('\n') + 1;
                }
                else{
                    s = 0;
                }
            }
            var newText = v.substring( s, e ).replace(/\n\t/g, "\n");
            if( !s && v[s] === '\t' ){
                newText = newText.substring( 1, newText.length );
            }

            //This is for Chrome
            var event = document.createEvent('TextEvent');
            if( event.initTextEvent ){
                element.setSelectionRange( 0, element.value.length );
                event.initTextEvent("textInput", true, true, null, v.substring(0, s) + newText + v.substring(e));
                element.dispatchEvent(event);
            }
            //This is for Firefox
            else{
                element.value = v.substring(0, s) + newText + v.substring(e);
            }

            e = s + newText.length;
            //Change e to end of selected line
            v = element.value;
            if( v[e] !== '\n' ){
                if( v.substring( e ).indexOf( '\n' ) !== -1 ){
                    e += v.substring( e ).indexOf( '\n' );
                }
                else{
                    e = v.length;
                }
            }
            element.setSelectionRange( s, e );
        };
	}
};

