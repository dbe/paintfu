//*******************************************On document ready, start up antWars************************************************************//
$(document).ready(function() {
  $canvas = $('.canvas');
  antWarsHandler = antWars($canvas);
});


//**********************************antWars**********************************************************//
function antWars($canvas) {
  var ants = [], //array of arrays. first dimension is the team number, second dimension is the actual list of ants.
      teams = [], //Array of teams
      context,
      drawAnts,
      constructAnts,
      height = $canvas[0].height,
      width = $canvas[0].width,
      mousePosition,
      colors = ['red', 'blue', 'green', 'orange', 'purple'],
      last_update_time,
      WORKER_ANT_COST = 10,
      FIGHTER_ANT_COST = 20,
      QUEEN_ANT_COST = 100;





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
      string += " Health is : " + this.attributes.health;
      string += " Attack is : " + this.attributes.attack;
      string += " Speed is : " + this.attributes.speed;
    return string;
  }
  
  Ant.prototype.move = moveRandomly;
  Ant.prototype.draw = simpleDraw;
  
  
//**********************************Team Object**********************************************************//  

function Team() {
  this.number = teams.length; //Identify itself as the next team in the list
  this.ants = [];
  this.food = 10;  //Rate at which ants are created
  this.worker = {ratio : 1, progress : 0};
  this.fighter = {ratio : 0, progress : 0};
  this.queen = {ratio : 0, progress : 0};
  teams[this.number] = this;
  
}
    

//********************************** Util functions **********************************************************//

//***************Ant movement functions*******************

  function moveRandomly(delta) {
    var unitVector = getUnitVector(this.pos, {x : Math.random() * width, y : Math.random() * height});
    this.pos.x += this.attributes.speed * (delta / 1000) * unitVector.x;
    this.pos.y += this.attributes.speed * (delta / 1000) * unitVector.y;
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
    context.fillStyle = colors[this.team];
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

//*************** Functional Constructs*******************

  //You call call this with either an anonomous function, or a string name of a function which the ants have.
  //It will call the correct method based on the type of variable passed in.
  function forAllAnts(func) {
    var method = (typeof func == 'string') ? forAntsOnTeam : forAntsOnTeamAnon
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < ants.length; i++)
    {
      method(i, func, args);
    }
  }

  //Calls function specified by the string "functionName" on the Ant object
  function forAntsOnTeam(teamNumber, functionName, args) {
    for(var i = 0; i < ants[teamNumber].length; i++)
    {
      var ant = ants[teamNumber][i];
      ant[functionName].apply(ant, args);
    }
  }
  
  //Calls anon function passed in
  function forAntsOnTeamAnon(teamNumber, func, args) {
    for(var i = 0; i < ants[teamNumber].length; i++)
    {
      func.apply(ants[teamNumber][i], args);
    }
  }

  
