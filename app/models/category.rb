require 'pry'
class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  attr_reader :relevant_tags
  #Runner method; returns a pair object given the number of keywords
  def make_pair(number_of_keywords)
    find_relevant_keywords(number_of_keywords)
    pair = find_pair
    Pair.create(article1_id: pair[0].id,
                article2_id: pair[1].id,
                category_id: self.id,
                difference_score: pair[2])
  end


  #should return the N most frequently appearing tags in the catgegory's articles
  def find_relevant_keywords(number)
    tag_count = Hash.new(0)
    self.articles.each do |article|
      article.tags.each do |tag|
        tag_count[tag] += 1
      end
    end
    ord_array = tag_count.sort_by {|k,v| -v}

    @relevant_tags = ord_array[0...number].map{|tag| tag[0]}
  end

  #find_relevant_keywords NEEDS TO be run before this.
  #given all relevent tags, selects all articles that have all relevent tags
  def relevant_articles
    self.articles.select do |article|
      false_count = 0

      @relevant_tags.each do |tag|
        false_count +=1 unless article.tags.include?(tag)
      end

      false_count == 0
    end
  end

  # find_relevant_keywords NEEDS TO be run before this.
  # test after relevant articles
  # returns the most different article pair based on relevant tags differences
  def find_pair
    article_pair = [0,0,0]
    articles_left = self.relevant_articles[1..-1]

    self.relevant_articles.each do |article1|
      a1_scores = article1.relevant_sentiment_scores(@relevant_tags)

      articles_left.each do |article2|

        a2_scores = article2.relevant_sentiment_scores(@relevant_tags)
        difference = sum_differences(a1_scores, a2_scores)

        article_pair = [article1,article2,difference] if difference > article_pair.last

      end
      articles_left.shift
    end
    article_pair
  end

  #method for evaluating differences between articles' relevant tags scores'
  def sum_differences(scores1, scores2)
    sum = 0
    scores1.each_index do |i|
      sum += (scores1[i] - scores2[i]).abs
    end
    sum
  end
end
