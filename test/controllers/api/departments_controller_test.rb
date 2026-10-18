require "test_helper"

class Api::DepartmentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    sign_in_as(create(:user))
  end

  test "lists departments with their employee counts" do
    finance = create(:department, name: "Finance")
    create(:employee, department: finance)
    create(:employee, :inactive, department: finance)
    create(:department, name: "Legal")

    get "/api/departments"

    assert_response :ok
    assert_equal [
      { "id" => finance.id, "name" => "Finance", "active" => 1, "notice_period" => 0, "inactive" => 1, "current" => 1 },
      { "id" => Department.find_by!(name: "Legal").id, "name" => "Legal", "active" => 0, "notice_period" => 0,
        "inactive" => 0, "current" => 0 }
    ], json_response["departments"]
  end

  test "counts notice periods that have ended as inactive" do
    create(:employee, :on_notice, notice_period_started_at: 31.days.ago, notice_period_ends_at: 1.minute.ago)

    get "/api/departments"

    assert_equal [ 0, 1 ], json_response["departments"].first.values_at("notice_period", "inactive")
  end

  test "creates a department" do
    assert_difference("Department.count") do
      post "/api/departments", params: { department: { name: "  Sales   Ops " } }, as: :json
    end

    assert_response :created
    assert_equal "Sales Ops", json_response.dig("department", "name")
  end

  test "responds 422 when the name already exists in any case" do
    create(:department, name: "Finance")

    post "/api/departments", params: { department: { name: "FINANCE" } }, as: :json

    assert_response :unprocessable_content
    assert_equal [ "has already been taken" ], json_response.dig("details", "name")
  end

  test "requires sign-in" do
    delete "/api/session"

    get "/api/departments"
    assert_response :unauthorized
    post "/api/departments", params: { department: { name: "Ops" } }, as: :json
    assert_response :unauthorized
  end
end
