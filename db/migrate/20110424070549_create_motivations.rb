class CreateMotivations < ActiveRecord::Migration
  def self.up
    create_table :motivations do |t|
      t.integer :media_type
      t.string :path
      t.text :title
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :motivations
  end
end
