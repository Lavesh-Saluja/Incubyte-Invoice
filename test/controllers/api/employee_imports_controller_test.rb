require "test_helper"

class Api::EmployeeImportsControllerTest < ActionDispatch::IntegrationTest
  include EmployeeImportHelpers

  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    create(:department, name: "Engineering")
    sign_in_as(create(:user))
  end

  test "downloads the template with the expected header and an example row" do
    get "/api/employee_imports/template"

    assert_response :ok
    assert_equal "text/csv", response.media_type
    assert_match "employee-import-template.csv", response.headers["Content-Disposition"]
    header, example = CSV.parse(response.body)
    assert_equal EmployeeImports::Schema::COLUMNS, header
    assert_equal "ACME-00125", example.first
  end

  test "previews a valid file without importing it" do
    assert_no_difference -> { Employee.count } do
      post "/api/employee_imports/preview", params: { file: csv_upload(import_csv(import_row(1), import_row(2))) }
    end

    assert_response :ok
    import = json_response["import"]
    assert_equal [ true, 2, 2, 0, [] ], import.values_at("valid", "total_rows", "valid_rows", "invalid_rows", "errors")
    assert_equal({ "row" => 2, "valid" => true, "employee_code" => "ACME-00001", "name" => "Priya Sharma",
      "email" => "employee1@example.com", "job_title" => "Software Engineer", "department" => "Engineering",
      "country" => "India", "status" => "active", "currency" => "INR", "annual_ctc" => "1800000.00" }, import["preview"].first)
  end

  test "previews row errors with the row number and column" do
    post "/api/employee_imports/preview", params: { file: csv_upload(import_csv(import_row(1), import_row(2, country: "Atlantis"))) }

    import = json_response["import"]
    assert_equal [ false, 1, 1 ], import.values_at("valid", "valid_rows", "invalid_rows")
    assert_equal [ { "row" => 3, "column" => "country", "message" => "“Atlantis” is not a recognised country" } ], import["errors"]
  end

  test "previews file problems as errors without a row" do
    post "/api/employee_imports/preview", params: { file: csv_upload("name\n", filename: "employees.txt") }

    assert_response :ok
    assert_equal [ { "row" => nil, "column" => nil, "message" => "The file must be a .csv file" } ], json_response["import"]["errors"]
  end

  test "imports a valid file and reports what was created" do
    assert_difference -> { Employee.count } => 2, -> { Salary.count } => 2 do
      post "/api/employee_imports", params: { file: csv_upload(import_csv(import_row(1), import_row(2))) }
    end

    assert_response :created
    assert_equal [ 2, 2 ], json_response["import"].values_at("employees_created", "salaries_created")
  end

  test "refuses an invalid file, explaining why, and imports nothing" do
    assert_no_difference -> { Employee.count } do
      post "/api/employee_imports", params: { file: csv_upload(import_csv(import_row(1), import_row(2, status: "retired"))) }
    end

    assert_response :unprocessable_content
    assert_match "Nothing was imported", json_response["error"]
    assert_equal 1, json_response["import"]["invalid_rows"]
  end

  test "submitting the same file twice imports it once" do
    file = import_csv(import_row(1))
    post "/api/employee_imports", params: { file: csv_upload(file) }

    assert_no_difference -> { Employee.count } do
      post "/api/employee_imports", params: { file: csv_upload(file) }
    end
    assert_response :unprocessable_content
  end

  test "requires a file" do
    post "/api/employee_imports/preview", params: {}, as: :json

    assert_response :bad_request
  end

  test "rejects cross-site uploads" do
    post "/api/employee_imports", params: { file: csv_upload(import_csv(import_row(1))) },
      headers: { "Sec-Fetch-Site" => "cross-site" }

    assert_response :forbidden
  end

  test "keeps other endpoints JSON-only" do
    post "/api/departments", params: { department: { name: "Legal" } }

    assert_response :unsupported_media_type
  end

  test "requires a signed-in user for every endpoint" do
    delete "/api/session"

    get "/api/employee_imports/template"
    assert_response :unauthorized
    post "/api/employee_imports/preview", params: { file: csv_upload(import_csv(import_row(1))) }
    assert_response :unauthorized
    assert_no_difference -> { Employee.count } do
      post "/api/employee_imports", params: { file: csv_upload(import_csv(import_row(1))) }
    end
    assert_response :unauthorized
  end
end
