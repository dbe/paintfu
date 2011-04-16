class VideoController < ApplicationController
  def index
    @rebeccas = params[:rebeccas] || 0
    @width = params[:width] || 480
    @height = params[:height] || 360
  end

end
