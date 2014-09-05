/*** @jsx React.DOM */
console.log("pair");
// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles

var pair = React.createClass({
	getPairs: function(){
		console.log("here")
		request = $.get('pairs');
		request.done(function(data){
			article1 = data[0].article1
			article2 = data[0].article2
		});
	},
	renderArticles: function(){
		
	},
	render:function(){
		this.getPairs();
		return (<div className='pair large-12 columns'> </div>);
	}
})

// we got all the pairs
// for each pair, render a pair
// render its articles


React.renderComponent(<pair/>,
	document.getElementById('newsFeed'));

// article model

var article = React.createClass({
	render:function(article){
		return (
			<div className = "article"> Article </div>
			)
	}
})

