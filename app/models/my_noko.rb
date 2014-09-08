require 'nokogiri'
require 'open-uri'
require 'pp'

class MyNoko
  #untested

  def self.parse(url)
    doc = Nokogiri::HTML(open(url))
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
        title = art.css('.titletext').text()
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
    google_news_base_url = "httMps://news.google.com"
    doc = Nokogiri::HTML(open(url))
    url_array = []
    doc.css(".topic-list .persistentblue").each do |topic|
      url_array << google_news_base_url + topic["href"]
    end
    url_array
  end

end

doc = Nokogiri::HTML(open("https://news.google.com/news/section?pz=1&cf=all&ned=us&hl=en&q=Ukraine&topicsid=FRONTPAGE&ict=tnv0&topicnv=__AB21PFzgFYiVzdeR9RgYfVUQIcN3eLnuy0SFp6v4XPqFsz2R_VVVPTPpS7769omAMRTuPCvzJHGZs8Vo_QMvPwIM2l7HrErhSkFrVGE_85p2vIw6XonHyE3ia-6wbhMJSoyNWqPtZXWvcBW4IoIEZle-m2KYkxuGe-5qvDHKYKxSBXsKiUW2yQxCB8IccprleyCCNJX3gkyMk4QXxbxSGYIkfZkxpgEPeO2SL9F5IJW8-j0_EdG5iQ3UCAGVi9lBcs5-9bV2GlmR6AvjL_Od10HiJF5AfVc7sPaQ-Er29DKGyVWzN1znybnpOdidY6YY_mk1oE5qe4XX9K4T8vo0Fqk1Jp33FbxjQz468Q5IKuiX2ywuGnUo-NGf_QLj8NWiihBiaQytWrWl-giyLcagQKLHEpTgvOqHhx5Pmqn7Ipsa2Mx8wtn-Tkybk3mKujWZUc7IfZgJxqIF-oKL7EW7UetZMqd2dn-ADnyth2j09UzzeyBuKcgFpdCbZA4cFcF-90nQ-ZY8hizTcZmadXeWtaDVI4pvU6cH4bt4GcearTjyAxdTWB-y05CBuj9reBJb7e_yqyE7USwMcC8fUPUNry5FzyBjg4sGxzg1zFor9_saO2aTFLCVgAAGXxRsFys-ocPm2rsvtKpkkygocJUOFYw765Cb4bXgkHZdpw3eaJVEItWrM6oKxUmK1PTfEToWLHc7hlnt_FKRCrojMUoXOtF_Df6A9phyAw=="))
# p articles = doc.css('.esc-lead-article-title .titletext')[0].text()


