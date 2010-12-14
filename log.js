(function($){
	$.logExpand = function(obj, objName){
		var result = "";
	    for (var i in obj) {
			if(typeof obj[i] == 'object')
				result += $.logExpand(obj[i], objName+'.'+i);
			else
				result += "<b>" + objName + "." + i + "</b> = " + obj[i] + "<br />\n";
		}
		return result;
	}

	$.log = function(){ 
		if(arguments.length == 0) // Nothing to log, everything logged successfully :)
			return true;

		var args = arguments;
		
		// This is the standard; firebug and newer webkit browsers support this
		if(window.console && window.console.log) {
			if(window.console.log.apply) {
				console.log.apply(window.console, args);
			} else {
				console.log(args);
			}
		}else if(opera) {
			opera.postError(args); 
		} else {
			return false;
		}
		return true;
	};

	$.fn.log = function(obj) {
		// Going to log into the specified control
		var args = $.logExpand(obj, 'arguments');
		this.html(args);
	}
})(jQuery);

