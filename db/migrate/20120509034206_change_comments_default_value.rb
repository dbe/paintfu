class ChangeCommentsDefaultValue < ActiveRecord::Migration
  def self.up
    change_column :entries, :comment, :text, :null => false, :default => ""
  end

  def self.down
    change_column :entries, :comment, :text
  end
end
