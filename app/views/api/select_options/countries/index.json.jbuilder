json.countries @countries do |country|
  json.code country.alpha2
  json.name country.common_name
  json.currency country.currency_code
end
