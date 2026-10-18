require "test_helper"

class DashboardPolicyTest < ActiveSupport::TestCase
  test "lets HR users see the dashboard and nobody else" do
    assert DashboardPolicy.new(build(:user), :dashboard).show?
    assert_not DashboardPolicy.new(nil, :dashboard).show?
  end
end
