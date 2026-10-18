class AddFilterIndexesToEmployees < ActiveRecord::Migration[8.1]
  def change
    add_index :employees, :country
    add_index :employees, :department
  end
end
