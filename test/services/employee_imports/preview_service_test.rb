require "test_helper"

class EmployeeImports::PreviewServiceTest < ActiveSupport::TestCase
  include EmployeeImportHelpers

  setup { create(:department, name: "Engineering") }

  def preview(*rows)
    EmployeeImports::PreviewService.new(csv_upload(import_csv(*rows))).process!
  end

  def row_errors(row)
    import_errors(preview(row)).map { |_, column, message| [ column, message ] }
  end

  test "a valid file has no errors and writes nothing" do
    result = nil
    assert_no_difference -> { Employee.count + Salary.count } do
      result = preview(import_row(1), import_row(2, country: "DE", currency: "EUR"))
    end

    assert result.valid?
    assert_equal [ 2, 2, 0 ], [ result.total_rows, result.valid_rows, result.invalid_rows ]
  end

  test "normalises text, email, department, country and currency" do
    result = preview(import_row(1, first_name: "  Priya ", email: " Priya@Example.COM ", department: " engineering ",
      country: "in", currency: "inr", status: "Active"))
    row = result.rows.sole

    assert result.valid?
    assert_equal [ "Priya", "priya@example.com", "IN", "active" ],
      row.employee_attributes.values_at("first_name", "email", "country", "status")
    assert_equal "INR", row.salary_attributes["currency"]
  end

  test "requires every value except the notice period dates" do
    blank = %w[employee_code last_name email job_title department country status currency
      annual_ctc annual_base_pay annual_pf annual_other_components]

    assert_equal blank.sort, row_errors(import_row(1, **blank.index_with(""))).map(&:first).sort
    assert_equal [ [ "first_name", "can't be blank" ] ], row_errors(import_row(1, first_name: " "))
  end

  test "checks email format and name length with the model's validations" do
    assert_equal [ [ "first_name", "is too long (maximum is 100 characters)" ], [ "email", "is invalid" ] ],
      row_errors(import_row(1, first_name: "a" * 101, email: "not-an-email"))
  end

  test "rejects employee codes that are too long or use the generated prefix" do
    assert_equal [ [ "employee_code", "must be at most 50 characters" ] ], row_errors(import_row(1, employee_code: "A" * 51))
    assert_equal [ [ "employee_code", "must not start with INC-, which is reserved for codes the app generates" ] ],
      row_errors(import_row(1, employee_code: "inc-2026-000001"))
  end

  test "rejects departments that do not exist, without creating them" do
    assert_no_difference -> { Department.count } do
      assert_equal [ [ "department", "“Legal” does not match an existing department. Add it on the Departments page first" ] ],
        row_errors(import_row(1, department: "Legal"))
    end
  end

  test "rejects unknown countries" do
    assert_equal [ [ "country", "“Atlantis” is not a recognised country" ] ], row_errors(import_row(1, country: "Atlantis"))
  end

  test "requires the currency of the employee's country" do
    assert_equal [ [ "currency", "must be INR for India" ] ], row_errors(import_row(1, currency: "USD"))
    assert_equal [ [ "currency", "must be EUR for Germany" ] ], row_errors(import_row(1, country: "DE", currency: "XYZ"))
  end

  test "rejects amounts that are not plain non-negative numbers with up to 2 decimals" do
    message = "must be a number with up to 2 decimal places, without commas or currency symbols"

    %w[-1 1,800,000 ₹100 1.234 abc 1e5 12345678901234].each do |amount|
      assert_equal [ [ "annual_ctc", message ] ], row_errors(import_row(1, annual_ctc: amount)), amount
    end
  end

  test "rejects unknown statuses" do
    assert_equal [ [ "status", "must be one of: active, notice_period, inactive" ] ], row_errors(import_row(1, status: "on_leave"))
  end

  test "active employees must not have notice period dates" do
    assert_equal [ [ "notice_period_start_date", "must be empty for active employees" ] ],
      row_errors(import_row(1, notice_period_start_date: Date.current.iso8601))
  end

  test "employees on notice need both dates, ending today or later and within the maximum notice period" do
    today = Date.current

    assert preview(import_row(1, status: "notice_period", notice_period_start_date: (today - 5).iso8601,
      notice_period_end_date: today.iso8601)).valid?
    assert_equal [ [ "notice_period_start_date", "is required for employees on notice" ],
      [ "notice_period_end_date", "is required for employees on notice" ] ],
      row_errors(import_row(1, status: "notice_period"))
    assert_equal [ [ "notice_period_end_date", "must not be before the notice period start date" ] ],
      row_errors(import_row(1, status: "notice_period", notice_period_start_date: today.iso8601,
        notice_period_end_date: (today - 1).iso8601))
    assert_equal [ [ "notice_period_start_date", "must not be after today" ] ],
      row_errors(import_row(1, status: "notice_period", notice_period_start_date: (today + 1).iso8601,
        notice_period_end_date: (today + 30).iso8601))
    assert_equal [ [ "notice_period_end_date", "is in the past. Use the status inactive for employees who have already left" ] ],
      row_errors(import_row(1, status: "notice_period", notice_period_start_date: (today - 40).iso8601,
        notice_period_end_date: (today - 10).iso8601))
    assert_equal [ [ "notice_period_end_date", "must be within 365 days of the start date" ] ],
      row_errors(import_row(1, status: "notice_period", notice_period_start_date: today.iso8601,
        notice_period_end_date: (today + 366).iso8601))
  end

  test "inactive employees may have both notice dates, ending no later than today, or neither" do
    today = Date.current

    assert preview(import_row(1, status: "inactive")).valid?
    assert preview(import_row(1, status: "inactive", notice_period_start_date: (today - 30).iso8601,
      notice_period_end_date: today.iso8601)).valid?
    assert_equal [ [ "notice_period_end_date", "must be given when the other notice period date is given" ] ],
      row_errors(import_row(1, status: "inactive", notice_period_start_date: today.iso8601))
    assert_equal [ [ "notice_period_end_date", "must not be after today for inactive employees" ] ],
      row_errors(import_row(1, status: "inactive", notice_period_start_date: today.iso8601,
        notice_period_end_date: (today + 1).iso8601))
  end

  test "rejects dates that are not real YYYY-MM-DD dates" do
    %w[2026-02-30 18/10/2026 2026-1-5 N/A].each do |date|
      assert_equal [ [ "notice_period_start_date", "must be a date in YYYY-MM-DD format" ] ],
        row_errors(import_row(1, status: "inactive", notice_period_start_date: date, notice_period_end_date: "2026-01-01")), date
    end
  end

  test "flags codes and emails repeated within the file" do
    result = preview(import_row(1), import_row(2, employee_code: "ACME-00001", email: "EMPLOYEE1@example.com"))

    assert_equal [
      [ 2, "employee_code", "is also used in row 3" ], [ 2, "email", "is also used in row 3" ],
      [ 3, "employee_code", "is also used in row 2" ], [ 3, "email", "is also used in row 2" ]
    ], import_errors(result)
  end

  test "flags codes and emails that already belong to an employee, with two queries for the whole file" do
    existing = create(:employee, email: "taken@example.com")
    Employee.where(id: existing.id).update_all(employee_code: "ACME-77777")
    rows = [ import_row(1, employee_code: "ACME-77777"), import_row(2, email: "Taken@Example.com") ] +
      (3..50).map { |number| import_row(number) }

    queries = []
    callback = ->(*, payload) { queries << payload[:sql] if payload[:sql].include?("employees") }
    result = ActiveSupport::Notifications.subscribed(callback, "sql.active_record") { preview(*rows) }

    assert_equal [ [ 2, "employee_code", "already belongs to an existing employee" ],
      [ 3, "email", "already belongs to an existing employee" ] ], import_errors(result)
    assert_equal 2, queries.size
  end

  test "rows with too few or too many values are reported" do
    content = import_csv(import_row(1)) + "ACME-2,Short\n"
    result = EmployeeImports::PreviewService.new(csv_upload(content)).process!

    assert_equal [ [ 3, nil, "has 2 values but the template has 15 columns" ] ], import_errors(result)
    assert_equal [ 2, 1, 1 ], [ result.total_rows, result.valid_rows, result.invalid_rows ]
  end
end
