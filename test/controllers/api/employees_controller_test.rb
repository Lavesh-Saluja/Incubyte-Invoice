require "test_helper"

class Api::EmployeesControllerTest < ActionDispatch::IntegrationTest
  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    sign_in_as(create(:user))
  end

  def salary_attributes(**overrides)
    { annual_ctc: "1800000.50", annual_base_pay: "1000000", annual_pf: "120000", annual_other_components: "680000.50",
      effective_from: "2026-04-01" }.merge(overrides)
  end

  def finance
    @finance ||= create(:department, name: "Finance")
  end

  def employee_attributes(**overrides)
    { first_name: "Asha", last_name: "Rao", email: "asha.rao@acme.test", department_id: finance.id,
      job_title: "Analyst", country: "IN", salary: salary_attributes }.merge(overrides)
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
    assert_equal employee_attributes.except(:salary).stringify_keys,
      employee.slice("first_name", "last_name", "email", "job_title", "country")
        .merge("department_id" => employee.dig("department", "id"))
    assert_equal "India", employee["country_name"]
  end

  test "creates the salary with the currency of the employee's country" do
    create_employee(country: "DE")

    salary = json_response.dig("employee", "salary")
    assert_equal({ "currency" => "EUR", "annual_ctc" => "1800000.5", "annual_base_pay" => "1000000.0",
      "annual_pf" => "120000.0", "annual_other_components" => "680000.5", "effective_from" => "2026-04-01" }, salary)
    assert_equal BigDecimal("1800000.50"), Employee.find(json_response.dig("employee", "id")).salary.annual_ctc
  end

  test "ignores a currency sent by the client" do
    create_employee(country: "IN", salary: salary_attributes(currency: "USD"))

    assert_equal "INR", json_response.dig("employee", "salary", "currency")
  end

  test "requires a salary when creating an employee" do
    assert_no_difference("Employee.count") { create_employee(salary: nil) }

    assert_response :unprocessable_content
    assert_equal [ "can't be blank" ], json_response.dig("details", "salary")
  end

  test "responds 422 with salary field errors and saves nothing" do
    assert_no_difference([ "Employee.count", "Salary.count" ]) do
      create_employee(salary: salary_attributes(annual_ctc: "-5", effective_from: ""))
    end

    assert_response :unprocessable_content
    assert_equal [ "must be greater than or equal to 0" ], json_response.dig("details", "salary.annual_ctc")
    assert_equal [ "can't be blank" ], json_response.dig("details", "salary.effective_from")
  end

  test "returns the employee's department" do
    create_employee

    assert_equal({ "id" => finance.id, "name" => "Finance" }, json_response.dig("employee", "department"))
  end

  test "responds 422 for an unknown department" do
    create_employee(department_id: SecureRandom.uuid)

    assert_response :unprocessable_content
    assert_equal [ "must exist" ], json_response.dig("details", "department")
  end

  test "changes the employee's department" do
    employee = create(:employee)
    sales = create(:department, name: "Sales")

    patch "/api/employees/#{employee.id}", params: { employee: { department_id: sales.id } }, as: :json

    assert_response :ok
    assert_equal sales, employee.reload.department
  end

  test "responds 422 for an unknown country" do
    create_employee(country: "Atlantis")

    assert_response :unprocessable_content
    assert_equal [ "is not a valid country" ], json_response.dig("details", "country")
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

  test "shows employees whose notice period has ended as inactive" do
    create(:employee, :on_notice, notice_period_started_at: 31.days.ago, notice_period_ends_at: 1.minute.ago)

    get "/api/employees"

    assert_equal [ "inactive" ], json_response["employees"].pluck("status")
  end

  test "returns the requested page" do
    employees = create_list(:employee, 3).reverse

    get "/api/employees", params: { page: 2, per_page: 2 }

    assert_equal [ employees.last.id ], json_response["employees"].pluck("id")
    assert_equal({ "page" => 2, "per_page" => 2, "total_count" => 3, "total_pages" => 2 }, json_response["meta"])
  end

  test "searches and filters the list" do
    match = create(:employee, first_name: "Asha", department: finance, country: "IN")
    create(:employee, first_name: "Asha", department: create(:department), country: "IN")
    create(:employee, first_name: "Ben", department: finance, country: "IN")

    get "/api/employees", params: { q: "asha", department_id: finance.id, country: "IN", status: "active" }

    assert_equal [ match.id ], json_response["employees"].pluck("id")
    assert_equal 1, json_response.dig("meta", "total_count")
  end

  test "filters employees whose annual CTC is at least the minimum salary" do
    below = create(:employee)
    create(:salary, employee: below, annual_ctc: 250_000)
    at_threshold = create(:employee)
    create(:salary, employee: at_threshold, annual_ctc: 300_000)
    above = create(:employee)
    create(:salary, employee: above, annual_ctc: 450_000)
    create(:employee)

    get "/api/employees", params: { min_salary: 300_000 }

    assert_equal [ above.id, at_threshold.id ], json_response["employees"].pluck("id")
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

    patch "/api/employees/#{employee.id}", params: { employee: { job_title: "Senior Analyst", country: "DE" } },
      as: :json

    assert_response :ok
    assert_equal [ "Senior Analyst", "DE" ], employee.reload.slice(:job_title, :country).values
  end

  test "updates the salary and follows a country change with its currency" do
    employee = create(:employee, :with_salary, country: "IN")

    patch "/api/employees/#{employee.id}",
      params: { employee: { country: "US", salary: salary_attributes(annual_ctc: "95000") } }, as: :json

    assert_response :ok
    salary = employee.reload.salary
    assert_equal [ "USD", BigDecimal("95000") ], [ salary.currency, salary.annual_ctc ]
  end

  test "adds a salary to an employee who has none" do
    employee = create(:employee, country: "SG")

    patch "/api/employees/#{employee.id}", params: { employee: { salary: salary_attributes } }, as: :json

    assert_response :ok
    assert_equal "SGD", employee.reload.salary.currency
  end

  test "returns a null salary for an employee without one" do
    employee = create(:employee)

    get "/api/employees/#{employee.id}"

    assert_nil json_response.dig("employee", "salary")
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

  test "an inactive employee cannot be edited" do
    employee = create(:employee, :inactive, job_title: "Analyst")

    patch "/api/employees/#{employee.id}", params: { employee: { job_title: "Manager" } }, as: :json

    assert_response :unprocessable_content
    assert_match(/inactive/, json_response.dig("details", "status").first)
    assert_equal "Analyst", employee.reload.job_title
  end

  test "an employee on notice can still be edited" do
    employee = create(:employee, :on_notice)

    patch "/api/employees/#{employee.id}", params: { employee: { job_title: "Manager" } }, as: :json

    assert_response :ok
    assert_equal "Manager", employee.reload.job_title
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
