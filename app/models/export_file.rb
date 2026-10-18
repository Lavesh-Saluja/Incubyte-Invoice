class ExportFile < ApplicationRecord
  belongs_to :export

  validates :content, :content_type, presence: true
  validates :byte_size, numericality: { greater_than_or_equal_to: 0 }
end
