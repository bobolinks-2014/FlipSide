class Pair < ActiveRecord::Base
  belongs_to :category
  belongs_to :article1, :class_name => "Article"
  belongs_to :article2, :class_name => "Article"
  validates_uniqueness_of :article1, :scope => :article2
  validates_uniqueness_of :article2, :scope => :article1
end
