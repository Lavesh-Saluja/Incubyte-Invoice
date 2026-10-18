module Departments
  class CreateService
    attr_reader :params

    def initialize(params)
      @params = params
    end

    def process!
      Department.create!(params)
    end
  end
end
