require 'pry'
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
          render :json => @pairs.to_json(:include=>{
      :article1=>{:include => {
        :article_tags=>{:include=> :tag}}},
      :article2=>{:include => {
        :article_tags=>{:include=> :tag}}}
      })
    end
  end

  def rate

    # TODO call method to rate the article etc etc

    if request.xhr?
      render :json => {status: "ok"}
    end
  end


end
