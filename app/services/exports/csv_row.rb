module Exports
  class CsvRow
    FORMULA_PREFIXES = [ "=", "+", "-", "@", "\t", "\r" ].freeze
    COLUMNS = %i[
      employee_code first_name last_name email job_title department country status
      notice_period_started_on notice_period_ends_on salary_currency annual_ctc annual_base_pay annual_pf
      annual_other_components salary_effective_from joined_on last_updated_on
    ].freeze

    def self.headers
      COLUMNS.map { |column| I18n.t("exports.columns.#{column}") }
    end

    attr_reader :employee

    def initialize(employee)
      @employee = employee
    end

    def to_a
      values.map { |value| safe(value) }
    end

    private
      def values
        salary = employee.salary
        [
          employee.employee_code, employee.first_name, employee.last_name, employee.email, employee.job_title,
          employee.department.name, employee.country_name, I18n.t("exports.statuses.#{employee.status}"),
          date(employee.notice_period_started_at), date(employee.notice_period_ends_at),
          salary&.currency, amount(salary&.annual_ctc), amount(salary&.annual_base_pay), amount(salary&.annual_pf),
          amount(salary&.annual_other_components), salary&.effective_from&.iso8601,
          date(employee.created_at), date(employee.updated_at)
        ]
      end

      def date(time)
        time&.to_date&.iso8601
      end

      def amount(value)
        value && ActiveSupport::NumberHelper.number_to_rounded(value, precision: 2)
      end

      def safe(value)
        value.is_a?(String) && value.start_with?(*FORMULA_PREFIXES) ? "'#{value}" : value
      end
  end
end
