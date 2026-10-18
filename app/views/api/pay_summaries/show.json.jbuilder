json.pay_summary do
  json.country @summary.country
  json.countries @summary.countries do |row|
    json.code row.key
    json.partial! "api/pay_summaries/row", row:
  end
  json.departments @summary.departments do |row|
    json.id row.key
    json.partial! "api/pay_summaries/row", row:
  end
end
