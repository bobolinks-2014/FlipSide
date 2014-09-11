/*** @jsx React.DOM */

var styleE = {backgroundColor: "#910000", color:"white", margin: "1px", padding:"10px"}
var styleD = {backgroundColor: "#E34848", color:"white", margin: "1px", padding:"10px"}
var styleC = {backgroundColor: "gray", color:"white", margin: "1px", padding:"10px"}
var styleB = {backgroundColor: "#3ab53a", color:"white", margin: "1px", padding:"10px"}
var styleA = {backgroundColor: "#005600", color:"white", margin: "1px", padding:"10px"}

//////////////////////////////// SEARCH MODEL ////////////////////////////////
var Search = React.createClass({
  getInitialState: function(){
    this.renderArticles;
    return {column: ""}
  },
  renderArticles: function(){
    var column = [];
    $.each(this.props.articles, function(){
      tags = this.article_tags;
      // send down an array of tags and then the article
      column.push(<Article options={this} tags= {tags} size={"large-12 columns"}/>);
    });
    this.setState({column: column});
  },
  componentDidMount: function(){
    this.renderArticles();
  },
  componentWillReceiveProps: function(){
    this.renderArticles();
  },
  render: function(){
    return(
      <div>

        <h2 className="text-center">Articles tagged {this.props.header}</h2>
        <div className = "panel large-1 columns static-first hide-for-medium-down">
            <h4>Tag Bias</h4>
            <ul className="no-bullet">
              <li style = {styleA} className= "secondary label"><div>very positive</div></li><br/>
              <li style = {styleB} className= "secondary label"><div>positive</div></li><br/>
              <li style = {styleC} className= "secondary label"><div>neutral</div></li><br/>
              <li style = {styleD} className= "secondary label"><div>negative</div></li><br/>
              <li style = {styleE} className= "secondary label"><div>very negative</div></li><br/>
            </ul>
        </div>
        <div className="row">{this.state.column}</div>
      </div>
    )
  }
});
