Notes:
- Discuss single topic display (doughnut/pie chart)

Pseudocode for Implementing d3

Data I need to have exposed:
- Number of articles read per topic

	tag_titles.each do |title|
		article_counts << user.user_tags.where(tag_name: title).size
	end

	titles_and_article_counts = tag_titles.zip(article_counts)

- Number of positive articles read per topic

	tag_titles.each do |title|
		positive_counts << user.user_tags.where(tag_name: title, agreement: true).size
	end

	titles_and_positive_counts = tag_titles.zip(positive_counts)

- Number of negative articles read per topic

	tag_titles.each do |title|
		negative_counts << user.user_tags.where(tag_name: title, agreement: false).size
	end

	titles_and_negative_counts = tag_titles.zip(negative_counts)

- Topic titles

	tag_titles

- Weighted sentiment analysis by topic

	tag_titles = []
	weighted_score_averages = []

	user.opinions.each do |opinion|
		tag_titles << opinion[0]
		adjusted_wsa = ((opinion[1].to_f.round(2))*100).to_i
		weighted_score_averages << adjusted_wsa
	end

	titles_and_scores = tag_titles.zip(weighted_score_averages)

- Pass data sets through with each user
	- Stacked bar chart:
		- Topics
		- Number of articles read per topic
		- Number of positive articles
		- Number of negative articles
	- Pack layout
		- Topics
		- Number of articles read per topic
		- Weighted sentiment analysis per topic

- Add target divs with IDs on each page where we will have visualizations
	- <div id="stackedBar"> </div>
	- <div id="packedCircles"> </div>

- Create React class that takes datasets (check how we sent user data through)
- Set render function on those classes that uses d3 commands
- Call render function on user profile page