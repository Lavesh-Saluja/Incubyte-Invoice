require "test_helper"

class EmployeeImports::ParseServiceTest < ActiveSupport::TestCase
  include EmployeeImportHelpers

  def parse(content, filename: "employees.csv")
    EmployeeImports::ParseService.new(csv_upload(content, filename:)).process!
  end

  def messages(parsed)
    parsed.errors.map(&:message)
  end

  test "reads rows keyed by column, with row numbers as shown in a spreadsheet" do
    parsed = parse(import_csv(import_row(1), import_row(2)))

    assert_empty parsed.errors
    assert_equal [ 2, 3 ], parsed.rows.map(&:number)
    assert_equal "employee1@example.com", parsed.rows.first.values["email"]
  end

  test "accepts the columns in any order, with surrounding spaces, any case and a UTF-8 byte order mark" do
    columns = EmployeeImports::Schema::COLUMNS.reverse
    content = import_csv(import_row, columns:).sub(columns.first, " #{columns.first.upcase} ")
    parsed = parse("\u{FEFF}#{content}")

    assert_empty parsed.errors
    assert_equal "ACME-00001", parsed.rows.first.values["employee_code"]
  end

  test "keeps commas and quotes inside quoted values" do
    parsed = parse(import_csv(import_row(1, job_title: %(Engineer, "Platform"))))

    assert_equal %(Engineer, "Platform"), parsed.rows.first.values["job_title"]
  end

  test "skips blank lines" do
    parsed = parse(import_csv(import_row(1)) + "\n,,,\n" + import_csv(import_row(2)).lines.last)

    assert_equal [ 2, 5 ], parsed.rows.map(&:number)
  end

  test "reports missing, duplicated and unexpected columns" do
    columns = EmployeeImports::Schema::COLUMNS - %w[email] + %w[status nickname]

    assert_equal [
      "The column “email” is missing",
      "The column “status” appears more than once",
      "The column “nickname” is not part of the template"
    ], messages(parse(import_csv(import_row, columns:)))
  end

  test "rejects files that are not .csv" do
    assert_equal [ "The file must be a .csv file" ], messages(parse(import_csv(import_row), filename: "employees.xlsx"))
  end

  test "rejects files that are not UTF-8" do
    assert_match "UTF-8", messages(parse(import_csv(import_row).encode("UTF-16LE"))).sole
  end

  test "rejects malformed CSV" do
    assert_equal [ "The file is not valid CSV near line 3. Check for unclosed quotes" ],
      messages(parse(import_csv(import_row) + %(ACME-2,"Unclosed\n)))
  end

  test "rejects empty files and files without employees" do
    assert_equal [ "The file is empty" ], messages(parse(""))
    assert_equal [ "The file has a header row but no employees" ], messages(parse(import_csv))
  end

  test "rejects files over the size limit" do
    with_import_limit(:MAX_FILE_SIZE, 100) do
      assert_equal [ "The file is larger than 100 Bytes" ], messages(parse(import_csv(import_row)))
    end
  end

  test "rejects files over the row limit" do
    with_import_limit(:MAX_ROWS, 1) do
      assert_equal [ "The file has more than 1 employees. Split it into smaller files" ],
        messages(parse(import_csv(import_row(1), import_row(2))))
    end
  end
end
