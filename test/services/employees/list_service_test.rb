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
end
