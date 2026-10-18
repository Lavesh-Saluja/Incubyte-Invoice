require "test_helper"

class DepartmentPolicyTest < ActiveSupport::TestCase
  test "lets HR users list and create departments and nobody else" do
    assert DepartmentPolicy.new(build(:user), Department).index?
    assert DepartmentPolicy.new(build(:user), Department).create?
    assert_not DepartmentPolicy.new(nil, Department).index?
    assert_not DepartmentPolicy.new(nil, Department).create?
  end

  test "scopes HR users to every department and others to none" do
    create_list(:department, 2)

    assert_equal 2, DepartmentPolicy::Scope.new(build(:user), Department).resolve.count
    assert_empty DepartmentPolicy::Scope.new(nil, Department).resolve
  end
end
