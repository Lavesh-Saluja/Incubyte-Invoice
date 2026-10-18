module Api
  class ExportsController < ApplicationController
    before_action :load_export, only: %i[show download]

    def index
      @exports = policy_scope(Export).recent.order(created_at: :desc)
    end

    def show
    end

    def create
      authorize Export
      @export = ::Exports::CreateService.new(current_user, filter_params).process!
      render :show, status: :accepted
    end

    def download
      return render_error(I18n.t("exports.errors.unavailable"), :gone) unless @export.downloadable?

      send_data @export.file.content, filename: @export.filename, type: @export.file.content_type, disposition: :attachment
    end

    private
      def load_export
        @export = policy_scope(Export).find(params[:id])
        authorize @export, action_name == "download" ? :download? : :show?
      end

      def filter_params
        params.fetch(:export, {}).fetch(:filters, {}).permit(*::Employees::FilterService::KEYS)
      end
  end
end
