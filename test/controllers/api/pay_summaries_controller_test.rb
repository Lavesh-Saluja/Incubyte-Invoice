require "test_helper"

class Api::PaySummariesControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "returns pay per country and per department for the requested country" do
    sign_in_as(create(:user))
    finance = create(:department, name: "Finance")
    create(:salary, employee: create(:employee, country: "DE", department: finance), currency: "EUR", annual_ctc: 90_000)
    create(:salary, employee: create(:employee, country: "IN", department: finance), currency: "INR", annual_ctc: 1_500_000)

    get "/api/pay_summary", params: { country: "DE" }

    assert_response :ok
    summary = json_response["pay_summary"]
    assert_equal "DE", summary["country"]
    assert_equal [ "DE", "IN" ], summary["countries"].pluck("code").sort
    assert_equal({ "code" => "DE", "name" => "Germany", "currency" => "EUR", "employees" => 1, "median_ctc" => "90000.0",
      "average_ctc" => "90000.0", "min_ctc" => "90000.0", "max_ctc" => "90000.0" },
      summary["countries"].find { |row| row["code"] == "DE" })
    assert_equal [ { "id" => finance.id, "name" => "Finance", "currency" => "EUR", "employees" => 1, "median_ctc" => "90000.0",
      "average_ctc" => "90000.0", "min_ctc" => "90000.0", "max_ctc" => "90000.0" } ], summary["departments"]
  end

  test "requires sign-in" do
    get "/api/pay_summary"

    assert_response :unauthorized
  end
end
