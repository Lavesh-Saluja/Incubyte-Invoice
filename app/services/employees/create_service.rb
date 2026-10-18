module Employees
  class CreateService
    include ActiveModel::Validations

    attr_reader :params

    validate :salary_must_be_given

    def initialize(params)
      @params = params
    end

    def salary
      params[:salary_attributes]
    end

    def process!
      validate!

      Employee.create!(params)
    end

    private
      def salary_must_be_given
        errors.add(:salary, :blank) if salary.blank?
      end
  end
end
