class VideoController < ApplicationController
  def index
    @rebeccas = params[:rebeccas] || 0
  end

end
