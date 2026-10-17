json.employee do
  json.partial! "api/employees/employee", employee: @employee
end
