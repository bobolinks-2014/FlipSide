namespace :article_updater do
  desc "Clear out old articles"
  task :delete_old_articles => :environment do
    articles = Article.all
    time_now = Time.now
    articles.each do |article|
      if (time_now - article.created_at)/3600 > 3
        article.destroy
      end
    end
    Category.all.each do |category|
      if (time_now - category.created_at)/3600 > 3
        category.destroy
      end
    end
    ArticleTag.all.each do |articleTag|
      if (time_now - articleTag.created_at)/3600 > 3
        articleTag.destroy
      end
    end
    Tag.all.each do |tag|
      if (time_now - tag.created_at)/3600 > 3
        tag.destroy
      end
    end
    Pair.all.each do |pair|
      if (time_now - pair.created_at)/3600 > 3
        pair.destroy
      end
    end
  end

end
