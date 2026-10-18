json.extract! employee, :id, :employee_code, :first_name, :last_name, :email, :job_title, :country,
  :country_name, :status, :notice_period_started_at, :notice_period_ends_at, :created_at, :updated_at

json.department do
  json.partial! "api/departments/department", department: employee.department
end

if employee.salary
  json.salary do
    json.extract! employee.salary, :currency, :annual_ctc, :annual_base_pay, :annual_pf, :annual_other_components,
      :effective_from
  end
else
  json.salary nil
end
