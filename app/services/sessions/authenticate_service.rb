module Sessions
  # Returns the user for a correct email and password, nil otherwise. authenticate_by takes the
  # same time whether or not the email exists, so responses do not reveal which accounts exist.
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
