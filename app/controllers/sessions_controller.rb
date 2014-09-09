class SessionsController < ApplicationController
  include SessionsHelper
  def new
    p "new session"
  end

  def create
    user = User.find_by_email(params[:email].downcase)
    p "created/found #{user.name}"
    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
          # redirect_to root_url

      render :json => {success: true, user_id: user.id}
    else
      if request.xhr?
        render :json => {fail: true, error: "Invalid user name or password."}
      end
    end

  end

  def destroy
    sign_out
    session.clear
    p "#{signed_in?}"
    redirect_to root_url
  end

end
