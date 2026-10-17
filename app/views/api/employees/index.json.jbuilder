json.employees @page.records, partial: "api/employees/employee", as: :employee
json.meta do
  json.page @page.page
  json.per_page @page.per_page
  json.total_count @page.total_count
  json.total_pages @page.total_pages
end
