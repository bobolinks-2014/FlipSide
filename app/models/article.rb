class Article < ActiveRecord::Base
	has_many :ratings
	has_many :tags
end
