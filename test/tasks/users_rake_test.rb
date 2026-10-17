require "test_helper"
require "rake"

class UsersRakeTest < ActiveSupport::TestCase
  HR_ENV = { "HR_NAME" => "HR Manager", "HR_EMAIL" => "hr@acme.test", "HR_PASSWORD" => "initial-password-1" }.freeze

  setup do
    Rails.application.load_tasks if Rake::Task.tasks.empty?
  end

  def run_task(env)
    original = HR_ENV.keys.index_with { |key| ENV[key] }
    HR_ENV.each_key { |key| ENV[key] = env[key] }
    task = Rake::Task["users:provision_hr"]
    task.reenable
    capture_io { task.invoke }
  ensure
    original.each { |key, value| ENV[key] = value }
  end

  test "creates the HR account from the environment" do
    out, = run_task(HR_ENV)

    assert_match "created", out
    assert User.find_by!(email: "hr@acme.test").authenticate("initial-password-1")
  end

  test "leaves an existing account untouched" do
    run_task(HR_ENV)
    out, = run_task(HR_ENV.merge("HR_PASSWORD" => "changed-password-2"))

    assert_match "already exists", out
    assert User.find_by!(email: "hr@acme.test").authenticate("initial-password-1")
  end

  test "skips when HR_EMAIL is unset and an account exists" do
    create(:user)

    out, = run_task({})

    assert_match "skipping", out
  end

  test "fails when no account exists and the variables are missing" do
    assert_raises(SystemExit) { run_task({}) }
  end

  test "fails with the validation errors when the password is too weak" do
    assert_raises(SystemExit) { run_task(HR_ENV.merge("HR_PASSWORD" => "short")) }
    assert_not User.exists?
  end
end
