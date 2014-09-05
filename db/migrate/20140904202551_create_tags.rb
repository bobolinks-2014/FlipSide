class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.string :sentiment
      t.timestamps
    end
  end
end
