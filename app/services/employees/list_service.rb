module Employees
  class ListService
    DEFAULT_PER_PAGE = 25
    MAX_PER_PAGE = 100
    SEARCH_COLUMNS = [
      "employees.first_name",
      "employees.last_name",
      "employees.first_name || ' ' || employees.last_name",
      "employees.email",
      "employees.employee_code"
    ].freeze

    Page = Data.define(:records, :page, :per_page, :total_count) do
      def total_pages
        (total_count.to_f / per_page).ceil
      end
    end

    attr_reader :scope, :page, :per_page, :filters

    def initialize(scope, page: nil, per_page: nil, filters: {})
      @scope = scope
      @page = [ page.to_i, 1 ].max
      @per_page = per_page.present? ? per_page.to_i.clamp(1, MAX_PER_PAGE) : DEFAULT_PER_PAGE
      @filters = filters.to_h.symbolize_keys.transform_values { |value| value.to_s.strip }.compact_blank
    end

    def process!
      matching = filtered_scope
      records = matching.includes(:salary, :department).order(*ordering).offset((page - 1) * per_page).limit(per_page)
      Page.new(records:, page:, per_page:, total_count: matching.count)
    end

    private
      def ordering
        newest_first = { employee_number: :desc }
        return [ newest_first ] unless filters[:status] == "notice_period"

        [ Employee.arel_table[:notice_period_ends_at].asc.nulls_last, newest_first ]
      end

      def filtered_scope
        result = scope
        result = result.where(status: filters[:status]) if Employee.statuses.key?(filters[:status])
        result = result.where(department_id: filters[:department_id]) if filters[:department_id]
        result = result.where(country: filters[:country].upcase) if filters[:country]
        result = search(result, filters[:q]) if filters[:q]
        result
      end

      def search(relation, query)
        pattern = "%#{Employee.sanitize_sql_like(query)}%"
        relation.where(SEARCH_COLUMNS.map { |column| "#{column} ILIKE :pattern" }.join(" OR "), pattern:)
      end
  end
end
