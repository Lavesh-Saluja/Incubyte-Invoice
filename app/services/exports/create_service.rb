module Exports
  class CreateService
    attr_reader :user, :filters

    def initialize(user, filters)
      @user = user
      @filters = filters
    end

    def process!
      export = Export.transaction do
        cancel_active_exports
        user.exports.create!(filters: Employees::FilterService.normalize(filters))
      end
      GenerateJob.perform_later(export.id)
      export
    end

    private
      def cancel_active_exports
        user.exports.active.find_each do |export|
          export.file&.delete
          export.update!(status: :cancelled, completed_at: Time.current)
        end
      end
  end
end
