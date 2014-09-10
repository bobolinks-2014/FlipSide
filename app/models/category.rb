require 'pry'
class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  attr_reader :relevant_tags

  def self.from_today
    self.all.where("created_at >= ?", Time.zone.now.ago(86400))
  end

  def self.from_last_six_hours
    self.all.where("created_at >= ?", Time.zone.now.ago(86400/4))
  end

  #Runner method; returns a pair object given the number of keywords
  def make_pair

    return self.articles.first if self.articles.size == 1

    pair = find_pair
    return if pair[0] == 0

    Pair.create(article1_id: pair[0].id,
                article2_id: pair[1].id,
                category_id: self.id,
                difference_score: pair[2])
  end

class ArticlePair(article_1, article_2, difference)
  def initialize(article_1, article_2, difference)

  end

end


  def find_generic_pair
    pairs = []
    self.articles.each do |subject|
      pairs << find_pair(subject, self.articles.remove(subject))
    end

    pairs.min_by{|p| p.difference}
  end

  def find_pair(subject, candidates)
    pairs = []
    candidates.each do |candidate|
      difference = sum_differences(subject, candidate)
      shared_tag_count = compare_tags(subject, candidate)

      pairs << ArticlePair.new(subject, candidate, difference) if shared_tag_count >= 2
    end

    pairs.max_by{|p| p.difference}
  end

  #method for evaluating differences between articles' relevant tags scores'
  def sum_differences(article1, article2)
    sum = 0

    article1.article_tags.each do |article_tag1|
      article_tag2 = article2.article_tags.find_by(tag_id: article_tag1.id)

      a1_score = article_tag1.sentiment_score
      a2_score = article_tag2.nil? ? 0 : article_tag2.sentiment_score

      sum += (a1_score - a2_score).abs
    end

    return sum
  end

  def compare_tags(article1, article2, number)
    similarities = (article1.tags & article2.tags).size
    similarities >= number
  end

  #takes an article which was matched with a user for some reason, and makes a pair with the most opposite article
  def make_user_pair(article)
    find_pair(article)
  end
end
