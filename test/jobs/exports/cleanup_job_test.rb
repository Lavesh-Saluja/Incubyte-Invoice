require "test_helper"

class Exports::CleanupJobTest < ActiveJob::TestCase
  test "cleans up expired exports" do
    old = travel_to(25.hours.ago) { create(:export) }

    Exports::CleanupJob.perform_now

    assert_not Export.exists?(old.id)
  end
end
