class Pair < ActiveRecord::Base
  belongs_to :category
  belongs_to :article1, :class_name => "Article"
  belongs_to :article2, :class_name => "Article"
  belongs_to :user

  def self.defaults
    self.all.where("created_at >= ?", Time.zone.now.ago(86400)).where(user_id: nil)
  end

  def self.for_user(user)
    categories = Category.from_today
    pairs = []
    categories.each do |category|
      pair = Pair.find_by(user: user, category: category) || Pair.defaults.find_by(category: category)
      pairs << pair unless pair.nil?
    end
    return pairs
  end
end
