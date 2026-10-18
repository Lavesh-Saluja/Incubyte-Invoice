json.import do
  json.partial! "api/employee_imports/result", result: @result
  json.employees_created @result.total_rows
  json.salaries_created @result.total_rows
end
