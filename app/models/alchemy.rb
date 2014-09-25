require_relative '../../lib/assets/alchemyapi.rb'

class Alchemy
  #called from MyNoko.make_articles & therfore called in every rake Scrape
  #keywords are passed to Article#make_tags
  def self.alchemize(url)
    alchemyapi = AlchemyAPI.new()
    response = alchemyapi.combined('url', url, { 'extract'=>'keyword', 'sentiment'=>1 })
    if response['status'] == 'OK'
      # puts JSON.pretty_generate(response)
    else
      puts 'Error in combined call: ' + response['statusInfo']
    end
    response["keywords"]
  end


  #not called anywhere
  def self.test_alchemize
    test_url= 'http://online.wsj.com/articles/russia-says-ukraine-nato-ambitions-threaten-peace-efforts-1409828434'
    tags = Alchemy.alchemize(test_url)
    # c = Category.first
    # a = Article.first
    # a.make_tags(tags, 5)
  end

end
