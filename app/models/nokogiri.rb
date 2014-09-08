require 'nokogiri'
require 'open-uri'


doc = Nokogiri::HTML(f)
  def extract_stuff(doc,param)
    text_array=[]
    doc.search(param).each do |element|
      text_array << element.inner_text
    end

    text_array
  end

test =  extract_stuff(doc,'table .title')
f.close

test.each do |item|
  p item
end


def self.parse(url)
    doc = Nokogiri::HTML(open(url))
    title = doc.css('.title a')[0].text
    username = doc.css('.subtext > a:nth-child(2)')[0].text
    points = doc.css('.subtext > span:first-child')[0].text.to_i
    comments = self.parse_comments(doc: doc, url: url)

    Post.new(url: url, title: title, username: username, points: points, comments:comments)
  end