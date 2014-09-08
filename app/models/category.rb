class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs

  def make_pair(number_of_keywords)
    find_relevent_keywords(number_of_keywords)
    pair = find_pair
    Pair.create(article1_id: pair[0].id,
                article2_id: pair[1].id,
                category_id: self.id,
                difference_score: pair[2])
  end

  def find_relevent_keywords(number)
    tag_count = Hash.new(0)
    self.articles.each do |article|
      article.tags.each do |tag|
        tag_count[tag] += 1
      end
    end

    #find the n-th tag count
    cut_off = tag_count.sort_by {|k,v| v}.reverse[number-1][1]

    #select the n-most frequent;y appearing tags
    @relevent_tags = tag_count.select {|k,v| v >= cut_off}.keys
  end

<<<<<<< Updated upstream
  #find_relevent_keywords NEEDS TO be run before this.
  def relevent_articles
    self.articles.select do |article|
      false_count = 0
=======
        if (difference > article_pair.last) && (compare_tags(article1, article2, 2)) && (article1.source != article2.source)
          article_pair = [article1, article2, difference]
        end
>>>>>>> Stashed changes

      @relevent_tags.each do |tag|
        unless article.tags.includes(tag)
          false_count +=1
        end
      end

      false_count == 0
    end
  end

  #find_relevent_keywords NEEDS TO be run before this.
  def find_pair
    article_pair = [0,0,0]
    self.relevent_articles.each do |article1|
      self.relevent_articles.each do |article2|
        a1_scores = article1.relevent_sentiment_scores(@relevant_tags)
        a2_scores = article2.relevent_sentiment_scores(@relevant_tags)
        difference = sum_differences(a1_scores, a2_scores)
        article_pair_array = [article1,article2,difference] if difference > article_pair_array[2]
      end
    end
    article_pair
  end

  def sum_differences(scores1, scores2)
    sum = 0
    i = 0
    while i < scores1.length
      sum += (scores1[i] - scores2[i]).abs
      i +=1
    end
    sum
  end
end
