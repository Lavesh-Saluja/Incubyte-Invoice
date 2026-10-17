module Users
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
