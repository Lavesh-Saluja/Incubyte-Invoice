class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name, null: false, limit: 100
      t.string :email, null: false
      t.string :role, null: false, default: "hr"
      t.string :password_digest, null: false

      t.timestamps
    end

    # The model stores emails lowercased; indexing lower(email) keeps them unique case-insensitively
    # even for rows written without going through the model.
    add_index :users, "lower(email)", unique: true, name: "index_users_on_lower_email"
    add_check_constraint :users, "role IN ('hr')", name: "users_role_allowed"
  end
end
