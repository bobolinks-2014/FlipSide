/*** @jsx React.DOM */

//////////////////////////////// USER PROFILE ////////////////////////////////

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
			if(response.success === true && response.user.dataset.length != 0) {
				var dataset = response.user.dataset;
				this.setState({stackedBarData:dataset});
				this.renderStackedBarGraph(dataset);
				renderGraphExplanation();
				$('#welcomeMessage').hide();
				$('#graphExplanation').show();
				$('#graphTitle').show();
			} else {
				renderWelcomeMessage();
				$('#graphExplanation').hide();
			}
		}.bind(this))
	},

	renderStackedBarGraph: function(stackedBarData) {
		var data = stackedBarData
		var layernames = d3.keys(data[0].layers);
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
			final_bar_names.push(barnames[e]);
		}

		var margin = {top: 150, right: 150, bottom: 200, left: 150},
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
			<div className = "row">
				<h2 id="graphTitle">Detect Your Biases</h2>
				<p>  Alchemy's natural language processing API parses each article on Flip/Side for keywords, and assigns them a positive or negative sentiment based on the tone of their context within the text.
				<br/>
				<br/>
				  This graph displays your history of each tag associated with an article you've rated. Green bars show the number of times you've agreed with the positive tone of a tag, or disagreed with the negative tone of a tag. Comparatively, red bars show the number of times you've agreed with the negative tone of a tag, or disagreed with the positive tone of a tag.
				</p>
			</div>
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
