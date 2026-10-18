ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/mock"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Build records with factories from test/factories, e.g. create(:employee)
    include FactoryBot::Syntax::Methods
  end
end

module EmployeeImportHelpers
  IMPORT_ROW = {
    "employee_code" => "ACME-00125", "first_name" => "Priya", "last_name" => "Sharma", "email" => "priya@example.com",
    "job_title" => "Software Engineer", "department" => "Engineering", "country" => "India", "status" => "active",
    "notice_period_start_date" => "", "notice_period_end_date" => "", "currency" => "INR",
    "annual_ctc" => "1800000.00", "annual_base_pay" => "1200000.00", "annual_pf" => "144000.00", "annual_other_components" => "456000.00"
  }.freeze

  def import_row(number = 1, **overrides)
    IMPORT_ROW.merge(
      "employee_code" => "ACME-#{number.to_s.rjust(5, "0")}", "email" => "employee#{number}@example.com"
    ).merge(overrides.stringify_keys)
  end

  def import_csv(*rows, columns: EmployeeImports::Schema::COLUMNS)
    CSV.generate { |csv| ([ columns ] + rows.map { |row| row.values_at(*columns) }).each { |line| csv << line } }
  end

  def csv_upload(content, filename: "employees.csv")
    Rack::Test::UploadedFile.new(StringIO.new(content.b), "text/csv", original_filename: filename)
  end

  def import_errors(result)
    result.errors.map { |error| [ error.row, error.column, error.message ] }
  end

  def with_import_limit(name, value)
    schema = EmployeeImports::Schema
    original = schema.const_get(name)
    schema.send(:remove_const, name)
    schema.const_set(name, value)
    yield
  ensure
    schema.send(:remove_const, name)
    schema.const_set(name, original)
  end
end

module ActionDispatch
  class IntegrationTest
    def json_response
      JSON.parse(response.body)
    end

    def sign_in_as(user, password: "correct-horse-battery")
      post "/api/session", params: { session: { email: user.email, password: } }, as: :json
      assert_response :ok, "sign in as #{user.email} failed"
    end
  end
end
