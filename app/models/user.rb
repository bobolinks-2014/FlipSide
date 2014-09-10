# require 'pry'
class User < ActiveRecord::Base
  before_save { self.email = email.downcase }
  before_create :create_remember_token
  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i },
                    uniqueness: { case_sensitive: false }
  has_many :ratings
  has_many :user_tags
  has_many :tags, through: :user_tags
  has_many :pairs

  has_secure_password
  validates :password, length: { minimum: 6 }

  #makes the user_tag with an article and a true/false agreement value
  #
  # create user_tags for each article_tag, including the user's agreement value
  # [true/false]
  def vote(article_tags, agreement)
    article_tags.each do |article_tag|
      tag = article_tag.tag
      relevance = article_tag.relevance
      sentiment = article_tag.sentiment_score

      UserTag.create!(tag: tag,
                      user: self,
                      relevance: relevance,
                      sentiment_score: sentiment,
                      agreement: agreement)
    end
  end

  #return a hash with tags(associated to the user) and their weighted_tag_score
  def opinions
    opinions_hash = Hash.new(0)
    self.tags.each do |tag|
      opinions_hash[tag] = UserTag.weighted_tag_score(self.user_tags.where(tag: tag))
    end
    opinions_hash
  end

# maybe?
class Opinion
  def initialize(tag, weighted_score)
    @tag = tag
    @weighted_score = weighted_score
  end

  def quotient(article_tags)
  end
end


  #def find_quotient(article)
  def find_quotient(opinions, article_tags)
    quotient = 0
    user_opinions = self.opinions

    overlapping_tags(article).each do |tag|
      article_tag     = article.article_tags.find_by(tag_id: tag.id)
      user_quotient   = user_opinions[tag]
      article_sentiment = article_tag.sentiment_score

      quotient += (user_quotient-article_sentiment).abs
    end

    return quotient
  end

  def overlapping_tags(article)
    self.tags & article.tags
  end

  # might be better elsewhere
  def vote_count(overlapping_tags)
    user_tags_count = self.user_tags.where(tag_id: overlapping_tags).size
  end

  private

  def create_remember_token
    self.remember_token = RememberToken.encrypted_remember_token
  end

end
