require "test_helper"

class Api::SettingsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "returns the notice period and import limits" do
    sign_in_as(create(:user))

    get "/api/settings"

    assert_response :ok
    assert_equal({ "notice_period_days" => Employee::DEFAULT_NOTICE_PERIOD_DAYS, "notice_period_max_days" => 365,
      "import_max_rows" => 10_000, "import_max_file_mb" => 5 }, json_response["settings"])
  end

  test "requires sign-in" do
    get "/api/settings"

    assert_response :unauthorized
  end
end
