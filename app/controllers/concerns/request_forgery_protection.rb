module RequestForgeryProtection
  extend ActiveSupport::Concern

  SAFE_METHODS = %w[GET HEAD OPTIONS].freeze
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
