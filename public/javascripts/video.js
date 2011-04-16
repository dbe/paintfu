var loadedRebeccas = [];

function onYouTubePlayerReady(playerId)
{
  console.log(playerId + " has loaded.");
  loadedRebeccas.push(playerId);
}

function createRebeccas(number,width,height)
{
  baseDivToReplace = "playerArea";
  baseSwfDiv = "player";
  baseUrl = "http://www.youtube.com/e/CD2LRROpph0?autoplay=1&controls=0&enablejsapi=1&playerapiid=";
  for(i=0;i<number;i++)
  {
    divToReplace = baseDivToReplace + i.toString();
    swfDiv = baseSwfDiv + i.toString();
    url = baseUrl + swfDiv;
    swfobject.embedSWF(url,divToReplace, width, height, "8", null, null, { allowScriptAccess: "always"}, {id: swfDiv});
  }
}

function moveRebecca()
{
  for each (item in loadedRebeccas)
  {
    test = $('#' + item).parent();
    randomNum = Math.ceil(Math.random()*10);
    if (randomNum <= 3){test.animate({left : '+=100'}, 500);}
    else if(randomNum <= 6){test.animate({top : '+=100'}, 500);}
    else if(randomNum <= 8){test.animate({left : '-=100'}, 500);}
    else {test.animate({top : '-=100'}, 500);}
  }
}
