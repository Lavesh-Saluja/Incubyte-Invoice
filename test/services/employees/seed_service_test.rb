require "test_helper"

class Employees::SeedServiceTest < ActiveSupport::TestCase
  def seed(count = 40)
    Employees::SeedService.new(count:).process!
  end

  def seeded
    Employee.where("email LIKE ?", "%@#{Employees::SeedService::EMAIL_DOMAIN}").includes(:salary, :department)
  end

  test "creates the requested number of valid employees, each with one salary in the country's currency" do
    assert_difference -> { Employee.count } => 40, -> { Salary.count } => 40 do
      assert_equal 40, seed
    end

    seeded.each do |employee|
      assert employee.valid?, employee.errors.full_messages.to_sentence
      assert employee.salary.valid?, employee.salary.errors.full_messages.to_sentence
      assert_equal employee.currency_code, employee.salary.currency
      assert_match(/\AINC-\d{4}-\d{6}\z/, employee.employee_code)
    end
  end

  test "only tops up to the requested count when run again" do
    seed(10)

    assert_equal 0, seed(10)
    assert_equal 5, seed(15)
    assert_equal 15, seeded.count
    assert_equal 15, seeded.distinct.count(:email)
  end

  test "gives each status dates that fit the notice period lifecycle" do
    seed(300)

    assert_equal %w[active inactive notice_period], seeded.distinct.pluck(:status).sort
    assert seeded.active.all? { |employee| employee.notice_period_started_at.nil? && employee.notice_period_ends_at.nil? }
    assert seeded.notice_period.all? { |employee| employee.notice_period_ends_at.future? }
    assert seeded.inactive.all? { |employee| employee.notice_period_ends_at.past? && employee.notice_period_ends_at > employee.created_at }
  end

  test "records salary components that add up to the CTC, effective after joining" do
    seed(50)

    seeded.each do |employee|
      salary = employee.salary
      assert_equal salary.annual_ctc, salary.annual_base_pay + salary.annual_pf + salary.annual_other_components
      assert_operator salary.effective_from, :>=, employee.created_at.to_date
    end
  end

  test "reuses existing departments regardless of case and creates the missing ones once" do
    engineering = create(:department, name: "engineering")

    seed(20)
    seed(30)

    assert_equal 1, Department.where("lower(name) = ?", "engineering").count
    assert_equal engineering, Department.find_by!("lower(name) = ?", "engineering")
    assert_equal Employees::SeedService::DEPARTMENTS.size, Department.count
  end
end
