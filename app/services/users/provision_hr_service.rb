module Users
  # Creates the HR account when no user has the given email. Never updates an existing account,
  # so re-running it (e.g. on every deploy) cannot overwrite a password.
  # Returns :created or :exists; raises ActiveRecord::RecordInvalid when the details are invalid.
  class ProvisionHrService
    attr_reader :name, :email, :password

    def initialize(name:, email:, password:)
      @name = name
      @email = email
      @password = password
    end

    def process!
      return :exists if User.exists?(email:)

      User.create!(name:, email:, password:, role: :hr)
      :created
    end
  end
end
