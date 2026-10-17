# Controllers stay thin: authorize with a policy, call a service, render a Jbuilder view.
class ApplicationController < ActionController::API
  before_action :no_store

  include ApiResponders
  include ApiRescuable
  include RequestForgeryProtection
  include Authentication
  include Pundit::Authorization

  # Fails loudly (Pundit::AuthorizationNotPerformedError) if an action forgets to authorize.
  after_action :verify_authorized, except: :index
  after_action :verify_policy_scoped, only: :index
end
