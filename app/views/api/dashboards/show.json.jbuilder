json.dashboard do
  json.counts @dashboard.counts
  json.leaving_soon_days Employees::DashboardService::LEAVING_SOON_DAYS
  json.departments @dashboard.departments do |row|
    json.extract! row, :id, :name, :active, :notice_period, :current
  end
  json.upcoming_departures @dashboard.upcoming_departures do |employee|
    json.extract! employee, :id, :employee_code, :first_name, :last_name, :notice_period_ends_at
    json.department employee.department.name
  end
end
