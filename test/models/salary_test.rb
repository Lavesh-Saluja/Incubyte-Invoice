require "test_helper"

class SalaryTest < ActiveSupport::TestCase
  AMOUNTS = %i[annual_ctc annual_base_pay annual_pf annual_other_components].freeze

  def errors_for(salary, attribute)
    salary.validate
    salary.errors[attribute]
  end

  def insert_salary!(**attributes)
    Salary.insert_all!([ {
      employee_id: create(:employee).id, currency: "INR", annual_ctc: 1, annual_base_pay: 1, annual_pf: 0,
      annual_other_components: 0, effective_from: Date.current
    }.merge(attributes) ])
  end

  test "is valid with an employee, currency, amounts and effective date" do
    assert build(:salary).valid?
  end

  test "uses a UUID primary key" do
    assert_match(/\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/, create(:salary).id)
  end

  test "belongs to an employee who has one salary" do
    salary = create(:salary)

    assert_equal salary, salary.employee.salary
  end

  test "requires an employee" do
    assert_includes errors_for(build(:salary, employee: nil), :employee), "must exist"
  end

  test "requires a currency and an effective date" do
    salary = build(:salary, currency: "", effective_from: nil)

    assert_includes errors_for(salary, :currency), "can't be blank"
    assert_includes errors_for(salary, :effective_from), "can't be blank"
  end

  test "requires every amount to be a number" do
    AMOUNTS.each do |amount|
      assert_includes errors_for(build(:salary, amount => nil), amount), "is not a number", "for #{amount}"
      assert_includes errors_for(build(:salary, amount => "abc"), amount), "is not a number", "for #{amount}"
    end
  end

  test "rejects negative amounts and accepts zero" do
    AMOUNTS.each do |amount|
      assert_includes errors_for(build(:salary, amount => -1), amount), "must be greater than or equal to 0",
        "for #{amount}"
      assert build(:salary, amount => 0).valid?, "expected #{amount} = 0 to be valid"
    end
  end

  test "stores amounts as exact decimals to two places" do
    salary = create(:salary, annual_ctc: "1234567.89", annual_pf: "0.1")

    salary.reload
    assert_instance_of BigDecimal, salary.annual_ctc
    assert_equal BigDecimal("1234567.89"), salary.annual_ctc
    assert_equal BigDecimal("0.10"), salary.annual_pf
  end

  test "does not assume CTC is the sum of the components" do
    assert build(:salary, annual_ctc: 100, annual_base_pay: 500, annual_pf: 50, annual_other_components: 0).valid?
  end

  test "allows only one salary per employee" do
    existing = create(:salary)

    assert_includes errors_for(build(:salary, employee: existing.employee), :employee_id), "has already been taken"
  end

  test "the database allows only one salary per employee" do
    existing = create(:salary)

    assert_raises(ActiveRecord::RecordNotUnique) { insert_salary!(employee_id: existing.employee_id) }
  end

  test "the database rejects negative amounts" do
    AMOUNTS.each do |amount|
      assert_raises(ActiveRecord::StatementInvalid, "for #{amount}") { insert_salary!(amount => -1) }
    end
  end

  test "the database rejects a salary for an unknown employee" do
    assert_raises(ActiveRecord::InvalidForeignKey) { insert_salary!(employee_id: SecureRandom.uuid) }
  end

  test "is removed with its employee" do
    salary = create(:salary)

    salary.employee.destroy!

    assert_not Salary.exists?(salary.id)
  end
end
