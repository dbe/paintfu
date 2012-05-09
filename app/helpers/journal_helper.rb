module JournalHelper
  @@hour_string = ""
  24.times do |i|
    @@hour_string << "<option>#{i + 1}</option>"
  end
  
  @@minute_string = ""
  60.times do |i|
    if i < 9
      @@minute_string << "<option>0#{i + 1}</option>"
    else
      @@minute_string << "<option>#{i + 1}</option>"
    end
  end
    
  
  def hour_select_options
    @@hour_string.html_safe
  end
  
  def minute_select_options
    @@minute_string.html_safe
  end
end