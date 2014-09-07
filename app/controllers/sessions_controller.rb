class SessionsController < ApplicationController
  include SessionsHelper
  def new
  end

  def create
    user = User.find_by_email(params[:email].downcase)

    if user && user.authenticate(params[:password])
      session[:user_id] = user.id
      puts "loggggggggged in"
      redirect_to root_url
    else
      puts "eeeeeerrroooor"
      if request.xhr?
        render :json => {fail: true, error: user.errors.full_messages}
      else
        flash.now[:error] = 'Invalid email/password combination'
        render 'new'
      end
    end
  end

  def destroy
    sign_out
    redirect_to root_url
  end

end
