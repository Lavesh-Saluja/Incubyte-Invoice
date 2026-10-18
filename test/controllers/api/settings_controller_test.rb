require "test_helper"

class Api::SettingsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "returns the default and maximum notice period" do
    sign_in_as(create(:user))

    get "/api/settings"

    assert_response :ok
    assert_equal({ "notice_period_days" => Employee::DEFAULT_NOTICE_PERIOD_DAYS, "notice_period_max_days" => 365 },
      json_response["settings"])
  end

  test "requires sign-in" do
    get "/api/settings"

    assert_response :unauthorized
  end
end
