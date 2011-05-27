//Global vars
var brushes = [];


$(document).ready(function() {
  init();
});

//init page
function init()
{
  //load brushes with default brush objects bound to canvas elements
  for(var i = 0; i< $('.canvas').length;i++)
  {
    brushes[i] = new brush($('.canvas').eq(i));
  }
  
  //Makes palette boxes selectable
  $('.color').bind('click', function() {
    $('.selected').toggleClass('selected');
    $(this).toggleClass('selected');
    console.log(brushes[0].context.style);
    brushes[0].context.strokeStyle = $(this).attr('id');
  });
  
}



//Add new behaviors here 
//example addition: inverse: draw in opposite direction of brush movement
function bindBrush(behavior,canvas)
{
  if (behavior == "normal")
  {
    canvas.bind('mousedown',function(event){
      coords = getCoords(event,canvas);
      brushes[this.id].context.beginPath();
      brushes[this.id].context.moveTo(coords.x,coords.y);
      brushes[this.id].drawBool = true;
    });

    canvas.bind('mousemove',function(event){
      if(brushes[this.id].drawBool == true)
      {
        coords = getCoords(event,canvas);
        brushes[this.id].context.lineTo(coords.x,coords.y);
        brushes[this.id].context.stroke();
      }
    });

    canvas.bind('mouseup',function(event){
      brushes[this.id].context.stroke();
      brushes[this.id].drawBool = false;
    }); 
  }
}

//gets coords relative to canvas element
//return type: coordinate
function getCoords(event,canvas)
{
  //Firefox
  if (event.layerX || event.layerX == 0) 
  { 
    x = event.layerX - canvas.offset().left - 1;
    y = event.layerY - canvas.offset().top - 1;
  } 
  //Opera
  else if (event.offsetX || event.offsetX == 0) 
  {
    x = event.offsetX - canvas.offset().left - 1;
    y = event.offsetY - canvas.offset().top - 1;
  }
  return new coordinate(x,y);
}

function coordinate(xPos,yPos)
{
  this.x = xPos;
  this.y = yPos;
}

//Brush object
function brush(canvas)
{
  this.context = canvas[0].getContext("2d");
  this.drawBool = false;
  bindBrush("normal",canvas);
}

