require "test_helper"

class Departments::StatsServiceTest < ActiveSupport::TestCase
  test "counts active, on notice, inactive and current employees per department, largest first" do
    finance, sales, empty = %w[Finance Sales Empty].map { |name| create(:department, name:) }
    create_list(:employee, 2, department: finance)
    create(:employee, :on_notice, department: finance)
    create(:employee, :inactive, department: finance)
    create(:employee, department: sales)

    rows = Departments::StatsService.new(Department.all).process!

    assert_equal [
      { id: finance.id, name: "Finance", active: 2, notice_period: 1, inactive: 1, current: 3 },
      { id: sales.id, name: "Sales", active: 1, notice_period: 0, inactive: 0, current: 1 },
      { id: empty.id, name: "Empty", active: 0, notice_period: 0, inactive: 0, current: 0 }
    ], rows
  end

  test "breaks ties by name" do
    %w[Beta Alpha].each { |name| create(:employee, department: create(:department, name:)) }

    assert_equal %w[Alpha Beta], Departments::StatsService.new(Department.all).process!.pluck(:name)
  end
end
