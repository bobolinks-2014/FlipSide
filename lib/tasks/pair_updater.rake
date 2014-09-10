namespace :pairs do
  desc "Rake task to get new pairs from DB"

  #does everything
  task :fetch => :environment do
    print "Running scrape..."
    Kimono.scrape
    puts "done"

    print "Running pair default articles..."
    Kimono.pair_default_articles
    puts "done"

    print "Running pair user articles..."
    Kimono.pair_user_articles
    puts "done"
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
