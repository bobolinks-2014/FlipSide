namespace :pairs do
  desc "Rake task to get new pairs from DB"

  #does everything
  task :fetch => :environment do
    Kimono.scrape
    Kimono.pair_default_articles
    Kimono.pair_user_articles
  end

  #makes default pairs for the day
  task :default => :environment do
    Kimono.pair_default_articles
  end

  #makes all user pairs
  task :users => :environment do
    Kimono.pair_user_articles
  end

  #scrapes google news; parses
  task :scrape => :environment do
    Kimono.scrape
  end
end
