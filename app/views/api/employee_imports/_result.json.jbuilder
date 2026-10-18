json.valid result.valid?
json.total_rows result.total_rows
json.valid_rows result.valid_rows
json.invalid_rows result.invalid_rows
json.errors_count result.errors.size
json.errors result.errors.first(EmployeeImports::Schema::MAX_ERRORS) do |error|
  json.extract! error, :row, :column, :message
end
json.preview result.rows.first(EmployeeImports::Schema::PREVIEW_ROWS) do |row|
  json.row row.number
  json.valid !row.invalid?
  json.employee_code row.values["employee_code"]
  json.name [ row.values["first_name"], row.values["last_name"] ].compact.join(" ")
  json.email row.email || row.values["email"]
  json.job_title row.values["job_title"]
  json.department row.department_name || row.values["department"]
  json.country row.country_name || row.values["country"]
  json.status row.values["status"]&.downcase
  json.currency row.values["currency"]&.upcase
  json.annual_ctc row.values["annual_ctc"]
end
