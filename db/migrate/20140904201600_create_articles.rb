class CreateArticles < ActiveRecord::Migration
  def change
    create_table :articles do |t|
      t.string :title
      t.string :source
      t.string :url
      t.text :slug

      t.timestamps
    end
  end
end
