require 'rest_client'


# returnVal = RestClient.get 'https://www.kimonolabs.com/api/8awe8hva?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'# json_str = returnVal.to_json


def add_categories(collection)
	category = ""
	collection.each do |article|
		article["category"] == "" ? article["category"] = category : category = article["category"]
	end
  p collection
end

# returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'
# json_obj = JSON.parse(returnVal)
# add_categories(json_obj)

##  INITIALIZING THE ARTICLES, TAGS and ARTICLETAGS
# for each article pulled into kimono,
  # assign the category to the article (in the json obj)
  # create a new article with the attributes source, url, category, title and slug
  # feed the article through Alchemy.alchemize(article.url) => return json obj of tags
  # grab the top n keywords from Alchemy
  # for each top keyword from Alchemy
      # find or create a tag
      # make a new tagarticle
    #end
  #end
#end

#wont actually take a returnval- but needs to be hardcoded right now
def start(json_obj)
  # kimono call
  # returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'
  # json_obj = JSON.parse(returnVal)
  articles = add_categories(json_obj["results"]["collection1"])
  create_articles(articles)
end

def create_articles(articles)
  articles.each do |article|
    new_article = Article.create(title:article["title"]["text"], source:article["source"], url:article["url"] ,category: article["category"])
    keywords = Alchemy.alchemize(new_article.url)

  end
end


json_obj = {"name"=>"world_news_details", "count"=>200, "frequency"=>"On demand", "version"=>17, "newdata"=>false, "lastrunstatus"=>"success", "thisversionrun"=>"Sat Sep 06 2014 14:22:04 GMT+0000 (UTC)", "lastsuccess"=>"Sat Sep 06 2014 14:23:13 GMT+0000 (UTC)", "results"=>{"collection1"=>[{"title"=>{"text"=>"Ukraine Cease-Fire: Putin Holds All the Cards", "href"=>"http://www.nbcnews.com/storyline/ukraine-crisis/ukraine-cease-fire-putin-holds-all-cards-n196806"}, "slug"=>"The cease-fire in Eastern Ukraine is no done deal. The last truce lasted just 10 days and became \"unilateral\" because pro-Russian rebels never abided by it.", "source"=>"NBCNews.com", "category"=>"Ukraine"}, {"title"=>{"text"=>"Uhuru Kenyatta coming for Pakasa Forum", "href"=>"http://www.newvision.co.ug/news/658814-uhuru-kenyatta-coming-for-pakasa-forum.html"}, "slug"=>"Kenyan president and one of Africa's top business moguls, Uhuru Kenyatta, is expected in Uganda this Saturday to address the fourth Pakasa Forum.", "source"=>"New Vision", "category"=>"Uhuru Kenyatta"}, {"title"=>{"text"=>"President Uhuru Kenyatta at a crossroads as Central governors talk tough", "href"=>"http://www.standardmedia.co.ke/article/2000131714/uhuru-at-a-crossroads-as-central-governors-talk-tough/"}, "slug"=>"NAIROBI, KENYA: Even as President Uhuru Kenyatta basks in the glow of high job approval ratings by the global pollster, Gallup Word Survey, that placed him in third position in the 26 African nations surveyed, he must resent the agitation for a ...", "source"=>"The Standard Digital News", "category"=>""}, {"title"=>{"text"=>"Differences must not tear us apart – Uhuru", "href"=>"http://www.capitalfm.co.ke/news/2014/08/differences-must-not-tear-us-apart-uhuru/"}, "slug"=>"“For us to succeed we must pull together and we must unite. Yes, we are a democratic society entitled to our different opinions but we should not allow those differences to tear the nation apart,” President Kenyatta said. He lauded Mzee Kenyatta and ...", "source"=>"Capital FM Kenya", "category"=>""}]}}

start(json_obj)




# def tag_article(keywords, new_article)
#   keywords.each do |keyword|
#     if keyword["relevance"] > 0.95
#       tag = Tag.find_or_create_by(name: keyword)
#       tag.save
#       ArticleTag.create(article:new_article, tag:tag)
#     end
#   end
# end
