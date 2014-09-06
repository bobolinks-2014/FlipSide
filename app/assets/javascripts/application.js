// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require foundation
//= require turbolinks
//= require react
//= require_tree .

$(function(){
  $(document).foundation();
  $('body').append('<div id = "landing" class = "large-12 columns full-page"><div id="manifesto" class= "row"> <h1>We live in an <div class="accentWord"> information cocoon</div> of media that constantly mirrors our existing beliefs. So we built an <div class="accentWord">anti-echo</div> chamber. Welcome to the <div id ="enter" class="inline"><div id="flipWord" class = "inline">ᖷlip</div>/<div id="sideWord" class = "inline">Side</div></div></h1></div></div>')
  $('#enter').on("click", function(e){
    e.preventDefault();
    $( '#landing' ).fadeOut( 1000 );
    renderPair();
  });

  $('#enter').hover(function(){
    $( this ).fadeOut( 1000 );
    $( this ).fadeIn( 1000 );
  });
});
