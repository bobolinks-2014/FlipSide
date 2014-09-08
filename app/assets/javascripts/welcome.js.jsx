/*** @jsx React.DOM */


// TAG MODEL //
var TagCollection = React.createClass({
	getInitialState: function(){

		return {tagCollection: this.getTags(this.props.tags)};
	},
	getTags: function(tags){
		tag_arr = [];
		$.each(tags, function(i){
			tag_arr.push(this.renderTag(tags[i]));
		}.bind(this));
		return tag_arr;
	},
	renderTag: function(tag){
		if (tag.sentiment_score > 0.7 ){
			var style = {
				backgroundColor: "#004400",
				color: "white",
				cursor: "default"
			};
		}
		else if (tag.sentiment_score > 0.2 ){
			var style = {
				backgroundColor: "#2d882d",
				color: "white",
				cursor: "default"
			};
		}
		else if (tag.sentiment_score > -0.2 ){
			var style = {
				backgroundColor: "gray",
				color: "white",
				cursor: "default"
			};
		}
		else if (tag.sentiment_score > -0.8 ){
			var style = {
				backgroundColor: "#aa3535",
				color: "white",
				cursor: "default"
			};
		}
		else{
			var style = {
				backgroundColor: "#570000",
				color: "white",
				cursor: "default"
			};
		};

		return(
			<div style = {style} className= "radius secondary label">#{tag.tag.name}</div>
		)
	},
	render: function(){
		return(
			<div className="tagCollection">{this.state.tagCollection}</div>
		)
	}
});


// PAIR MODEL //

var Pair = React.createClass({
	getInitialState: function(){
		return {pairs: ""};
	},
	getArticles: function(){
		request = $.get('pairs');
		pair_arr = [];
		request.done(function(data){
			$.each(data, function(index){
				var articles = [];
				articles.push(data[index].article1);
				articles.push(data[index].article2);
				pairRendered = this.renderArticles(articles, data[index].difference_score, this.getCommonTags(articles));
				pair_arr.push(pairRendered);
			}.bind(this));
			this.setState({
				pairs: pair_arr,
			});
		}.bind(this));
	},
	getCommonTags: function(articles){
		var tags1 = articles[0].article_tags;
		var tags2 = articles[1].article_tags;
		commonTags = [];
		article1tags = [];
		article2tags = [];
		$.each(tags1, function(i){
			$.each(tags2, function(j){
				if (tags1[i].tag.name === tags2[j].tag.name){
					article1tags.push(tags1[i]);
					article2tags.push(tags2[j]);
				}
			})
		})
		// this is an array of common tags where each element of the array is an article tag...because i needed that.
		return [article1tags, article2tags];
	},
	componentDidMount: function(){
		console.log("componentDidMount");
		this.getArticles();
	},
	renderArticles: function(articles, difference_score, tags){
		debugger;
		return(
			<div className="pair row">
				<p className="text-center"> These articles discuss some category </p>
				<div className="paired_articles">
					<Article options={articles[0]} tags = {tags[0]} />
					<Article options={articles[1]} tags ={tags[1]} />
				</div>
				<hr/>
			</div>
		);
	},
	render:function(){

		console.log("rendering pairs");
		var styleE = {backgroundColor: "#004400", color:"white"}
    var styleD = {backgroundColor: "#2d882d", color:"white"}
    var styleC = {backgroundColor: "gray", color:"white"}
    var styleB = {backgroundColor: "#aa3535", color:"white"}
    var styleA = {backgroundColor: "#570000", color:"white"}
		return (
			<div className='newsFeed large-12 columns'>
				<p>Sentiment is the attitude or opinion expressed towards something, such as a person, product, organization or location</p>
				<ul inline-list>
					<li style = {styleA}className= "radius secondary label">very negative</li>
					<li style = {styleB}className= "radius secondary label">negative</li>
					<li style = {styleC}className= "radius secondary label">neutral</li>
					<li style = {styleD}className= "radius secondary label">positive</li>
					<li style = {styleE}className= "radius secondary label">very positive</li>
				</ul>
				{this.state.pairs}
			</div>
		);
	}
})


// ARTICLE MODEL //
// for security reasons...you can't access the url of an iframe.
var Article = React.createClass({
	getInitialState: function(){
		return {
			showArticle: false,
			style: {},
			titleStyle: {}
		};
	},
	onMouseOver: function(){
		this.setState({
			style:{
				boxShadow: "0px 0px 10px #888888",
				cursor: "pointer"
			}
		});

	},
	onMouseLeave: function(){
		this.setState({style: {boxShadow: "none"}});
	},
	render: function(){
		return (
			<div className = 'large-6 columns' style={this.state.style} onMouseOver = {this.onMouseOver} onMouseLeave = {this.onMouseLeave}>
					<Rating article_id= {this.props.options.id} />
					<TagCollection tags={this.props.tags}/>
				<div className = 'article' id= {this.props.options.id} >
					<div className = {this.props.options.url}>
						<h2>{this.props.options.title}</h2>
						<h6 className="subheader">{this.props.options.source}</h6>
						<p>{this.props.options.slug}</p>
					</div>
				</div>
			</div>
		);
	}
});


// RATING MODEL //
var Rating = React.createClass({
	getInitialState: function(){
		return {
			content:(
				<ul className="bottom right inline-list">
					<li className="agree tiny radius button">postive</li>
					<li className="disagree tiny radius button">negative</li>
				</ul>
			),
			response: ""
		}
	},
	onClick: function(e){
		this.setState({response: $(e.target).text()});
		$(e.target).fadeOut('1000');
		$(e.target).siblings().fadeOut('1000');
		this.setState({content: <p className = "right">You rated this article {this.state.response}</p>})
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


function renderPair(){
	console.log("renderPair method")
	React.renderComponent(
	<Pair/>,
	document.getElementById('container')
	);
}

// function renderHome(){
// 	React.renderComponent(
// 	<Home/>,
// 	document.getElementById('container')
// 	);
// }

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
	renderPair();
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
			// $('.not_logged_in').hide();
			// $('.logged_in').show();
			console.log("SIGN IN");
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
			// $('.not_logged_in').hide();
			// $('.logged_in').show();
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

// USER PROFILE //

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
      // $('.not_logged_in').hide();
      // $('.logged_in').show();
      renderUserProfile(response.user);
    } else {
      renderPair();
    }
  })
});
