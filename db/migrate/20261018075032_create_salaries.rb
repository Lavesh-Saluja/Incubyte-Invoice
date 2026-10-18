class CreateSalaries < ActiveRecord::Migration[8.1]
  AMOUNTS = %i[annual_ctc annual_base_pay annual_pf annual_other_components].freeze

  def change
    create_table :salaries, id: :uuid do |t|
      t.references :employee, type: :uuid, null: false, foreign_key: true, index: { unique: true }
      t.string :currency, null: false
      AMOUNTS.each { |amount| t.decimal amount, precision: 15, scale: 2, null: false }
      t.date :effective_from, null: false

      t.timestamps
    end

    AMOUNTS.each do |amount|
      add_check_constraint :salaries, "#{amount} >= 0", name: "salaries_#{amount}_non_negative"
    end
  end
end
