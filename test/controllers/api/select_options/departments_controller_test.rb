require "test_helper"

class Api::SelectOptions::DepartmentsControllerTest < ActionDispatch::IntegrationTest
  setup { Api::SessionsController::RATE_LIMIT_STORE.clear }

  test "lists the departments employees are in, once each and sorted" do
    sign_in_as(create(:user))
    create(:employee, department: "Sales")
    create(:employee, department: "Finance")
    create(:employee, department: "Sales")

    get "/api/select_options/departments"

    assert_response :ok
    assert_equal %w[Finance Sales], json_response["departments"]
  end

  test "requires sign-in" do
    get "/api/select_options/departments"

    assert_response :unauthorized
  end
end
