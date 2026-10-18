require "test_helper"

class Exports::GenerateJobTest < ActiveJob::TestCase
  test "generates the export" do
    create(:employee)
    export = create(:export)

    Exports::GenerateJob.perform_now(export.id)

    assert export.reload.completed?
  end

  test "ignores an export that no longer exists" do
    assert_nothing_raised { Exports::GenerateJob.perform_now(SecureRandom.uuid) }
  end
end
