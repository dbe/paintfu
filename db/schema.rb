# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120502062307) do

  create_table "entries", :force => true do |t|
    t.date    "date",           :null => false
    t.text    "comment"
    t.integer "wake_up_hour"
    t.integer "wake_up_minute"
    t.integer "sleep_hour"
    t.integer "sleep_minute"
    t.integer "mood"
    t.integer "energy"
    t.integer "productivity"
  end

  create_table "foods", :force => true do |t|
    t.integer "entries_id", :null => false
    t.string  "type",       :null => false
    t.integer "calories"
    t.integer "caffeine"
  end

  create_table "naps", :force => true do |t|
    t.integer "entries_id", :null => false
    t.integer "start_hour", :null => false
    t.integer "length",     :null => false
  end

  create_table "workouts", :force => true do |t|
    t.integer "entries_id", :null => false
    t.string  "activity",   :null => false
    t.integer "start_hour", :null => false
    t.integer "length",     :null => false
    t.integer "intensity",  :null => false
  end

end
