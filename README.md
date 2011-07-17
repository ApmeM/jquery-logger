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
Other browsers hang up on such large objects

## Configuration options

Script is very simple and easi to use. It does not contain any configuration options yet.

## Copyrights

Created by Artem Votincev (apmem.org)

Distributed under BSD license

