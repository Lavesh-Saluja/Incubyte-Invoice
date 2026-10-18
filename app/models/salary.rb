class Salary < ApplicationRecord
  belongs_to :employee

  validates :currency, presence: true
  validates :effective_from, presence: true

  validates :annual_ctc,
            :annual_base_pay,
            :annual_pf,
            :annual_other_components,
            numericality: { greater_than_or_equal_to: 0 }

  validates :employee_id, uniqueness: true
end
