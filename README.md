# jQuery logger plugin

## Introduction

jQuery logger plugin allow to log any data not only to browser console, but even to any html element (such as div).

It contain a function to expand javascript objects to log something more usefull then [Object object] :). 
With function to detect recursion usages to prevent brousers to hang up (do not help for IE and chrome :( ).

## Demonstration

Demonstration abailable at http://apmem.github.com/jquery-logger/example

## browser support

Currently the following browsers were tested to work with this menu plugin:

* Firefox
* Opera
* Chrome
* IE 6-9

Most of this browsers (except opera and FF) are unable to show DOM elements because all of them contains links to each other and there is too many elements.
Because of this all other browsers hang up and ask to terminate script. Be careful when using it on production servers.

## Installation and usage

Script requred jquery.js to be included into the document before this script.

After the script attached it can be used in one of the following ways:

 * $.log({"name": "value", "test": "test"});
 * $("#logDiv").log({"name": "value", "test": "test"});

### WARNING: 

Use $("#logDiv").log($(document)); only in ff and opera. 

If maxLevel is not set - other browsers hang up on such large objects

## Configuration options

Logger have a configuration function logConfig to change predefined parameters that will be applied to all future log() calls.

The following parameters can be set:
* loggerEnabled (default: true) - Set is logger enabled. Logger can be disabled on production sites
* recursionBehaviour (default 'stop') - Recursion behaviour trigger when object, that detected in current logging process is logged again.
** Possible values:
** * 'stop' - if recursion detected - show it as regular string and do not go deeper
** * 'skip' - if recursion detected - it will be expanded anyway until maxLevel level not reached
* maxLevel (default: -1) - Maximum iteration level (0 means no properties should be displayed). -1 means no maximum level is set.
* defaultElement (default: null) - default logger element will be used if $.log() is called. if element is null - browser console will be used.
* prefix(default: 'args' - Prefix for all properties to log.

### WARNING:

Be carefull if maxLevel is set to -1 and recursionBehaviour is set to 'skip' - iterations will never stopped and browser will hang up

## Copyrights

Created by Artem Votincev (apmem.org)

Distributed under BSD license

