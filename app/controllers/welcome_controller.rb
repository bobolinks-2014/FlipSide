class WelcomeController < ApplicationController
  def welcome
  end

  # all the pairs
  def pairs
    # get pairs from today
    if params[:category] == "all"
      # find stuff created in the last 24 hours (86400 seconds)
      @pairs = Pair.all.where("created_at >= ?", Time.zone.now.ago(86400))
  	else
      category = Category.find_by(name: params[:category]).id
      @pairs = Pair.where(category: category).where("created_at >= ?", Time.zone.now.ago(86400))
    end

    if request.xhr?
      render :json => @pairs.to_json(:include => [:article1, :article2])
    end
  end

  def rate

    @article = Article.find(params[:article_id])
    rating = params[:rating] == "agree" ? true : false
    current_user.vote(@article, rating)
    if request.xhr?
      render :json => {status: "ok"}
    end
  end


end
