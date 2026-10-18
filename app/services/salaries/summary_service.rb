module Salaries
  class SummaryService
    Summary = Data.define(:country, :countries, :departments)
    Row = Data.define(:key, :name, :currency, :employees, :median_ctc, :average_ctc, :min_ctc, :max_ctc)

    STATS = [
      "COUNT(*)",
      "ROUND(CAST(percentile_cont(0.5) WITHIN GROUP (ORDER BY salaries.annual_ctc) AS numeric), 2)",
      "ROUND(AVG(salaries.annual_ctc), 2)",
      "MIN(salaries.annual_ctc)",
      "MAX(salaries.annual_ctc)"
    ].map { |sql| Arel.sql(sql) }.freeze

    attr_reader :scope, :requested_country

    def initialize(scope, country: nil)
      @scope = scope
      @requested_country = country.to_s.strip.upcase.presence
    end

    def process!
      Employees::ExpireNoticePeriodsService.new.process!

      countries = country_rows
      country = countries.find { |row| row.key == requested_country } || countries.first
      Summary.new(country: country&.key, countries:, departments: country ? department_rows(country) : [])
    end

    private
      def current
        scope.where(status: %w[active notice_period]).joins(:salary)
      end

      def country_rows
        current.group("employees.country", "salaries.currency")
          .pluck(Arel.sql("employees.country"), Arel.sql("salaries.currency"), *STATS)
          .map { |code, currency, *stats| Row.new(code, Employee::COUNTRIES[code]&.common_name || code, currency, *stats) }
          .sort_by { |row| [ -row.employees, row.name ] }
      end

      def department_rows(country)
        current.joins(:department).where(country: country.key, salaries: { currency: country.currency })
          .group("departments.id", "departments.name")
          .pluck(Arel.sql("departments.id"), Arel.sql("departments.name"), *STATS)
          .map { |id, name, *stats| Row.new(id, name, country.currency, *stats) }
          .sort_by { |row| [ -row.employees, row.name.downcase ] }
      end
  end
end
