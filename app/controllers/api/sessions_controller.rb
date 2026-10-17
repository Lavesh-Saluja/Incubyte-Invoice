module Api
  # Sign in, read the signed-in user, sign out. The session is the user's own, so there is no
  # record for Pundit to authorize here.
  class SessionsController < ApplicationController
    # One store per process: the free plan runs a single instance. Production's default cache
    # store is not shared either, and tests use a null cache, so keep the counter explicit.
    RATE_LIMIT_STORE = ActiveSupport::Cache::MemoryStore.new

    allow_unauthenticated_access only: :create
    skip_after_action :verify_authorized, :verify_policy_scoped

    rate_limit to: 5, within: 1.minute, only: :create, store: RATE_LIMIT_STORE,
      with: -> { render_error(I18n.t("errors.too_many_sign_in_attempts"), :too_many_requests) }

    def show
      @user = current_user
    end

    def create
      credentials = params.require(:session).permit(:email, :password)
      @user = Sessions::AuthenticateService.new(email: credentials[:email], password: credentials[:password]).process!
      return render_error(I18n.t("errors.invalid_credentials"), :unauthorized) unless @user

      sign_in(@user)
      render :show
    end

    def destroy
      sign_out
      head :no_content
    end
  end
end
