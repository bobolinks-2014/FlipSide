namespace :db do
  desc "Clear out old articles"
  task :dump => :environment do
    articles = Article.all
    time_now = Time.now
    print "remove articles ..."
    articles.each do |article|
      if (time_now - article.created_at)/3600 > 3
        article.destroy
      end
    end
    print "remove categories ..."
    Category.all.each do |category|
      if (time_now - category.created_at)/3600 > 3
        category.destroy
      end
    end
    print "remove articletags ..."
    ArticleTag.all.each do |articleTag|
      if (time_now - articleTag.created_at)/3600 > 3
        articleTag.destroy
      end
    end
    print "remove tags ..."
    Tag.all.each do |tag|
      if (time_now - tag.created_at)/3600 > 3
        tag.destroy
      end
    end
    print "remove pairs ..."
    Pair.all.each do |pair|
      if (time_now - pair.created_at)/3600 > 3
        pair.destroy
      end
    end
  end

end
