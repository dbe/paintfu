class JournalController < ApplicationController
  before_filter :auth_user, :except => :auth
  AUTH_TOKEN = "klajsdflkjsdjh234234098fsa9df09asd78f9023ujisd70"
  
  def index
  end
  
  def auth
    cookies[:auth] = AUTH_TOKEN
    redirect_to :controller => :journal, :action => :index
  end
  
  private
  
  def auth_user
    return render :text => "nope" unless cookies[:auth] && cookies[:auth] == AUTH_TOKEN
  end
end
