/**
 * Extension for jQuery for log any data and objects into 
 * console.log, error console or specified HTML element
 * (for example div).
 * Created by Artem Votincev (apmem.org)
 * Copyiright (c) 2011 Artem Votincev (apmem.org)
 * Distributed under BSD license
 *
 * @requires jQuery.js
 * @version 1.2 
 * @author artem
 * @download https://github.com/ApmeM/jquery-logger
 * @usage 
 * $.log({"name": "value", "test": "test"});
 * $("#logDiv").log({"name": "value", "test": "test"});
 * 
 * WARNING: 
 * Use $("#logDiv").log($(document)); only in ff and opera. 
 * Other browsers hang up on this large objects
 */

(function($){

/**
 * global configuration for the whole plugin
*/
    var config = {
        // Logger can be disabled on production sites
        loggerEnabled: true,

        // Recursion behaviour trigger when object, that detected in current logging process is logged again.
        // Possible values:
        // * 'stop' - if recursion detected - show it as regular string and do not go deeper
        // * 'skip' - if recursion detected - it will be expanded anyway until maxLevel level not reached
        // be carefull if maxLevel is less then 0 and recursionBehaviour is set to 'skip' - iterations will never stopped and browser will hang up
        recursionBehaviour: 'stop',

        // Maximum iteration level (0 means no properties should be displayed). less then 0 means no maximum level is set (at least maxint level :) ).
        maxLevel: -1,

        // Default logger element will be used if $.log() is called. if element is null - browser console will be used.
        defaultElement: null,

        // Prefix for all properties to log into HTML elements.
        prefix: 'args'
    };

/**
 * Configure logger with non-default parameters
 * @param settings - new configuration settings
*/
	$.logConfig = function(settings){ 
        if (settings) $.extend(config, settings);
    }

/**
 * Constants used in code to view log in iappropriate format
 * for error console it should be displayed as text
 * for html controls it should be displayed as html
*/
	var LOG_HTML = 1;
	var LOG_TEXT = 2;

/**
 * Print name-value pair into string with provided logType
 * Replace html special chars to be sure we will not run script once again
*/
	var logPrint = function(name, value, logType){
		if(logType == 'html')
		{
			value = ("" + value).replace(/&/gi, '&amp;').replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
			return "<b>" + name + "</b> = " + value + "<br />";
		}
		else if(logType == 'text')
			return name + " = " + value + "\n";
		else 
			throw new Error('Index out of range exception: logType = ', logType);
	}

/**
 * Recursive function that check all properties and display
 * them in specified format
 * @param obj is object to display
 * @param objName is text representation of the object
 * @param curLevel show current recursion level. If it become 0 - recursion vill be stopped.
 * @throw index out of range exception (logType is not supplied)
 * @return string with all properies of provided object
 * @private
*/
	var logExpand = function(obj, objName, curLevel, currentConfig){
		var result = "";
        // We have reached the top level
        // Or recursion detected and should be stopped
        if 
            (
                curLevel == 0 ||
				(
                    $.inArray(obj, currentConfig.visitedObjs) != -1 && 
                    currentConfig.recursionBehaviour == 'stop'
                )
            )
        {
            return logPrint(objName, obj, currentConfig.logType);
        }

		currentConfig.visitedObjs.push(obj);

		// Check all properties of the current object
	    for (var i in obj) {
			var objVal = obj[i];
			if(
				// We need to log all objects
                // except nsXPCComponent (it will throw permission denied error)
				typeof(objVal) == 'object' &&
                Object.prototype.toString.call(objVal) != '[object nsXPCComponents]'
			){
				try { 
					result += logExpand(objVal, objName + '.' + i, curLevel - 1, currentConfig); 
				} catch(e){
					result += logPrint(objName + "." + i, objVal + " " + e, currentConfig.logType);
				}
			} else{
				// If this is not an object - just show its value
				result += logPrint(objName + "." + i, objVal, currentConfig.logType);
			}
		}
		return result;
	}

    var logConsole = function(obj, currentConfig) {
        // If we can write into console - we will do it:
		// firefox (with firebug), chrome and opera know what to do with it
		if(window.console && window.console.log) {
			if(window.console.log.apply) {
				console.log.apply(window.console, obj);
			} else {
				console.log(obj);
			}
		} else {
			// Firebug is not installed (or this browser do not support console)
			// expand object and throw an error to log it into error log
            $.extend(currentConfig, {logType: 'text', visitedObjs: []}); 
			var expanded = logExpand(obj, currentConfig.prefix, currentConfig.maxLevel, currentConfig);
		    throw new Error(expanded);
		}
     }
/**
 * main logging function
*/
    var log = function(element, arg){
        if (!config.loggerEnabled)
            return true;

		// Going to log into the specified control
		if(arg.length == 0) // Nothing to log, everything logged successfully :)
			return true;

        if (element == null){
            element = config.defaultElement;
        }

        var currentConfig = {};
        $.extend(currentConfig, config); 


        // Make logging in separate thread to not stop main thread if something fail.
        setTimeout(function(){
		    // Splice arguments object into array of objects 
	        // (it have a very strange behavior)
            var obj = [].slice.call(arg);

            // No element set, and default element is not set eather
            // Will log into the browser console
            if (element == null){
                logConsole(obj);
            }

            $.extend(currentConfig, {logType: 'html', visitedObjs: []}); 
            var text = logExpand(obj, currentConfig.prefix, currentConfig.maxLevel, currentConfig);
            $(element).html($(element).html() + "<hr>" + text);
        }, 0);
    }

/**
 * jQuery extension $.log print all arguments of the function into window.console
 * or if it is not exist - to error console with the help of throw Error in separate thread.
 * @member $
*/
	$.log = function(){ 
        log(null, arguments);
		return true;
	};

/**
 * jQuery extension $.fn.log print all arguments of the function into the html object
 * @member $
*/
	$.fn.log = function() {
        log(this, arguments);
        return true;
	}
})(jQuery);

