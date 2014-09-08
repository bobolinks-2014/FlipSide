class SessionsController < ApplicationController
  include SessionsHelper
  def new
  end

  def create
    user = User.find_by_email(params[:email].downcase)

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      render :json => {success: true, user_id: user.id}
    else

      if request.xhr?
        render :json => {fail: true, error: "Invalid user name or password."}
      end
    end

  end

  def destroy
    sign_out
    redirect_to root_url
  end

end
