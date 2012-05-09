class FixIncorrectStuff < ActiveRecord::Migration
  def self.up
    change_column :foods, :caffeine, :integer, :null => false, :default => 0
    rename_column :foods, :type, :name
  end

  def self.down
    change_column :foods, :caffeine, :integer
    rename_column :foods, :name, :type
  end
end
