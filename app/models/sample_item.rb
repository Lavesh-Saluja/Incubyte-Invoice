class SampleItem < ApplicationRecord
  MAX_QUANTITY = 1_000_000

  normalizes :name, with: ->(name) { name.strip }

  validates :name, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }
  validates :quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: MAX_QUANTITY }
end
