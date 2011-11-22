//   var color = '#' + Math.floor(Math.random() * 16777216).toString(16);
$(function() {
  canvas = initCanvas(600,600, 'visualizer');
  context = canvas.getContext('2d');
  setInterval(filltimeQueue, 0);
  setInterval(paint, 1000/24);
});

var timeQueue = [];
testRenderer = new Renderer(circX, circY, 1, 1)



function Renderer(xFunc, yFunc, xRate, yRate) {
  this.xFunc = xFunc;
  this.yFunc = yFunc;
  this.xRate = xRate;
  this.yRate = yRate;
}

Renderer.prototype.paint = function() {
  
}


function filltimeQueue() {
  if(timeQueue.length == 50)
  {
    timeQueue.splice(0,1);
  }
  timeQueue.push(new Date().getTime());
}



function paintThing() {
  clearContext();
  
  context.beginPath();
  
  for(var i = 0; i< timeQueue.length; i++)
  {
    var time = timeQueue[i];
    //var x = horiz(time) * width;
    var x = 250;//(circX(time) * 100) + 250;
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