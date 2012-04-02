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

  function numericSort(a, b) {
    return a - b;
  }
  function togglePause() {
    //There is a tiny hack around pausing like this.
    //Instead of recording the outstanding delta since the last draw before the pause, and retaining that until after the pause,
    //I keep updating the delta even though I do no work. If the delta is faily constant, then this doesn't really matter, but
    //if there was a long time without a new draw right when I paused, then the latency went way down, the engine would only update for the shorter amount of latency instead of the longer amount.
    paused = !paused;
  }

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
  	togglePause();
  	statusAnts();
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
    for(var i = 0; i < ants.length; i++) {
      var $teamDetails = $('.team-data.team' + i).find('.team-details');
      $teamDetails.find('.ants-left').html(ants[i].length);
      $teamDetails.find('.food').html(teams[i].food);
    }
  }

  function setupTeamDataDiv() {
    var $hud = $('.hud');
    for(var i = 0; i < ants.length; i++) {
      $hud.append("<div class='team-data team" + i + "'><h2>Team" + i + ":</h2><div class=team-details><dl><dt>Ants Left</dt><dd class=ants-left></dd><dt>Food</dt><dd class=food></dd></dl></div></div>");
      $('.team' + i + ' h2').css('color', colors[i]);
    }
  }

  //Helper which will build a bunch of ants for testing.
  function constructAnts(numberOfAntsPerTeam) {
    var numberOfTeams = teams.length;
    var ants = [];
    for(i = 0; i < numberOfTeams; i++)
    {
      ants[i] = [];
      for(j = 0; j < numberOfAntsPerTeam; j++)
      {
        var random = (Math.random() - 0.5) * 100;
        var random2 = (Math.random() - 0.5) * 100;
        ants[i].push(new Ant(Math.ceil(250 + random), Math.ceil(250 + random2), 50, 3, i));
      }
    }
    return ants;
  }
  
  //Yes, this funciton wastes progress towards building an ant when they complete :(
  function buildAnts(delta) {
    for(var i = 0; i < teams.length; i++) {
      updateBuildProgress(teams[i].worker, teams[i].food, delta);
      updateBuildProgress(teams[i].fighter, teams[i].food,  delta);
      updateBuildProgress(teams[i].queen, teams[i].food, delta);
    }
  }
  
  //Returns boolean of whether or not to create ant
  function updateBuildProgress(antType, rate, delta) {
    var gained = antType.ratio * rate * (delta / 1000);
    //Create ant
    if(antType.progress + gained >= 100) {
      antType.progress = (antType.progress + gained - 100);
      console.log("ANT CREATED");
      return true;
    }
    else {
      antType.progress += gained;
      return false;
    }
  }
  
 
  //This method of resolving combat does not take into account the possibility of there being multiple ants on top of each other simulatneously.
  //This results in the order of resolving combat mattering. If there are 3 teams, and we check 1v2 first, then 1v3. Then team 3 will have an advantage over the other 2 teams.
  //This is because after the initial check, team 1 and 2 will have killed each other off, and team 3 will only have to deal with low health ants (assumeing all 3 teams ants were on top of each other)
  //This basically could represent reality if the ants were to attack each other in this form. Also, in reality it won't have any effect unless the ants spawn or teleport all on top of each other, which won't happen.
  function resolveCombat() {
    var deadAnts = [];
    for(var i = 0; i < teams.length; i++) {
      deadAnts[i] = [];
    }
    
    //for each team
    for(var i = 0; i < ants.length; i++) {
      //for each ant on that team
      for(var j = 0; j < ants[i].length; j++) {
        if(ants[i][j].attributes.health == 0){continue;}
        //for all teams greater than the current team
        for(var k = i + 1; k < ants.length; k++) {
          //for each ant on that secondary team
          for (var l = 0; l < ants[k].length; l++) {
            if(ants[k][l].attributes.health == 0 || ants[i][j].attributes.health == 0){continue;}
            var antOne = ants[i][j];
            var antTwo = ants[k][l]; 
            if (detectCollision(antOne, antTwo)) {
              //Deal damage
              //console.log("Collision detected between: " + antOne + " and " + antTwo);
              var shotsToKillAntOne = Math.ceil(antOne.attributes.health / antTwo.attributes.attack);
              var shotsToKillAntTwo = Math.ceil(antTwo.attributes.health / antOne.attributes.attack);

              //Ant one is stronger, ant two dies
              if(shotsToKillAntOne > shotsToKillAntTwo)
              {
                deadAnts[k].push(l);
                antTwo.attributes.health = 0;
                antOne.attributes.health -= (shotsToKillAntTwo * antTwo.attributes.attack);
              }
              else if(shotsToKillAntTwo > shotsToKillAntOne)
              {
                deadAnts[i].push(j);
                antOne.attributes.health = 0;
                antTwo.attributes.health -= (shotsToKillAntOne * antOne.attributes.attack);
              }
              //Both die simultaneously
              else
              {
                deadAnts[i].push(j);
                deadAnts[k].push(l);
                antOne.attributes.health = 0;
                antTwo.attributes.health = 0;
              }
            }
          }
        }
      }
    }
    
    for(var i = 0; i < deadAnts.length; i++) {
      deadAnts[i] = deadAnts[i].sort(numericSort);
      for(var j = deadAnts[i].length - 1; j >= 0; j--) {
        ants[i].splice(deadAnts[i][j], 1)
      }
    }
  }
    
  function gameLoop() {
    if(!last_update_time){last_update_time = new Date().getTime();return;}
    var time = new Date().getTime();
    var delta = time - last_update_time;
    if(!paused) {
      resolveCombat();
      clearContext();
      moveAnts(delta);
      drawAnts();
      buildAnts(delta);
      updateStats();
    }
    last_update_time = time;
  }
  
  
  
  //********************************************** INIT ***************************************************************//
    context = $canvas[0].getContext('2d');
    //$canvas.mousemove(mouseMoved);
    $canvas.click(mouseClicked);
    paused = false;

    new Team();
    new Team();
    new Team();

    firstTime = true;

    ants = constructAnts(100);

    setupTeamDataDiv();

    //gameLoop();
    //gameLoop();
    //resolveCombat();
    //setTimeout(gameLoop, 5000);
    setInterval(gameLoop, (1000 / 30)); //Trigger game loop
    //setInterval(statusAnts, 5000);

    return {
      getTeams : function() {
        return teams;
      },
      getAnts : function() {
        return ants;
      }
    };
}



