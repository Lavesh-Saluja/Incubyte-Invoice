module Api
  module SelectOptions
    class DepartmentsController < ApplicationController
      def index
        @departments = policy_scope(Employee).distinct.order(:department).pluck(:department)
      end
    end
  end
end
