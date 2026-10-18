module Api
  class DepartmentsController < ApplicationController
    def index
      ::Employees::ExpireNoticePeriodsService.new.process!
      @departments = ::Departments::StatsService.new(policy_scope(Department)).process!
    end

    def create
      authorize Department
      @department = ::Departments::CreateService.new(params.require(:department).permit(:name)).process!
      render :show, status: :created
    end
  end
end
