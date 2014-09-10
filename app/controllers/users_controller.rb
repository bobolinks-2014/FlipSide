require 'pry'

class UsersController < ApplicationController
  include SessionsHelper
  before_filter :signed_in_user,
                only: [:index, :edit, :update, :destroy]
  before_filter :correct_user,   only: [:edit, :update]

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  def profile
    if session[:user_id]
      user = User.find(session[:user_id])

      tag_titles = []
      weighted_score_averages = []
      article_counts = []
      positive_counts = []
      negative_counts = []
      tag_ids = []


      user.opinions.each do |opinion|
        tag_ids << ["id", opinion[0].id]
        tag_titles << ["name", opinion[0].name]
        adjusted_wsa = ((opinion[1].to_f.round(2))*100).to_i
        weighted_score_averages << adjusted_wsa
      end
      titles_and_scores = tag_titles.zip(weighted_score_averages)


      tag_ids.each do |id|
        article_counts << user.user_tags.where(tag_id: id).size
      end
      titles_and_article_counts = tag_titles.zip(article_counts)


      tag_ids.each do |id|
        positive_counts << ["positive", user.user_tags.where(tag_id: id, agreement: true).size]
      end
      titles_and_positive_counts = tag_titles.zip(positive_counts)


      tag_ids.each do |id|
        negative_counts << ["negative", user.user_tags.where(tag_id: id, agreement: false).size]
      end
      titles_and_negative_counts = tag_titles.zip(negative_counts)


      article_counts = positive_counts.zip(negative_counts)
      dataset = tag_ids.zip(tag_titles).zip(article_counts)

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

      final_sentiment_array = new_array.sort { |x,y| x["layers"]["positive"]+x["layers"]["negative"] <=> y["layers"]["positive"]+y["layers"]["negative"] }.reverse.first(6)

      render :json => {success: true, user: {
        email: user.email,
        name: user.name,
        dataset: final_sentiment_array
        } }
    end
  end

  def new
    @user = User.new
  end

  def create

    @user = User.new(strong_params)
    p params
    if @user.save
      session[:user_id] = @user.id
      render :json => {success: true, user: @user.email}
    else

      render :json => {fail: true, error: @user.errors.full_messages}
    end
  end

  def edit_profile
  end

  def edit
    if session[:user_id]
      @user = User.find(session[:user_id])
      render :json => {user: {name: @user.name, email: @user.email } }
    end
  end

  def update
    if @user.update_attributes(user_params)
      render :json => {user: {name: @user.name, email: @user.email } }
    else
      redirect_to '/profile'
    end
  end

  def destroy
    User.find(session[:user_id]).destroy
    redirect_to root
  end


  private

    def strong_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end

    def correct_user
      @user = User.find(params[:id])
      redirect_to(root_url) unless current_user?(@user)
    end

    def admin_user
      redirect_to(root_url) unless current_user.admin?
    end
end
