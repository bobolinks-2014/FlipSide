require 'pry'
class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  attr_reader :relevant_tags

  def self.from_today
    self.all.where("created_at >= ?", Time.zone.now.ago(86400))
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


  def find_pair(article=nil)
    article_pair = [0,0,0]

    if article
      all_articles = [article]
      articles_left = self.articles.to_a
    else
      all_articles = self.articles
      articles_left = self.articles[1..-1]
    end

    all_articles.each do |article1|
      articles_left.each do |article2|

        difference = sum_differences(article1, article2)

        if (compare_tags(article1, article2, 2)) && (difference > article_pair.last) #&& (article1.source != article2.source)
          article_pair = [article1, article2, difference]
        end

      end
      articles_left.shift
    end

    article_pair
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
