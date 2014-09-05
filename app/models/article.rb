class Article < ActiveRecord::Base
	has_many :ratings
	has_many :tags


	# Given a subject, generate pairs of articles based on opposing sentiment
	# Generate 
	def findPairs
	end
end
