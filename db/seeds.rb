# Idempotent demo data for local development. Run with: bin/rails db:seed
# Development only: `db:prepare` seeds automatically when it creates a new database,
# and seed rows in the test database would break tests that count records.
return unless Rails.env.development?
