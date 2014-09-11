module UsersHelper
	def get_user_data
		user.opinions.each do |opinion|
      tag_ids << ["id", opinion[0].id]
      tag_titles << ["name", opinion[0].name]
      adjusted_wsa = ((opinion[1].to_f.round(2))*100).to_i
      weighted_score_averages << adjusted_wsa
    end
	end	

	def get_total_article_count
		tag_ids.each do |id|
        article_counts << user.user_tags.where(tag_id: id).size
      end
    tag_titles.zip(article_counts)
	end	

	def get_positive_article_count
		tag_ids.each do |id|
        positive_counts << ["positive", user.user_tags.where(tag_id: id, agreement: true).size]
    end
    tag_titles.zip(positive_counts)
	end	

	def get_negative_article_count
		tag_ids.each do |id|
        negative_counts << ["negative", user.user_tags.where(tag_id: id, agreement: false).size]
      end
		tag_titles.zip(negative_counts)
	end

	def build_dataset
		
		new_array = []
		dataset.each do |item|
      hash = Hash.new{}
      layer_hash = Hash.new{}
      hash[item[0][0][0]] = item[0][0][1]
      hash[item[0][1][0]] = item[0][1][1]
      layer_hash[item[1][0][0]] = item[1][0][1]
      layer_hash[item[1][1][0]] = item[1][1][1]
      hash["layers"] = layer_hash
      new_array << hash
    end

    new_array.sort { |x,y| x["layers"]["positive"]+x["layers"]["negative"] <=> y["layers"]["positive"]+y["layers"]["negative"] }.reverse.first(6)
	end
end