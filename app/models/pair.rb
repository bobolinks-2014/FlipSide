require 'pry'
class Pair < ActiveRecord::Base
  belongs_to :category
  belongs_to :article1, :class_name => "Article"
  belongs_to :article2, :class_name => "Article"


  def getCommonTags
    commonTags = []
    self.article1.tags.each do |tag1|
      self.article2.tags.each do |tag2|
        p tag1.name
        p tag2.name
        if tag1 == tag2
          commonTags << [tag1, tag2]
        end
      end
    end
    commonTags
  end
end
