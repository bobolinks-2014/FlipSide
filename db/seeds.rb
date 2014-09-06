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
category2 = Category.create({
	name: "US"
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


boo_america = Article.create({
	title: "America Sucks!",
	source: "Vox Media",
	url: "http://www.vox.com/2014/9/5/6110037/estonia-russia-officer-kidnapped",
	slug: "In the winter of 2012, something surprising happened to AMERICA: He discovered, as he wrote in a government newspaper, that Russia isn't just an ordinary country but a unique 'state civilizaAMURICAethnic Russians who form its 'cultural nucleus.' This was something new. In his previous 12 years in office, first as Russia's president and then as prime minister, Mr. Putin had generally stayed away from grand pronouncements on culture and ideology.",
	category: category2
	})

yay_america = Article.create({
	title: "'Murica",
	source: "Wall Street Journal",
	url: "http://online.wsj.com/articles/why-putin-saysrussia-is-exceptional-1401473667",
	slug: "On FridayKABOOMa warning that Russian aggression against Estoni-a could trFIREWORKSO, Russian security forces have seized an officer with Estonia's state security bureau at gunpoint and taken him into Russia.",
	category: category2
	})

pair1 = Pair.create({
	category: category1,
	article1: boo_russia,
	article2: yay_russia,
	difference_score: 0.95
	})
pair2 = Pair.create({
	category: category2,
	article1: boo_america,
	article2: yay_america,
	difference_score: 0.83
	})
p "*Tags"* 100
russia = Tag.create(name: "Russia")
putin = Tag.create(name: "Putin")
america = Tag.create(name: "America")
obama = Tag.create(name: "Obama")
p "*"* 100
ArticleTag.create(article: boo_russia, tag: russia, sentiment_score: -0.9)
ArticleTag.create(article: yay_russia, tag: putin, sentiment_score: 0.5)
ArticleTag.create(article: boo_america, tag: america, sentiment_score: -0.5)
ArticleTag.create(article: yay_america, tag: obama, sentiment_score: 0.3)

