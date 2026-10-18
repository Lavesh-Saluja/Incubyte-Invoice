module Api
  class EmployeesController < ApplicationController
    PERMITTED_ATTRIBUTES = %i[first_name last_name email department job_title country].freeze
    SALARY_ATTRIBUTES = %i[annual_ctc annual_base_pay annual_pf annual_other_components effective_from].freeze

    before_action :expire_notice_periods
    before_action :load_employee, only: %i[show update]

    def index
      @page = ::Employees::ListService.new(policy_scope(Employee), page: params[:page], per_page: params[:per_page]).process!
    end

    def show
    end

    def create
      authorize Employee
      @employee = ::Employees::CreateService.new(employee_params).process!
      render :show, status: :created
    end

    def update
      ::Employees::UpdateService.new(@employee, employee_params).process!
      render :show
    end

    private
      def expire_notice_periods
        ::Employees::ExpireNoticePeriodsService.new.process!
      end

      def load_employee
        @employee = Employee.find(params[:id])
        authorize @employee
      end

      def employee_params
        attributes = params.require(:employee).permit(*PERMITTED_ATTRIBUTES, salary: SALARY_ATTRIBUTES)
        salary = attributes.delete(:salary)
        salary ? attributes.merge(salary_attributes: salary) : attributes
      end
  end
end
