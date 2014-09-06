require 'spec_helper'

describe Category do
  before do

    @category = Category.create!(name: "The bad stuff meow")

    @tag1 = Tag.create!(name:"this_is_text2")
    @tag2 = Tag.create!(name:"this_is_text1")
    @tag3 = Tag.create!(name:"this_is_text6")
    @tag4 = Tag.create!(name:"this_is_text3")
    @tag5 = Tag.create!(name:"this_is_text5")
    @tag6 = Tag.create!(name:"this_is_text6")


    @article = Article.create!(title: "YOLO",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag2 = ArticleTag.create!(article_id: @article.id, tag_id: @tag2.id,sentiment_score:0.8)
    @article_tag3 = ArticleTag.create!(article_id: @article.id, tag_id: @tag3.id,sentiment_score:-0.3)
    @article_tag4 = ArticleTag.create!(article_id: @article.id, tag_id: @tag4.id,sentiment_score:-0.111)


    @article2 = Article.create!(title: "FUUUUUUCK",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag5 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag5.id,sentiment_score:0.8)
    @article_tag6 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag6.id,sentiment_score:-0.3)
    @article_tag4 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag4.id,sentiment_score:-0.111)


    @article3 = Article.create!(title: "YOLAAAAAA",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag13 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag2.id,sentiment_score:0.8)
    @article_tag12 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag1.id,sentiment_score:-0.3)
    @article_tag11 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag4.id,sentiment_score:-0.111)



  end

  describe '#find_relevant_keywords' do
    it "sets the @relevent_tags instance variabls to the n most frequently appearing tags in that category" do
      @category.find_relevant_keywords(2)
      expect(@category.relevant_tags[0]).to eq(@tag4)
    end

    it "returns instances of Tag" do
      @category.find_relevant_keywords(2)
      expect(@category.relevant_tags[1]).to be_an_instance_of(Tag)
    end

    it "should do something with ties" do
      @article_tag5 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag5.id,sentiment_score:0.8)
      @category.find_relevant_keywords(2)
      expect(@category.relevant_tags.length).to eq(2)
    end
  end

  describe '#relevant_articles' do
    it "returns all articles with relevant tags" do
      @category.find_relevant_keywords(2)

      expect(@category.relevant_articles.length).to eq(2)
    end

    it "doesn't return the article without relevant tags" do
      @category.find_relevant_keywords(2)

      expect(@category.relevant_articles.include?(@article2)).to eq(false)
    end
  end

  describe '#sum_differences' do
    it "should properly sum differences, like a 9 year old." do
      @score_array1 = [0.4,-0.27,0]
      @score_array2 = [0.2,0.7,0.9112]
      expect(@category.sum_differences(@score_array1, @score_array2)).to eq(2.0812)
    end
  end

  describe '#find_pair' do
    before do

      @article4 = Article.create!(title: "qwertyui",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag13 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag2.id,sentiment_score:1)
      @article_tag12 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag1.id,sentiment_score:-0.2)
      @article_tag11 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag4.id,sentiment_score:-1)

      @article5 = Article.create!(title: "lkjhgfds",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag13 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag2.id,sentiment_score:-1)
      @article_tag12 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag1.id,sentiment_score:-0.1)
      @article_tag11 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag4.id,sentiment_score:1)

      @category.find_relevant_keywords(2)

    end
    it "should return an array of length 3" do


      expect(@category.find_pair).to be_kind_of(Array)
      expect(@category.find_pair.length).to eq(3)
    end

    it "should return two articles and their differences" do
      expect(@category.find_pair[0]).to eq(@article4)
      expect(@category.find_pair[1]).to eq(@article5)
      expect(@category.find_pair[2].to_f).to eq(4.0)

    end
  end

  describe '#make_pair' do
    it "should make one pair object" do

      @article4 = Article.create!(title: "qwertyui",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag13 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag2.id,sentiment_score:1)
      @article_tag12 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag1.id,sentiment_score:-0.2)
      @article_tag11 = ArticleTag.create!(article_id: @article4.id, tag_id: @tag4.id,sentiment_score:-1)

      @article5 = Article.create!(title: "lkjhgfds",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag13 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag2.id,sentiment_score:-1)
      @article_tag12 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag1.id,sentiment_score:-0.1)
      @article_tag11 = ArticleTag.create!(article_id: @article5.id, tag_id: @tag4.id,sentiment_score:1)

      before_count = Pair.all.length
      @category.make_pair(2)
      after_count = Pair.all.length

      expect(before_count).to eq(after_count-1)
    end
  end
end
