class Employee < ApplicationRecord
  CODE_PREFIX = "INC"
  NAME_MAX_LENGTH = 100

  attr_readonly :employee_number, :employee_code

  has_one :salary, dependent: :destroy

  enum :status, { active: "active", notice_period: "notice_period", inactive: "inactive" },
    default: :active, validate: true

  normalizes :first_name, :last_name, :department, :job_title, :country, with: ->(value) { value.strip }
  normalizes :email, with: ->(email) { email.strip.downcase }

  before_validation :assign_employee_code, on: :create

  validates :employee_code, presence: true, uniqueness: true
  validates :first_name, :last_name, presence: true, length: { maximum: NAME_MAX_LENGTH }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }, uniqueness: { case_sensitive: false }
  validates :department, :job_title, :country, presence: true

  DEFAULT_NOTICE_PERIOD_DAYS = Integer(ENV.fetch("NOTICE_PERIOD_DAYS", 30))
  NOTICE_PERIOD_MAX_DAYS = 365

  scope :with_expired_notice_period, -> { notice_period.where(notice_period_ends_at: ..Time.current) }

  def self.next_employee_number
    connection.select_value("SELECT nextval(pg_get_serial_sequence('employees', 'employee_number'))")
  end

  private
    def assign_employee_code
      @sequence_number ||= self.class.next_employee_number
      self.employee_number = @sequence_number
      self.employee_code = format("%s-%d-%06d", CODE_PREFIX, Time.current.year, @sequence_number)
    end
end
