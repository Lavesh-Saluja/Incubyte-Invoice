json.dashboard do
  json.counts @dashboard.counts
  json.leaving_soon_days Employees::DashboardService::LEAVING_SOON_DAYS
  json.departments @dashboard.departments
  json.upcoming_departures @dashboard.upcoming_departures do |employee|
    json.extract! employee, :id, :employee_code, :first_name, :last_name, :department, :notice_period_ends_at
  end
end
