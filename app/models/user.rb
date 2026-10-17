class User < ApplicationRecord
  PASSWORD_MIN_LENGTH = 12

  has_secure_password

  enum :role, { hr: "hr" }, default: :hr, validate: true

  normalizes :name, with: ->(name) { name.strip }
  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :name, presence: true, length: { maximum: 100 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: PASSWORD_MIN_LENGTH }, allow_nil: true
end
