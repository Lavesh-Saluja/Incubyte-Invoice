require "test_helper"

class Api::Employees::NoticePeriodsControllerTest < ActionDispatch::IntegrationTest
  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    sign_in_as(create(:user))
    @employee = create(:employee)
  end

  def start_notice(employee = @employee, **params)
    post "/api/employees/#{employee.id}/notice_period", params: { notice_period: params }, as: :json
  end

  def remove_notice(employee = @employee)
    delete "/api/employees/#{employee.id}/notice_period"
  end

  test "starts a notice period of the configured length from now" do
    freeze_time

    start_notice

    assert_response :ok
    @employee.reload
    assert @employee.notice_period?
    assert_equal Time.current, @employee.notice_period_started_at
    assert_equal Employee::DEFAULT_NOTICE_PERIOD_DAYS.days.from_now, @employee.notice_period_ends_at
    assert_equal "notice_period", json_response.dig("employee", "status")
  end

  test "uses the number of days HR chooses" do
    freeze_time

    start_notice(days: 7)

    assert_equal 7.days.from_now, @employee.reload.notice_period_ends_at
  end

  test "a zero-day notice makes the employee inactive at once" do
    start_notice(days: 0)

    assert_response :ok
    assert @employee.reload.inactive?
    assert_equal @employee.notice_period_started_at, @employee.notice_period_ends_at
  end

  test "rejects days that are not a whole number from 0 to 365" do
    {
      -1 => "must be greater than or equal to 0",
      366 => "must be less than or equal to 365",
      "abc" => "is not a number",
      1.5 => "must be an integer"
    }.each do |days, message|
      start_notice(days:)

      assert_response :unprocessable_content
      assert_equal [ message ], json_response.dig("details", "days"), "for days=#{days.inspect}"
    end
    assert @employee.reload.active?
  end

  test "only an active employee can be put on notice" do
    on_notice = create(:employee, :on_notice)

    start_notice(on_notice)

    assert_response :unprocessable_content
    assert_equal [ "must be active to start a notice period" ], json_response.dig("details", "status")
  end

  test "the notice period ends with the employee inactive" do
    start_notice(days: 30)

    travel 30.days + 1.second
    sign_in_as(User.sole)
    get "/api/employees/#{@employee.id}"

    assert_equal "inactive", json_response.dig("employee", "status")
    assert @employee.reload.inactive?
  end

  test "removing the notice period reactivates an employee on notice and clears the dates" do
    on_notice = create(:employee, :on_notice)

    remove_notice(on_notice)

    assert_response :ok
    on_notice.reload
    assert on_notice.active?
    assert_nil on_notice.notice_period_started_at
    assert_nil on_notice.notice_period_ends_at
  end

  test "removing the notice period reactivates an inactive employee" do
    start_notice(days: 0)

    remove_notice

    assert_response :ok
    assert @employee.reload.active?
  end

  test "a reactivated employee can be edited again" do
    start_notice(days: 0)
    remove_notice

    patch "/api/employees/#{@employee.id}", params: { employee: { job_title: "Manager" } }, as: :json

    assert_response :ok
    assert_equal "Manager", @employee.reload.job_title
  end

  test "an active employee has no notice period to remove" do
    remove_notice

    assert_response :unprocessable_content
    assert_equal [ "must be on notice or inactive to remove the notice period" ],
      json_response.dig("details", "status")
  end

  test "responds 404 for an unknown employee" do
    post "/api/employees/#{SecureRandom.uuid}/notice_period", as: :json

    assert_response :not_found
  end

  test "requires sign-in" do
    delete "/api/session"

    start_notice
    assert_response :unauthorized
    remove_notice
    assert_response :unauthorized
  end
end
