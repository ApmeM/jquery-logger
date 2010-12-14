/**
 * Extension for jQuery for log any data and objects into 
 * console.log, error console or specified DOM element
 * (for example div).
 * Created by Artem Votincev (apmem.org)
 * Copyiright (c) 2010 Artem Votincev (apmem.org)
 *
 * @requires jQuery.js
 * @version 1.0 
 * @author artem
 */

(function($){

	var LOG_HTML = 1;
	var LOG_TEXT = 2;
	
	var logExpand = function(obj, objName, logType, visitedObjs){
		var result = "";
	    for (var i in obj) {
			if(typeof obj[i] == 'object'){
				if($.inArray(obj[i], visitedObjs) == -1){
					visitedObjs.push(obj[i]);
					result += logExpand(obj[i], objName + '.' + i, logType, visitedObjs);
				}else
				{
					if(logType == LOG_HTML)
						result += "<b>" + objName + "." + i + "</b> = " + obj[i] + "<br />";
					else if(logType == LOG_TEXT)
						result += objName + "." + i + " = " + obj[i] + "\n";
					else 
						throw new Error('Index out of range exception: logType = ', logType);
				}
			} else{
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

	$.fn.log = function(obj) {
		// Going to log into the specified control
//		var obj = [].slice.call(arguments);
		var arr = [];
		var args = logExpand(obj, 'args', LOG_HTML, arr);
		this.html(args);
		arr = [];
	}
})(jQuery);

