module SessionsHelper

  def signed_in?
    session[:user_id] != nil
  end

  def current_user=(user)
    @current_user = user
  end

  def current_user
    # remember_token = User.encrypt(cookies[:remember_token])
    @current_user ||= User.find_by(session[:user_id])
  end

  def current_user?(user)
    user == current_user
  end

  def signed_in_user
    unless signed_in?
      redirect_to signin_url, notice: "Please sign in."
    end
  end

  def sign_out
    session[:user_id] = nil
  end

  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    session.delete(:return_to)
  end

end
