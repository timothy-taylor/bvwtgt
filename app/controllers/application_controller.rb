class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  after_action :set_csrf_cookie

  helper_method :login!,
                :logged_in?,
                :current_user,
                :authorized_user?,
                :logout!,
                :set_user,
                :fallback_index_html

  def login!
    session[:user_id] = @user.id
  end

  def logged_in?
    !!session[:user_id]
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def authorized_user?
    @user == current_user
  end

  def logout!
    session.clear
  end

  def set_user
    @user = User.find_by(id: session[:user_id])
  end

  def fallback_index_html
    render file: 'public/index.html'
  end

  private

  def require_login
    return head :forbidden unless logged_in?
  end

  def set_csrf_cookie
    cookies['CSRF-TOKEN'] = {
      value: form_authenticity_token, secure: true, same_site: :strict
    }
  end
end
