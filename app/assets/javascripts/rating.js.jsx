/*** @jsx React.DOM */

//////////////////////////////// RATING MODEL ////////////////////////////////
var Rating = React.createClass({
  getInitialState: function(){
    var style = {
      fontSize: "17px",
    }
    return {
      content:(
        <div className="left">
          <br/>
          <div> Was this coverage fair? </div>
          <div className="agree radius secondary label" style={style} >Yes</div>
          <div className="disagree radius secondary label" style={style} >No</div>
        </div>
      ),
      response: ""
    }
  },
  onClick: function(e){
    this.setState({response: $(e.target).text()});
    $(e.target).fadeOut('1000');
    $(e.target).siblings().fadeOut('1000');
    this.setState({content: <p className = "left">You rated this article {this.state.response}</p>})
    var request = $.post('rate', {rating: e.target.className , article_id: this.props.article_id})
  },
  render: function(){
    return(
      <div className="rating inline" onClick={this.onClick}>
        {this.state.content}
      </div>
    )
  }
})