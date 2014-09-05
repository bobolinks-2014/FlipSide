require 'rest_client'
class Article < ActiveRecord::Base
	has_many :ratings
	has_many :tags
  belongs_to :category

  # this needs to be called each time the request to kimono is made
	def add_categories(collection)
		category = ""
		collection["results"]["collection1"].each do |article|
			article["category"] == "" ? article["category"] = category : category = article["category"]
		end
	end
	# returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'
	# json_obj = JSON.parse(returnVal)
	# add_categories(json_obj)

end
