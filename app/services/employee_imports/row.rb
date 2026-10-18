module EmployeeImports
  class Row
    AMOUNT_FORMAT = /\A\d{1,13}(\.\d{1,2})?\z/
    DATE_FORMAT = /\A\d{4}-\d{2}-\d{2}\z/
    TEXT_COLUMNS = %w[employee_code first_name last_name email job_title].freeze
    COUNTRY_CODES = ISO3166::Country.all.each_with_object({}) { |country, codes|
      [ country.alpha2, country.common_name, country.iso_short_name ].compact.each { |key| codes[key.downcase] = country.alpha2 }
    }.freeze
    MODEL_ERROR_COLUMNS = (Schema::COLUMNS.to_h { |column| [ column.to_sym, column ] })
      .merge(Schema::AMOUNT_COLUMNS.to_h { |column| [ :"salary.#{column}", column ] })
      .merge(notice_period_started_at: "notice_period_start_date", notice_period_ends_at: "notice_period_end_date")
      .freeze
    SKIPPED_MODEL_ERRORS = %i[salary.currency salary.employee].freeze

    attr_reader :number, :values, :field_count, :errors, :employee_attributes, :salary_attributes, :department_name, :country_name


    def initialize(parsed_row, departments:, effective_from:)
      @number = parsed_row.number
      @values = parsed_row.values.transform_values { |value| value&.strip.presence }
      @field_count = parsed_row.field_count
      @departments = departments
      @effective_from = effective_from
      @errors = []
    end

    def validate
      return tap { add_error(nil, :wrong_field_count, count: field_count, expected: Schema::COLUMNS.size) } if field_count != Schema::COLUMNS.size

      @start_date = date("notice_period_start_date")
      @end_date = date("notice_period_end_date")
      @employee = Employee.new(employee_attributes_from_values)
      employee.build_salary(salary_attributes_from_values)
      validate_employee_code
      validate_currency
      validate_notice_period
      employee.valid?(:import)
      merge_model_errors
      keep_attributes
      self
    end

    def employee_code
      employee_attributes&.fetch("employee_code")
    end

    def email
      employee_attributes&.fetch("email")
    end

    def invalid?
      errors.any?
    end

    def error_on?(column)
      errors.any? { |error| error.column == column }
    end

    def add_error(column, key, **options)
      message = key.is_a?(Symbol) ? I18n.t("employee_imports.errors.#{key}", **options) : key
      errors << RowError.new(row: number, column:, message:)
    end

    private
      attr_reader :departments, :effective_from, :employee, :start_date, :end_date

      def keep_attributes
        @employee_attributes = employee.attributes.except("id", "employee_number", "created_at", "updated_at")
        @salary_attributes = employee.salary.attributes.except("id", "employee_id", "created_at", "updated_at")
        @department_name = employee.department&.name
        @country_name = employee.country_name
        @employee = nil
      end

      def employee_attributes_from_values
        values.slice(*TEXT_COLUMNS).merge(
          department: department,
          country: country_code,
          status: status,
          notice_period_started_at: start_date&.beginning_of_day,
          notice_period_ends_at: end_date&.end_of_day
        )
      end

      def salary_attributes_from_values
        Schema::AMOUNT_COLUMNS.to_h { |column| [ column, amount(column) ] }.merge(effective_from:)
      end

      def department
        name = values["department"]
        return blank_error("department") if name.nil?

        departments.fetch(name.squish.downcase) do
          add_error("department", :unknown_department, name:)
          nil
        end
      end

      def country_code
        value = values["country"]
        return if value.nil?

        COUNTRY_CODES.fetch(value.downcase) do
          add_error("country", :unknown_country, country: value)
          nil
        end
      end

      def status
        value = values["status"]&.downcase
        return blank_error("status") if value.nil?
        return value if Employee.statuses.key?(value)

        add_error("status", :invalid_status, statuses: Employee.statuses.keys.join(", "))
        nil
      end

      def date(column)
        value = values[column]
        return if value.nil?
        return Date.iso8601(value) if value.match?(DATE_FORMAT) && Date.valid_date?(*value.split("-").map(&:to_i))

        add_error(column, :invalid_date)
        nil
      end

      def amount(column)
        value = values[column]
        return blank_error(column) if value.nil?
        return BigDecimal(value) if value.match?(AMOUNT_FORMAT)

        add_error(column, :invalid_amount)
        nil
      end

      def blank_error(column)
        add_error(column, I18n.t("errors.messages.blank"))
        nil
      end

      def validate_employee_code
        code = values["employee_code"]
        return if code.nil?

        add_error("employee_code", :code_too_long, max: Schema::CODE_MAX_LENGTH) if code.length > Schema::CODE_MAX_LENGTH
        add_error("employee_code", :reserved_code, prefix: Schema::RESERVED_CODE_PREFIX) if code.upcase.start_with?(Schema::RESERVED_CODE_PREFIX)
      end

      def validate_currency
        currency = values["currency"]&.upcase
        return blank_error("currency") if currency.nil?
        return if employee.country.nil? || currency == employee.currency_code

        add_error("currency", :currency_mismatch, expected: employee.currency_code, country: employee.country_name)
      end

      def validate_notice_period
        return if employee.status.nil? || error_on?("notice_period_start_date") || error_on?("notice_period_end_date")

        case employee.status
        when "active" then validate_active_dates
        when "notice_period" then validate_notice_dates
        when "inactive" then validate_inactive_dates
        end
      end

      def validate_active_dates
        add_error("notice_period_start_date", :must_be_blank_when_active) if start_date
        add_error("notice_period_end_date", :must_be_blank_when_active) if end_date
      end

      def validate_notice_dates
        add_error("notice_period_start_date", :required_for_notice) unless start_date
        add_error("notice_period_end_date", :required_for_notice) unless end_date
        return unless start_date && end_date

        today = Date.current
        add_error("notice_period_start_date", :start_in_future) if start_date > today
        return add_error("notice_period_end_date", :end_before_start) if end_date < start_date

        add_error("notice_period_end_date", :notice_already_ended) if end_date < today
        add_error("notice_period_end_date", :notice_too_long, max: Employee::NOTICE_PERIOD_MAX_DAYS) if (end_date - start_date) > Employee::NOTICE_PERIOD_MAX_DAYS
      end

      def validate_inactive_dates
        return if start_date.nil? && end_date.nil?
        return add_error(start_date ? "notice_period_end_date" : "notice_period_start_date", :both_dates_or_neither) if start_date.nil? || end_date.nil?
        return add_error("notice_period_end_date", :end_before_start) if end_date < start_date

        add_error("notice_period_end_date", :inactive_end_in_future) if end_date > Date.current
      end

      def merge_model_errors
        employee.errors.each do |error|
          next if SKIPPED_MODEL_ERRORS.include?(error.attribute)

          column = MODEL_ERROR_COLUMNS[error.attribute]
          next if column && error_on?(column)

          add_error(column, error.message)
        end
      end
  end
end
