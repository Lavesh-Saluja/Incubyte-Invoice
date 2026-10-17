require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
# require "active_job/railtie"
require "active_record/railtie"
# require "active_storage/engine"
require "action_controller/railtie"
# require "action_mailer/railtie"
# require "action_mailbox/engine"
# require "action_text/engine"
require "action_view/railtie"
# require "action_cable/engine"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Starter
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    # Sign-in state lives in Rails' encrypted cookie session (no sessions table). API-only apps drop
    # the cookie and session middleware, so add them back. The frontend reaches the API on its own
    # origin (Vite proxy locally, a Render rewrite in production), so the cookie is first-party:
    # HttpOnly, Secure in production, SameSite=Lax. No expiry is set, so it ends with the browser
    # session; Authentication also enforces a 12-hour maximum on the server.
    config.session_store :cookie_store,
      key: "_acme_session",
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options

    # New tables get UUID primary keys (PostgreSQL 13+ provides gen_random_uuid()).
    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end
  end
end
