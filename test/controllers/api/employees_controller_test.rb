require "test_helper"

class Api::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    sign_in_as(create(:user))
  end

  def employee_attributes(**overrides)
    { first_name: "Asha", last_name: "Rao", email: "asha.rao@acme.test", department: "Finance",
      job_title: "Analyst", country: "India" }.merge(overrides)
  end

  def create_employee(**overrides)
    post "/api/employees", params: { employee: employee_attributes(**overrides) }, as: :json
  end

  test "creates an employee with a generated code and active status" do
    assert_difference("Employee.count") { create_employee }

    assert_response :created
    employee = json_response["employee"]
    assert_match(/\AINC-\d{4}-\d{6}\z/, employee["employee_code"])
    assert_equal "active", employee["status"]
    assert_nil employee["notice_period_started_at"]
    assert_equal employee_attributes.stringify_keys,
      employee.slice("first_name", "last_name", "email", "department", "job_title", "country")
  end

  test "ignores an employee code, status and notice dates sent by the client" do
    create_employee(employee_code: "HACK-1", status: "inactive", notice_period_ends_at: 1.day.from_now)

    employee = Employee.find(json_response.dig("employee", "id"))
    assert_not_equal "HACK-1", employee.employee_code
    assert employee.active?
    assert_nil employee.notice_period_ends_at
  end

  test "normalizes the email" do
    create_employee(email: "  Asha.Rao@ACME.test ")

    assert_equal "asha.rao@acme.test", json_response.dig("employee", "email")
  end

  test "responds 422 with field errors for invalid details" do
    assert_no_difference("Employee.count") { create_employee(first_name: "", email: "not-an-email") }

    assert_response :unprocessable_content
    assert_equal "Validation failed", json_response["error"]
    assert_equal [ "can't be blank" ], json_response.dig("details", "first_name")
    assert_equal [ "is invalid" ], json_response.dig("details", "email")
  end

  test "responds 422 when the email belongs to another employee" do
    create(:employee, email: "asha.rao@acme.test")

    create_employee(email: "ASHA.RAO@acme.test")

    assert_response :unprocessable_content
    assert_equal [ "has already been taken" ], json_response.dig("details", "email")
  end

  test "responds 409 when the database rejects a duplicate" do
    Employees::CreateService.stub(:new, ->(_) { raise ActiveRecord::RecordNotUnique }) { create_employee }

    assert_response :conflict
    assert_equal "A record with these details already exists", json_response["error"]
  end

  test "responds 400 without employee parameters" do
    post "/api/employees", params: {}, as: :json

    assert_response :bad_request
  end

  test "lists employees newest first with pagination details" do
    older, newer = create_list(:employee, 2)

    get "/api/employees"

    assert_response :ok
    assert_equal [ newer.id, older.id ], json_response["employees"].pluck("id")
    assert_equal({ "page" => 1, "per_page" => 25, "total_count" => 2, "total_pages" => 1 }, json_response["meta"])
  end

  test "returns the requested page" do
    employees = create_list(:employee, 3).reverse

    get "/api/employees", params: { page: 2, per_page: 2 }

    assert_equal [ employees.last.id ], json_response["employees"].pluck("id")
    assert_equal({ "page" => 2, "per_page" => 2, "total_count" => 3, "total_pages" => 2 }, json_response["meta"])
  end

  test "returns an empty list when there are no employees" do
    get "/api/employees"

    assert_equal [], json_response["employees"]
    assert_equal 0, json_response.dig("meta", "total_pages")
  end

  test "shows an employee" do
    employee = create(:employee)

    get "/api/employees/#{employee.id}"

    assert_response :ok
    assert_equal employee.employee_code, json_response.dig("employee", "employee_code")
  end

  test "responds 404 for an unknown employee" do
    get "/api/employees/#{SecureRandom.uuid}"
    assert_response :not_found

    get "/api/employees/not-a-uuid"
    assert_response :not_found
  end

  test "updates the editable details" do
    employee = create(:employee)

    patch "/api/employees/#{employee.id}", params: { employee: { job_title: "Senior Analyst", country: "Germany" } },
      as: :json

    assert_response :ok
    assert_equal [ "Senior Analyst", "Germany" ], employee.reload.slice(:job_title, :country).values
  end

  test "keeps the employee code and status when the client sends them on update" do
    employee = create(:employee)

    patch "/api/employees/#{employee.id}",
      params: { employee: { employee_code: "HACK-1", status: "inactive", first_name: "Asha" } }, as: :json

    assert_response :ok
    employee.reload
    assert_equal "Asha", employee.first_name
    assert_not_equal "HACK-1", employee.employee_code
    assert employee.active?
  end

  test "responds 422 for invalid updates and leaves the employee unchanged" do
    employee = create(:employee, last_name: "Rao")

    patch "/api/employees/#{employee.id}", params: { employee: { last_name: " " } }, as: :json

    assert_response :unprocessable_content
    assert_equal [ "can't be blank" ], json_response.dig("details", "last_name")
    assert_equal "Rao", employee.reload.last_name
  end

  test "responds 404 when updating an unknown employee" do
    patch "/api/employees/#{SecureRandom.uuid}", params: { employee: { first_name: "Asha" } }, as: :json

    assert_response :not_found
  end

  test "requires sign-in for every action" do
    employee = create(:employee)
    delete "/api/session"

    get "/api/employees"
    assert_response :unauthorized
    get "/api/employees/#{employee.id}"
    assert_response :unauthorized
    create_employee
    assert_response :unauthorized
    patch "/api/employees/#{employee.id}", params: { employee: { first_name: "X" } }, as: :json
    assert_response :unauthorized
  end
end
