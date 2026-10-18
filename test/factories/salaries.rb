FactoryBot.define do
  factory :salary do
    employee
    currency { "INR" }
    annual_ctc { 1_800_000 }
    annual_base_pay { 1_000_000 }
    annual_pf { 120_000 }
    annual_other_components { 680_000 }
    effective_from { Date.new(2026, 4, 1) }
  end
end
