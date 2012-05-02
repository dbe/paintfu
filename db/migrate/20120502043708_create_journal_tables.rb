class CreateJournalTables < ActiveRecord::Migration
  def self.up
    create_table :entries do |t|
      t.datetime :date, :null => false
      
      t.text :comment
      
      #Sleep
      t.integer :wake_up_hour
      t.integer :wake_up_minute
      t.integer :sleep_hour
      t.integer :sleep_minute
      
      #Macro stats
      t.integer :mood
      t.integer :energy
      t.integer :productivity
      
    end
    
    create_table :foods do |t|
      t.integer :entries_id, :null => false
      
      t.string :type, :null => false
      t.integer :calories
      t.integer :caffeine
    end
    
    create_table :naps do |t|
      t.integer :entries_id, :null => false
      
      t.integer :start_hour, :null => false
      t.integer :length, :null => false  #Minutes
    end
    
    create_table :workouts do |t|
      t.integer :entries_id, :null => false
      
      t.string :activity, :null => false
      t.integer :start_hour, :null => false
      t.integer :length, :null => false
      t.integer :intensity, :null => false
    end
  end

  def self.down
    drop_table :entries
    drop_table :foods
    drop_table :naps
    drop_table :workouts
  end
end
