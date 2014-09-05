require 'rest_client'


# returnVal = RestClient.get 'https://www.kimonolabs.com/api/8awe8hva?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'# json_str = returnVal.to_json


def add_categories(collection)
	category = ""
	collection["results"]["collection1"].each do |article|
		unless article["category"] == ""
			category = article["category"]
			p article["category"]
		else
			article["category"] = category
		end
	end
endg
returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'
json_obj = JSON.parse(returnVal)
add_categories(json_obj)