class Category < ActiveRecord::Base
  has_many :articles
  has_many :pairs



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

  def relevent_articles
    self.articles.select do |article|
      false_count = 0

      @relevent_tags.each do |tag|
        unless article.tags.includes(tag)
          false_count +=1
        end
      end

      false_count == 0
    end
  end

  def find_pair
    #working
  end
end
