module Employees
  class UpdateService
    include ActiveModel::Validations

    delegate :status, to: :employee

    attr_reader :employee, :params

    validate :employee_must_not_be_inactive

    def initialize(employee, params)
      @employee = employee
      @params = params
    end

    def process!
      validate!

      employee.update!(params)
      employee
    end

    private
      def employee_must_not_be_inactive
        errors.add(:status, :inactive_not_editable) if employee.inactive?
      end
  end
end
