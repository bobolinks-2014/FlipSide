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
		return <Tag tag={tag}/>
	},
	render: function(){
		return(
			<div className="tagCollection">{this.state.tagCollection}</div>
		)
	}
});

var Tag = React.createClass({
	onClick: function(){
		var request = $.get('/filter_tags', {tag_id: this.props.id});
		request.done(function(data){
			<Search articles = {data}/>
		});
	},
	render: function(){
		var score = this.props.tag.sentiment_score;
		if (score > 0.65 ){
			var style = {
				backgroundColor: "#004400",
				color: "white"
			};
		}
		else if (score > 0.35 ){
			var style = {
				backgroundColor: "#2d882d",
				color: "white"
			};
		}
		else if (score > -0.35 ){
			var style = {
				backgroundColor: "gray",
				color: "white"
			};
		}
		else if (score > -0.65 ){
			var style = {
				backgroundColor: "#aa3535",
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
			<div style = {style} className= "tag secondary label" onClick={this.onClick}>{this.props.tag.tag.name}</div>
		)
	}
});


// FILTERED MODEL //
var Search = React.createClass({
	getInitialState: function(){
		return {column: ""}
	},
	renderArticles: function(articles){
		var column = [];
		$.each(articles, function(i){
			debugger;
			tags = articles[i].tags;
			column.push(<Article options={articles[i]} tags= {tags}/>);
		})
		this.setState({column: column});
	},
	render: function(){

		this.renderArticles(this.props.articles);
		return(
			<div>this.state.column</div>
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
		var styleE = {backgroundColor: "#004400", color:"white", margin: "1px"}
    var styleD = {backgroundColor: "#2d882d", color:"white", margin: "1px"}
    var styleC = {backgroundColor: "gray", color:"white", margin: "1px"}
    var styleB = {backgroundColor: "#aa3535", color:"white", margin: "1px"}
    var styleA = {backgroundColor: "#570000", color:"white", margin: "1px"}
		return (
			<div className='newsFeed large-12'>
				<div className = "panel large-2 columns">
					<h4>About</h4>
					<p> The media likes to feed you only what you want to hear. At FlipSide, we strive to do the opposite.</p>
					<h4>Article Sentiment Analysis</h4>
					<p>Each article is analyzed for sentiment on the Sentiment is the attitude or opinion expressed towards something, such as a person, product, organization or location. Article sentiments are categorized as follows: </p>
					<ul className="no-bullet">
						<li style = {styleA} className= "secondary label"><div>very negative</div></li>
						<li style = {styleB} className= "secondary label"><div>negative</div></li>
						<li style = {styleC} className= "secondary label"><div>neutral</div></li>
						<li style = {styleD} className= "secondary label"><div>positive</div></li>
						<li style = {styleE} className= "secondary label"><div>very positive</div></li>
					</ul>
				</div>
				<h2 className="text-center large-8 columns">FlipSide - World News Feed</h2>
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
		debugger;
		return (
			<div className = 'large-6 columns article-container' style={this.state.style} onMouseOver = {this.onMouseOver} onMouseLeave = {this.onMouseLeave}>

				<div className = 'article' id= {this.props.options.id} data-reveal-id="myModal">
					<div className = {this.props.options.url}>
						<h4 style = {this.state.titleStyle}>{this.props.options.title}</h4>
						<h6 className="subheader">{this.props.options.source}</h6>
						<p>{this.props.options.slug}</p>
					</div>
				</div>
				<TagCollection tags={this.props.tags}/>
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
					<br/>
					<div> Evaluate the article bias </div>
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

	$('#myModal').append("<iframe  src="+url+" class= 'large-12 columns' height='100%' id='frame'></iframe>");
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
				// this.renderPackedCirclesGraph();
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

		var margin = {top: 150, right: 150, bottom: 150, left: 150},
		    width = 1000 - margin.left - margin.right,
		    height = 800 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
					    .domain(barnames)
					    .rangeRoundBands([0, width], .25);

		var y = d3.scale.linear()
								    .domain([0, d3.max(idheights)])
								    .range([height, 0]);

		var colors = ["#2d882d", "#aa3535"];

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

		svg.append("text")
		    .attr("transform", "translate(" + (width / 2) + " ," + (height + 28) + ")")
		    .attr("dy", "2em")
		    .style("text-anchor", "middle")
		    .style("font-size", "1.5em")
		    .text("Categories")
		    .classed("axis_title")
		    ;

    svg.append("text")
		    .attr("transform", "rotate(-90)")
        .attr("y", 0 - 90)
        .attr("x",0 - (height / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .style("font-size", "1.5em")
        .text("Stories Read")
        .classed("axis_title")
        ;

    svg.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height - 600) + ")")
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .style("font-size", "1.75em")
        .text("Sentiment Snapshot")
        .classed("graph_title")
        ;

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
												    .style("fill", function(d,i,j) {return colors[i]});
	},

	// renderPackedCirclesGraph:function(packedCirclesData) {
	// 	console.log("Hooray!")

	// 	packedCirclesData = { "name": "categories",
	// 												// "value": 50,
	// 												"children": [
	// 													{ "name": "Putin", "value" : 20 },
	// 													{ "name": "Obama", "value" : 40 },
	// 													{ "name": "America", "value" : 10 },
	// 													{ "name": "Russia", "value" : 70 }
	// 												]
	// 											};

	// 	var data = packedCirclesData

	// 	var width = 1000,
	// 	    height = 800,
	// 	    r = 720,
	// 	    x = d3.scale.linear().range([0, r]),
 //    		y = d3.scale.linear().range([0, r]);

	// 	var pack = d3.layout.pack()
	// 								.size([width, height])
	// 								.padding(10);

	// 	var svg = d3.select("#packedCircles").append("svg")
	// 																				.attr("width", width)
	// 																				.attr("height", height)

	// 	var nodes = pack.nodes(data);

	// 	var circle = svg.selectAll("circle")
	// 									.data(nodes)
	// 									.enter().append("circle")
	// 									.attr("r", function(d) { return d.value; })
	// 									.attr("cx", function(d) { return d.x; })
 //      							.attr("cy", function(d) { return d.y; })
	// 									.attr("class", "category")
	// 									.style("fill", "steelblue")
	// 									.attr("opacity", 0.25)
	// 									.attr("stroke", "gray")
	// 									.attr("stroke-width", "2");

	// 	var text = svg.selectAll("text")
	// 								.data(nodes)
	// 								.enter().append("text")
	// 								.attr("class", function(d) { return d.children ? "categories" : "tag"; })
	// 					      .attr("x", function(d) { return d.x; })
	// 					      .attr("y", function(d) { return d.y; })
	// 					      .attr("dy", ".35em")
	// 					      .attr("text-anchor", "middle")
	// 					      .style("opacity", function(d) { return d.r > 20 ? 1 : 0; })
	// 					      .text(function(d) { return d.name; });
	// },

  render: function() {
    return (
    	<div>
	      <div className="userProfile" className="text-center">
	        <h1>Welcome to your user profile, {this.props.user.name}.</h1>
	        <p>Your email address is {this.props.user.email}.</p>
	      </div>
	      <div id="stackedBar" className="text-center"> </div>
				// <div id="packedCircles" className="text-center"> </div>
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
      renderPair();
    }
  })
});
