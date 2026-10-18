class CreateExports < ActiveRecord::Migration[8.1]
  def change
    create_table :exports, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: true, index: false
      t.string :status, null: false, default: "queued"
      t.jsonb :filters, null: false, default: {}
      t.integer :total_rows
      t.integer :processed_rows, null: false, default: 0
      t.string :error_message
      t.datetime :started_at
      t.datetime :completed_at

      t.timestamps
    end

    add_index :exports, %i[user_id created_at]
    add_index :exports, :status
    add_check_constraint :exports, "status IN ('queued', 'processing', 'completed', 'failed', 'cancelled')",
      name: "exports_status_allowed"

    create_table :export_files, id: :uuid do |t|
      t.references :export, type: :uuid, null: false, foreign_key: { on_delete: :cascade }, index: { unique: true }
      t.binary :content, null: false
      t.string :content_type, null: false
      t.bigint :byte_size, null: false

      t.timestamps
    end
  end
end
