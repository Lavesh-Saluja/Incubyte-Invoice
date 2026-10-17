class CreateEmployees < ActiveRecord::Migration[8.1]
  def change
    create_table :employees, id: :uuid do |t|
      t.bigserial :employee_number, null: false
      t.string :employee_code, null: false
      t.string :first_name, null: false, limit: 100
      t.string :last_name, null: false, limit: 100
      t.string :email, null: false
      t.string :department, null: false
      t.string :job_title, null: false
      t.string :country, null: false
      t.string :status, null: false, default: "active"
      t.datetime :notice_period_started_at
      t.datetime :notice_period_ends_at

      t.timestamps
    end

    add_index :employees, :employee_number, unique: true
    add_index :employees, :employee_code, unique: true
    add_index :employees, "lower(email)", unique: true, name: "index_employees_on_lower_email"
    add_index :employees, :status

    add_check_constraint :employees, "status IN ('active', 'notice_period', 'inactive')",
      name: "employees_status_allowed"
  end
end
