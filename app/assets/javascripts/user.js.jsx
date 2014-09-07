var UserProfile = React.createClass({
  render: function() {
    return (
      <div className="userProfile">
        <p>Welcome to your user profile, {this.props.user.name}.</p>
        <p>Your email address is {this.props.user.email}.</p>
      </div>
    )
  }
})

function renderUserProfile(user){
  React.renderComponent(
    <UserProfile user={user}/>,
    document.getElementById('container')
  );
}

$("#user_profile_link").on('click', function(e) {
  e.preventDefault();

  var request = $.ajax({
    type: "get",
    url: '/profile',
  });

  request.done(function(response) {
    if(response.success == true) {
      $('#signin_button').foundation('reveal', 'close');
      $('.not_logged_in').hide();
      $('.logged_in').show();
      renderUserProfile(response.user);
    } else {
      renderHome();
    }
  })
});

// $("#user_profile_link").on('click', function(e) {
//  e.preventDefault();
//  console.log("you made it!");

//  var request = $.ajax({
//    type: "GET",
//    url: '/profile',
//  });

//  request.done(function(response) {
//    if(response.success == true) {
//      $('#signin_button').foundation('reveal', 'close');
//      $('.not_logged_in').hide();
//      $('.logged_in').show();
//      window.location.assign("/users/" + response.user_id + "")
//    } else {
//      console.log('failed');
//       renderHome();
//     }
//  })
// });
