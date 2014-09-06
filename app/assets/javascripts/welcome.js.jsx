/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
var Pair = React.createClass({
	getInitialState: function(){
		return {pairs: ""};
	},
	getPairs: function(e){
		e.preventDefault();
		console.log("here")
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
	renderArticles: function(articles){
		return(
			<div className="row">
				<Article options = {articles[0]}/>
				<Article options = {articles[1]}/>
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
				<div className='pair large-12 columns'>{this.state.pairs}</div>
			</div>
		);
	}
})
//title={article1.title} source = {article1.source} slug = {article1.slug}
// <div className = 'article large-6 columns'>
// 	<h2>{article1.title}</h2>
// 	<h6 className="subheader">{article1.source}</h6>
// 	<p>{article1.slug}</p>
// </div>
// <div className = 'article large-6 columns'>
// 	<h2>{article2.title}</h2>
// 	<h6 className="subheader">{article2.source}</h6>
// 	<p>{article2.slug}</p>
// </div>


var Article = React.createClass({
	render: function(){
		return (
			<div className = 'article large-6 columns'>
				<h2>{this.props.options.title}</h2>
				<h6 className="subheader">{this.props.options.source}</h6>
				<p>{this.props.options.slug}</p>
			</div>
		);
	}
});

function renderPair(){
	React.renderComponent(
	<Pair/>,
	document.getElementById('newsFeed')
	);
}
