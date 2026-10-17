module Authentication
  extend ActiveSupport::Concern

  SESSION_LIFETIME = 12.hours

  included do
    before_action :authenticate_user!
  end

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :authenticate_user!, **options
    end
  end

  private
    def current_user
      Current.user
    end

    def authenticate_user!
      Current.user = user_from_session
      render_error(I18n.t("errors.unauthenticated"), :unauthorized) unless Current.user
    end

    def user_from_session
      return if session[:user_id].blank?

      if session_expired?
        reset_session
        return
      end

      user = User.find_by(id: session[:user_id])
      reset_session unless user
      user
    end

    def session_expired?
      signed_in_at = session[:signed_in_at].to_i
      signed_in_at.zero? || Time.zone.at(signed_in_at) < SESSION_LIFETIME.ago
    end

    def sign_in(user)
      reset_session
      session[:user_id] = user.id
      session[:signed_in_at] = Time.current.to_i
      Current.user = user
    end

    def sign_out
      reset_session
      Current.user = nil
    end
end
