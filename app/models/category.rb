require 'pry'
class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  attr_reader :relevant_tags
  #Runner method; returns a pair object given the number of keywords
  def make_pair
    return self.articles.first if self.articles.size == 1
    find_pair
  end

  #simplest
  # for all the articles in a category
  # compare avg sentiments of the tags and find max difference

  # Better
  # for all the articles in a category
  # intialize article pair
  # initial sentiment difference: 0
  # find look for articles with at least 1-2 tags in common
  # if they have tags in common
    # find their sentiment difference
    # sentiment difference is the average sentiment difference between the common tags
    # if the sentiment differnece is greater than some threshold, make a pair


  def find_pair
    articles_left = self.articles[1..-1]
    self.articles.each do |article1|
      articles_left.each do |article2|
        articletags = common_tags(article1, article2, 2)
        if articletags != nil
          diff = find_average_sentiment_difference(articletags)
          if  diff > 0.9
            Pair.create(article1_id: article1.id,
            article2_id: article2.id,
            category_id: self.id,
            difference_score: diff)
          end
        end
      end
    end
  end

  # this finds the common tags of article1 and article2. if they have a tag in common,
  # find the articleTags associated with the article and tag this returns an array of ArticleTag pairs
  def common_tags(article1, article2, num)
    common_tags = []
    article1.tags.each do |tag1|
      article2.tags.each do |tag2|
        if tag1.name == tag2.name
          common_tags << [ArticleTag.where(tag: tag1, article: article1), ArticleTag.where(tag: tag2, article: article2)]
        end
      end
    end
    return common_tags.length >= num ? common_tags : nil
  end

  # find the average sentiment difference between the tags
  # article tags are an array of article tag pairs
  def find_average_sentiment_difference(articletags)
    differences = []
    articletags.each do |articletag|
      differences << (articletag[0].first.sentiment_score - articletag[1].first.sentiment_score).abs
    end
    differences.inject(:+)/ differences.length
  end
# c= Category.first

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

end
