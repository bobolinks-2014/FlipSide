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

var styleE = {backgroundColor: "#910000", color:"white", margin: "1px", padding:"10px"}
var styleD = {backgroundColor: "#E34848", color:"white", margin: "1px", padding:"10px"}
var styleC = {backgroundColor: "gray", color:"white", margin: "1px", padding:"10px"}
var styleB = {backgroundColor: "#3ab53a", color:"white", margin: "1px", padding:"10px"}
var styleA = {backgroundColor: "#005600", color:"white", margin: "1px", padding:"10px"}

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

// FILTERED MODEL //
var Search = React.createClass({
	getInitialState: function(){
		this.renderArticles;
		return {column: ""}
	},
	renderArticles: function(){
		var column = [];
		$.each(this.props.articles, function(){
			tags = this.article_tags;
			// send down an array of tags and then the article
			column.push(<Article options={this} tags= {tags} size={"large-12 columns"}/>);
		});
		this.setState({column: column});
	},
	componentDidMount: function(){
		this.renderArticles();
	},
	componentWillReceiveProps: function(){
		this.renderArticles();
	},
	render: function(){
		return(
			<div>

				<h2 className="text-center">Articles tagged {this.props.header}</h2>
				<div className="row">{this.state.column}</div>
			</div>
		)
	}
});

function renderSearch(data, name){
		React.renderComponent(
		<Search articles={data} header={name}/>,
		document.getElementById('container')
	);
}
// TAG MODEL //
var Tag = React.createClass({
	onClick: function(){
		var name = this.props.tag.tag.name
		console.log("I clicked a tag: "+name)
		var request = $.get('filterTags', {tag_id: this.props.tag.tag_id});
		request.done(function(data){
			renderSearch(data, name);
		}.bind(this));
	},
	render: function(){
		var score = this.props.tag.sentiment_score;
		if (score > 0.65 ){
			var style = {
				backgroundColor: "#910000",
				color: "white",
				margin: "1px",
				padding: "10px"
			};
		}
		else if (score > 0.35 ){
			var style = {
				backgroundColor: "#E34848",
				color: "white",
				margin: "1px",
				padding: "10px"
			};
		}
		else if (score > -0.35 ){
			var style = {
				backgroundColor: "gray",
				color: "white",
				margin: "1px",
				padding: "10px"
			};
		}
		else if (score > -0.65 ){
			var style = {
				backgroundColor: "#3ab53a",
				color: "white",
				margin: "1px",
				padding: "10px"
			};
		}
		else{
			var style = {
				backgroundColor: "#005600",
				color: "white",
				margin: "1px",
				padding: "10px"
			};
		};

		return(
			<div style = {style} className= "tag radius secondary label" onClick={this.onClick}>{this.props.tag.tag.name}</div>
		)
	}
});




// PAIR MODEL //

