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
      
//********************************************** INIT ***************************************************************//
  context = $canvas[0].getContext('2d');
  //$canvas.mousemove(mouseMoved);
  $canvas.click(mouseClicked);
  
  ants = constructAnts(5);
  
  setInterval(gameLoop, (1000 / 60)); //Trigger game loop




















//**********************************Ant Object**********************************************************//
      
  function Ant(x, y, speed, radius, team) {
    this.pos = {'x' : x, 'y' : y};
    this.size = radius; //the radius of the ant
    this.attributes = {
      health : x,
      attack : 5,
      speed : speed
    };
    this.team = team;
  }
  
  Ant.prototype.toString = function() {
  	var string = ""
      string += "Position is : (" + this.pos.x + "," + this.pos.y + ")";
      string += " Size is : " + this.size;
      string += " Path is centered at : (" + this.path.center.x + "," + this.path.center.y + ")";
      string += " Health is : " + this.attributes.health;
      string += " Attack is : " + this.attributes.attack;
      string += " Speed is : " + this.attributes.speed;
    return string;
  }
  
  Ant.prototype.move = moveRandomly;
  Ant.prototype.draw = simpleDraw;
    

//********************************** Util functions **********************************************************//

//***************Ant movement functions*******************

  function moveRandomly() {
    var unitVector = getUnitVector(this.pos, {x : Math.random() * width, y : Math.random() * height});
    this.pos.x += this.attributes.speed * unitVector.x;
    this.pos.y += this.attributes.speed * unitVector.y;
  }
  
  function followMouse() {
    var unitVector = getUnitVector(this.pos, mousePosition);
    this.pos.x += this.attributes.speed * unitVector.x;
    this.pos.y += this.attributes.speed * unitVector.y;
  }
  
//*************** Ant rendering functions*******************
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
  }
  
  function simpleDraw() {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI*2 ,true); //draw ant(x,y,radius,start_angle, end_angle, anti-clockwise)
    context.closePath();
    context.fill();
    context.stroke();
  }
  

//*************** Coordinate functions*******************

  function getUnitVector(from, to) {
    var vector = {x : (to.x - from.x), y : (to.y - from.y)};
    var magnitude = Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
    var unitVector = {x : (vector.x/magnitude), y : (vector.y/magnitude)};
    return unitVector;
  }

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
  }
  
  //Takes 2 coords, returns distance between them
  function calculateDistance(from, to) {
    return Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2));
  }
  
  function detectCollision(ant1, ant2) {
  	return (ant1.size + ant2.size >= calculateDistance(ant1.pos, ant2.pos));
  }

//*************** Mouse Handler functions*******************
     
  function mouseMoved(e) {
    mousePosition = getCoords(e, $canvas);
  }
  
  function mouseClicked(e) {
  	console.log(getCoords(e,$canvas));	
  }
  
//*************** Canvas rendering functions*******************
  
  function clearContext() {
    context.clearRect(0, 0, width, height);
  }

  function animateIntro() {
  	console.log("Animate Intro is not yet implemented");
  }

  function drawAnts() {
    for(i = 0; i < ants.length; i++)
    {
      ants[i].draw();
    }
  }
  
  function moveAnts() {
    for(i = 0; i < ants.length; i++)
    {
      ants[i].move();
    }
  }
  
  function statusAnts() {
    for(i = 0; i < ants.length; i++)
    {
      console.log(ants[i].toString());
    }
  }

  //Helper which will build a bunch of ants for testing.
  function constructAnts(number) {
    var ants = [];
    for(i = 0; i < number; i++)
    {
      var random = (Math.random() - 0.5) * 100;
      var random2 = (Math.random() - 0.5) * 100;
      ants.push(new Ant(250 + random, 250 + random2, 1, 10));
    }
    return ants;
  }
 
  
  //Still needs optimization
  function resolveCombat() {
  	deadAnts = [];
    for (i = 0; i < ants.length; i++)
    {
      for (j = i + 1; j < ants.length; j++)
      {
        //Collision
        if (detectCollision(ants[i], ants[j]))
        {          
          //Deal damage
          shots_to_kill_ant_j = Math.ceil(ants[j].attributes.health / ants[i].attributes.attack);
          shots_to_kill_ant_i = Math.ceil(ants[i].attributes.health / ants[j].attributes.attack);        
          
          if(shots_to_kill_ant_i > shots_to_kill_ant_j)
          {
          	deadAnts.push(j);
          	ants[j].attributes.health = 0;
          	ants[i].attributes.health -= (shots_to_kill_ant_j * ants[j].attributes.attack);
          }
          else if(shots_to_kill_ant_j > shots_to_kill_ant_i)
          {
          	deadAnts.push(i);
          	ants[i].attributes.health = 0;
          	ants[j].attributes.health -= (shots_to_kill_ant_i * ants[i].attributes.attack);
          }
          else
          {
          	deadAnts.push(i);
          	deadAnts.push(j);
          	ants[i].attributes.health = 0;
          	ants[j].attributes.health = 0;
          }
        }
      }
    }
    for(i = 0; i < deadAnts.length; i++)
    {
   	  //take out ant from main array when it should be dead
   	  //because splice will actually reduce the indexes of all the ants, we must subtract by i to adjust for there being i less ants in the main array per iteration
   	  ants.splice(deadAnts[i] - i, 1)
    }
    
  }
    
  function gameLoop() {
    resolveCombat();
    clearContext();
    moveAnts();
    drawAnts();
  }
}



