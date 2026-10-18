module Exports
  class GenerateJob < ApplicationJob
    queue_as :default

    def perform(export_id)
      export = Export.find_by(id: export_id)
      GenerateService.new(export).process! if export
    end
  end
end
