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
    india_finance = create(:employee, department: "Finance", country: "IN")
    create(:employee, department: "Finance", country: "DE")
    create(:employee, :inactive, department: "Finance", country: "IN")
    create(:employee, department: "Sales", country: "IN")

    page = list(filters: { status: "active", department: "Finance", country: "in" })

    assert_equal [ india_finance ], page.records.to_a
    assert_equal 1, page.total_count
  end

  test "combines search with filters and paginates the matches" do
    create_list(:employee, 3, first_name: "Asha", department: "Finance")
    create(:employee, first_name: "Asha", department: "Sales")

    page = list(filters: { q: "asha", department: "Finance" }, per_page: 2)

    assert_equal [ 3, 2, 2 ], [ page.total_count, page.total_pages, page.records.size ]
  end

  test "ignores blank filters and unknown statuses" do
    create_list(:employee, 2)

    assert_equal 2, list(filters: { q: "  ", status: "retired", department: "" }).total_count
  end
end
