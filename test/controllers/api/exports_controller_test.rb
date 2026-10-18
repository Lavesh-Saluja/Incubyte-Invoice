require "test_helper"

class Api::ExportsControllerTest < ActionDispatch::IntegrationTest
  include ActiveJob::TestHelper

  setup do
    Api::SessionsController::RATE_LIMIT_STORE.clear
    @user = create(:user)
    sign_in_as(@user)
  end

  test "starts an export of the current filters" do
    department = create(:department, name: "Finance")

    assert_enqueued_with(job: Exports::GenerateJob) do
      post "/api/exports", params: { export: { filters: { department_id: department.id, country: "IN" } } }, as: :json
    end

    assert_response :accepted
    export = json_response["export"]
    assert_equal [ "queued", 0, false ], export.values_at("status", "progress", "downloadable")
    assert_equal({ "status" => nil, "department" => "Finance", "country" => "India", "q" => nil }, export["filters"])
    assert_equal({ "department_id" => department.id, "country" => "IN" }, export["filter_values"])
  end

  test "starting a new export cancels the one in progress" do
    running = create(:export, :processing, user: @user)

    post "/api/exports", params: { export: { filters: {} } }, as: :json

    assert running.reload.cancelled?
  end

  test "lists the user's exports from the last 24 hours, newest first" do
    older = create(:export, :completed, user: @user)
    newer = create(:export, user: @user)
    travel_to(25.hours.ago) { create(:export, user: @user) }
    create(:export)

    get "/api/exports"

    assert_equal [ newer.id, older.id ], json_response["exports"].pluck("id")
  end

  test "shows an export's progress" do
    export = create(:export, :processing, user: @user)

    get "/api/exports/#{export.id}"

    assert_equal [ "processing", 50, 500, 1000 ],
      json_response["export"].values_at("status", "progress", "processed_rows", "total_rows")
  end

  test "downloads a completed export as an uncached CSV attachment" do
    export = create(:export, :completed, user: @user)

    get "/api/exports/#{export.id}/download"

    assert_response :ok
    assert_equal "text/csv", response.media_type
    assert_match(/attachment; filename="employees-.*\.csv"/, response.headers["Content-Disposition"])
    assert_equal "no-store", response.headers["Cache-Control"]
    assert_equal export.file.content, response.body
  end

  test "responds 410 for an export that is not ready or has expired" do
    running = create(:export, :processing, user: @user)
    get "/api/exports/#{running.id}/download"
    assert_response :gone

    expired = create(:export, :completed, user: @user)
    travel Export::RETENTION + 1.minute
    sign_in_as(@user)
    get "/api/exports/#{expired.id}/download"
    assert_response :gone
    assert_equal "This export is no longer available. Please export again", json_response["error"]
  end

  test "does not reveal or download another user's export" do
    other = create(:export, :completed)

    get "/api/exports/#{other.id}"
    assert_response :not_found
    get "/api/exports/#{other.id}/download"
    assert_response :not_found
  end

  test "requires sign-in" do
    export = create(:export, :completed, user: @user)
    delete "/api/session"

    get "/api/exports"
    assert_response :unauthorized
    post "/api/exports", params: { export: { filters: {} } }, as: :json
    assert_response :unauthorized
    get "/api/exports/#{export.id}/download"
    assert_response :unauthorized
  end
end
