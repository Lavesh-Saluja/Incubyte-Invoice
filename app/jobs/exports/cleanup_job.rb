module Exports
  class CleanupJob < ApplicationJob
    queue_as :default

    def perform
      CleanupService.new.process!
    end
  end
end
