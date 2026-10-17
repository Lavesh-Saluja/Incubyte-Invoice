# Per-request state, reset automatically between requests.
class Current < ActiveSupport::CurrentAttributes
  attribute :user
end
