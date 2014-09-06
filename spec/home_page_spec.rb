require 'rails_helper'

feature 'View main page' do

  scenario 'User navigates to home page' do
    visit '/'
  end

  scenario 'User views top bar' do
    visit '/'
    page.find(".top-bar")
  end

  scenario 'User looks for Load Articles button', js: true do
    visit '/'
    page.find("#load_articles")
  end

  scenario 'User looks for Load Articles button', js: true do
    visit '/'
    page.find("#load_articles")
  end

end