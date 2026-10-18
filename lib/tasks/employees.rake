namespace :employees do
  desc "Top up demo employees with salaries to COUNT (default 10000). Safe to run again: only missing ones are added"
  task seed_demo: :environment do
    count = Integer(ENV.fetch("COUNT", 10_000))
    created = Employees::SeedService.new(count:).process!
    puts "employees:seed_demo: added #{created} demo employees (target #{count})"
  end
end
