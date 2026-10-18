json.settings do
  json.notice_period_days @notice_period_days
  json.notice_period_max_days Employee::NOTICE_PERIOD_MAX_DAYS
  json.import_max_rows EmployeeImports::Schema::MAX_ROWS
  json.import_max_file_mb EmployeeImports::Schema::MAX_FILE_SIZE / 1.megabyte
end
