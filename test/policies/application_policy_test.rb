require "test_helper"

class ApplicationPolicyTest < ActiveSupport::TestCase
  test "denies every action by default, even to an HR user" do
    policy = ApplicationPolicy.new(build(:user), Object.new)

    %i[index? show? create? update? destroy?].each do |action|
      assert_not policy.public_send(action), "expected #{action} to be denied"
    end
  end
end
