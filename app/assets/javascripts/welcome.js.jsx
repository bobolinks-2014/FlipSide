/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
var Pair = React.createClass({
	getInitialState: function(){
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
		return {pairs: ""};
	},
	renderArticles: function(articles){
		return(
			<div className="pair row">
				<Article options = {articles[0]}/>
				<Article options = {articles[1]}/>
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

			// <div>
			// 	<form onSubmit={this.getPairs}>
			// 		<input type = "submit" className= 'button' value = "load articles"/>
			// 	</form>
			// </div>

var Article = React.createClass({
	onClick: function(url){
		// iframe should pop up
		console.log(url);
	},
	render: function(){
		return (
			<div className = 'article large-6 columns' onClick={this.onClick(this.props.options.url)}>
				<h2>{this.props.options.title}</h2>
				<h6 className="subheader">{this.props.options.source}</h6>
				<p>{this.props.options.slug}</p>
			</div>
		);
	}
});

function renderPair(){
	console.log("here");
	React.renderComponent(
	<Pair/>,
	document.getElementById('container')
	);
}
