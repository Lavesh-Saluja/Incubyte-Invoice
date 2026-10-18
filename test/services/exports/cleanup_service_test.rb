require "test_helper"

class Exports::CleanupServiceTest < ActiveSupport::TestCase
  test "deletes exports older than 24 hours with their files and keeps recent ones" do
    old = travel_to(25.hours.ago) { create(:export, :completed) }
    recent = create(:export, :completed)

    Exports::CleanupService.new.process!

    assert_not Export.exists?(old.id)
    assert_not ExportFile.exists?(export_id: old.id)
    assert Export.exists?(recent.id)
  end

  test "removes temporary export files left behind for over an hour" do
    stale = File.join(Dir.tmpdir, "#{Exports::GenerateService::TEMPFILE_PREFIX}-stale.csv")
    fresh = File.join(Dir.tmpdir, "#{Exports::GenerateService::TEMPFILE_PREFIX}-fresh.csv")
    File.write(stale, "x")
    File.write(fresh, "x")
    File.utime(2.hours.ago.to_time, 2.hours.ago.to_time, stale)

    Exports::CleanupService.new.process!

    assert_not File.exist?(stale)
    assert File.exist?(fresh)
  ensure
    FileUtils.rm_f([ stale, fresh ])
  end
end
