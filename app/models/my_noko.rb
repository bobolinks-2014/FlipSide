require 'nokogiri'
require 'open-uri'
require 'pp'

class MyNoko
  #untested

  def self.parse(url)
    uri = URI(url)
    response = Net::HTTP.get_response(uri)
    if response.code == 200
      doc = Nokogiri::HTML(response.body)
    else
      puts "Failed to download #{url}"
    end
    # title = doc.css('.title a')[0].text
    # username = doc.css('.subtext > a:nth-child(2)')[0].text
    # points = doc.css('.subtext > span:first-child')[0].text.to_i
    category = doc.css(".section-name").text()
    category = Category.create!(name: category)


    articles = doc.css('.esc-body')

    articles.each_with_index do |art,index|
      if index == 0
        title = doc.css('.esc-lead-article-title .titletext')[0].text()
      else
        title = art.css('.esc-lead-article-title .titletext')[0].text()
      end
      slug = art.css('.esc-lead-snippet-wrapper').text()

      url = art.css(".article")[0]["href"]
      source = art.css(".al-attribution-source").text()

      # p "title: "
      # p title
      # p "slug: "
      # p slug
      # p "url: "
      # p url
      # p "source: "
      # p source
      # p "*"*200
      # p category

      article = {
        :title => title,
        :url => url,
        :source => source,
        :slug => slug,
        :category => category
      }

      make_articles(article)
    end
  end


  def self.make_articles(article)
    return if article[:source] == "Wall Street Journal"
    new_article = Article.create(title: article[:title],
                   url: article[:url],
                   source: article[:source],
                   slug: article[:slug],
                   category: article[:category])

    keywords = Alchemy.alchemize(new_article.url)
    # binding.pry
    new_article.make_tags(keywords, 10)
  end


  def self.world_news_parse(url)
    google_news_base_url = "https://news.google.com"
    doc = Nokogiri::HTML(open(url))
    url_array = []
    doc.css(".topic-list .persistentblue").each do |topic|
      url_array << google_news_base_url + topic["href"]
    end
    url_array
  end

end







