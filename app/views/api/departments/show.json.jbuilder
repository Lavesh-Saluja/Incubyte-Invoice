json.department do
  json.partial! "api/departments/department", department: @department
end
