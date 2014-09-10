class PairGenerator

  def initialize(user, category)
    @user = user
    @category = category
  end

  def custom_match
    closest_matching_article = possible_article_matches(category)[-1].keys[0]

    if closest_matching_article.nil?
      Pair.defaults.find_by(category: category)
    else
      new_pair = category.find_pair(closest_matching_article)
      Pair.find_or_create_by(article1: new_pair[0],
                             article2: new_pair[1],
                             category: category,
                             difference_score: new_pair[2],
                             user: user)
    end
  end

  def possible_article_matches
    possible_matches = []
    articles = @category.articles

    articles.each do |article|
      overlapping_tags = @user.overlapping_tags(article)

      if @user.vote_count(overlapping_tags) >=20
        quotient = find_quotient(article)
        possible_matches << {article => quotient}
      end
    end

    return [{nil => nil}] if possible_matches.empty?
    possible_matches.sort_by { |hash| hash.values[0] }
  end

end
