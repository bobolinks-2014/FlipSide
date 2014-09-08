require 'spec_helper'

describe 'Kimono' do
  before do
    @json_obj = {"name"=>"world_news_details", "count"=>200, "frequency"=>"On demand", "version"=>17, "newdata"=>false, "lastrunstatus"=>"success", "thisversionrun"=>"Sat Sep 06 2014 14:22:04 GMT+0000 (UTC)", "lastsuccess"=>"Sat Sep 06 2014 14:23:13 GMT+0000 (UTC)", "results"=>{"collection1"=>[{"title"=>{"text"=>"Ukraine Cease-Fire: Putin Holds All the Cards", "href"=>"http://www.nbcnews.com/storyline/ukraine-crisis/ukraine-cease-fire-putin-holds-all-cards-n196806"}, "slug"=>"The cease-fire in Eastern Ukraine is no done deal. The last truce lasted just 10 days and became \"unilateral\" because pro-Russian rebels never abided by it.", "source"=>"NBCNews.com", "category"=>"Ukraine"},{"title"=>{"text"=>"Ukraine Cease-Fire: Putin Holds All the Cards", "href"=>"http://www.google.com"}, "slug"=>"The cease-fire in Eastern Ukraine is no done deal. The last truce lasted just 10 days and became \"unilateral\" because pro-Russian rebels never abided by it.", "source"=>"NBnCNews.com", "category"=>"Ukraine"}, {"title"=>{"text"=>"Uhuru Kenyatta coming for Pakasa Forum", "href"=>"http://www.newvision.co.ug/news/658814-uhuru-kenyatta-coming-for-pakasa-forum.html"}, "slug"=>"Kenyan president and one of Africa's top business moguls, Uhuru Kenyatta, is expected in Uganda this Saturday to address the fourth Pakasa Forum.", "source"=>"New Vision", "category"=>"Uhuru Kenyatta"}, {"title"=>{"text"=>"President Uhuru Kenyatta at a crossroads as Central governors talk tough", "href"=>"http://www.standardmedia.co.ke/article/2000131714/uhuru-at-a-crossroads-as-central-governors-talk-tough/"}, "slug"=>"NAIROBI, KENYA: Even as President Uhuru Kenyatta basks in the glow of high job approval ratings by the global pollster, Gallup Word Survey, that placed him in third position in the 26 African nations surveyed, he must resent the agitation for a ...", "source"=>"The Standard Digital News", "category"=>""}, {"title"=>{"text"=>"Differences must not tear us apart – Uhuru", "href"=>"http://www.capitalfm.co.ke/news/2014/08/differences-must-not-tear-us-apart-uhuru/"}, "slug"=>"“For us to succeed we must pull together and we must unite. Yes, we are a democratic society entitled to our different opinions but we should not allow those differences to tear the nation apart,” President Kenyatta said. He lauded Mzee Kenyatta and ...", "source"=>"Capital FM Kenya", "category"=>""}]}}
  end

  describe '#add_categories' do
    it 'adds the proper categories to articles where they dont exist' do
      expect(@json_obj["results"]["collection1"][-1]["category"]).to eq("")
      Kimono.add_categories(@json_obj)
      expect(@json_obj["results"]["collection1"][-1]["category"]).to eq("Uhuru Kenyatta")
    end
  end

  describe '#kimono_parser' do
    it 'adds new categories when needed' do
      Kimono.add_categories(@json_obj)

      category_count_before = Category.all.length
      Kimono.kimono_parser(@json_obj)
      category_count_after = Category.all.length

      # expect(category_count_after-category_count_before).to eq(2)
      expect(category_count_after).to eq( category_count_before + 2)
    end

    it 'adds new articles when needed' do
      Kimono.add_categories(@json_obj)

      article_count_before = Article.all.length
      Kimono.kimono_parser(@json_obj)
      article_count_after = Article.all.length

      expect(article_count_after).to eq(article_count_before+5)
    end
  end

  pending "starts" do
    Kimono.start
    expect(2).to eq(3)
  end

end
