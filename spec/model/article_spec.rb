
require_relative '../../app/models/article'

describe Article do
  before do
    @category = Category.create!(name: "The bad stuff meow")
    @article = Article.create!(title: "YOLO",source: "That one place", url: "www.coding4life.org/children/catholicism", slug: "This is the first few phrases of an article", category_id: @category.id)

    @keywords1=[{"text" => "this_is_text1","sentiment" => {"type" => "neutral"}},
                {"text" => "this_is_text2","sentiment" => {"type" => "fuck_face","score"=> 0.1}},
                {"text" => "this_is_text3","sentiment" => {"type" => "yolo","score"=> -0.1}}]


  end
  describe '#make_tags' do
    it 'should do somwthign' do
      size_before = ArticleTag.all.size
      @article.make_tags(@keywords1,3)
      size_after = ArticleTag.all.size

      expect(size_after).to eq(size_before+3)
    end

  end

  describe '#relevent_sentiment_scores' do

  end

end
