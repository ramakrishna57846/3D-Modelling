
var debug = 1;

var cube;
var cylinder;
var sphere;
var cone;
var socket;

function initViewPort()
{
	socket = io();
	
	/* Create the default scene */
    createDefaultScene();
}

