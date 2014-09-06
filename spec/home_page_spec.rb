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

  scenario 'User opens articles', js: true do
    visit '/'
    click_on 'load articles'
  end

  scenario 'User looks at articles', js: true do
    visit '/'
    click_on 'load articles'
    wait_for_ajax
    page.has_css?('.article')
  end

  scenario 'User opens article iframe', js: true do
    visit '/'
    click_on 'load articles'
    wait_for_ajax
    find('.article', visible: true)
    page.execute_script "$('.load articles').trigger('click')"
    # page.has_css?('.article')
    # page.find('.article')
  end


end