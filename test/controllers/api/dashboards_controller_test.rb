require "test_helper"

class Api::DashboardsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "returns counts, departments and upcoming departures" do
    sign_in_as(create(:user))
    create(:employee, department: "Finance")
    leaving = create(:employee, :on_notice, department: "Finance", notice_period_ends_at: 3.days.from_now)

    get "/api/dashboard"

    assert_response :ok
    dashboard = json_response["dashboard"]
    assert_equal({ "current_headcount" => 2, "active" => 1, "notice_period" => 1, "inactive" => 0, "leaving_soon" => 1 },
      dashboard["counts"])
    assert_equal 10, dashboard["leaving_soon_days"]
    assert_equal [ { "department" => "Finance", "active" => 1, "notice_period" => 1, "total" => 2 } ],
      dashboard["departments"]
    assert_equal [ leaving.id ], dashboard["upcoming_departures"].pluck("id")
    assert_equal %w[id employee_code first_name last_name department notice_period_ends_at],
      dashboard["upcoming_departures"].first.keys
  end

  test "requires sign-in" do
    get "/api/dashboard"

    assert_response :unauthorized
  end
end
