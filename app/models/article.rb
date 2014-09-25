require 'pry'
class Article < ActiveRecord::Base
	has_many :ratings
	has_many :article_tags
  has_many :tags, :through => :article_tags
  belongs_to :category
  validates :slug, uniqueness: :true

  #fed by Alchemy.alchemize - Called a ton if we rake Scrape.
  #makes tags from keywords, and makes article tags with relevant scores
  def make_tags(keywords, number)
    keywords[0...number].each do |keyword|
      kw_name = keyword["text"]
      tag = Tag.find_or_create_by(name: kw_name)
      tag.save
      next unless keyword["sentiment"]
      sentiment_score = keyword["sentiment"]["type"] == "neutral" ?
                        0 :
                        keyword["sentiment"]["score"]

      relevance = keyword["relevance"]

      article_tag = ArticleTag.create(article_id: self.id,
                                      tag_id: tag.id,
                                      sentiment_score: sentiment_score,
                                      relevance: relevance)
    end
  end

  def relevant_sentiment_scores(tags)
    scores = []
    tags.each do |tag|
      scores << self.article_tags.where(tag_id: tag.id)[0].sentiment_score
    end
    p scores
    scores
  end


end
