var canvas;
var ctx;
var x;
var y;
var color;
var drawBool;
$(document).ready(function() {
  init();
});


function init() 
{
  //init canvas and context
  canvas = $('canvas')[0];
  ctx = canvas.getContext("2d");
    
  $(canvas).bind('mousedown',function(event){
    getCoords(event);
    ctx.beginPath();
    ctx.moveTo(x,y);
    drawBool = true;
  });
  
  $(canvas).bind('mousemove',function(event){
    if(drawBool == true)
    {
      getCoords(event);
      ctx.lineTo(x,y);
      ctx.stroke();
    }
  });
  
  $(canvas).bind('mouseup',function(event){
    ctx.stroke();
    drawBool = false;
  });
 
  //Makes palette boxes selectable
  $('.color').bind('click', function() {
    $('.selected').toggleClass('selected');
    $(this).toggleClass('selected');
  });

}

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
}

function horzLine(xPos,yPos)
{
  ctx.moveTo(xPos,yPos);
  ctx.lineTo(xPos + 100, yPos);
  ctx.stroke();
}

//Brush object
function brush(color)
{
  this.color = color;
  this.lineWidth = 1;
  this.lineCap = "round"; 
}

