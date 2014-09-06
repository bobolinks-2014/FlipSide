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
	propagateClick: function(url){
		this.props.onClick(this);

	},
	render: function(){
		return (
			<div className = 'article large-6 columns' >
				<div className = {this.props.options.url}>
					<h2>{this.props.options.title}</h2>
					<h6 className="subheader">{this.props.options.source}</h6>
					<p>{this.props.options.slug}</p>
				</div>
			</div>
		);
	}
});


var Home = React.createClass({
	getInitialState: function(){
		console.log("hello");
		return {home: this.getHome()}
	},
	getHome: function(){
		console.log("here")
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
	console.log("here");
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
	$(this.parentElement).append('<div class= "close right button tiny radius round">X</div><iframe src='+url+' class= "large-12 columns" height="600px"></iframe>');
});

$('div').on("click",'.close', function(e){
	e.preventDefault();
	removeIFrame();
});
