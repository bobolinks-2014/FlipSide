require 'spec_helper'
# require 'pry'
# require_relative '../../app/models/article'

describe 'Article' do
  before do
    @category = Category.create!(name: "The bad stuff meow")
    @article = Article.create!(title: "YOLO",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)

    @keywords1=[{"text" => "this_is_text1","sentiment" => {"type" => "neutral"}},
                {"text" => "this_is_text2","sentiment" => {"type" => "fuck_face","score"=> 0.1}},
                {"text" => "this_is_text3","sentiment" => {"type" => "yolo","score"=> -0.1}}]

    @tag1 = Tag.create!(name:"this_is_text2")
    @tag5 = Tag.create!(name:"this_is_text5")
    @tag6 = Tag.create!(name:"this_is_text6")

    @tags = [@tag1, @tag5, @tag6]

    @article2 = Article.create!(title: "FUUUUUUCK",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)

    @article_tag2 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag1.id,sentiment_score:0.8, relevance: 0.5)
    @article_tag3 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag5.id,sentiment_score:-0.3, relevance: 1.0)
    @article_tag4 = ArticleTag.create!(article_id: @article2.id, tag_id: @tag6.id,sentiment_score:-0.111, relevance: 0.3)

  end
  describe '#make_tags' do
    it 'should add three article_tags' do
      size_before = ArticleTag.all.size
      @article.make_tags(@keywords1,3)
      size_after = ArticleTag.all.size

      expect(size_after).to eq(size_before+3)
    end

    it 'should add tags if they dont already exist' do
      size_before = Tag.all.size
      @article.make_tags(@keywords1,3)
      size_after = Tag.all.size

      expect(size_after).to eq(size_before+2)
    end

    it 'should add sentiment scores to the ArticleTag' do
      @article.make_tags(@keywords1,3)

      expect(ArticleTag.last.sentiment_score).to be_kind_of(BigDecimal)
    end

  end

  describe '#relevant_sentiment_scores' do
    it 'should return an array of three numbers' do

      p @article2.relevant_sentiment_scores(@tags)
      expect( @article2.relevant_sentiment_scores(@tags)[0]).to be_kind_of(BigDecimal)

    end

  end

end
