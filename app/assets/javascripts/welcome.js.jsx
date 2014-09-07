/*** @jsx React.DOM */

var Pair = React.createClass({

	getInitialState: function(){
		this.getArticles("all");
		return {pairs: ""};
	},
	getArticles: function(category){
		request = $.get('pairs', {category: category});
		pair_arr = [];
		request.done(function(data){
			$.each(data, function(index){
				var articles = [];
				articles.push(data[index].article1);
				articles.push(data[index].article2);
				pairRendered = this.renderArticles(articles);
				pair_arr.push(pairRendered);
			}.bind(this));
			this.setState({
				pairs: pair_arr,
			});
		}.bind(this));
	},
	renderArticles: function(articles){
		return(
			<div className="pair row">
				<Article options={articles[0]} onClick={this.handleClick}/>
				<Article options={articles[1]} onClick={this.handleClick}/>
				<hr/>
			</div>
		);
	},
	render:function(){
		return (
			<div className='newsFeed large-12 columns'>{this.state.pairs}</div>
		);
	}
})

// for security reasons...you can't access the url of an iframe.

var Article = React.createClass({
	getInitialState: function(){
		return {showArticle: false};
	},
	render: function(){
		return (
			<div className = 'large-6 columns'>
				<div className = 'article' id= {this.props.options.id} >
					<div className = {this.props.options.url}>
						<h2>{this.props.options.title}</h2>
						<h6 className="subheader">{this.props.options.source}</h6>
						<p>{this.props.options.slug}</p>
					</div>
				</div>
				<Rating article_id= {this.props.options.id} />
			</div>
		);
	}
});

var Rating = React.createClass({
	getInitialState: function(){
		var style = {
			color: "black"
		};
		return {
			clicked: "red",
			not_clicked: "black",
			content:(
				<ul className="bottom right inline-list">
					<li className="agree inline" style={style}>agree</li>
					<li className="disagree inline" style={style} >disagree</li>
				</ul>
			)
		}
	},
	onClick: function(e){

		e.target.style.color = this.state.clicked;
		$(e.target).siblings()[0].style.color = this.state.not_clicked;
		var request = $.post('rate', {rating: e.target.className , article_id: this.props.article_id})
	},
	render: function(){
		return(
			<div className="rating inline" onClick={this.onClick}>
				{this.state.content}
			</div>
		)
	}
})



var Home = React.createClass({
	getInitialState: function(){
		return {home: this.getHome()}
	},
	getHome: function(){
		return ( <div>
						<div id = "landing" className = "large-12 columns full-page"></div>
						<div id="manifesto" className= "row">
							<h1>We live in an <div className="accentWord"> information cocoon</div> of media that constantly mirrors our existing beliefs. So we built an <div className="accentWord">anti-echo</div> chamber. Welcome to the <div id ="enter" className="inline"><div id="flipWord" className = "inline">ᖷlip</div>/<div id="sideWord" className = "inline">Side</div></div>
							</h1>
						</div>
					</div>)
	},
	render: function(){
		return(
			<div>{this.state.home}</div>
		)
	}
});


// http://stackoverflow.com/questions/22639534/pass-props-to-parent-component-in-react-js
// var Iframe = React.createClass({
// 	render: function(){
// 		return(
// 			<div className = "row article-view">

// 		    <iframe src={this.props.url} className = "large-12 columns widescreen" height="600"></iframe>
// 		  </div>
// 		)
// 	}
// });

function renderPair(){
	React.renderComponent(
	<Pair/>,
	document.getElementById('container')
	);
}

function renderHome(){
	React.renderComponent(
	<Home/>,
	document.getElementById('container')
	);
}

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
	$(this.parentElement.parentElement).append('<div class= "close right button tiny radius round">X</div><iframe src='+url+' class= "large-12 columns" height="600px"></iframe>');
});

$('div').on("click",'.close', function(e){
	e.preventDefault();
	removeIFrame();
});

$("#goHome").on("click", function(e){
	e.preventDefault();
	renderHome();
})
$('div').on("click","#enter", function(e){
    e.preventDefault();
    $( '#landing' ).fadeOut( 1000 );
    $( '#manifesto' ).fadeOut( 1000 );
    renderPair();
  });

$('div').on("mouseover","#enter", function(){
  $("#enter").fadeOut( 1000 );
  $("#enter").fadeIn( 1000 );
});

$("#signin_form").on('submit', function(e) {
	e.preventDefault();
	console.log("signin form on submit");

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
			renderPair();
		} else {
		console.log('failed');
			$("div#error ul").append('<li>'+response.error+'</li>');
      renderHome();
    }
	})
});

$("#signup_form").on('submit', function(e) {
	e.preventDefault();
	console.log("signup form on submit");

	var name = $("#signup_name").val();
	var email = $("#signup_email").val();
	var password = $("#signup_password").val();
	var password_confirmation = $("#signup_password_confirmation").val();
	console.log(email);
	var request = $.ajax({
		type: "POST",
		url: '/users',
		data: { user: {name: name, email: email, password: password, password_confirmation: password_confirmation} },
		dataType: "json"
	});

	request.done(function(response) {
		if(response.success == true) {
			console.log('success');
			$('#signup_button').foundation('reveal', 'close');
			$('.not_logged_in').hide();
			$('.logged_in').show();
			renderPair();
		} else {
			$.each(response.error, function(i) {
				$("div#error ul").append('<li>'+response.error[i]+'</li>');
		});
    renderHome();
    }
	})
	return request;
});

$('a.close-reveal-modal').on("click", function() {
	$("div#error ul li").remove();
});

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
