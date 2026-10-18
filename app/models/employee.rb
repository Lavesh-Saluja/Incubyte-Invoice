class Employee < ApplicationRecord
  CODE_PREFIX = "INC"
  NAME_MAX_LENGTH = 100
  COUNTRIES = ISO3166::Country.all.index_by(&:alpha2).freeze

  attr_readonly :employee_number, :employee_code

  belongs_to :department
  has_one :salary, dependent: :destroy
  accepts_nested_attributes_for :salary, update_only: true

  enum :status, { active: "active", notice_period: "notice_period", inactive: "inactive" },
    default: :active, validate: true

  normalizes :first_name, :last_name, :job_title, with: ->(value) { value.strip }
  normalizes :country, with: ->(country) { country.strip.upcase }
  normalizes :email, with: ->(email) { email.strip.downcase }

  before_validation :assign_employee_code, on: :create
  before_validation :assign_salary_currency

  validates :employee_code, presence: true
  validates :employee_code, uniqueness: true, on: %i[create update]
  validates :first_name, :last_name, presence: true, length: { maximum: NAME_MAX_LENGTH }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :email, uniqueness: { case_sensitive: false }, on: %i[create update]
  validates :job_title, :country, presence: true
  validates :country, inclusion: { in: COUNTRIES.keys, message: :invalid_country }, allow_blank: true

  DEFAULT_NOTICE_PERIOD_DAYS = Integer(ENV.fetch("NOTICE_PERIOD_DAYS", 30))
  NOTICE_PERIOD_MAX_DAYS = 365

  scope :with_expired_notice_period, -> { notice_period.where(notice_period_ends_at: ..Time.current) }
  scope :leaving_within, ->(days) { notice_period.where(notice_period_ends_at: Time.current..days.days.from_now) }

  def self.next_employee_number
    next_employee_numbers(1).first
  end

  def self.next_employee_numbers(count)
    connection.select_values(sanitize_sql_array([
      "SELECT nextval(pg_get_serial_sequence('employees', 'employee_number')) FROM generate_series(1, ?)", Integer(count)
    ]))
  end

  def self.code_for(number, year: Time.current.year)
    format("%s-%d-%06d", CODE_PREFIX, year, number)
  end

  def country_name
    COUNTRIES[country]&.common_name
  end

  def currency_code
    COUNTRIES[country]&.currency_code
  end

  private
    def assign_salary_currency
      salary.currency = currency_code if salary
    end

    def assign_employee_code
      @sequence_number ||= self.class.next_employee_number
      self.employee_number = @sequence_number
      self.employee_code = self.class.code_for(@sequence_number)
    end
end
