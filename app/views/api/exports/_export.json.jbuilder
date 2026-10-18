json.extract! export, :id, :status, :progress, :total_rows, :processed_rows, :error_message, :filename,
  :created_at, :started_at, :completed_at, :expires_at
json.downloadable export.downloadable?
json.filter_values export.filters
json.filters do
  json.status export.filters["status"]
  json.department Department.find_by(id: export.filters["department_id"])&.name
  json.country ISO3166::Country[export.filters["country"]]&.common_name
  json.q export.filters["q"]
end
