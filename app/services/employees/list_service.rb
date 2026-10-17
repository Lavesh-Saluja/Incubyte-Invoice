module Employees
  class ListService
    DEFAULT_PER_PAGE = 25
    MAX_PER_PAGE = 100

    Page = Data.define(:records, :page, :per_page, :total_count) do
      def total_pages
        (total_count.to_f / per_page).ceil
      end
    end

    attr_reader :scope, :page, :per_page

    def initialize(scope, page: nil, per_page: nil)
      @scope = scope
      @page = [ page.to_i, 1 ].max
      @per_page = per_page.present? ? per_page.to_i.clamp(1, MAX_PER_PAGE) : DEFAULT_PER_PAGE
    end

    def process!
      records = scope.order(employee_number: :desc).offset((page - 1) * per_page).limit(per_page)
      Page.new(records:, page:, per_page:, total_count: scope.count)
    end
  end
end
