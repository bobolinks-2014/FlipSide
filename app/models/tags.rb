class Tags < ActiveRecord::Base
	has_many :articles
  validates uniqueness: true

  # def self.get_tags :=> json object

end
