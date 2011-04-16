function onYouTubePlayerReady(playerId)
{
  console.log(playerId + " has loaded.");
  if (playerId == "player0")
  {
    window.setInterval(moveRebecca,1000,"player0");
  }
}

function createRebeccas(number)
{
  baseDivToReplace = "playerArea";
  baseSwfDiv = "player"
  baseUrl = "http://www.youtube.com/e/CD2LRROpph0?autoplay=1&enablejsapi=1&playerapiid=";
  for(i=0;i<number;i++)
  {
    divToReplace = baseDivToReplace + i.toString();
    swfDiv = baseSwfDiv + i.toString();
    url = baseUrl + swfDiv;
    swfobject.embedSWF(url,divToReplace, "425", "356", "8", null, null, { allowScriptAccess: "always"}, {id: swfDiv});
  }
}

function moveRebecca(playerId)
{
  test = $('#' + playerId).parent();
  console.log("In moveRebecca");
  test.animate({left: '+=100'},1000);
}