var Pair = React.createClass({
	getInitialState: function(){
		return {pairs: ""};
	},

	getArticles: function(starting, ending){
		request = $.get('pairs', {starting: starting, ending:ending});

		pair_arr = [];
		request.progress(function(){
			console.log( "waiting ...")
		});
		request.done(function(data){
			$.each(data, function(index){
				var articles = [];
				if (data[index]!== null){
					articles.push(data[index].article1);
					articles.push(data[index].article2);

					pairRendered = this.renderArticles(articles, data[index].difference_score, this.getCommonTags(articles), data[index].category.name);
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
		this.getArticles(0,3);
		this.getArticles(4,9);
		this.getArticles(10,-1);
	},
	renderArticles: function(articles, difference_score, tags, category){
		var styleCategory = {
			textTransform: "uppercase",
			letterSpacing: "4px",
			color: "black"
		}
		return(
			<div className="pair row">
				<div className="paired_articles">
					<h1 className = "text-center" style = {styleCategory}>{category}</h1>
					<Article options={articles[0]} tags = {tags[0]} size={"large-6 columns"}/>
					<Article options={articles[1]} tags ={tags[1]} size={"large-6 columns"}/>
				</div>
				<hr/>
			</div>
		);
	},
	render:function(){

		console.log("rendering pairs");

		return (
			<div>
				<div className="landing">
					<div className="row">
					<br/>
					<h1 className="accentWord"> Flip/Side</h1>
					<h3> Every story has another side. </h3>
					</div>
				</div>
					<div className = "panel large-1 columns static-first hide-for-medium-down">
						<h4>Tag Bias</h4>
						<ul className="no-bullet">
							<li style = {styleA} className= "secondary label"><div>very positive</div></li><br/>
							<li style = {styleB} className= "secondary label"><div>positive</div></li><br/>
							<li style = {styleC} className= "secondary label"><div>neutral</div></li><br/>
							<li style = {styleD} className= "secondary label"><div>negative</div></li><br/>
							<li style = {styleE} className= "secondary label"><div>very negative</div></li><br/>
						</ul>
				</div>
				<div className='newsFeed large-12 columns'>
					{this.state.pairs}
				</div>
			</div>
		);
	}
})



	// 			<div className="panel large-2 columns hide-this" ></div>


// ARTICLE MODEL //
// for security reasons...you can't access the url of an iframe.
var Article = React.createClass({
	getInitialState: function(){
		return {
			showArticle: false,
			style: {},
			titleStyle: {textDecoration: "underline", color: "#606060"}
		};
	},
	onMouseOver: function(){
		this.setState({
			style:{
				boxShadow: "0px 1px 10px #888888",
				cursor: "pointer",
				backgroundColor: '#F2F2F2',
				transition: "0.15s"
			},
			titleStyle: {textDecoration: "underline"}
		});

	},
	onMouseDown: function(){
		this.setState({
			titleStyle: {color: "black", textDecoration: "underline"}
		});
	},
	onMouseLeave: function(){
		this.setState({
			style: {boxShadow: 'none'},
			titleStyle: {color: "gray", textDecoration: "underline"}
		});
	},
	render: function(){
		console.log("render Article")
		var classSet = this.props.size+' article-container'
		return (
			<div className = {classSet} style={this.state.style} onMouseOver = {this.onMouseOver} onMouseLeave = {this.onMouseLeave}>

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
					<div> Was this coverage fair? </div>
					<div className="agree radius secondary label">Yes</div>
					<div className="disagree radius secondary label">No</div>
				</div>
			),//'
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

	$('#myModal').append("<iframe  src="+url+" class= 'large-12 columns' height='95%' width='80%' id='frame'></iframe>");
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
		console.log("componentDidMount")
		request.done(function(response) {
			debugger;
			if(response.success === true && response.user.dataset.length != 0) {
				console.log("in here")
				console.log(response.user.dataset)
				var dataset = response.user.dataset;
				this.setState({stackedBarData:dataset});
				this.renderStackedBarGraph(dataset);
				renderGraphExplanation();
				$('#welcomeMessage').hide();
				$('#graphExplanation').show();
				$('#graphTitle').show();
			} else {
				renderWelcomeMessage();
			}
		}.bind(this))
		// AJAX request, get user and data
		// Call render methods for profileData, stackedBarData, and packedCirclesData
	},

	renderStackedBarGraph: function(stackedBarData) {
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

		var final_bar_names = [];

		for (var e=0; e<barnames.length; e++) {
			// console.log(barnames[e]);
			// var split_arr = barnames[e].split(' ');
			// console.log(split_arr);
			// var new_title = split_arr.join("\n");
			// console.log(new_title);
			final_bar_names.push(barnames[e]);
		}

		console.log(final_bar_names)

		var margin = {top: 150, right: 150, bottom: 300, left: 150},
		    width = 1000 - margin.left - margin.right,
		    height = 800 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
								    .domain(final_bar_names)
								    .rangeRoundBands([0, width], .25)
								    ;

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
				.call(xAxis)
				.selectAll("text")
					.style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", function(d) {
            return "rotate(-65)"
          })
				;

		svg.append("g")
		    .attr("class", "y axis")
		    .call(yAxis);

		svg.append("text")
		    .attr("transform", "translate(" + (width / 2) + " ," + (height + 28) + ")")
		    .attr("dy", "2em")
		    .style("text-anchor", "middle")
		    .style("font-size", "1.5em")
		    // .text("Categories")
		    .classed("axis_title")
		    ;

    svg.append("text")
		    .attr("transform", "rotate(-90)")
        .attr("y", 0 - 100)
        .attr("x",0 - (height / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .style("font-size", "1.5em")
        .text("Articles Rated")
        .classed("axis_title")
        ;

    // svg.append("text")
    //     .attr("transform", "translate(" + (width / 2) + " ," + (height - 600) + ")")
    //     .attr("dy", "2em")
    //     .style("text-anchor", "middle")
    //     .style("font-size", "1.75em")
    //     .text("Detect Your Biases")
    //     .classed("graph_title")
    //     ;

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
												        "x": function(d,i,j) {return x(final_bar_names[j]);},
												        "y": function(d) {return y(d.y0);},
												        "width": x.rangeBand(),
												        "height": function(d) {return height - y(d.height);}
												    })
												    .style("fill", function(d,i,j) {return colors[i]});
	},

  render: function() {
    return (
    	<div>

	      <div className="userProfile" className="text-center">
	        <h1>{this.props.user.name}</h1>
	        <div className="panel" id="welcomeMessage"></div>
	        <h2 id="graphTitle">Detect Your Biases</h2>
		      <div className="panel" id="graphExplanation"></div>
	      </div>
	      <div id="stackedBar" className="text-center"></div>


			</div>
    )
  }
});

var WelcomeMessage = React.createClass({
	render: function() {
		return (
			<p>Welcome to FlipSide. This is your personal profile page. As you read stories and vote on them, this panel will be replaced with data on your reading habits.</p>
		)
	}
})

var GraphExplanation = React.createClass({
	render: function() {
		return (
			<p>The graph below scales up as you cast more votes. Green bars indicate your agreement with the general slant of an article, whereas red bars show where you disagreed with the sentiment that Alchemy identified in the article you were reading.</p>
		)
	}
})

function renderWelcomeMessage() {
	React.renderComponent(
    <WelcomeMessage/>,
    document.getElementById('welcomeMessage')
	);
}

function renderGraphExplanation() {
	React.renderComponent(
    <GraphExplanation/>,
    document.getElementById('graphExplanation')
	);
}

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
