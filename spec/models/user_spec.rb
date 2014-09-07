require 'spec_helper'
require 'pry'

describe User do


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


end
