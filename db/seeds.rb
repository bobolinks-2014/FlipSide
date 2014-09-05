# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

category1 = Category.create({
	name: "Russia"
	})

boo_russia = Article.create({
	title: "Russia Sucks!",
	source: "Vox Media",
	url: "http://www.vox.com/2014/9/5/6110037/estonia-russia-officer-kidnapped",
	slug: "In the winter of 2012, something surprising happened to Vladimir Putin: He discovered, as he wrote in a government newspaper, that Russia isn't just an ordinary country but a unique 'state civilization,'' bound together by the ethnic Russians who form its 'cultural nucleus.' This was something new. In his previous 12 years in office, first as Russia's president and then as prime minister, Mr. Putin had generally stayed away from grand pronouncements on culture and ideology.",
	category: category1
	})

yay_russia = Article.create({
	title: "Russia is Great!",
	source: "Wall Street Journal",
	url: "http://online.wsj.com/articles/why-putin-says-russia-is-exceptional-1401473667",
	slug: "On Friday morning, less than 48 hours after President Obama delivered a speech in Estonia warning that Russian aggression against Estonia could trigger war with the US and NATO, Russian security forces have seized an officer with Estonia's state security bureau at gunpoint and taken him into Russia.",
	category: category1
	})

pair1 = Pair.create({
	category: category1,
	article1: boo_russia,
	article2: yay_russia,
	difference_score: 0.95
	})

