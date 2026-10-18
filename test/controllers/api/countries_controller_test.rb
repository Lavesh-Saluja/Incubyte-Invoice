require "test_helper"

class Api::CountriesControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "lists every ISO 3166 country with its currency, sorted by name" do
    sign_in_as(create(:user))

    get "/api/countries"

    assert_response :ok
    countries = json_response["countries"]
    assert_equal ISO3166::Country.all.size, countries.size
    assert_includes countries, { "code" => "IN", "name" => "India", "currency" => "INR" }
    assert_equal countries.pluck("name").sort, countries.pluck("name")
  end

  test "requires sign-in" do
    get "/api/countries"

    assert_response :unauthorized
  end
end
