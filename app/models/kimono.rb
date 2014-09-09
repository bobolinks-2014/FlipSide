require 'rest_client'
require 'pry'

# of keywords to pair articles on
NUMBER_OF_KEYWORDS = 3

class Kimono
  #untested
  def self.start
    urls_array = MyNoko.world_news_parse("https://news.google.com/news/section?pz=1&cf=all&ned=us&topic=n")

    urls_array.each do |url|
      MyNoko.parse(url)
    end

    process_categories(NUMBER_OF_KEYWORDS)

  end
  #untested

  def array_of_urls(json_obj)
    array_of_urls = []
    json_obj["results"]["collection1"].each do |item|
      array_of_urls << item["title"]["href"]
    end
    array_of_urls
  end

  def self.add_categories(collection)
    category = ""
    collection["results"]["collection1"].each do |article|
      if article["category"] == ""
       article["category"] = category
      else
        category = article["category"]
      end
    end
  end

  def self.kimono_parser(json)
    category = Category.new
    json_collection = json["results"]["collection1"]
    json_collection.each do |article_hash|
      unless article_hash["category"] == category.name
        category = Category.create(name:article_hash["category"])
      end

      title   = article_hash["title"]["text"]
      url     = article_hash["title"]["href"]
      source  = article_hash["source"]
      slug    = article_hash["slug"]

      new_article = Article.create(title: title,
                     url: url,
                     source: source,
                     slug: slug,
                     category_id: category.id)

      keywords = Alchemy.alchemize(new_article.url)
      # binding.pry
      new_article.make_tags(keywords, 10)
    end
  end

  def self.process_categories(number_of_keywords)
    Category.from_today.each do |category|
      category.make_pair
    end

  end
end
