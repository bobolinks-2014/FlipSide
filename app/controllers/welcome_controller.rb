require 'pry'
class WelcomeController < ApplicationController
  include SessionsHelper
# when the page refreshes, the user id in session goes away
# but the no one is logged out.
  def index
    @current_user = current_user if signed_in?
  end

  # all the pairs
  def pairs
    # get pairs for a particular user
    if signed_in?
      p "*"*800
      p "custom pairings"
      categories = Category.from_today
      @pairs = []

      categories.each do |category|
        @pairs << current_user.custom_match(category)
      end


      @pairs# = Pair.where(user: current_user).where("created_at >= ?", Time.zone.now.ago(86400))

      # find stuff created in the last 24 hours (86400 seconds)
    else
      p "$"*800
      p "default pairings"
      @pairs = Pair.defaults
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
    if signed_in?
      rating = params[:rating].gsub(/(\s.+)/, "") == "agree" ? true : false
      current_user.vote(@article, rating)
    end
    if request.xhr?
      render :json => {status: "ok"}
    end
  end
end
