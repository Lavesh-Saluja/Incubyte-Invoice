module Employees
  class UpdateService
    attr_reader :employee, :params

    def initialize(employee, params)
      @employee = employee
      @params = params
    end

    def process!
      employee.update!(params)
      employee
    end
  end
end
