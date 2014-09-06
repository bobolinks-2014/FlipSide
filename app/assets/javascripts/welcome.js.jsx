/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
var Pair = React.createClass({
	getInitialState: function(){
		return {
			pairs: "",
			showArticle1: false,
			showArticle2: false
		};
	},
	getPairs: function(e){
		e.preventDefault();
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
		this.setState({
			showArticle1: false,
			showArticle2: true
		})
	},
	renderArticles: function(articles){
		return(
			<div className="pair row">
				<Article options={articles[0]} onClick={this.handleClick}/>
				<Article options={articles[1]} onClick={this.handleClick}/>
				{ this.state.showArticle1? <Iframe url={this.props.articles[0].url}/> : null }
				{ this.state.showArticle2? <Iframe url={this.props.articles[1].url}/> : null }
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



// for security reasons...you can't access the url of an iframe.
var Article = React.createClass({
	propagateClick: function(url){
		this.props.onClick(this);
	},
	render: function(){
		return (
			<div>
				<div className = 'article large-6 columns' onClick={this.propagateClick}>
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
