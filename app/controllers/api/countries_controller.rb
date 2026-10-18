module Api
  class CountriesController < ApplicationController
    skip_after_action :verify_policy_scoped

    def index
      @countries = ISO3166::Country.all.sort_by(&:common_name)
    end
  end
end
