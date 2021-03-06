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
    denominator = user_tags.pluck(:relevance).inject(:+)

    user_tags.each do |user_tag|
      direction = user_tag.agreement ? 1 : -1
      score = user_tag.sentiment_score * user_tag.relevance * direction
      numerator += score
    end

    weighted_tag_score = numerator/denominator
  end

  def custom_match(category)
    closest_matching_article = possible_article_matches(category)[-1].keys[0]

    if closest_matching_article.nil?
      Pair.defaults.find_by(category: category)
    else
      new_pair = category.find_pair(closest_matching_article)
      Pair.find_or_create_by(article1_id: new_pair[0].id,
              article2_id: new_pair[1].id,
              category_id: category.id,
              user_id: self.id,
              difference_score: new_pair[2])
    end

  end

  def possible_article_matches(category)
    possible_matches = []
    articles = category.articles

    articles.each do |article|
      overlapping_tags = overlapping_tags(article)

      if vote_count(overlapping_tags) >=20
        quotient = find_quotient(article)
        possible_matches << {article => quotient}
      end
    end

    return [{nil => nil}] if possible_matches.empty?
    possible_matches.sort_by { |hash| hash.values[0] }
  end

  def find_quotient(article)
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
    user_tags = self.tags
    article_tags = article.tags

    user_tags & article_tags
  end

  # might be better elsewhere
  def vote_count(overlapping_tags)
    user_tags_count = self.user_tags.where(tag_id: overlapping_tags).size
  end



	  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end

end
