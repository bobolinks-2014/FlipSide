class Tag < ActiveRecord::Base
  has_many :article_tags
	has_many :articles, :through => :article_tags
  has_many :user_tags
  has_many :users, through: :user_tags
end
