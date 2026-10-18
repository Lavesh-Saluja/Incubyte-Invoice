require "test_helper"

class Exports::CreateServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  setup { @user = create(:user) }

  def create_export(filters = {})
    Exports::CreateService.new(@user, filters).process!
  end

  test "queues an export of the given filters, dropping blank and unknown ones" do
    export = nil
    assert_enqueued_with(job: Exports::GenerateJob) do
      export = create_export(status: "active", country: " IN ", q: "", page: "2")
    end

    assert export.queued?
    assert_equal({ "status" => "active", "country" => "IN" }, export.filters)
    assert_equal @user, export.user
  end

  test "cancels the user's running export and deletes its partial file" do
    running = create(:export, :processing, user: @user)
    create(:export_file, export: running)
    finished = create(:export, :completed, user: @user)
    someone_elses = create(:export, :processing)

    create_export

    assert running.reload.cancelled?
    assert_not ExportFile.exists?(export_id: running.id)
    assert finished.reload.completed?
    assert someone_elses.reload.processing?
  end
end
