class CreateArticleTags < ActiveRecord::Migration
  def change
    create_table :article_tags do |t|
      t.integer :article_id
      t.integer :tag_id
      t.decimal :sentiment_score
      t.decimal :relevance

      t.timestamps
    end
  end
end
