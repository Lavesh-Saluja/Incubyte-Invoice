module Api
  class EmployeesController < ApplicationController
    PERMITTED_ATTRIBUTES = %i[first_name last_name email department job_title country].freeze

    before_action :load_employee, only: %i[show update]

    def index
      @page = Employees::ListService.new(policy_scope(Employee), page: params[:page], per_page: params[:per_page]).process!
    end

    def show
    end

    def create
      authorize Employee
      @employee = Employees::CreateService.new(employee_params).process!
      render :show, status: :created
    end

    def update
      Employees::UpdateService.new(@employee, employee_params).process!
      render :show
    end

    private
      def load_employee
        @employee = Employee.find(params[:id])
        authorize @employee
      end

      def employee_params
        params.require(:employee).permit(*PERMITTED_ATTRIBUTES)
      end
  end
end
