# Idempotent demo data for local development. Run with: bin/rails db:seed
# Development only: `db:prepare` seeds automatically when it creates a new database,
# and seed rows in the test database would break tests that count records.
return unless Rails.env.development?

hr_email = "hr@acme.test"
hr_password = "password1234"
result = Users::ProvisionHrService.new(name: "HR Manager", email: hr_email, password: hr_password).process!
puts "Local HR account #{result == :created ? "created" : "already exists"}: #{hr_email} / #{hr_password}"

created = Employees::SeedService.new.process!
puts "Demo employees: added #{created}, #{Employee.where("email LIKE ?", "%@#{Employees::SeedService::EMAIL_DOMAIN}").count} in total"
