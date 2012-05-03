module ApplicationHelper
  def bruce_lee
    filename = Dir.entries("public/images/bruce_lee").sample
    image_tag "bruce_lee/#{filename}", :class => 'bruce-lee'
  end
end
