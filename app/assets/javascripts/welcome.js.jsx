/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
	var showArticle1= false;
	var showArticle2= false;
var Pair = React.createClass({

	getInitialState: function(){
		return {
			pairs: "",

		};
	},
	getPairs: function(e){
		e.preventDefault();
		console.log("here");
		request = $.get('pairs');
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
	handleClick: function(article){
		console.log(this); // this is the current pair
		console.log(article); // article is the article we clicked
		if (article.state.showArticle === false){
			showArticle1 = true;
		};
		console.log(showArticle2);
		console.log(showArticle1);
	},
	renderArticles: function(articles){
		console.log(articles);
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
			<div>
				<form onSubmit={this.getPairs}>
					<input type = "submit" className= 'button' value = "load articles"/>
				</form>
				<div className='newsFeed large-12 columns'>{this.state.pairs}</div>
			</div>
		);
	}
})


				// { this.state.showArticle1? <Iframe url={articles[0].url}/> : null }
				// { this.state.showArticle2? <Iframe url={articles[1].url}/> : null }
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
				// { this.state.showArticle? <Iframe url={this.props.options.url}/> : null }
// http://stackoverflow.com/questions/22639534/pass-props-to-parent-component-in-react-js
var Iframe = React.createClass({
	render: function(){
		return(
			<div className = "row article-view">
		    <iframe src={this.props.url} className = "large-12 columns widescreen" height="600"></iframe>
		  </div>
		)
	}
});

function renderPair(){
	React.renderComponent(
	<Pair/>,
	document.getElementById('container')
	);
}

$('div').on("click",".article",function(e){
	e.preventDefault();
	var url = this.firstChild.className;
	console.log(url);
	console.log(this);
	console.log($('iframe'));
	if ($('iframe').length !== 0){
		$('iframe').remove();
	}
		
	$(this.parentElement).append('<div className = "large-12 columns article-view"><iframe src='+url+' className = "large-12 columns widescreen" height="600"></iframe></div>');
});

