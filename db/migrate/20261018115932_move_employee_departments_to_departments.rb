class MoveEmployeeDepartmentsToDepartments < ActiveRecord::Migration[8.1]
  CLEAN_NAME = "btrim(regexp_replace(employees.department, '\\s+', ' ', 'g'))".freeze

  def up
    execute <<~SQL
      INSERT INTO departments (id, name, created_at, updated_at)
      SELECT gen_random_uuid(), name, now(), now()
      FROM (
        SELECT DISTINCT ON (lower(#{CLEAN_NAME})) #{CLEAN_NAME} AS name
        FROM employees
        ORDER BY lower(#{CLEAN_NAME}), #{CLEAN_NAME}
      ) AS distinct_departments
    SQL

    add_reference :employees, :department, type: :uuid, foreign_key: true, index: true

    execute <<~SQL
      UPDATE employees SET department_id = departments.id
      FROM departments
      WHERE lower(departments.name) = lower(#{CLEAN_NAME})
    SQL

    change_column_null :employees, :department_id, false
    remove_index :employees, :department
    remove_column :employees, :department
  end

  def down
    add_column :employees, :department, :string

    execute <<~SQL
      UPDATE employees SET department = departments.name
      FROM departments
      WHERE departments.id = employees.department_id
    SQL

    change_column_null :employees, :department, false
    add_index :employees, :department
    remove_reference :employees, :department, foreign_key: true, index: true
    execute "DELETE FROM departments"
  end
end
