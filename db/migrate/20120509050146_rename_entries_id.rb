class RenameEntriesId < ActiveRecord::Migration
  def self.up
    rename_column :foods, :entries_id, :entry_id
    rename_column :workouts, :entries_id, :entry_id
    rename_column :naps, :entries_id, :entry_id
  end

  def self.down
    rename_column :foods, :entry_id, :entries_id
    rename_column :workouts, :entry_id, :entries_id
    rename_column :naps, :entry_id, :entries_id
  end
end
