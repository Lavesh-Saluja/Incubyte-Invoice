module Api
  module Employees
    class NoticePeriodsController < ApplicationController
      before_action :load_employee

      def create
        authorize @employee, :start_notice_period?
        ::Employees::StartNoticePeriodService.new(@employee, days: params.dig(:notice_period, :days)).process!
        render "api/employees/show"
      end

      def destroy
        authorize @employee, :remove_notice_period?
        ::Employees::RemoveNoticePeriodService.new(@employee).process!
        render "api/employees/show"
      end

      private
        def load_employee
          ::Employees::ExpireNoticePeriodsService.new.process!
          @employee = Employee.find(params[:employee_id])
        end
    end
  end
end
