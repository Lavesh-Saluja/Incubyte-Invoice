# Idempotent demo data for local development. Run with: bin/rails db:seed
# Skipped in production: `db:prepare` seeds automatically when it creates a new database.
return if Rails.env.production?

[
  { name: "First sample item", description: "Created by db/seeds.rb" },
  { name: "Second sample item" }
].each do |attributes|
  SampleItem.find_or_create_by!(name: attributes[:name]) do |item|
    item.description = attributes[:description]
  end
end
