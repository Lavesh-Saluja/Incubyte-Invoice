# The starter's demonstration table. Dropped so existing databases (including production) match the schema.
class DropSampleItems < ActiveRecord::Migration[8.1]
  def up
    drop_table :sample_items, if_exists: true
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
