require "test_helper"

class EmployeeImports::CreateServiceTest < ActiveSupport::TestCase
  include EmployeeImportHelpers

  setup { @department = create(:department, name: "Engineering") }

  def import(*rows)
    EmployeeImports::CreateService.new(csv_upload(import_csv(*rows))).process!
  end

  test "creates each employee with exactly one current salary, effective from the import date" do
    today = Date.current

    travel_to(today.noon) do
      assert_difference -> { Employee.count } => 3, -> { Salary.count } => 3 do
        import(import_row(1), import_row(2, country: "Germany", currency: "EUR"),
          import_row(3, status: "notice_period", notice_period_start_date: (today - 5).iso8601,
            notice_period_end_date: (today + 25).iso8601))
      end
    end

    employee = Employee.find_by!(employee_code: "ACME-00002")
    assert_equal [ "Priya", "employee2@example.com", "DE", "active", @department ],
      [ employee.first_name, employee.email, employee.country, employee.status, employee.department ]
    assert_equal [ "EUR", BigDecimal("1800000"), BigDecimal("456000"), today ],
      employee.salary.slice(:currency, :annual_ctc, :annual_other_components, :effective_from).values
    assert employee.employee_number.present?

    on_notice = Employee.find_by!(employee_code: "ACME-00003")
    assert on_notice.notice_period?
    assert_equal [ (today - 5).beginning_of_day, (today + 25).end_of_day.floor(6) ],
      [ on_notice.notice_period_started_at, on_notice.notice_period_ends_at ]
  end

  test "keeps imported notice periods and inactive employees in the normal lifecycle" do
    today = Date.current
    import(import_row(1, status: "notice_period", notice_period_start_date: (today - 5).iso8601, notice_period_end_date: today.iso8601),
      import_row(2, status: "inactive"))

    Employees::ExpireNoticePeriodsService.new.process!
    assert Employee.find_by!(employee_code: "ACME-00001").notice_period?

    travel_to(today.tomorrow.noon) { Employees::ExpireNoticePeriodsService.new.process! }
    assert Employee.find_by!(employee_code: "ACME-00001").inactive?
    assert Employee.find_by!(employee_code: "ACME-00002").inactive?
  end

  test "stores the same currency that the manual employee form would" do
    import(import_row(1, country: "SG", currency: "SGD"))
    manual = Employee.create!(attributes_for(:employee, country: "SG").merge(department: @department,
      salary_attributes: attributes_for(:salary).except(:currency)))

    assert_equal manual.salary.currency, Employee.find_by!(employee_code: "ACME-00001").salary.currency
  end

  test "imports nothing when any row is invalid" do
    assert_no_difference -> { Employee.count + Salary.count } do
      error = assert_raises(EmployeeImports::InvalidImportError) { import(import_row(1), import_row(2, department: "Legal")) }
      assert_equal 1, error.result.invalid_rows
    end
  end

  test "rolls everything back when the database rejects a later batch" do
    existing = create(:employee, :with_salary)
    insert_salaries = Salary.method(:insert_all!)
    batches = 0
    failing_second_batch = lambda do |*args, **options|
      batches += 1
      raise ActiveRecord::RecordNotUnique, "duplicate" if batches == 2

      insert_salaries.call(*args, **options)
    end

    with_import_limit(:BATCH_SIZE, 2) do
      Salary.stub(:insert_all!, failing_second_batch) do
        assert_raises(ActiveRecord::RecordNotUnique) { import(*(1..3).map { |number| import_row(number) }) }
      end
    end

    assert_equal 2, batches
    assert_equal [ existing ], Employee.all.to_a
    assert_equal [ existing.salary ], Salary.all.to_a
  end

  test "never changes or removes existing employees, and a repeated import creates nothing" do
    existing = create(:employee, :with_salary)
    original = existing.attributes

    import(import_row(2))
    assert_no_difference -> { Employee.count + Salary.count } do
      assert_raises(EmployeeImports::InvalidImportError) { import(import_row(2)) }
      assert_raises(EmployeeImports::InvalidImportError) { import(import_row(1, email: existing.email, first_name: "Changed")) }
    end

    assert_equal original, existing.reload.attributes
  end
end
