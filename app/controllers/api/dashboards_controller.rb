module Api
  class DashboardsController < ApplicationController
    def show
      authorize :dashboard
      @dashboard = ::Employees::DashboardService.new(policy_scope(Employee)).process!
    end
  end
end
