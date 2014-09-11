/*** @jsx React.DOM */

//////////////////////////////// PAIR MODEL ////////////////////////////////

var Pair = React.createClass({
  getInitialState: function(){
    return {pairs: ""};
  },

  getArticles: function(starting, ending){
    request = $.get('pairs', {starting: starting, ending:ending});

    pair_arr = [];
    request.progress(function(){

    });
    request.done(function(data){
      $.each(data, function(index){
        var articles = [];
        if (data[index]!== null){
          articles.push(data[index].article1);
          articles.push(data[index].article2);

          pairRendered = this.renderArticles(articles, data[index].difference_score, this.getCommonTags(articles), data[index].category.name);
          pair_arr.push(pairRendered);
        }
      }.bind(this));
      this.setState({
        pairs: pair_arr,
      });
    }.bind(this));
  },
  getCommonTags: function(articles){
    var tags1 = articles[0].article_tags;
    var tags2 = articles[1].article_tags;
    commonTags = [];
    article1tags = [];
    article2tags = [];
    $.each(tags1, function(i){
      $.each(tags2, function(j){
        if (tags1[i].tag.name === tags2[j].tag.name){
          article1tags.push(tags1[i]);
          article2tags.push(tags2[j]);
        }
      })
    })
    return [article1tags, article2tags];
  },
  componentDidMount: function(){
    this.getArticles(0,3);
    this.getArticles(4,9);
    this.getArticles(10,-1);
  },
  renderArticles: function(articles, difference_score, tags, category){
    var styleCategory = {
      textTransform: "uppercase",
      letterSpacing: "0.4em",
      color: "black"
    }
    return(
      <div className="pair row">
        <div className="paired_articles">
          <h2 className = "text-center" style = {styleCategory}>{category}</h2>
          <Article options={articles[0]} tags = {tags[0]} size={"large-6 columns"}/>
          <Article options={articles[1]} tags ={tags[1]} size={"large-6 columns"}/>
        </div>
        <hr/>
      </div>
    );
  },
  render:function(){
    return (
      <div>
        <div className="landing">
          <div className="row">
          <br/>
          <h1 className> Flip<div className="accentWord inline">/</div>Side</h1>
          <h3> Every story has another side. </h3>
          </div>
        </div>
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
        <div className='newsFeed large-12 columns'>
          {this.state.pairs}
        </div>
      </div>
    );
  }
})