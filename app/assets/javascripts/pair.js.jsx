/*** @jsx React.DOM */
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles
var pair = React.createClass({
	getPairs: function(){
		console.log("here")
		request = $.get('pairs');
		var pairs = [];
		request.done(function(data){
			$.each(data, function(index){
				var articles = [];
				articles.push(data[index].article1);
				articles.push(data[index].article2);
				pairs.push(this.renderArticles(articles));
			}.bind(this));
			this.setState({pairs: pairs});
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
		this.getPairs();
		return (<div className='pair large-12 columns'>hello</div>);
		
	}
})



React.renderComponent(<pair/>,
	document.getElementById('newsFeed'));

// article model

// var article = React.createClass({
// 	render: function(article){
// 		debugger;
// 		return (
// 			<div className = "article"> Article </div>
// 			)
// 	}
// })

