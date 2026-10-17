# CSRF protection for the cookie-authenticated JSON API (ActionController::API has no token CSRF).
# Layered on the SameSite=Lax cookie, which browsers already withhold from cross-site writes:
# - state-changing requests from another site are refused (Sec-Fetch-Site, sent by browsers);
# - request bodies must be JSON, which HTML forms cannot send (and cross-origin fetch cannot
#   send without a CORS preflight, which is not allowed).
# GET requests must stay free of side effects, because Lax still sends the cookie on top-level GETs.
module RequestForgeryProtection
  extend ActiveSupport::Concern

  SAFE_METHODS = %w[GET HEAD OPTIONS].freeze
  # "none" is a user-initiated request (e.g. typed URL); non-browser clients send no header.
  ALLOWED_FETCH_SITES = [ nil, "same-origin", "none" ].freeze

  included do
    before_action :verify_request_origin
  end

  private
    def verify_request_origin
      return if SAFE_METHODS.include?(request.method)

      if ALLOWED_FETCH_SITES.exclude?(request.headers["Sec-Fetch-Site"])
        render_error(I18n.t("errors.cross_site_request"), :forbidden)
      elsif request.content_length.to_i.positive? && request.media_type != Mime[:json].to_s
        render_error(I18n.t("errors.unsupported_media_type"), :unsupported_media_type)
      end
    end
end
