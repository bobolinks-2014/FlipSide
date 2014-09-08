class Pair < ActiveRecord::Base
  belongs_to :category
  belongs_to :article1, :class_name => "Article"
  belongs_to :article2, :class_name => "Article"

  def self.defaults
    self.all.where("created_at >= ?", Time.zone.now.ago(86400)).where(user_id: nil)
  end

  def self.custom(current_user)
    categories = Category.from_today
    categories.each do |category|
        default_pair = Pair.defaults.where(category: category)

        current_user.possible_article_matches(category)
    end
  end
end
