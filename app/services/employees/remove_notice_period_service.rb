module Employees
  class RemoveNoticePeriodService
    include ActiveModel::Validations

    delegate :status, to: :employee

    attr_reader :employee

    validate :employee_must_be_on_notice_or_inactive

    def initialize(employee)
      @employee = employee
    end

    def process!
      validate!

      employee.update!(status: :active, notice_period_started_at: nil, notice_period_ends_at: nil)
      employee
    end

    private
      def employee_must_be_on_notice_or_inactive
        errors.add(:status, :must_be_on_notice_or_inactive) if employee.active?
      end
  end
end
