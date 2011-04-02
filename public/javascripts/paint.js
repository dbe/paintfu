$(document).ready(function() {
  $('.color').bind('click', function() {
    $('.selected').toggleClass('selected');
    $(this).toggleClass('selected');
  });
});