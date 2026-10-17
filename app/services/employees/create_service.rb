module Employees
  class CreateService
    attr_reader :params

    def initialize(params)
      @params = params
    end

    def process!
      Employee.create!(params)
    end
  end
end
