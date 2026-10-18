require "test_helper"

class Api::DashboardsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "returns counts, departments and upcoming departures" do
    sign_in_as(create(:user))
    finance = create(:department, name: "Finance")
    create(:employee, department: finance)
    leaving = create(:employee, :on_notice, department: finance, notice_period_ends_at: 3.days.from_now)

    get "/api/dashboard"

    assert_response :ok
    dashboard = json_response["dashboard"]
    assert_equal({ "current_headcount" => 2, "active" => 1, "notice_period" => 1, "inactive" => 0, "leaving_soon" => 1 },
      dashboard["counts"])
    assert_equal 10, dashboard["leaving_soon_days"]
    assert_equal [ { "id" => finance.id, "name" => "Finance", "active" => 1, "notice_period" => 1, "current" => 2 } ],
      dashboard["departments"]
    assert_equal [ leaving.id ], dashboard["upcoming_departures"].pluck("id")
    assert_equal %w[id employee_code first_name last_name notice_period_ends_at department],
      dashboard["upcoming_departures"].first.keys
    assert_equal "Finance", dashboard["upcoming_departures"].first["department"]
  end

  test "requires sign-in" do
    get "/api/dashboard"

    assert_response :unauthorized
  end
end
