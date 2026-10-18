require "test_helper"

class PaySummaryPolicyTest < ActiveSupport::TestCase
  test "lets HR users see the pay summary and nobody else" do
    assert PaySummaryPolicy.new(build(:user), :pay_summary).show?
    assert_not PaySummaryPolicy.new(nil, :pay_summary).show?
  end
end
