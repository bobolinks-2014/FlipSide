class WelcomeController < ApplicationController
  def welcome
  end

  # all the pairs
  def pairs
  	@pairs = Pair.all
  	if request.xhr?
      
      render :json => @pairs.to_json(:include => [:article1, :article2])
    end
  end


end
