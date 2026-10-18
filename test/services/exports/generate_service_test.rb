require "test_helper"
require "csv"

class Exports::GenerateServiceTest < ActiveSupport::TestCase
  def generate(export)
    Exports::GenerateService.new(export).process!
    export.reload
  end

  def rows(export)
    CSV.parse(export.file.content, headers: true)
  end

  test "writes every matching employee with their salary, in list order" do
    finance = create(:department, name: "Finance")
    older = create(:employee, first_name: "Older", department: finance, country: "IN")
    newer = create(:employee, :with_salary, first_name: "Newer", department: finance, country: "IN")
    create(:employee, country: "DE")

    export = generate(create(:export, filters: { "country" => "IN" }))

    assert export.completed?
    assert_equal [ 2, 2 ], [ export.total_rows, export.processed_rows ]
    assert_equal [ newer.employee_code, older.employee_code ], rows(export).map { |row| row["Employee code"] }
    newest = rows(export).first
    assert_equal [ "Newer", "Finance", "India", "Active", "INR" ],
      newest.to_h.values_at("First name", "Department", "Country", "Status", "Salary currency")
    assert_equal "1800000.00", newest["Annual CTC"]
    assert_equal "2026-04-01", newest["Salary effective from"]
    assert_nil rows(export).to_a.last[11]
  end

  test "includes the headers for every column" do
    export = generate(create(:export))

    assert_equal Exports::CsvRow.headers, CSV.parse(export.file.content).first
    assert_equal 18, Exports::CsvRow.headers.size
  end

  test "orders employees on notice by their notice end date" do
    later = create(:employee, :on_notice, notice_period_ends_at: 20.days.from_now)
    sooner = create(:employee, :on_notice, notice_period_ends_at: 2.days.from_now)

    export = generate(create(:export, filters: { "status" => "notice_period" }))

    assert_equal [ sooner, later ].map(&:employee_code), rows(export).map { |row| row["Employee code"] }
  end

  test "neutralises values that a spreadsheet would run as formulas" do
    create(:employee, first_name: "=HYPERLINK(\"http://evil\")", last_name: "+1", job_title: "-2", email: "x@acme.test")

    row = rows(generate(create(:export))).first

    assert_equal [ "'=HYPERLINK(\"http://evil\")", "'+1", "'-2" ], row.to_h.values_at("First name", "Last name", "Job title")
  end

  test "stops and stores nothing when the export is cancelled part way" do
    stub_const_batch_size(1) do
      create_list(:employee, 3)
      export = create(:export)
      calls = 0
      service = Exports::GenerateService.new(export)
      service.define_singleton_method(:cancelled?) { (calls += 1) > 1 }

      service.process!

      assert_not ExportFile.exists?(export_id: export.id)
      assert_not export.reload.completed?
    end
  end

  test "marks the export failed when something goes wrong" do
    create(:employee)
    export = create(:export)

    Exports::CsvRow.stub(:headers, -> { raise "boom" }) { generate(export) }

    assert export.failed?
    assert_equal "The export could not be completed. Please try again", export.error_message
  end

  test "deletes its temporary file, also when the export fails" do
    create(:employee)
    paths = []
    original_new = Tempfile.method(:new)
    tracking_new = ->(*args, **kwargs) { original_new.call(*args, **kwargs).tap { |file| paths << file.path } }

    Tempfile.stub(:new, tracking_new) do
      generate(create(:export))
      Exports::CsvRow.stub(:headers, -> { raise "boom" }) { generate(create(:export)) }
    end

    assert_equal 2, paths.size
    assert paths.none? { |path| File.exist?(path) }
  end

  test "does nothing for an export that is no longer active" do
    export = create(:export, status: :cancelled)

    generate(export)

    assert export.cancelled?
    assert_nil export.total_rows
  end

  private
    def stub_const_batch_size(size)
      original = Export::BATCH_SIZE
      Export.send(:remove_const, :BATCH_SIZE)
      Export.const_set(:BATCH_SIZE, size)
      yield
    ensure
      Export.send(:remove_const, :BATCH_SIZE)
      Export.const_set(:BATCH_SIZE, original)
    end
end
