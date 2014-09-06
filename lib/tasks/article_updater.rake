namespace :article_updater do
  desc "TODO"
  task :get_articles => :environment do

  end

  task :delete_old_articles => :environment do
    articles = Article.all
    time_now = Time.now
    articles.each do |article|
      if (time_now - article.created_at)/3600 > 3
        article.destroy
      end
    end
  end

end
