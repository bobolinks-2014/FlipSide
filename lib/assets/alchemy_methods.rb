# require 'rest_client'
require './alchemyapi'
require 'pry'



require_relative './lib/assets/alchemyapi.rb'
test_url= 'http://online.wsj.com/articles/russia-says-ukraine-nato-ambitions-threaten-peace-efforts-1409828434'
def alchemize(url)
  alchemyapi = AlchemyAPI.new()
  response = alchemyapi.combined('url', url, { 'extract'=>'keyword', 'sentiment'=>1 })
  if response['status'] == 'OK'
    # puts JSON.pretty_generate(response)
  else
    puts 'Error in combined call: ' + response['statusInfo']
  end
  response["keywords"]
end
tags = alchemize(test_url)
c = Category.first
a = Article.first

c = Category.create(name:"People Who Suck")
a = Article.create(title: "BREAKING: Tanner sucks at Legos",
               source: "Wall Street Journal",
               url: 'http://online.wsj.com/articles/russia-says-ukraine-nato-ambitions-threaten-peace-efforts-1409828434',
               slug: "The guy can't even keep the fucking colors straight. What a moron!",
               category_id: c.id)

a.make_tags(tags, 5)


#we need an array of keywords,
  # new_article.make_tags()
