/*** @jsx React.DOM */

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
		console.log(tag);
		if (tag.sentiment_score > 0.7 ){
			var style = {
				backgroundColor: "#fb9e9e",
				color: "white"
			};
		}
		else if (tag.sentiment_score > 0.2 ){
			var style = {
				backgroundColor: "#d15f5f",
				color: "white"
			};
		}
		else if (tag.sentiment_score > -0.2 ){
			var style = {
				backgroundColor: "#aa3535",
				color: "white"
			};
		}
		else if (tag.sentiment_score > -0.8 ){
			var style = {
				backgroundColor: "#831414",
				color: "white"
			};
		}
		else{
			var style = {
				backgroundColor: "#570000",
				color: "white"
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
	renderArticles: function(articles, difference_score, tags){
		return(
			<div className="pair row">
				<p className="text-center"> These articles discuss some category </p>
				<div className="paired_articles">
					<Article options={articles[0]} tags = {tags[0]} onClick={this.handleClick}/>
					<Article options={articles[1]} tags ={tags[1]} onClick={this.handleClick}/>
				</div>
				<hr/>
			</div>
		);
	},
	render:function(){
		var styleE = {backgroundColor: "#fb9e9e", color:"white"}
    var styleD = {backgroundColor: "#d15f5f", color:"white"}
    var styleC = {backgroundColor: "#aa3535", color:"white"}
    var styleB = {backgroundColor: "#831414", color:"white"}
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

// for security reasons...you can't access the url of an iframe.

var Article = React.createClass({
	getInitialState: function(){
		return {showArticle: false};
	},
	render: function(){
		return (
			<div className = 'large-6 columns'>
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

var Rating = React.createClass({
	getInitialState: function(){
		return {
			content:(
				<ul className="bottom right inline-list">
					<li className="agree tiny radius button">agree</li>
					<li className="disagree tiny radius button">disagree</li>
				</ul>
			)
		}
	},
	onClick: function(e){
		$(e.target).addClass('disabled');
		$(e.target).siblings().addClass('disabled');
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
	getInitialState: function() {
		return {
			stackedBarData:[],
			packedCirclesData: [],
			userData: []
		}
	},

	componentDidMount: function() {
		var request = $.ajax({
			type: "GET",
			url: '/profile',
		});

		request.done(function(response) {
			if(response.success == true) {
				var dataset = response.user.dataset;
				this.setState({stackedBarData:dataset});
				this.renderStackedBarGraph(dataset);
			}
		}.bind(this))
		// AJAX request, get user and data
		// Call render methods for profileData, stackedBarData, and packedCirclesData
	},

	renderStackedBarGraph: function(stackedBarData) {
		console.log(stackedBarData)
		//get the layernames present in the first data element
		var data = stackedBarData
		var layernames = d3.keys(data[0].layers);
		//get idheights, to use for determining scale extent, also get barnames for scale definition
		var idheights = [];
		var barnames = [];
		for (var i=0; i<data.length; i++) {
		    tempvalues = d3.values(data[i].layers);
		    tempsum = 0;
		    for (var j=0; j<tempvalues.length; j++) {tempsum = tempsum + tempvalues[j];}
		    idheights.push(tempsum);
		    barnames.push(data[i].name);
		};

		var margin = {top: 10, right: 10, bottom: 30, left: 30},
		    width = 400 - margin.left - margin.right,
		    height = 300 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .domain(barnames)
		    .rangeRoundBands([0, width], .25);

		var y = d3.scale.linear()
		    .domain([0, d3.max(idheights)])
		    .range([height, 0]);
		    
		var colors = d3.scale.category10();

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom")

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");

		var svg = d3.select("#stackedBar").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		svg.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		    .append("text")
		    .attr("x", width / 2)
		    .attr("y", margin.bottom - 10)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Topics");

		svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis)
		    .append("text")
		    .attr("transform", "rotate(-90)")
		    .attr("x", -height/2)
		    .attr("y", -margin.bottom)
		    .attr("dy", ".71em")
		    .style("text-anchor", "end")
		    .text("Total Number of Votes");

		//add a g element for each bar
		var bargroups = svg.append("g")
		    .attr("class", "bars")
		    .selectAll("g")
		    .data(data, function(d) {return d.id;})
		  .enter().append("g")
		    .attr("id", function(d) {return d.name;});
		//sub-selection for rect elements
		var barrects = bargroups.selectAll("rect")
		    .data(function(d) {
		        //set data as an array of objects [{height: _, y0: _},..]
		        //must compute sum of other elements to get y0 (computed height)
		        var temparray = [];
		        var tempsum = 0;
		        for (var i=0; i<layernames.length; i++) {
		            console.log(layernames[i]);
		            temparray.push(
		                {height: d.layers[layernames[i]],
		                 y0: tempsum + d.layers[layernames[i]]}
		            );
		            tempsum = tempsum + d.layers[layernames[i]];
		        }
		        return temparray;
		    })
		  .enter().append("rect")
		    .attr({
		        "x": function(d,i,j) {return x(barnames[j]);},
		        "y": function(d) {return y(d.y0);},
		        "width": x.rangeBand(),
		        "height": function(d) {return height - y(d.height);}
		    })
		    .style("fill", function(d,i,j) {return colors(i)});   
	},

  render: function() {
    return (
    	<div>
	      <div className="userProfile">
	        <p>Welcome to your user profile, {this.props.user.name}.</p>
	        <p>Your email address is {this.props.user.email}.</p>
	      </div>
	      <div id="stackedBar"> </div>
				<div id="packedCircles"> </div>
			</div>
    )
  }
});

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
