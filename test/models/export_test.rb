require "test_helper"

class ExportTest < ActiveSupport::TestCase
  test "starts queued with no progress" do
    export = create(:export)

    assert export.queued?
    assert_equal 0, export.progress
  end

  test "reports progress as a percentage of rows processed, reaching 100 only when completed" do
    assert_equal 42, build(:export, :processing, total_rows: 1000, processed_rows: 420).progress
    assert_equal 99, build(:export, :processing, total_rows: 10, processed_rows: 10).progress
    assert_equal 100, build(:export, status: :completed, total_rows: 0).progress
  end

  test "accepts only known statuses, in the model and the database" do
    assert_includes build(:export, status: "paused").tap(&:validate).errors[:status], "is not included in the list"
    assert_raises(ActiveRecord::StatementInvalid) do
      Export.insert_all!([ { user_id: create(:user).id, status: "paused" } ])
    end
  end

  test "is downloadable only when completed, unexpired and with a stored file" do
    completed = create(:export, :completed)

    assert completed.downloadable?
    assert_not create(:export, :processing).downloadable?
    travel Export::RETENTION + 1.minute
    assert_not completed.downloadable?
  end

  test "expires 24 hours after it was requested" do
    export = create(:export)

    assert_in_delta export.created_at + 24.hours, export.expires_at, 1.second
  end

  test "selects active, recent and expired exports" do
    queued = create(:export)
    processing = create(:export, :processing)
    completed = create(:export, :completed)
    old = travel_to(25.hours.ago) { create(:export) }

    assert_equal [ queued, processing ].sort_by(&:id), Export.active.excluding(old).sort_by(&:id)
    assert_equal [ queued, processing, completed ].sort_by(&:id), Export.recent.sort_by(&:id)
    assert_equal [ old ], Export.expired.to_a
  end

  test "names the file after when it was requested" do
    export = travel_to(Time.zone.local(2026, 10, 18, 15, 42)) { create(:export) }

    assert_equal "employees-2026-10-18-1542.csv", export.filename
  end

  test "removes its file with it" do
    export = create(:export, :completed)

    export.destroy!

    assert_not ExportFile.exists?(export_id: export.id)
  end
end
