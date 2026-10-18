module Api
  module SelectOptions
    class CountriesController < ApplicationController
      skip_after_action :verify_policy_scoped

      def index
        countries = ISO3166::Country.all
        countries = countries.select { |country| used_codes.include?(country.alpha2) } if params[:in_use] == "true"
        @countries = countries.sort_by(&:common_name)
      end

      private
        def used_codes
          @used_codes ||= policy_scope(Employee).distinct.pluck(:country).to_set
        end
    end
  end
end
