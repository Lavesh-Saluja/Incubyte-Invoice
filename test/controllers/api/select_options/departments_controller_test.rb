require "test_helper"

class Api::SelectOptions::DepartmentsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "lists every department by name, including those without employees" do
    sign_in_as(create(:user))
    sales = create(:department, name: "Sales")
    finance = create(:department, name: "Finance")
    create(:employee, department: sales)

    get "/api/select_options/departments"

    assert_response :ok
    assert_equal [ { "id" => finance.id, "name" => "Finance" }, { "id" => sales.id, "name" => "Sales" } ],
      json_response["departments"]
  end

  test "requires sign-in" do
    get "/api/select_options/departments"

    assert_response :unauthorized
  end
end
