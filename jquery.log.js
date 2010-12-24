/**
 * Extension for jQuery for log any data and objects into 
 * console.log, error console or specified HTML element
 * (for example div).
 * Created by Artem Votincev (apmem.org)
 * Copyiright (c) 2010 Artem Votincev (apmem.org)
 *
 * @requires jQuery.js
 * @version 1.0 
 * @author artem
 */

(function($){

/**
 * Constants used in code to view log in iappropriate format
 * for error console it should be displayed as text
 * for html controls it should be displayed as html
*/
	var LOG_HTML = 1;
	var LOG_TEXT = 2;

/**
 * checking error "Permission denied for <file://> to get property XPCComponents.classes"
**/
	var test = '';
	try{
	    test = Components.classes;
	} catch(e){
		alert(e);
	}
    alert(test);

/**
 * Recursive function that check all properties and display
 * them in specified format
 * @param obj is object to display
 * @param objName is text representation of the object
 * @param logType reflect displaying type (should be one of the types from const section)
 * @param visitedObjs is array with all objects was visited in previous (to avoid recursion)
 * @throw index out of range exception (logType is not supplied)
 * @return string with all properies of provided object
 * @private
*/
	var logExpand = function(obj, objName, logType, visitedObjs){
		var result = "";
		// Check all properties of the current object
	    for (var i in obj) {
			// If current property is object - we need to show all its properties too
			if(typeof obj[i] == 'object'){
				// if this object was not visited - go into its properties
				if($.inArray(obj[i], visitedObjs) == -1){
					visitedObjs.push(obj[i]);
					result += logExpand(obj[i], objName + '.' + i, logType, visitedObjs);
				}else {
				// if this object already wisited - just show name and skip it
					if(logType == LOG_HTML)
						result += "<b>" + objName + "." + i + "</b> = " + obj[i] + "<br />";
					else if(logType == LOG_TEXT)
						result += objName + "." + i + " = " + obj[i] + "\n";
					else 
						throw new Error('Index out of range exception: logType = ', logType);
				}
			} else{
				// If this is not an object - just show its value
				if(logType == LOG_HTML)
					result += "<b>" + objName + "." + i + "</b> = " + obj[i] + "<br />";
				else if(logType == LOG_TEXT)
					result += objName + "." + i + " = " + obj[i] + "\n";
				else 
					throw new Error('Index out of range exception: logType = ', logType);
			}
		}
		return result;
	}
/**
 * jQuery extension $.log print all arguments of the function into window.console
 * or if it is not exist - to error console with the help of throw Error in separate thread.
 * @member $
*/
	$.log = function(){ 
		if(arguments.length == 0) // Nothing to log, everything logged successfully :)
			return true;

		// Splice arguments object into array of objects 
		// (it have a very strange behavior)
		var args = [].slice.call(arguments);
		
		// If we can write into console - we will do it:
		// firefox (with firebug), chrome and opera know what to do with it
		if(window.console && window.console.log) {
			if(window.console.log.apply) {
				console.log.apply(window.console, args);
			} else {
				console.log(args);
			}
		} else {
			// Firebug is not installed (or this browser do not support console)
			// expand object and throw it in separate thread to not stop current operation
			var arr = [];
			var expanded = logExpand(args, 'args', LOG_TEXT, arr);
			arr = [];
		    setTimeout(function(){ throw new Error(expanded); }, 0);
		}
		return true;
	};

/**
 * jQuery extension $.fn.log print all arguments of the function into the html object
 * @member $
*/
	$.fn.log = function(obj) {
		// Going to log into the specified control
//		var obj = [].slice.call(arguments);
		var arr = [];
		var args = logExpand(obj, 'args', LOG_HTML, arr);
		this.html(this.html() + "<hr>" + args);
		arr = [];
	}
})(jQuery);