//*************** Canvas rendering functions*******************
  
  function clearContext() {
    context.clearRect(0, 0, width, height);
  }

  function animateIntro() {
  	console.log("Animate Intro is not yet implemented");
  }
  
  function drawAnts() {
    forAllAnts('draw');
  }
  
  function moveAnts(delta) {
    forAllAnts('move', delta);
  }
  
  function statusAnts() {
    forAllAnts(function() {
      console.log(this.toString());
    });
  }
  
  function updateStats() {
    var $lis = $('.team-data > ul > li');
    for(var i = 0; i < ants.length; i++) {
      $lis.eq(i).html("Team " + i + ": " + ants[i].length + " ants left");
    }
  }
  
  function setupTeamDataDiv() {
    var $teamData = $('.team-data > ul');
    for(var i = 0; i < ants.length; i++) {
      $teamData.html($teamData.html() + '<li class=team' + i + '>Team ' + i + ': </li>');    
     $('.team' + i).css('color', colors[i]);
    }
  }

  //Helper which will build a bunch of ants for testing.
  function constructAnts(numberOfTeams, numberOfAntsPerTeam) {
    var ants = [];
    for(i = 0; i < numberOfTeams; i++)
    {
      ants[i] = [];
      for(j = 0; j < numberOfAntsPerTeam; j++)
      {
        var random = (Math.random() - 0.5) * 100;
        var random2 = (Math.random() - 0.5) * 100;
        ants[i].push(new Ant(250 + random, 250 + random2, 100, 10, i));
      }
    }
    return ants;
  }
  
  //Yes, this funciton wastes progress towards building an ant when they complete :(
  function buildAnts(delta) {
    for(var i = 0; i < teams.length; i++) {
      updateBuildProgress(teams[i].worker, delta);
      updateBuildProgress(teams[i].fighter, delta);
      updateBuildProgress(teams[i].queen, delta);
    }
  }
  
  //Returns boolean of whether or not to create ant
  function updateBuildProgress(antType, delta) {
    var gained = antType.ratio * (delta / 1000);
    //Create ant
    if(antType.progress + gained >= 100) {
      antType.progress = 0;
      console.log("ANT CREATED");
      return true;
    }
    else {
      antType.progress += gained;
      return false;
    }
  }
  
 
  
  //Still needs optimization
  function resolveCombat() {
    
  	// deadAnts = [];
  	//     for (i = 0; i < ants.length; i++)
  	//     {
  	//       for (j = i + 1; j < ants.length; j++)
  	//       {
  	//         //Collision
  	//         if (detectCollision(ants[i], ants[j]))
  	//         {          
  	//           //Deal damage
  	//           shots_to_kill_ant_j = Math.ceil(ants[j].attributes.health / ants[i].attributes.attack);
  	//           shots_to_kill_ant_i = Math.ceil(ants[i].attributes.health / ants[j].attributes.attack);
  	//           
  	//           if(shots_to_kill_ant_i > shots_to_kill_ant_j)
  	//           {
  	//             deadAnts.push(j);
  	//             ants[j].attributes.health = 0;
  	//             ants[i].attributes.health -= (shots_to_kill_ant_j * ants[j].attributes.attack);
  	//           }
  	//           else if(shots_to_kill_ant_j > shots_to_kill_ant_i)
  	//           {
  	//             deadAnts.push(i);
  	//             ants[i].attributes.health = 0;
  	//             ants[j].attributes.health -= (shots_to_kill_ant_i * ants[i].attributes.attack);
  	//           }
  	//           //Both die simultaneously
  	//           else
  	//           {
  	//             deadAnts.push(i);
  	//             deadAnts.push(j);
  	//             ants[i].attributes.health = 0;
  	//             ants[j].attributes.health = 0;
  	//           }
  	//         }
  	//       }
    }
    for(i = 0; i < deadAnts.length; i++)
    {
   	  //take out ant from main array when it should be dead
   	  //because splice will actually reduce the indexes of all the ants, we must subtract by i to adjust for there being i less ants in the main array per iteration
   	  ants.splice(deadAnts[i] - i, 1)
    }
    
  }
    
  function gameLoop() {
    if(!last_update_time){last_update_time = new Date().getTime();return;}
    var time = new Date().getTime();
    var delta = time - last_update_time;
    
    //resolveCombat();
    clearContext();
    moveAnts(delta);
    drawAnts();
    buildAnts(delta);
    updateStats();
    last_update_time = time;
  }
  
  
  
  //********************************************** INIT ***************************************************************//
    context = $canvas[0].getContext('2d');
    //$canvas.mousemove(mouseMoved);
    $canvas.click(mouseClicked);

    new Team();
    new Team();


    //ants = constructAnts(2,5);

    setupTeamDataDiv();

    setInterval(gameLoop, (1000 / 30)); //Trigger game loop
  //  setInterval(statusAnts, 5000);

    return {
      getTeams : function() {
        return teams;
      },
      getAnts : function() {
        return ants;
      }
    };
}



