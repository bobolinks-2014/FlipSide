/*** @jsx React.DOM */

//////////////////////////////// ARTICLE MODEL ////////////////////////////////
var Article = React.createClass({
  getInitialState: function(){
    return {
      showArticle: false,
      style: {},
      titleStyle: {textDecoration: "underline", color: "#606060"}
    };
  },
  onMouseOver: function(){
    this.setState({
      style:{
        boxShadow: "0px 1px 10px #888888",
        cursor: "pointer",
        backgroundColor: '#F2F2F2',
        transition: "0.15s"
      },
      titleStyle: {textDecoration: "underline"}
    });

  },
  onMouseDown: function(){
    this.setState({
      titleStyle: {color: "black", textDecoration: "underline"}
    });
  },
  onMouseLeave: function(){
    this.setState({
      style: {boxShadow: 'none'},
      titleStyle: {color: "gray", textDecoration: "underline"}
    });
  },
  render: function(){
    var classSet = this.props.size+' article-container'
    return (
      <div className = {classSet} style={this.state.style} onMouseOver = {this.onMouseOver} onMouseLeave = {this.onMouseLeave}>

        <div className = 'article' id= {this.props.options.id} data-reveal-id="myModal">
          <div className = {this.props.options.url}>
            <h4 style = {this.state.titleStyle}>{this.props.options.title}</h4>
            <h6 className="subheader">{this.props.options.source}</h6>
            <p>{this.props.options.slug}</p>
          </div>
        </div>
        <TagCollection tags={this.props.tags}/>
        <Rating article_id= {this.props.options.id} />
      </div>
    );
  }
});