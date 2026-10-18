require "test_helper"

class Api::SelectOptions::CountriesControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "lists every ISO 3166 country with its currency, sorted by name" do
    sign_in_as(create(:user))

    get "/api/select_options/countries"

    assert_response :ok
    countries = json_response["countries"]
    assert_equal ISO3166::Country.all.size, countries.size
    assert_includes countries, { "code" => "IN", "name" => "India", "currency" => "INR" }
    assert_equal countries.pluck("name").sort, countries.pluck("name")
  end

  test "lists only the countries employees are in when asked" do
    sign_in_as(create(:user))
    create(:employee, country: "IN")
    create(:employee, country: "DE")
    create(:employee, country: "IN")

    get "/api/select_options/countries", params: { in_use: "true" }

    assert_equal [ { "code" => "DE", "name" => "Germany", "currency" => "EUR" },
      { "code" => "IN", "name" => "India", "currency" => "INR" } ], json_response["countries"]
  end

  test "requires sign-in" do
    get "/api/select_options/countries"

    assert_response :unauthorized
  end
end
