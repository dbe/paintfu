$(function(){
  $('body').append("<canvas width=600 height=600> Get Canvas </canvas>");
  $('canvas').css('border', '1px solid');
  context = $('canvas')[0].getContext('2d');
  setInterval(paintThing, 30);
  setInterval(fillQueue, 0);
});

queue = [];
timesPerSecond = 1;
screenPerSecond = 1;
width = 600;
height = 600;


function fillQueue() {
  if(queue.length == 1000)
  {
    queue.splice(0,1);
  }
  queue.push(new Date().getTime());
}

function paintThing() {
  clearContext();
  
  context.beginPath();
  
  for(var i = 0; i< queue.length; i++)
  {
    var time = queue[i];
    // var x = horiz(time) * width;
    var x = (circX(time) * 100) + 250;
    var y = (circY(time) * 100) + 250;
    context.fillRect(x , y, 5, 5)
    if(i == 0)
    {
      context.moveTo(x, y);
    }
    else
    {
      context.lineTo(x, y);
    }
  }
  //context.stroke();
}

function clearContext() {
  context.clearRect(0, 0, 600, 600);
}

//returns a number of screens that the unit should have taken
function horiz(time) {
  var seconds = time / 1000;
  return (screenPerSecond * seconds) % 1;
}

function circX(time) {
  var seconds = time / 1000;
  return Math.cos(timesPerSecond * seconds * 2 * Math.PI);
}

function circY(time) {
  var seconds = time / 1000;
  return Math.sin(timesPerSecond * seconds * 2 * Math.PI);
}