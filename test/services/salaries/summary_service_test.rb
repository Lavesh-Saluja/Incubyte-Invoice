require "test_helper"

class Salaries::SummaryServiceTest < ActiveSupport::TestCase
  def employee_paid(ctc, country: "IN", department: nil, status: :active)
    traits = { active: [], notice_period: [ :on_notice ], inactive: [ :inactive ] }.fetch(status)
    employee = create(:employee, *traits, country:, department: department || create(:department))
    create(:salary, employee:, currency: employee.currency_code, annual_ctc: ctc)
    employee
  end

  def summary(country: nil)
    Salaries::SummaryService.new(Employee.all, country:).process!
  end

  test "summarises current employees' CTC per country in its own currency, largest country first" do
    [ 100, 200, 300, 1000 ].each { |ctc| employee_paid(ctc, country: "IN") }
    [ 50, 70 ].each { |ctc| employee_paid(ctc, country: "US") }

    india, us = summary.countries

    assert_equal [ "IN", "India", "INR", 4 ], [ india.key, india.name, india.currency, india.employees ]
    assert_equal [ 250, 400, 100, 1000 ], [ india.median_ctc, india.average_ctc, india.min_ctc, india.max_ctc ]
    assert_equal [ "US", "USD", 2, 60, 60 ], [ us.key, us.currency, us.employees, us.median_ctc, us.average_ctc ]
  end

  test "counts active and on-notice employees but not inactive ones or employees without a salary" do
    employee_paid(100)
    employee_paid(300, status: :notice_period)
    employee_paid(9_999, status: :inactive)
    create(:employee, country: "IN")

    assert_equal [ 2, 200 ], summary.countries.sole.then { |row| [ row.employees, row.average_ctc ] }
  end

  test "treats employees whose notice period has ended as inactive" do
    employee_paid(100)
    employee_paid(900, status: :notice_period).update_columns(notice_period_ends_at: 1.minute.ago)

    assert_equal 1, summary.countries.sole.employees
  end

  test "breaks the selected country down by department, defaulting to the largest country" do
    engineering, sales = create(:department, name: "Engineering"), create(:department, name: "Sales")
    [ 300, 500 ].each { |ctc| employee_paid(ctc, department: engineering) }
    employee_paid(200, department: sales)
    employee_paid(80, country: "US", department: sales)

    default = summary
    assert_equal "IN", default.country
    assert_equal [ [ "Engineering", 2, 400 ], [ "Sales", 1, 200 ] ],
      default.departments.map { |row| [ row.name, row.employees, row.median_ctc ] }

    us = summary(country: " us ")
    assert_equal "US", us.country
    assert_equal [ [ sales.id, "USD", 80 ] ], us.departments.map { |row| [ row.key, row.currency, row.max_ctc ] }
  end

  test "falls back to the largest country for an unknown country and is empty without salaries" do
    employee_paid(100)

    assert_equal "IN", summary(country: "ZZ").country
    Salary.delete_all
    assert_equal [ nil, [], [] ], summary.then { |result| [ result.country, result.countries, result.departments ] }
  end
end
