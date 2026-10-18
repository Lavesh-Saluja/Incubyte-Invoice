require "test_helper"

class Employees::ListServiceTest < ActiveSupport::TestCase
  def list(**options)
    Employees::ListService.new(Employee.all, **options).process!
  end

  test "orders by newest employee first" do
    older, newer = create_list(:employee, 2)

    assert_equal [ newer, older ], list.records.to_a
  end

  test "defaults to the first page of 25" do
    page = list

    assert_equal [ 1, 25 ], [ page.page, page.per_page ]
  end

  test "paginates and counts every employee" do
    create_list(:employee, 5)

    page = list(page: "2", per_page: "2")

    assert_equal 2, page.records.size
    assert_equal [ 5, 3 ], [ page.total_count, page.total_pages ]
  end

  test "keeps page and page size within bounds" do
    assert_equal [ 1, 1 ], list(page: "-3", per_page: "0").then { |page| [ page.page, page.per_page ] }
    assert_equal 100, list(per_page: "5000").per_page
    assert_equal 1, list(page: "abc").page
  end

  test "searches first name, last name, full name, email and code without regard to case" do
    asha = create(:employee, first_name: "Asha", last_name: "Rao", email: "asha.rao@acme.test")
    create(:employee, first_name: "Ben", last_name: "Stone", email: "ben@acme.test")

    [ "asha", "RAO", "asha r", "ASHA.RAO@", asha.employee_code.downcase ].each do |query|
      assert_equal [ asha ], list(filters: { q: query }).records.to_a, "for #{query.inspect}"
    end
  end

  test "treats search wildcards as plain text" do
    create(:employee, first_name: "Asha")

    assert_empty list(filters: { q: "%" }).records
    assert_empty list(filters: { q: "_sha" }).records
  end

  test "filters by status, department and country" do
    finance, sales = create_list(:department, 2)
    india_finance = create(:employee, department: finance, country: "IN")
    create(:employee, department: finance, country: "DE")
    create(:employee, :inactive, department: finance, country: "IN")
    create(:employee, department: sales, country: "IN")

    page = list(filters: { status: "active", department_id: finance.id, country: "in" })

    assert_equal [ india_finance ], page.records.to_a
    assert_equal 1, page.total_count
  end

  test "combines search with filters and paginates the matches" do
    finance, sales = create_list(:department, 2)
    create_list(:employee, 3, first_name: "Asha", department: finance)
    create(:employee, first_name: "Asha", department: sales)

    page = list(filters: { q: "asha", department_id: finance.id }, per_page: 2)

    assert_equal [ 3, 2, 2 ], [ page.total_count, page.total_pages, page.records.size ]
  end

  test "ignores blank filters and unknown statuses" do
    create_list(:employee, 2)

    assert_equal 2, list(filters: { q: "  ", status: "retired", department_id: "" }).total_count
  end

  test "sorts employees on notice by notice end date, soonest first, across pages" do
    later = create(:employee, :on_notice, notice_period_ends_at: 20.days.from_now)
    soonest = create(:employee, :on_notice, notice_period_ends_at: 2.days.from_now)
    middle = create(:employee, :on_notice, notice_period_ends_at: 9.days.from_now)

    first_page = list(filters: { status: "notice_period" }, per_page: 2)
    second_page = list(filters: { status: "notice_period" }, per_page: 2, page: 2)

    assert_equal [ soonest, middle ], first_page.records.to_a
    assert_equal [ later ], second_page.records.to_a
  end

  test "keeps newest-first order for other statuses" do
    older, newer = create_list(:employee, 2)

    assert_equal [ newer, older ], list(filters: { status: "active" }).records.to_a
  end
end
