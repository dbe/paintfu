//*******************************************On document ready, start up antWars************************************************************//
$(document).ready(function() {
  $canvas = $('.canvas');
  antWars($canvas);
});


//**********************************antWars**********************************************************//
function antWars($canvas) {
  var ants,
      context,
      drawAnts,
      constructAnts,
      height = $canvas[0].height,
      width = $canvas[0].width,
      mousePosition;

//**********************************Ant Object**********************************************************//
      
  function Ant(x, y, speed, radius) {
    this.pos = {'x' : x, 'y' : y};
    this.size = radius; //the radius of the ant
    this.path = {
      radius : 100,
      center : {
        x : x - 100,
        y: y
      }
    }
    this.attributes = {
      health : 100,
      attack : 5,
      speed : speed
    }
    
    this.toString = function() {
      var string = ""
      string += "Position is : (" + this.pos.x + "," + this.pos.y + ")";
      string += " Size is : " + this.size;
      string += " Path is centered at : (" + this.path.center.x + "," + this.path.center.y + ")";
      string += " Health is : " + this.attributes.health;
      string += " Attack is : " + this.attributes.attack;
      string += " Speed is : " + this.attributes.speed;
      return string;
    }
     
    this.draw = simpleDraw;
    this.move = moveRandomly;
  };

//********************************** Util functions **********************************************************//

//*************** Movement functions*******************

  function moveRandomly() {
    var unitVector = getUnitVector(this.pos, {x : Math.random() * width, y : Math.random() * height});
    this.pos.x += this.attributes.speed * unitVector.x;
    this.pos.y += this.attributes.speed * unitVector.y;
  };
  
  function followMouse() {
    var unitVector = getUnitVector(this.pos, mousePosition);
    this.pos.x += this.attributes.speed * unitVector.x;
    this.pos.y += this.attributes.speed * unitVector.y;
  };
  
//*************** Rendering functions*******************
  function drawWithCenters() {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2 ,true); //draw ant(x,y,radius,start_angle, end_angle, anti-clockwise)
    context.closePath();
    context.fill();
    context.stroke();
    
    context.beginPath();
    context.arc(this.path.center.x, this.path.center.y, 15, 0, Math.PI*2, true); //draw center of circle
    context.closePath();
    //context.fill();
    context.stroke();
    
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.path.center.x, this.path.center.y); //Conect ant's center point with the ant himself with a line
    context.closePath();      
    context.stroke();
  };
  
  function simpleDraw() {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2 ,true); //draw ant(x,y,radius,start_angle, end_angle, anti-clockwise)
    context.closePath();
    context.fill();
    context.stroke();
  }


  function getUnitVector(from, to) {
    var vector = {x : (to.x - from.x), y : (to.y - from.y)};
    var magnitude = Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
    var unitVector = {x : (vector.x/magnitude), y : (vector.y/magnitude)};
    return unitVector;
  };

  //gets coords relative to canvas element
  //returns a json with x and y set
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
    return {x : x, y: y};
  };
  
  function mouseMoved(e) {
    mousePosition = getCoords(e, $canvas);
  }
  
  function clearContext() {
    context.clearRect(0, 0, width, height);
  };

  function drawAnts() {
    for(i = 0; i < ants.length; i++)
    {
      ants[i].draw();
    }
  };
  
  function moveAnts() {
    for(i = 0; i < ants.length; i++)
    {
      ants[i].move();
    }
  };
  
  function statusAnts() {
    for(i = 0; i < ants.length; i++)
    {
      console.log(ants[i].toString());
    }
  };

  function constructAnts(number) {
    var ants = [];
    for(i = 0; i < number; i++)
    {
      var random = (Math.random() - 0.5) * 100;
      var random2 = (Math.random() - 0.5) * 100;
      ants.push(new Ant(250 + random, 250 + random2, 1, 10));
    }
    return ants;
  };
  
  //Takes 2 coords, returns distance between them
  function calculateDistance(from, to) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
  }
  
  //Cringe at O(n^2)
  function resolveCombat() {
    for (i = 0; i < ants.length; i++)
    {
      var ant = ants[i];

      for (j = 0; j < ants.length; j++)
      {
        if(i == j){continue;}
        var ant2 = ants[j];
        //Collision
        if ((ant.size * 2) >= calculateDistance(ant.pos, ant2.pos))
        {
          //Deal damage
          ant2.attributes.health -= ant.attributes.attack;
          //Check to see if the ant died
          if(ant2.attributes.health <= 0)
          {
            //Take ant out of list
            ants.splice(j,1);
          }
        }
      }
    }
  }
  
  function gameLoop() {
    resolveCombat();
    clearContext();
    moveAnts();
    drawAnts();
  };
//********************************************** INIT ***************************************************************//
  context = $canvas[0].getContext('2d');
  $canvas.mousemove(mouseMoved);
  
  ants = constructAnts(50);
  
  setInterval(gameLoop, (1000 / 60)); //Trigger game loop
}



