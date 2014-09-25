require 'rest_client'

# of keywords to pair articles on
NUMBER_OF_KEYWORDS = 3

class Kimono
  #untested
  #first task of fetch and only task of scrape
  #calls MyNoko.parse + wrld_news_parse
  def self.scrape
    urls_array = MyNoko.world_news_parse("https://news.google.com/news/section?pz=1&cf=all&ned=us&topic=w")

    urls_array.each do |url|
      MyNoko.parse(url)
    end
  end

  #called in the fetch and default rake tasks
  #calls process_categories with a hard-coded number
  def self.pair_default_articles
    process_categories(NUMBER_OF_KEYWORDS)
  end


  #called in :users rake task
  #calls custom_match on a user
  def self.pair_user_articles
    categories = Category.from_last_six_hours
    User.all.each do |user|
      categories.each do |category|
        user.custom_match(category)
      end
    end
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
      new_article.make_tags(keywords, 10)
    end
  end


  #called by Kimono.pair_default_articles(number)
  #calls Category#make_pair for each category made today.
  def self.process_categories(number_of_keywords)
    Category.from_last_six_hours.each do |category|
      category.make_pair
    end

  end
end
