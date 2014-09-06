require 'spec_helper'

feature 'View main page' do

  scenario 'User navigates to home page and views articles' do
    expect(page).to have_tag("div#container")
  end

  scenario 'User navigates to home page and views articles' do
    expect(page).to have_tag("div#article")
  end

  scenario 'User navigates to home page and views articles' do
    expect(page).to have_tag("div#pair")
  end

end