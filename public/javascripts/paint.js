var canvas;
var context;
var color;
var drawBool;
$(document).ready(function() {
  init();
});


function init() 
{
  //init canvas and context
  canvas = $('canvas')[0];
  context = canvas.getContext("2d");
  
  bindPaintbrush("normal");
 
  //Makes palette boxes selectable
  $('.color').bind('click', function() {
    $('.selected').toggleClass('selected');
    $(this).toggleClass('selected');
  });

}

//Add new behaviors here 
//example addition: inverse: draw in opposite direction of brush movement
function bindPaintbrush(behavior)
{
  if (behavior == "normal")
  {
    $(canvas).bind('mousedown',function(event){
      coords = getCoords(event);
      context.beginPath();
      context.moveTo(coords.x,coords.y);
      drawBool = true;
    });

    $(canvas).bind('mousemove',function(event){
      if(drawBool == true)
      {
        coords = getCoords(event);
        context.lineTo(coords.x,coords.y);
        context.stroke();
      }
    });

    $(canvas).bind('mouseup',function(event){
      context.stroke();
      drawBool = false;
    }); 
  }
}

//
function getCoords(event)
{
  //Firefox
  if (event.layerX || event.layerX == 0) 
  { 
    x = event.layerX - $('.canvas').offset().left - 1;
    y = event.layerY - $('.canvas').offset().top - 1;
  } 
  //Opera
  else if (event.offsetX || event.offsetX == 0) 
  {
    x = event.offsetX - $('.canvas').offset().left - 1;
    y = event.offsetY - $('.canvas').offset().top - 1;
  }
  return new coordinate(x,y);
}

function coordinate(xPos,yPos)
{
  this.x = xPos;
  this.y = yPos;
}

//Brush object
function brush(color)
{
  this.color = color;
  this.lineWidth = 1;
  this.lineCap = "round"; 
}

