// Define bindEvent() that is a cross-browser replacement for addEventListener
function bindEvent(el, eventName, eventHandler) {

	if (el === undefined) {
		console.log('bindEvent() ERROR: arg1 is undefined; not adding listener for ' + eventName);
		return;
	}

	if(	el === null){
		console.log('bindEvent() ERROR: arg 1 is null; not adding listener for ' + eventName);
		return;
	}

	console.log('bindEvent() adding listener for ' + eventName + ' to '+ el);

	if(el.addEventListener){
    	el.addEventListener(eventName, eventHandler);
  	}
  	else if(el.attachEvent){
    	el.attachEvent('on'+eventName, eventHandler);
 	}
}


// Define getElementsByClassName function for IE
// http://forums.devshed.com/javascript-development-115/javascript-get-all-elements-of-class-abc-24349.html

if (document.getElementsByClassName === undefined) {
	document.getElementsByClassName = function(className)
	{
		var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
		var allElements = document.getElementsByTagName("*");
		var results = [];

		var element;
		for (var i = 0; (element = allElements[i]) !== null; i++) {
			var elementClass = element.className;
			if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
				results.push(element);
		}

		return results;
	}
}


function writeToDebug(string){
	var oDebug = document.getElementById("debug");
	if(oDebug){
		oDebug.appendChild(document.createTextNode(string));
		oDebug.appendChild(document.createElement("br"));
	}
}


function objectMerge(oSlave,oMaster){

	// Since Objects pass by reference you run it like:
	// var slave = {
	// }
	// var master = {
	// }
	// objectMerge(slave,master)
	// and slave will be updated by master

	var key;
	for(key in oMaster){

		// If is object, call recursively
		if(oMaster[key] instanceof Object){
			//writeToDebug('objectMerge() (recursive START '+key+')');
			objectMerge(oSlave[key],oMaster[key]);
			//writeToDebug('objectMerge() (recursive END '+key+')');
		}
		else{
			oSlave[key] = oMaster[key];
			//writeToDebug('objectMerge() '+key+': '+oMaster[key]);
		}

	}

}

function objectTrace(oObject){
	var key;
	for(key in oObject){

		// If is object, call recursively
		if(oObject[key] instanceof Object){
			console.log('objectTrace() (recursive START '+key+')');
			objectTrace(oObject[key]);
			console.log('objectTrace() (recursive END '+key+')');
		}
		else{
			console.log('objectTrace() '+key+': '+oObject[key]);
		}

	}
}



function getOffset( el ) {

	// 2012.08.15 user offset() instead

	// Get the x,y position of any element.  In webkit (Safari, Chorme) the
	// y position is relative to the top of the currently viewable area. For
	// example, If a div starts out 100 px below the top of the page, y will
	// return 100.  If you scroll down 60px, thus moving the div 60 px closer
	// to the top, y will return 40 px. However, in FF, the y position is
	// relative to the top of the document.  This makes it a real pain in the
	// ass.

	// http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript

    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


function offset(element){

	// Get the x,y position of any element relative to the top of the document
	// in all browsers

    var body = document.body,
        //win = document.defaultView,
        win = window,
        docElem = document.documentElement,
        box = document.createElement('div');
    box.style.paddingLeft = box.style.width = "1px";
    body.appendChild(box);
    var isBoxModel = box.offsetWidth == 2;
    body.removeChild(box);
    box = element.getBoundingClientRect();
    var clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
    return {
        top : box.top  + scrollTop  - clientTop,
        left: box.left + scrollLeft - clientLeft
    };
}



function getWindowSize(){

	// http://www.java-samples.com/showtutorial.php?tutorialid=1015

	var myWidth;
	var myHeight;

	if( typeof( window.innerWidth ) == 'number' ) {

		// Non-IE

		myWidth = window.innerWidth;
		myHeight = window.innerHeight;

	} else if( document.documentElement &&

		( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {

		//IE 6+ in 'standards compliant mode'

		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;

	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {

		//IE 4 compatible

		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;

	}

	return {
		'height':myHeight,
		'width':myWidth
	};
}



function addEvent(e, func, arg){

	// Add multiple functions to a specific window event in a consise way that
	// is cross-platform (unfortunately event listeners are browser specific).
	// Example call window.addEvent('onload',func) Note that inside of the
	// function "this" refers to the window object.  Could easily add params
	// in the form of an Object

	// http://www.dannytalk.com/how-to-handle-multiple-window-events-in-javascript/.

   // alert('addEvent: '+e+', '+func);

    var old_event = this[e];
    if (old_event){
        // Set the event to a function that executes the previous function func
        // alert('adding +'+e);
        this[e] = function() {
            old_event();
            func(arg);
        };
    }
    else{
		// Set the event to a function that executes func
        this[e] = function(){
        	func(arg);
        }
	}
}



function getScrollTop(){

	// Deciding which one to use is not that easy. Chrome and Safari always use document.body.scrollTop, while IE and Firefox use document.body.scrollTop for quirks mode and document.documentElement.scrollTop for standard mode. Your best bet may be something like:

	// var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	// var scrolLeft = document.body.scrollLeft || document.documentElement.scrollLeft;

	// http://www.xinotes.org/notes/note/969/

	return document.body.scrollTop || document.documentElement.scrollTop;

}

var parseHash = function(hash){

	// @parameter (String) hash in URL-encoded format with leading "#" (#node=___&key=____&...=...)
	// @return (Object) with a property/value for each URL parameter

	// Parse leading "#" and split into array at each "&"
	var asHash = hash.substring(1,hash.length).split('&'); // ["node=____","key=____"]

	// Build object
	var oHash = {};
	for(var n=0; n<asHash.length; n++){
		asKeyValue = asHash[n].split('=');
		oHash[asKeyValue[0]] = asKeyValue[1];
	}
	return oHash;
}

function loadjscssfile(filename, filetype){

  var fileref;

	if (filetype=="js"){
		//if filename is a external JavaScript file
		fileref=document.createElement('script')
		fileref.setAttribute("type","text/javascript")
		fileref.setAttribute("src", filename)
	}
	else if (filetype=="css"){
		//if filename is an external CSS file
		fileref=document.createElement("link")
		fileref.setAttribute("rel", "stylesheet")
		fileref.setAttribute("type", "text/css")
		fileref.setAttribute("href", filename)
	}
	if (typeof fileref!="undefined")
	document.getElementsByTagName("head")[0].appendChild(fileref)
}

function abbreviate (user_str, user_max, user_suffix) {
    var startend_spaces = /^\s+|\s+$/g;
    var linebreak_spaces = /[\r\n]*\s*[\r\n]+/g;
    var tab_spaces = /[ \t]+/g;
    var ending_space = /[ ]$/g;
    var abbr = '';
    var suffix = (typeof user_suffix !== 'undefined' ? user_suffix : '...');
    var max = user_max - suffix.length;
    var counter = 0;
    var string = user_str;
    var len;

    // if after cleaning up all extraneous white space, if the length of the
    // string is less than the `max` value then just return the string
    if ((string = string.replace(startend_spaces, '').replace(linebreak_spaces, ' ').replace(tab_spaces, ' ')).length <= max) {
        return string;
    }

    string = string.split(' ');
    len = string.length;

    while (counter < len) {
        // individual characters of a string can be accessed via bracket notation
        if ((abbr + string[counter]).length < max) {
            abbr += string[counter] + ' ';
        } else {
            break;
        }

        counter++;
    }

    return abbr.replace(ending_space, '') + suffix;
}

