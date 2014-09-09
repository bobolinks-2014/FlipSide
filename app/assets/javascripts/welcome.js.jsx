/*** @jsx React.DOM */
// SPIN //
var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};

var target = document.getElementById('container');
var spinner = new Spinner(opts).spin(target);

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
		else if (tag.sentiment_score > 0.3 ){
			var style = {
				backgroundColor: "#2d882d",
				color: "white",
				cursor: "default"
			};
		}
		else if (tag.sentiment_score > -0.3 ){
			var style = {
				backgroundColor: "gray",
				color: "white",
				cursor: "default"
			};
		}
		else if (tag.sentiment_score > -0.7 ){
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
			<div style = {style} className= " radius secondary label">#{tag.tag.name} {tag.sentiment_score}</div>
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
				if (data[index] !== null){
					articles.push(data[index].article1);
					articles.push(data[index].article2);
					pairRendered = this.renderArticles(articles, data[index].difference_score, this.getCommonTags(articles));
					pair_arr.push(pairRendered);
				}
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
		return(
			<div className="pair row">
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
				<div className = "panel large-2 columns">
					<h4>About</h4>
					<p> The media likes to feed you only what you want to hear. At FlipSide, we strive to do the opposite.</p>
					<h4>Article Sentiment Analysis</h4>
					<p>Each article is analyzed for sentiment on the Sentiment is the attitude or opinion expressed towards something, such as a person, product, organization or location. Article sentiments are categorized as follows: </p>
					<ul className="no-bullet">
						<li style = {styleA} className= "radius secondary label">very negative</li><br/>
						<li style = {styleB} className= "radius secondary label">negative</li><br/>
						<li style = {styleC} className= "radius secondary label">neutral</li><br/>
						<li style = {styleD} className= "radius secondary label">positive</li><br/>
						<li style = {styleE} className= "radius secondary label">very positive</li><br/>
					</ul>
				</div>
				<h2 className="text-center large-8 columns">FlipSide News Feed</h2>
				{this.state.pairs}
			</div>
		);
	}
})

//				<p className="text-center"> These articles discuss some category </p>


// ARTICLE MODEL //
// for security reasons...you can't access the url of an iframe.
var Article = React.createClass({
	getInitialState: function(){
		return {
			showArticle: false,
			style: {},
			titleStyle: {textDecoration: "underline"}
		};
	},
	onMouseOver: function(){
		this.setState({
			style:{
				boxShadow: "0px 1px 10px #888888",
				cursor: "pointer"
			},
			titleStyle: {color: "gray", textDecoration: "underline"}
		});

	},
	onMouseDown: function(){
		this.setState({
			titleStyle: {color: "gray", textDecoration: "underline"}
		});
	},
	onMouseLeave: function(){
		this.setState({
			style: {boxShadow: 'none'},
			titleStyle: {color: "black", textDecoration: "underline"}
		});
	},
	render: function(){
		return (
			<div className = 'large-6 columns' style={this.state.style} onMouseOver = {this.onMouseOver} onMouseLeave = {this.onMouseLeave}>
				<TagCollection tags={this.props.tags}/>
				<div className = 'article' id= {this.props.options.id} data-reveal-id="myModal">
					<div className = {this.props.options.url}>
						<h4 style = {this.state.titleStyle}>{this.props.options.title}</h4>
						<h6 className="subheader">{this.props.options.source}</h6>
						<p>{this.props.options.slug}</p>
					</div>
				</div>
				<Rating article_id= {this.props.options.id} />
			</div>
		);
	}
});


// RATING MODEL //
var Rating = React.createClass({
	getInitialState: function(){
		return {
			content:(
				<div className="left">
					<p> The essence of this article was </p>
					<div className="agree radius secondary label">postive</div>
					<div className="disagree radius secondary label">negative</div>
				</div>
			),
			response: ""
		}
	},
	onClick: function(e){
		this.setState({response: $(e.target).text()});
		$(e.target).fadeOut('1000');
		$(e.target).siblings().fadeOut('1000');
		this.setState({content: <p className = "left">You rated this article {this.state.response}</p>})
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
	var request = $.ajax({url: url, type:"GET"});
	request.done(function(response) {
		debugger;
	});

	$('#myModal').append("<iframe  src="+url+" class= 'large-12 columns' height='600px' id='frame'></iframe>");
	//$("#myModal iframe").on('autocompleteerror autocomplete waiting volumechange toggle timeupdate suspend submit stalled show select seeking seeked scroll resize reset ratechange progress playing play pause mousewheel mouseup mouseover mouseout mousemove mouseleave mouseenter mousedown loadstart loadedmetadata loadeddata load keyup keypress keydown invalid input focus error ended emptied durationchange drop dragstart dragover dragleave dragenter dragend drag dblclick cuechange contextmenu close click change canplaythrough canplay cancel blur abort wheel webkitfullscreenerror webkitfullscreenchange selectstart search paste cut copy beforepaste beforecut beforecopy', function(event) {console.log(event);})

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
			$('.not_logged_in').hide();
			$('.logged_in').show();
			location.reload();
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
      $('.not_logged_in').hide();
      $('.logged_in').show();
      renderUserProfile(response.user);
    } else {
      renderPair();
    }
  })
});
