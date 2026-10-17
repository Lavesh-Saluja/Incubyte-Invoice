# Idempotent demo data for local development. Run with: bin/rails db:seed
# Development only: `db:prepare` seeds automatically when it creates a new database,
# and seed rows in the test database would break tests that count records.
return unless Rails.env.development?

# Local HR account for signing in during development. These credentials are for development only:
# the guard above stops this file from running elsewhere, and production uses users:provision_hr.
hr_email = "hr@acme.test"
hr_password = "password1234"
result = Users::ProvisionHrService.new(name: "HR Manager", email: hr_email, password: hr_password).process!
puts "Local HR account #{result == :created ? "created" : "already exists"}: #{hr_email} / #{hr_password}"
