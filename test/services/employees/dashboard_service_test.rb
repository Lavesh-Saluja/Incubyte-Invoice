require "test_helper"

class Employees::DashboardServiceTest < ActiveSupport::TestCase
  def dashboard
    Employees::DashboardService.new(Employee.all).process!
  end

  def on_notice(ends_in:, **attributes)
    create(:employee, :on_notice, notice_period_started_at: 20.days.ago, notice_period_ends_at: ends_in.from_now,
      **attributes)
  end

  test "counts current headcount as active plus on notice, excluding inactive" do
    create_list(:employee, 3)
    on_notice(ends_in: 20.days)
    create_list(:employee, 2, :inactive)

    assert_equal({ current_headcount: 4, active: 3, notice_period: 1, inactive: 2, leaving_soon: 0 }, dashboard.counts)
  end

  test "counts as leaving soon only notice periods ending within the next 10 days" do
    on_notice(ends_in: 2.days)
    on_notice(ends_in: 10.days - 1.minute)
    on_notice(ends_in: 11.days)

    assert_equal 2, dashboard.counts[:leaving_soon]
  end

  test "treats notice periods that have already ended as inactive" do
    on_notice(ends_in: -1.minute)

    assert_equal({ current_headcount: 0, active: 0, notice_period: 0, inactive: 1, leaving_soon: 0 }, dashboard.counts)
  end

  test "breaks headcount down by department, excluding inactive employees, largest first" do
    create_list(:employee, 2, department: "Finance")
    on_notice(ends_in: 20.days, department: "Finance")
    create(:employee, department: "Sales")
    create(:employee, :inactive, department: "Sales")
    create(:employee, :inactive, department: "Legal")

    assert_equal [
      { department: "Finance", active: 2, notice_period: 1, total: 3 },
      { department: "Sales", active: 1, notice_period: 0, total: 1 }
    ], dashboard.departments
  end

  test "lists upcoming departures within 10 days, leaving soonest first" do
    later = on_notice(ends_in: 8.days)
    sooner = on_notice(ends_in: 1.day)
    on_notice(ends_in: 15.days)
    create(:employee)

    assert_equal [ sooner, later ], dashboard.upcoming_departures.to_a
  end
end
