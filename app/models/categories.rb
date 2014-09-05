class Categories < ActiveRecord::Base
  has_many :articles
  has_many :pairs

end
