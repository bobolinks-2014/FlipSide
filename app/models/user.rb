require 'pry'
class User < ActiveRecord::Base
	before_save { self.email = email.downcase }
	before_create :create_remember_token
	validates :name, presence: true, length: { maximum: 50 }
	validates :email, presence: true, format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i },
                    uniqueness: { case_sensitive: false }
	has_many :ratings
  has_many :user_tags
  has_many :tags, through: :user_tags

  has_secure_password
	validates :password, length: { minimum: 6 }

	 def User.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def User.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  #makes the user_tag with an article and a true/false agreement value
  def vote(article,agreement)
    article.article_tags.each do |article_tag|
      tag = article_tag.tag
      relevance = article_tag.relevance
      sentiment = article_tag.sentiment_score
      UserTag.create!(tag: tag,
                     user:self,
                     relevance: relevance,
                     sentiment_score: sentiment,
                     agreement: agreement)
    end
  end
 #return a hash with tags(associated to the user) and their weighted_tag_score
  def opinions
    opinions_hash = Hash.new(0)
    self.tags.each do |tag|
      opinions_hash[tag] = weighted_tag_score(tag)
    end
    opinions_hash
  end
  #make sentiment, agreement, relevance attr_reader
  def weighted_tag_score(tag)
    user_tags = self.user_tags.where(tag_id: tag.id)
    numerator = 0
    user_tags.each do |user_tag|
      direction = user_tag.agreement ? 1 : -1
      score = user_tag.sentiment_score*user_tag.relevance*direction
      numerator += score
    end
    denominator = user_tags.pluck(:relevance).inject(:+)
    weighted_tag_score = numerator/denominator
  end


	  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end

end
