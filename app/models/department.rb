class Department < ApplicationRecord
  NAME_MAX_LENGTH = 100

  has_many :employees, dependent: :restrict_with_error

  normalizes :name, with: ->(name) { name.squish }

  validates :name, presence: true, length: { maximum: NAME_MAX_LENGTH }, uniqueness: { case_sensitive: false }
end
