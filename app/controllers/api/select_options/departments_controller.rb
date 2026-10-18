module Api
  module SelectOptions
    class DepartmentsController < ApplicationController
      def index
        @departments = policy_scope(Department).order(:name)
      end
    end
  end
end
