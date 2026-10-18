require "test_helper"

class EmployeeTest < ActiveSupport::TestCase
  def errors_for(employee, attribute)
    employee.validate
    employee.errors[attribute]
  end

  def insert_employee!(**attributes)
    Employee.insert_all!([ {
      employee_code: "INC-2026-#{SecureRandom.hex(3)}", first_name: "Raw", last_name: "Insert",
      email: "raw-#{SecureRandom.hex(3)}@acme.test", department: "Finance", job_title: "Analyst", country: "India"
    }.merge(attributes) ])
  end

  test "is valid with the required details" do
    assert build(:employee).valid?
  end

  test "uses a UUID primary key" do
    assert_match(/\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/, create(:employee).id)
  end

  test "generates the employee code from the joining year and the next sequence number" do
    travel_to Time.zone.local(2026, 3, 15) do
      employee = create(:employee)

      assert_equal format("INC-2026-%06d", employee.employee_number), employee.employee_code
    end
  end

  test "uses one global sequence that does not reset when the year changes" do
    first = travel_to(Time.zone.local(2026, 12, 31)) { create(:employee) }
    second = travel_to(Time.zone.local(2027, 1, 1)) { create(:employee) }

    assert_match(/\AINC-2026-\d{6}\z/, first.employee_code)
    assert_match(/\AINC-2027-\d{6}\z/, second.employee_code)
    assert_operator second.employee_number, :>, first.employee_number
  end

  test "draws numbers from the database sequence, not from existing records" do
    latest = create(:employee)
    latest.destroy!

    assert_operator create(:employee).employee_number, :>, latest.employee_number
  end

  test "ignores a caller-supplied employee code and number" do
    employee = create(:employee, employee_code: "CUSTOM-1", employee_number: 0)

    assert_match(/\AINC-\d{4}-\d{6}\z/, employee.employee_code)
    assert_operator employee.employee_number, :positive?
  end

  test "validating repeatedly before saving uses a single sequence number" do
    employee = build(:employee)
    employee.validate
    code = employee.employee_code
    employee.save!

    assert_equal code, employee.reload.employee_code
  end

  test "the employee code cannot be changed after creation" do
    employee = create(:employee)

    assert_raises(ActiveRecord::ReadonlyAttributeError) { employee.update(employee_code: "INC-2026-999999") }
  end

  test "the database rejects a duplicate employee code" do
    employee = create(:employee)

    assert_raises(ActiveRecord::RecordNotUnique) { insert_employee!(employee_code: employee.employee_code) }
  end

  test "requires first name, last name, email, department, job title and country" do
    employee = Employee.new

    employee.validate
    %i[first_name last_name email department job_title country].each do |attribute|
      assert_includes employee.errors[attribute], "can't be blank", "expected #{attribute} to be required"
    end
  end

  test "treats whitespace-only values as blank" do
    assert_includes errors_for(build(:employee, department: "   "), :department), "can't be blank"
  end

  test "limits first and last names to 100 characters" do
    assert build(:employee, first_name: "a" * 100, last_name: "b" * 100).valid?
    assert_includes errors_for(build(:employee, first_name: "a" * 101), :first_name),
      "is too long (maximum is 100 characters)"
    assert_includes errors_for(build(:employee, last_name: "b" * 101), :last_name),
      "is too long (maximum is 100 characters)"
  end

  test "trims names, department, job title and country" do
    employee = create(:employee, first_name: " Asha ", last_name: " Rao ", department: " Finance ",
      job_title: " Analyst ", country: " India ")

    assert_equal %w[Asha Rao Finance Analyst India],
      employee.slice(:first_name, :last_name, :department, :job_title, :country).values
  end

  test "normalizes the email to trimmed lowercase" do
    assert_equal "asha.rao@acme.test", create(:employee, email: "  Asha.Rao@ACME.test ").email
  end

  test "requires a well-formed email" do
    assert_includes errors_for(build(:employee, email: "not-an-email"), :email), "is invalid"
  end

  test "rejects an email already used by another employee in any case" do
    create(:employee, email: "asha@acme.test")

    assert_includes errors_for(build(:employee, email: "ASHA@acme.test"), :email), "has already been taken"
  end

  test "the database rejects duplicate emails that bypass the model" do
    create(:employee, email: "asha@acme.test")

    assert_raises(ActiveRecord::RecordNotUnique) { insert_employee!(email: "Asha@ACME.test") }
  end

  test "a new employee is active with no notice period" do
    employee = create(:employee)

    assert employee.active?
    assert_nil employee.notice_period_started_at
    assert_nil employee.notice_period_ends_at
  end

  test "accepts only the active, notice period and inactive statuses" do
    assert build(:employee, :on_notice).valid?
    assert build(:employee, :inactive).valid?
    assert_includes errors_for(build(:employee, status: "terminated"), :status), "is not included in the list"
  end

  test "the database rejects other statuses" do
    assert_raises(ActiveRecord::StatementInvalid) { insert_employee!(status: "terminated") }
  end
end
