module Employees
  class FilterService
    KEYS = %i[q status department_id country leaving_within min_salary].freeze
    LEAVING_WITHIN_DAYS = (1..Employee::NOTICE_PERIOD_MAX_DAYS).freeze
    SEARCH_COLUMNS = [
      "employees.first_name",
      "employees.last_name",
      "employees.first_name || ' ' || employees.last_name",
      "employees.email",
      "employees.employee_code"
    ].freeze

    attr_reader :scope, :filters

    def self.normalize(filters)
      filters.to_h.symbolize_keys.slice(*KEYS).transform_values { |value| value.to_s.strip }.compact_blank
    end

    def initialize(scope, filters = {})
      @scope = scope
      @filters = self.class.normalize(filters)
    end

    def process!
      matching.order(*ordering)
    end

    def matching
      result = scope
      result = result.where(status: filters[:status]) if Employee.statuses.key?(filters[:status])
      result = result.where(department_id: filters[:department_id]) if filters[:department_id]
      result = result.where(country: filters[:country].upcase) if filters[:country]
      result = search(result, filters[:q]) if filters[:q]
      result = result.leaving_within(leaving_within_days) if leaving_within_days
      result = result.joins(:salary).where(salaries: { annual_ctc: min_salary.. }) if min_salary
      result
    end

    private
      def min_salary
        value = BigDecimal(filters[:min_salary], exception: false)
        value if value && value >= 0
      end

      def ordering
        newest_first = { employee_number: :desc }
        return [ newest_first ] unless filters[:status] == "notice_period" || leaving_within_days

        [ Employee.arel_table[:notice_period_ends_at].asc.nulls_last, newest_first ]
      end

      def leaving_within_days
        days = Integer(filters[:leaving_within], exception: false)
        days if LEAVING_WITHIN_DAYS.cover?(days)
      end

      def search(relation, query)
        pattern = "%#{Employee.sanitize_sql_like(query)}%"
        relation.where(SEARCH_COLUMNS.map { |column| "#{column} ILIKE :pattern" }.join(" OR "), pattern:)
      end
  end
end
