require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "is valid with a name, email and long enough password" do
    assert build(:user).valid?
  end

  test "uses a UUID primary key" do
    assert_match(/\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/, create(:user).id)
  end

  test "requires a name of at most 100 characters" do
    assert_includes build(:user, name: " ").tap(&:validate).errors[:name], "can't be blank"
    assert_includes build(:user, name: "a" * 101).tap(&:validate).errors[:name], "is too long (maximum is 100 characters)"
  end

  test "requires a well-formed email" do
    assert_includes build(:user, email: "").tap(&:validate).errors[:email], "can't be blank"
    assert_includes build(:user, email: "not-an-email").tap(&:validate).errors[:email], "is invalid"
  end

  test "normalizes the email to trimmed lowercase" do
    assert_equal "hr.manager@acme.test", create(:user, email: "  HR.Manager@ACME.test ").email
  end

  test "finds users by email regardless of case" do
    user = create(:user, email: "hr@acme.test")

    assert_equal user, User.find_by(email: "HR@Acme.Test")
  end

  test "rejects an email already taken in a different case" do
    create(:user, email: "hr@acme.test")

    assert_includes build(:user, email: "HR@ACME.TEST").tap(&:validate).errors[:email], "has already been taken"
  end

  test "defaults the role to HR" do
    assert User.new.hr?
  end

  test "rejects roles other than HR" do
    assert_includes build(:user, role: "admin").tap(&:validate).errors[:role], "is not included in the list"
  end

  test "requires a password of at least 12 characters" do
    assert_includes build(:user, password: nil).tap(&:validate).errors[:password], "can't be blank"
    assert_includes build(:user, password: "short-pass1").tap(&:validate).errors[:password],
      "is too short (minimum is 12 characters)"
  end

  test "stores only a password digest" do
    user = create(:user, password: "correct-horse-battery")
    stored = User.connection.select_one("SELECT * FROM users WHERE id = #{User.connection.quote(user.id)}")

    assert_not_includes stored.values.map(&:to_s), "correct-horse-battery"
    assert BCrypt::Password.new(stored["password_digest"]).is_password?("correct-horse-battery")
  end

  test "authenticates only with the right password" do
    user = create(:user, password: "correct-horse-battery")

    assert_equal user, User.authenticate_by(email: user.email, password: "correct-horse-battery")
    assert_nil User.authenticate_by(email: user.email, password: "wrong-password-123")
  end

  test "the database rejects duplicate emails that bypass the model" do
    create(:user, email: "hr@acme.test")

    assert_raises(ActiveRecord::RecordNotUnique) do
      User.insert_all!([ { name: "Copy", email: "HR@acme.test", password_digest: "x" } ])
    end
  end

  test "the database rejects roles other than HR that bypass the model" do
    assert_raises(ActiveRecord::StatementInvalid) do
      User.insert_all!([ { name: "Admin", email: "admin@acme.test", password_digest: "x", role: "admin" } ])
    end
  end
end
