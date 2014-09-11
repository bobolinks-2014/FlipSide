/*** @jsx React.DOM */
//////////////////////////////// TAG COLLECTION MODEL /////////////////////////////////
var TagCollection = React.createClass({
  getInitialState: function(){
    return {tagCollection: this.getTags(this.props.tags)};
  },
  getTags: function(tags){
    tag_arr = [];
    $.each(tags, function(i){
      tag_arr.push(this.renderTag(tags[i]));
    }.bind(this));
    return tag_arr;
  },
  renderTag: function(tag){
    return <Tag tag={tag}/>
  },
  render: function(){
    return(
      <div className="tagCollection">{this.state.tagCollection}</div>
    )
  }
});


//////////////////////////////// TAG MODEL ////////////////////////////////
var Tag = React.createClass({
  onClick: function(){
    var request = $.get('filterTags', {tag_id: this.props.tag.tag_id});
    request.done(function(data){
      renderSearch(data, name);
    }.bind(this));
  },
  render: function(){
    var score = this.props.tag.sentiment_score;
    if (score > 0.65 ){
      var style = {
        backgroundColor: "#005600",
        color: "white",
        margin: "1px",
        padding: "7px"
      };
    }
    else if (score > 0.35 ){
      var style = {
        backgroundColor: "#3ab53a",
        color: "white",
        margin: "1px",
        padding: "7px"
      };
    }
    else if (score > -0.35 ){
      var style = {
        backgroundColor: "gray",
        color: "white",
        margin: "1px",
        padding: "7px"
      };
    }
    else if (score > -0.65 ){
      var style = {
        backgroundColor: "#E34848",
        color: "white",
        margin: "1px",
        padding: "7px"
      };
    }
    else{
      var style = {
        backgroundColor: "#910000",
        color: "white",
        margin: "1px",
        padding: "7px"
      };
    };

    return(
      <div style = {style} className= "tag radius secondary label" onClick={this.onClick}>{this.props.tag.tag.name}</div>
    )
  }
});
