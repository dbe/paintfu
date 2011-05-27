class DropMotivations < ActiveRecord::Migration
  def self.up
    drop_table :motivations
  end

  def self.down
    create_table :motivations do |t|
      t.integer :media_type
      t.string :path
      t.text :title
      t.text :description
    end
  end
end
