require 'pry'
class WelcomeController < ApplicationController
  include SessionsHelper
# when the page refreshes, the user id in session goes away
# but the no one is logged out.
  def index
    @current_user = current_user if signed_in?
  end

  def filterTags
    p "*"*100
    tag =  Tag.find(params[:tag_id])
    p tag.name
    @articles  = tag.articles
    if request.xhr?
      render :json => @articles.to_json(:include => {:article_tags=>{:include=>:tag}})
    end
  end
  # all the pairs
  def pairs
    # need to add an order_by created at date. newsfeed should be most recent first.
    starting = params[:starting].to_i
    ending = params[:ending].to_i

    # get pairs for a particular user
    if signed_in?
      p "signed in"
      @pairs = Pair.for_user(current_user)
    else
      p "not signed in"
      @pairs = Pair.defaults
    end

   @pairs = (@pairs.sort_by &:created_at).reverse

    if request.xhr?
      render :json => @pairs[starting..ending].to_json(:include=>{
        :category=>{:only => [:name]},
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
