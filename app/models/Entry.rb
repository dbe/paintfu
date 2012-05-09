class Entry < ActiveRecord::Base
  has_many :foods 
  has_many :naps
  has_many :workouts
end