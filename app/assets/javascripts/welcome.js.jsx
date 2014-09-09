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
			<div style = {style} className= " radius secondary label">#{tag.tag.name}</div>
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
				if (data[index]!== null){
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
	console.log('stuff')
	$('#myModal').append('<iframe src='+url+' class= "large-12 columns" height="600px"></iframe>');
});

// $('div').on("click",'.close', function(e){
// 	e.preventDefault();
// 	removeIFrame();
// });

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

//////////////////////////////////////////////////////////////////////////////

// var Site = React.createClass({

// 	render: function(url){
// 		return (
// 			<iframe src={url} class= "large-12 columns" height="600px"></iframe>
// 			)
// 	}
// })

// $('div').on('click', function(e){
// 	e.preventDefault();
// 	var url = this.firstChild.className;
// 	removeIFrame();

// 	var iframe = '<iframe src='+url+' class= "large-12 columns" height="600px"></iframe>'

// // console.log('stuff is happnin')

// 	$(renderSite(url)).foundation('reveal', 'close');

// })
///////////////////////////////////////////////////////////////////////////////
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
			// debugger;
			$('.not_logged_in').hide();
			$('.logged_in').show();
			renderPair();
		} else {
		console.log('failed');
			$("div#error ul").append('<li>'+response.error+'</li>');
      renderPair();
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
				this.renderPackedCirclesGraph();
			}
		}.bind(this))
		// AJAX request, get user and data
		// Call render methods for profileData, stackedBarData, and packedCirclesData
	},

	renderStackedBarGraph: function(stackedBarData) {
		console.log(stackedBarData)

		//Width and height
		//add as many elements to data as necessary, all layers should be present in first data element, add or remove layer elements as necessary
		var data = stackedBarData

		//get the layernames present in the first data element

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
		    width = 500 - margin.left - margin.right,
		    height = 400 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
					    .domain(barnames)
					    .rangeRoundBands([0, width], .25);

		var y = d3.scale.linear()
								    .domain([0, d3.max(idheights)])
								    .range([height, 0]);

		var colors = d3.scale.category10();

		var xAxis = d3.svg.axis()
									    .scale(x)
									    .orient("bottom");

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
				.call(xAxis);

		svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis);

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

	renderPackedCirclesGraph:function(packedCirclesData) {
		console.log("Hooray!")

		packedCirclesData = { "name": "categories",
													// "value": 50,
													"children": [
														{ "name": "Putin", "value" : 20 },
														{ "name": "Obama", "value" : 40 },
														{ "name": "America", "value" : 10 },
														{ "name": "Russia", "value" : 70 }
													]
												};

		var data = packedCirclesData

		var width = 1000,
		    height = 800,
		    r = 720,
		    x = d3.scale.linear().range([0, r]),
    		y = d3.scale.linear().range([0, r]);

		var pack = d3.layout.pack()
									.size([width, height])
									.padding(10);

		var svg = d3.select("#packedCircles").append("svg")
																					.attr("width", width)
																					.attr("height", height)

		var nodes = pack.nodes(data);

		var circle = svg.selectAll("circle")
										.data(nodes)
										.enter().append("circle")
										.attr("r", function(d) { return d.value; })
										.attr("cx", function(d) { return d.x; })
      							.attr("cy", function(d) { return d.y; })
										.attr("class", "category")
										.style("fill", "steelblue")
										.attr("opacity", 0.25)
										.attr("stroke", "gray")
										.attr("stroke-width", "2");

		var text = svg.selectAll("text")
									.data(nodes)
									.enter().append("text")
									.attr("class", function(d) { return d.children ? "categories" : "tag"; })
						      .attr("x", function(d) { return d.x; })
						      .attr("y", function(d) { return d.y; })
						      .attr("dy", ".35em")
						      .attr("text-anchor", "middle")
						      .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
						      .text(function(d) { return d.name; });
	},

  render: function() {
    return (
    	<div>
	      <div className="userProfile">
	        <p>Welcome to your user profile, {this.props.user.name}.</p>
	        <p>Your email address is {this.props.user.email}.</p>
	      </div>
	      <div id="stackedBar" className="text-center"> </div>
				<div id="packedCircles" className="text-center"> </div>
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
      // $('.not_logged_in').hide();
      // $('.logged_in').show();
      renderUserProfile(response.user);
    } else {
      renderPair();
    }
  })
});
