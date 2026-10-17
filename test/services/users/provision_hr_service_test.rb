require "test_helper"

class Users::ProvisionHrServiceTest < ActiveSupport::TestCase
  def provision(name: "HR Manager", email: "hr@acme.test", password: "initial-password-1")
    Users::ProvisionHrService.new(name:, email:, password:).process!
  end

  test "creates an HR user when none has the email" do
    assert_equal :created, provision

    user = User.find_by!(email: "hr@acme.test")
    assert_equal "HR Manager", user.name
    assert user.hr?
    assert user.authenticate("initial-password-1")
  end

  test "is idempotent and never overwrites an existing password" do
    provision

    assert_no_difference("User.count") do
      assert_equal :exists, provision(name: "Someone Else", email: "HR@ACME.TEST", password: "another-password-2")
    end
    user = User.find_by!(email: "hr@acme.test")
    assert_equal "HR Manager", user.name
    assert user.authenticate("initial-password-1")
  end

  test "does not need a password when the account already exists" do
    provision

    assert_equal :exists, provision(name: nil, password: nil)
  end

  test "raises without creating anything when the details are invalid" do
    assert_no_difference("User.count") do
      assert_raises(ActiveRecord::RecordInvalid) { provision(password: "too-short") }
      assert_raises(ActiveRecord::RecordInvalid) { provision(name: nil) }
    end
  end
end
