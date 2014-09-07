class CreateUserTags < ActiveRecord::Migration
  def change
    create_table :user_tags do |t|
      t.integer :tag_id
      t.integer :user_id
      t.decimal :sentiment_score
      t.decimal :relevance
      t.boolean :agreement

      t.timestamps
    end
  end
end
