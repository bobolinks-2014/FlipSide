class WelcomeController < ApplicationController
  def welcome
  end

  # all the pairs
  def pairs
  	@pairs = Pair.all
  	respond_to do |format|
    format.html
    format.json { render :json => @pairs.to_json(:include => [:article1_id, :article2_id]) }
  end
  end


end
