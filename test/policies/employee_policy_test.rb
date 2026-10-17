require "test_helper"

class EmployeePolicyTest < ActiveSupport::TestCase
  test "lets HR users view, create and update employees" do
    policy = EmployeePolicy.new(build(:user), build(:employee))

    assert policy.index?
    assert policy.show?
    assert policy.create?
    assert policy.update?
  end

  test "denies everything without a user" do
    policy = EmployeePolicy.new(nil, build(:employee))

    assert_not policy.index?
    assert_not policy.show?
    assert_not policy.create?
    assert_not policy.update?
    assert_not policy.destroy?
  end

  test "scopes HR users to all employees and others to none" do
    create_list(:employee, 2)

    assert_equal 2, EmployeePolicy::Scope.new(build(:user), Employee).resolve.count
    assert_empty EmployeePolicy::Scope.new(nil, Employee).resolve
  end
end
