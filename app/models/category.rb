require 'pry'
class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  attr_reader :relevant_tags
  #Runner method; returns a pair object given the number of keywords
  def make_pair#number_of_keywords)
    # find_relevant_keywords(number_of_keywords)
    return self.articles.first if self.articles.size == 1
    pair = find_pair
    Pair.create(article1_id: pair[0].id,
                article2_id: pair[1].id,
                category_id: self.id,
                difference_score: pair[2])
  end


  #should return the N most frequently appearing tags in the catgegory's articles
  # def find_relevant_keywords(number)
  #   tag_count = Hash.new(0)
  #   self.articles.each do |article|
  #     article.tags.each do |tag|
  #       tag_count[tag] += 1
  #     end
  #   end
  #   ord_array = tag_count.sort_by {|k,v| -v}

  #   @relevant_tags = ord_array[0...number].map{|tag| tag[0]}
  # end

  #find_relevant_keywords NEEDS TO be run before this.
  #given all relevent tags, selects all articles that have all relevent tags
  # def relevant_articles
  #   self.articles.select do |article|
  #     false_count = 0

  #     @relevant_tags.each do |tag|
  #       false_count +=1 unless article.tags.include?(tag)
  #     end

  #     false_count == 0
  #   end
  # end

  # find_relevant_keywords NEEDS TO be run before this.
  # test after relevant articles
  # returns the most different article pair based on relevant tags differences

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
    # if the sentiment difference is greater than the current reigning sentiment difference, reassign article to pair
    # then make a pair

  # of if they have tags in common
    # find their sentiment different
    # if the sentiment differnece is greater than some threshold, make a pair


  def find_pair(article=nil)
    article_pair = [0,0,0]
    if article
      all_articles = [article]
      articles_left = self.articles[0..1]
    else
      all_articles = self.articles
      articles_left = self.articles[1..-1]
    end

    all_articles.each do |article1|
      articles_left.each do |article2|

        difference = sum_differences(article1, article2)
        article_pair = [article1, article2, difference] if difference > article_pair.last && compare_tags(article1, article2, 2)

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
    similarities = 0
    article1.tags.each do |tag1|
      article2.tags.each do |tag2|
        if tag1 == tag2
          similarities += 1
        end
      end
    end

    similarities >= number

  end

  #takes an article which was matched with a user for some reason, and makes a pair with the most opposite article
  def make_user_pair(article)
    find_pair(article)
  end



  #   article1.article_tags.each_index do |i|
  #     # check if the article tag exists in article2
  #     # if it doesn't set sentiment to 0

  #     sum += (scores1[i] - scores2[i]).abs
  #   end
  #   sum
  # end
end
