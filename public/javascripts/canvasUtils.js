//Appends a canvas to the body of the html doc and returns the canvas object
function initCanvas(width, height, id) {
  $('body').append("<canvas width=" + width + " height=" + height + " id=" + id + " > Get Canvas </canvas>");
  $('#' + id).css('border', '1px solid');
  return $('#' + id)[0];
}

//expects a variable named context and canvas
//Beware, if I use transformations, this won't work properly
function clearContext() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}