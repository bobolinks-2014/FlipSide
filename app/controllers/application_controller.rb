require 'rest_client'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  def test
		returnVal = RestClient.get 'https://www.kimonolabs.com/api/9lezh1lc?apikey=GsBpFLhrLVtXl8mIDnFj8zv8rRVrsKTn'
		returnVal.to_json
		if request.xhr?
			render :json => returnVal
		end
  end
end
