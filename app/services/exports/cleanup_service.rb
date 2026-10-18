module Exports
  class CleanupService
    def process!
      deleted = Export.expired.delete_all
      Dir.glob(File.join(Dir.tmpdir, "#{GenerateService::TEMPFILE_PREFIX}*")).each do |path|
        File.delete(path) if File.mtime(path) < 1.hour.ago
      end
      deleted
    end
  end
end
