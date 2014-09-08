require 'pry'

class WelcomeController < ApplicationController
  include SessionsHelper

  def index
    if @current_user
      render :json => {user: @current_user}
    end
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
    # current_user = User.create(name: "fake", email: "hell0@jello.com", password: "123456", password_confirmation: "123456")
    @article = Article.find(params[:article_id])
    p "*"*100
    p current_user
    rating = params[:rating] == "agree" ? true : false
    current_user.vote(@article, rating)
    p "*"* 100
    p @current_user.opinions
    if request.xhr?
      render :json => {status: "ok"}
    end
  end
end
