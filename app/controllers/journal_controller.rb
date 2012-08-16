class JournalController < ApplicationController
  before_filter :auth_user, :except => :auth
  layout 'journal'
  
  #Super secret open source password
  AUTH_TOKEN = "klajsdflkjsdjh234234098fsa9df09asd78f9023ujisd70"
  
  def index
    @entries = Entry.all
  end
  
  def show
    @entry = Entry.find(params[:id])
  end
  
  def create
    date = Date.parse(params[:date])
    entry = (Entry.all.select {|entry| entry.date == date}).first
    if(entry.nil?)
      flash[:success] = "Journal entry was created"
      entry = Entry.create!(:date => date)
    end
    redirect_to journal_entry_path(entry.id)
  end
  
  #lolAuth
  def auth
    cookies[:auth] = AUTH_TOKEN
    redirect_to :controller => :journal, :action => :index
  end
  
  
  #Ajax method
  def submit_comment
    entry = Entry.find(params[:id])
    entry.update_attributes!(:comment =>  params[:comment])
    return render :text => "OK"
  end
  
  def submit_table_change
    table = params[:table_name].capitalize
    column = params[:column_name]
    value = params[:value]
    table.constantize.find(params[:id]).update_attributes!(column.to_sym => value)
    return render :text => "OK"
  end
  
  def submit_record_creation
    table = params[:table_name].capitalize
    params[:attributes][:entry_id] = params[:id]
    table.constantize.create!(params[:attributes])
    return render :text => "OK"
  end
  
  private
  
  def auth_user
    return render :text => "nope" unless cookies[:auth] && cookies[:auth] == AUTH_TOKEN
  end
end
