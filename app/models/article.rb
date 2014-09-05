require 'rest_client'
class Article < ActiveRecord::Base
	has_many :ratings
	has_many :tags
  belongs_to :category



end
