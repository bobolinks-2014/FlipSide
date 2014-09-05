class Article < ActiveRecord::Base
	has_many :ratings
	has_many :article_tags
  has_many :tags, :through => :article_tags
  belongs_to :category


  def make_tags(keywords, number)
    keywords[0...number].each do |keyword|
      kw_name = keyword["text"]
      tag = Tag.find_or_create_by(name: kw_name)
      tag.save

      sentiment_score = keyword["sentiment"]["type"] == "neutral" ?
                        0 :
                        keyword["sentiment"]["score"]

      article_tag = ArticleTag.new(article_id: self.id,
                                   tag_id: tag.id,
                                   sentiment_score: sentiment_score)


    end
  end


end
