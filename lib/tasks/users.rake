namespace :users do
  desc "Create the HR account from HR_NAME, HR_EMAIL and HR_PASSWORD if it does not exist (never overwrites)"
  task provision_hr: :environment do
    name, email, password = ENV.values_at("HR_NAME", "HR_EMAIL", "HR_PASSWORD")

    if email.blank?
      abort "users:provision_hr: set HR_NAME, HR_EMAIL and HR_PASSWORD to create the HR account" unless User.exists?
      puts "users:provision_hr: HR_EMAIL is not set and an account exists; skipping"
      next
    end

    case Users::ProvisionHrService.new(name:, email:, password:).process!
    when :created then puts "users:provision_hr: created the HR account"
    when :exists then puts "users:provision_hr: the HR account already exists; nothing changed"
    end
  rescue ActiveRecord::RecordInvalid => error
    abort "users:provision_hr: #{error.record.errors.full_messages.to_sentence}"
  end
end
