class ChangeDatetimeToDate < ActiveRecord::Migration
  def self.up
    change_column :entries, :date, :date, :null => false
  end

  def self.down
    change_column :entries, :date, :datetime, :null => false
  end
end
