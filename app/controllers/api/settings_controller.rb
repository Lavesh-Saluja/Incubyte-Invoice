module Api
  class SettingsController < ApplicationController
    skip_after_action :verify_authorized

    def show
      @notice_period_days = Employee::DEFAULT_NOTICE_PERIOD_DAYS
    end
  end
end
