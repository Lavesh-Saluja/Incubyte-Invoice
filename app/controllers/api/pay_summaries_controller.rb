module Api
  class PaySummariesController < ApplicationController
    def show
      authorize :pay_summary
      @summary = ::Salaries::SummaryService.new(policy_scope(Employee), country: params[:country]).process!
    end
  end
end
