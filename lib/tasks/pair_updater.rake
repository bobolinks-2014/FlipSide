require 'benchmark'
namespace :pairs do
  desc "Rake task to get new pairs from DB"
  task :fetch => :environment do
puts Benchmark.measure {
    # puts "Hello, World."
    Kimono.start

    categories = Category.from_today
    User.all.each do |user|
      categories.each do |category|
        user.custom_match(category)
      end
    end

}

  end
end
