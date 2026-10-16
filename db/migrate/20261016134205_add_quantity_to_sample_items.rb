class AddQuantityToSampleItems < ActiveRecord::Migration[8.1]
  def change
    # A constant default backfills existing rows without rewriting the table.
    add_column :sample_items, :quantity, :integer, null: false, default: 1
  end
end
