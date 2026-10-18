class CreateDepartments < ActiveRecord::Migration[8.1]
  def change
    create_table :departments, id: :uuid do |t|
      t.string :name, null: false, limit: 100

      t.timestamps
    end

    add_index :departments, "lower(name)", unique: true, name: "index_departments_on_lower_name"
  end
end
