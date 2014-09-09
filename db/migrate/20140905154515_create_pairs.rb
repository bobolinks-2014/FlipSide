class CreatePairs < ActiveRecord::Migration
  def change
    create_table :pairs do |t|
      t.integer :category_id
      t.integer :article1_id
      t.integer :article2_id
      t.integer :user_id
      t.decimal :difference_score

      t.timestamps
    end
  end
end
