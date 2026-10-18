module EmployeeImports
  module Schema
    COLUMNS = %w[
      employee_code first_name last_name email job_title department country status
      notice_period_start_date notice_period_end_date
      currency annual_ctc annual_base_pay annual_pf annual_other_components
    ].freeze

    AMOUNT_COLUMNS = %w[annual_ctc annual_base_pay annual_pf annual_other_components].freeze
    DATE_COLUMNS = %w[notice_period_start_date notice_period_end_date].freeze

    EXAMPLE_ROW = [
      "ACME-00125", "Priya", "Sharma", "priya@example.com", "Software Engineer", "Engineering", "India",
      "active", "", "", "INR", "1800000.00", "1200000.00", "144000.00", "456000.00"
    ].freeze

    MAX_ROWS = Integer(ENV.fetch("EMPLOYEE_IMPORT_MAX_ROWS", 10_000))
    MAX_FILE_SIZE = Integer(ENV.fetch("EMPLOYEE_IMPORT_MAX_FILE_MB", 5)).megabytes
    MAX_ERRORS = 500
    PREVIEW_ROWS = 50
    CODE_MAX_LENGTH = 50
    RESERVED_CODE_PREFIX = "#{Employee::CODE_PREFIX}-".freeze
    BATCH_SIZE = 1_000
    TEMPLATE_FILENAME = "employee-import-template.csv"
  end
end
