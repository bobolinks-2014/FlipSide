require 'rest_client'
require 'pp'
require 'pry'


# returnVal = RestClient.get 'https://www.kimonolabs.com/api/8awe8hva?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'# json_str = returnVal.to_json

def add_categories(collection)
	category = ""
	collection["results"]["collection1"].each do |article|
		if article["category"] == ""
     article["category"] = category
    else
      category = article["category"]
    end
	end
end

# world news
# returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'

#national news categories
# returnVal= RestClient.get 'https://www.kimonolabs.com/api/4rqnhjt0?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'

# seed national news
returnVal = RestClient.get 'https://www.kimonolabs.com/api/58tlfm0u?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'

json_obj = JSON.parse(returnVal)
fixed_json = add_categories(json_obj)

def kimono_parser(json)
  category = Category.new
  json.each do |article_hash|
    unless article_hash["category"] == category.name
      category = Category.create(name:article_hash["category"])
    end

    title   = article_hash["title"]["text"]
    url     = article_hash["title"]["href"]
    source  = article_hash["source"]
    slug    = article_hash["slug"]

    Article.create(title: title,
                   url: url,
                   source: source,
                   slug: slug,
                   category_id: category.id)
  end
end
