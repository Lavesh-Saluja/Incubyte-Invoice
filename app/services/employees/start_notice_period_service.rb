module Employees
  class StartNoticePeriodService
    include ActiveModel::Validations

    delegate :status, to: :employee

    attr_reader :employee, :days

    validates :days, numericality: {
      only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: Employee::NOTICE_PERIOD_MAX_DAYS
    }
    validate :employee_must_be_active

    def initialize(employee, days: nil)
      @employee = employee
      @days = days.nil? ? Employee::DEFAULT_NOTICE_PERIOD_DAYS : days
    end

    def process!
      validate!

      starts_at = Time.current
      notice_days = Integer(days)
      employee.update!(
        status: notice_days.zero? ? :inactive : :notice_period,
        notice_period_started_at: starts_at,
        notice_period_ends_at: starts_at + notice_days.days
      )
      employee
    end

    private
      def employee_must_be_active
        errors.add(:status, :must_be_active) unless employee.active?
      end
  end
end
