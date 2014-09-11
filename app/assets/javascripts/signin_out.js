$("#goHome").on("click", function(e){
  e.preventDefault();
  renderPair();
})


$("#signin_form").on('submit', function(e) {
  e.preventDefault();

  var email = $("#signin_email").val();
  var password = $("#signin_password").val();

  var request = $.ajax({
    type: "POST",
    url: '/sessions',
    data: { email: email, password: password },
  });

  request.done(function(response) {
    if(response.success == true) {
      $('#signin_button').foundation('reveal', 'close');
      $('.not_logged_in').hide();
      $('.logged_in').show();
      location.reload();
      renderPair();
    } else {
      $("div#error ul").append('<li>'+response.error+'</li>');
      renderPair();
    }
  })
});

$("#signup_form").on('submit', function(e) {
  e.preventDefault();
  var name = $("#signup_name").val();
  var email = $("#signup_email").val();
  var password = $("#signup_password").val();
  var password_confirmation = $("#signup_password_confirmation").val();
  var request = $.ajax({
    type: "POST",
    url: '/users',
    data: { user: {name: name, email: email, password: password, password_confirmation: password_confirmation} },
    dataType: "json"
  });

  request.done(function(response) {
    if(response.success == true) {
      $('#signup_button').foundation('reveal', 'close');
      $('.not_logged_in').hide();
      $('.logged_in').show();
      location.reload();
      renderPair();
    } else {
      $.each(response.error, function(i) {
        $("div#error ul").append('<li>'+response.error[i]+'</li>');
    });
    renderPair();
    }
  })
  return request;
});

$('a.close-reveal-modal').on("click", function() {
  $("div#error ul li").remove();
});