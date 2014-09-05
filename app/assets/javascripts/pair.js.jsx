/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
var pair = React.createClass({
	getInitialState: function(){
		return {pairs: "pairs44"};
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
				articlesRendered = this.renderArticles(articles)
				pair_arr.push(articlesRendered);
			}.bind(this));
			this.setState({
				pairs: pair_arr,
			});
			// console.log("in get pairs");
			// console.log(this.state.pairs);
		}.bind(this));
	},
	renderArticles: function(articles){
		var article1 = articles[0];
		var article2 = articles[1];
		return(
			<div>
				<div className = 'article large-6 columns'>
					<div>{article1.title}{article1.source}{article1.slug}</div>
				</div>
				<div className = 'article large-6 columns'>
					<div>{article1.title}{article2.source}{article2.slug}</div>
				</div>
			</div>
		);
	},
	render:function(){

		return (
			<div>
				<form onSubmit = {this.getPairs}>
					<input type = "submit" value = "press to load"/>
				</form>
				<div className='pair large-12 columns'>{this.state.pairs}</div>
			</div>
			);
	}
})



React.renderComponent(
	<pair/>,
	document.getElementById('newsFeed')
	);

