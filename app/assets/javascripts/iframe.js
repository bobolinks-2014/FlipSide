function removeIFrame(){
  if ($('iframe').length !== 0){
    $('iframe').remove();
    $('.button.close').remove();
  }
}

$('div').on("click",".article",function(e){
  e.preventDefault();
  var url = this.firstChild.className;
  removeIFrame();
  $('#myModal').append("<iframe  src="+url+" class= 'large-12 columns' height='95%' width='80%' id='frame'></iframe>");
});
