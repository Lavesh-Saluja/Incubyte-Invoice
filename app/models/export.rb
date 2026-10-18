class Export < ApplicationRecord
  RETENTION = 24.hours
  BATCH_SIZE = 500
  ACTIVE_STATUSES = %w[queued processing].freeze

  belongs_to :user
  has_one :file, class_name: "ExportFile", dependent: :delete

  enum :status, {
    queued: "queued", processing: "processing", completed: "completed", failed: "failed", cancelled: "cancelled"
  }, default: :queued, validate: true

  scope :active, -> { where(status: ACTIVE_STATUSES) }
  scope :recent, -> { where(created_at: RETENTION.ago..) }
  scope :expired, -> { where(created_at: ...RETENTION.ago) }

  validates :processed_rows, numericality: { greater_than_or_equal_to: 0 }

  def active?
    queued? || processing?
  end

  def progress
    return 100 if completed?
    return 0 if total_rows.to_i.zero?

    [ (processed_rows * 100.0 / total_rows).floor, 99 ].min
  end

  def expires_at
    created_at + RETENTION
  end

  def downloadable?
    completed? && expires_at.future? && ExportFile.exists?(export_id: id)
  end

  def filename
    "employees-#{created_at.strftime('%Y-%m-%d-%H%M')}.csv"
  end
end
