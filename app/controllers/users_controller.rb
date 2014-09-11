require 'pry'

class UsersController < ApplicationController
  include SessionsHelper
  include UsersController
  before_filter :signed_in_user,
                only: [:index, :edit, :update, :destroy]
  # before_filter :correct_user,   only: [:edit, :update]

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

      get_user_data

      get_positive_article_count
      get_negative_article_count
      article_counts = positive_counts.zip(negative_counts)

      dataset = tag_ids.zip(tag_titles).zip(article_counts)

      final_sentiment_array = build_dataset

      render :json => {success: true, user: {
        id: user.id,
        email: user.email,
        name: user.name,
        dataset: final_sentiment_array
        }
      }
    end
  end

  def new
    @user = User.new
  end

  def create

    @user = User.new(strong_params)
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
