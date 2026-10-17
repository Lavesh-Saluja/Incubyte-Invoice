module Sessions
  class AuthenticateService
    attr_reader :email, :password

    def initialize(email:, password:)
      @email = email
      @password = password
    end

    def process!
      return if email.blank? || password.blank?

      User.authenticate_by(email:, password:)
    end
  end
end
