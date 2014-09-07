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
      render :json => {success: true, user: {email: user.email, name: user.name}}
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

  def edit
  end

  def update
    if @user.update_attributes(user_params)
      flash[:success] = "Profile updated"
      sign_in @user
      redirect_to @user
    else
      render 'edit'
    end
  end

  def destroy
    User.find(params[:id]).destroy
    flash[:success] = "User destroyed."
    redirect_to users_url
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
