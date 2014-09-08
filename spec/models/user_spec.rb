require 'spec_helper'
require 'pry'

describe User do
  before do
    @category = Category.create!(name: "The bad stuff meow")
    @user = User.create!(name: "me", email: "yolo2@yolo.com", password:"123456", password_confirmation: "123456")

    @tag1 = Tag.create!(name:"this_is_text1")
    @tag2 = Tag.create!(name:"this_is_text2")
    @tag3 = Tag.create!(name:"this_is_text3")
    @tag4 = Tag.create!(name:"this_is_text4")
    @tag5 = Tag.create!(name:"this_is_text5")
    @tag6 = Tag.create!(name:"this_is_text6")


    @usertag1 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag2 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag3 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag4 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag5 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag6 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag7 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag8 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag10 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag21 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag31 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag41 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag51 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag61 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag71 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag81 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag12 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag22 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag32 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag42 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag52 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag62 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag72 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag82 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag102 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag212 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag312 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag412 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    @usertag512 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
    @usertag612 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
    @usertag712 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    @usertag812 = UserTag.create!(user_id: @user.id, tag_id: @tag4.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)


    @article = Article.create!(title: "qwertyugvu",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag2 = ArticleTag.create!(article_id: @article.id, tag_id: @tag2.id,sentiment_score:0.8, relevance: 1.0)
    @article_tag3 = ArticleTag.create!(article_id: @article.id, tag_id: @tag3.id,sentiment_score:-0.3, relevance: 1.0)
    @article_tag4 = ArticleTag.create!(article_id: @article.id, tag_id: @tag4.id,sentiment_score:-0.111, relevance: 1.0)


    @article2 = Article.create!(title: "qwertyui",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag5 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag5.id,sentiment_score:0.8, relevance: 1.0)
    @article_tag6 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag6.id,sentiment_score:-0.3, relevance: 1.0)
    @article_tag4 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag4.id,sentiment_score:-0.111, relevance: 1.0)


    @article3 = Article.create!(title: "YOLAAAAAA",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article", category_id: @category.id)
    @article_tag13 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag2.id,sentiment_score:0.8, relevance: 1.0)
    @article_tag12 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag1.id,sentiment_score:-0.3, relevance: 1.0)
    @article_tag11 = ArticleTag.create!(article_id: @article3.id, tag_id: @tag4.id,sentiment_score:-0.111, relevance: 1.0)
  end

  describe "#weighted_tag_score" do
    before do
      @user = User.create!(name: "me", email: "yolo@yolo.com", password:"123456", password_confirmation: "123456")

      @tag1 = Tag.create!(name: "Y")
      @tag2 = Tag.create!(name: "O")
      @tag3 = Tag.create!(name: "L")

      @usertag1 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
      @usertag2 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
      @usertag3 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

    end
    it "should return the proper weighted score" do
      expect(@user.weighted_tag_score(@tag1).to_f.round(4)).to eq((0.85/1.1).round(4))
    end
  end

  describe "#vote" do
    before do
      @user = User.create!(name: "me", email: "yolo@yolo.com", password:"123456", password_confirmation: "123456")

      @article = Article.create()

      @tag1 = Tag.create!(name: "Y")
      @tag2 = Tag.create!(name: "O")
      @tag3 = Tag.create!(name: "L")

      @article_tag1 = ArticleTag.create(article: @article, tag: @tag1, sentiment_score: 0.9, relevance: 0.9)

    end

    it "creates user tag instances" do
      before_count = UserTag.all.size
      @user.vote(@article, true)
      after_count = UserTag.all.size

      expect(after_count).to eq(before_count+1)

    end
  end

  describe "#opinions" do
    before do
      @user = User.create!(name: "me", email: "yolo@yolo.com", password:"123456", password_confirmation: "123456")

      @tag1 = Tag.create!(name: "Y")
      @tag2 = Tag.create!(name: "O")
      @tag3 = Tag.create!(name: "L")

      @usertag1 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
      @usertag2 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
      @usertag3 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    end

    it "returns a hash with tags as keys" do
      expect(@user.opinions.keys[0]).to be_an_instance_of(Tag)
    end

    it "returns a hash with the correct weighted tag scores as values" do
      expect(@user.opinions.values[0].to_f.round(4)).to be((0.85/1.1).round(4))
    end
  end

  describe "#vote_count" do
    before do
      @user = User.create!(name: "me", email: "yolo@yolo.com", password:"123456", password_confirmation: "123456")

      @tag1 = Tag.create!(name: "Y")
      @tag2 = Tag.create!(name: "O")
      @tag3 = Tag.create!(name: "L")

      @usertag1 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
      @usertag2 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
      @usertag3 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)
    end

    it "counts the total number of votes for the given tags" do
      @overlapping_tags = [@tag1,@tag2]
      expect(@user.vote_count(@overlapping_tags)).to eq(2)
    end
  end

  describe "#overlapping_tags" do
    before do
      @user = User.create!(name: "me", email: "yolo@yolo.com", password:"123456", password_confirmation: "123456")

      @tag1 = Tag.create!(name: "Y")
      @tag2 = Tag.create!(name: "O")
      @tag3 = Tag.create!(name: "L")
      @tag4 = Tag.create!(name: "O")

      @usertag1 = UserTag.create!(user_id: @user.id, tag_id: @tag1.id, relevance: 0.5, sentiment_score: 0.9, agreement: true)
      @usertag2 = UserTag.create!(user_id: @user.id, tag_id: @tag2.id, relevance: 0.5, sentiment_score: 0.7, agreement: true)
      @usertag3 = UserTag.create!(user_id: @user.id, tag_id: @tag3.id, relevance: 0.1, sentiment_score: -0.5, agreement: false)

      @article = Article.create!(title: "qwertyugvu",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article")
      @article_tag2 = ArticleTag.create!(article_id: @article.id, tag_id: @tag2.id,sentiment_score:0.8, relevance: 1.0)
      @article_tag3 = ArticleTag.create!(article_id: @article.id, tag_id: @tag3.id,sentiment_score:-0.3, relevance: 1.0)
      @article_tag4 = ArticleTag.create!(article_id: @article.id, tag_id: @tag4.id,sentiment_score:-0.111, relevance: 1.0)
    end

    it "returns the tags which an article and user share" do
      expect(@user.overlapping_tags(@article)[0]).to be_an_instance_of(Tag)
      expect(@user.overlapping_tags(@article).size).to be(2)
    end
  end

  describe "#possible_article_matches" do

    it "should return an array of order hashes with articles and floats" do
      expect(@user.possible_article_matches(@category)[0].values[0]).to be_an_instance_of(BigDecimal)
      expect(@user.possible_article_matches(@category)[0].keys[0]).to be_an_instance_of(Article)
      expect(@user.possible_article_matches(@category)[1].keys[0]).to be_an_instance_of(Article)
    end

    it "orders the array" do
      expect(@user.possible_article_matches(@category)[0].values[0]<=@user.possible_article_matches(@category)[1].values[0]).to eq(true)
    end

    it "returns [{nil => nil}] if it can't find a match" do 
      @category99 = Category.create!
      expect(@user.possible_article_matches(@category99)).to eq([{nil => nil}])
    end

  end

  describe "#find_quotient" do
    it "finds the difference between a user's opinions and an article, given their overlapping tags." do
      expect(@user.find_quotient(@article).to_f).to eq(1.511)
    end
  end

  describe "#custom_match" do 
    before do
    end

    it "returns a custom match within the category if available" do
      @pair = Pair.create!(category: @category, article1_id: @article.id, article2_id: @article2.id, difference_score: 0.88)
      expect(@user.custom_match(@category).article1).to eq(@article3)
      expect(@user.custom_match(@category).article2).to eq(@article)
    end

    it "returns the category's default match if custom match is unavailable" do 
      @category2 = Category.create!
      @article777 = Article.create!(title: "qwertyui",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag1111 = ArticleTag.create!(article_id: @article777.id, tag_id: @tag5.id,sentiment_score:0.8, relevance: 1.0)
      @article_tag2222 = ArticleTag.create!(article_id: @article777.id, tag_id: @tag6.id,sentiment_score:-0.3, relevance: 1.0)
      @article_tag3333 = ArticleTag.create!(article_id: @article777.id, tag_id: @tag6.id,sentiment_score:-0.111, relevance: 1.0)


      @article666 = Article.create!(title: "YOLAAAAAA",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few phrases of an article", category_id: @category.id)
      @article_tag4444 = ArticleTag.create!(article_id: @article666.id, tag_id: @tag5.id,sentiment_score:0.8, relevance: 1.0)
      @article_tag5555 = ArticleTag.create!(article_id: @article666.id, tag_id: @tag6.id,sentiment_score:-0.3, relevance: 1.0)
      @article_tag6666 = ArticleTag.create!(article_id: @article666.id, tag_id: @tag6.id,sentiment_score:-0.111, relevance: 1.0)

      @pair = Pair.create!(category: @category2, article1_id: @article666.id, article2_id: @article777.id, difference_score: 0.88)

      expect(@user.custom_match(@category2)).to eq(@pair)
    end

  end
end
