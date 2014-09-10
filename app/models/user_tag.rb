class UserTag < ActiveRecord::Base
  belongs_to :user
  belongs_to :tag

  def score
    direction = user_tag.agreement ? 1 : -1
    user_tag.sentiment_score * user_tag.relevance * direction
  end

  #make sentiment, agreement, relevance attr_reader
  def self.weighted_scores(user_tags)
    numerator = 0
    # inject
    numerator = user_tags.sum{|ut| ut.score}

    denominator = user_tags.pluck(:relevance).inject(:+)


    numerator/denominator
  end
end
