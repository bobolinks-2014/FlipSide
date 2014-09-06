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
  end

end
