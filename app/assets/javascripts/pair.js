// a pair model
// this describes the pair functionality
// this renders the pair
// has two articles

var pair = React.createClass({
	getPairs: function(){
		request = $.get('/pairs');
		request.done(function(data){

		});
	},
	render:function(){

	}
})


// article model

var article = React.createClass({
	getArticle: function(){

	},
	render:function(){
		<div className = "article">  </div>
	}
})