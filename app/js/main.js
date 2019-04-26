
var debug = 1;

var cube;
var cylinder;
var sphere;
var cone;
var socket;

function initViewPort()
{
  socket = io();

  socket.on('importData', function(msg){
    importData(msg);

  });
  
  /* Create the default scene */
  setTimeout(function () { createScene(null); },10);
}

