class StrobeController < ApplicationController
  def index
    @fullScreen = params[:fullScreen] || 0;
  end

end
