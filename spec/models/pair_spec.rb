require 'spec_helper'

      # t.integer :category_id
      # t.integer :article1_id
      # t.integer :article2_id
      # t.integer :user_id
      # t.decimal :difference_score

describe Pair do
	before do
    @category = Category.create!(name: "The bad stuff meow")

    @article1 = Article.create!(title: "YOLAAAAAA",source: "That one place", url: "www.coding4life.org/", slug: " is the first few phrases of an article", category_id: @category.id)
    @article2 = Article.create!(title: "YOL",source: "That one place", url: "www.coding4life.org/", slug: "This  the first few phrases of an article", category_id: @category.id)

    @article3 = Article.create!(title: "Y",source: "That one place", url: "www.coding4life.org/", slug: "This is  first few phrases of an article", category_id: @category.id)
    @article4 = Article.create!(title: "YL",source: "That one place", url: "www.coding4life.org/", slug: "This is the  few phrases of an article", category_id: @category.id)

    @article5 = Article.create!(title: "YAAAAAA",source: "That one place", url: "www.coding4life.org/", slug: "This is the first  phrases of an article", category_id: @category.id)
    @article6 = Article.create!(title: "LOoooooL",source: "That one place", url: "www.coding4life.org/", slug: "This is the first few  of an article", category_id: @category.id)

    @user = User.create!(name: "me", email: "yolo2@yolo.com", password:"123456", password_confirmation: "123456")

		@pair1 = Pair.create!(category: @category, article1_id: @article1.id, article2_id: @article2.id, difference_score: 0.88)

	end

	describe "self#defaults" do
		it "only returns pairs where user_id is null" do
			@pair2 = Pair.create!(category: @category, article1_id: @article3.id, article2_id: @article4.id, user_id: @user.id, difference_score: 0.88)

			expect(Pair.defaults.size).to eq(1)
		end

		it "only returns pairs created in the last 24 hours" do
			@pair3 = Pair.create!(category: @category, article1_id: @article5.id, article2_id: @article6.id, difference_score: 0.88)
			@pair3.update(created_at: Time.zone.at(1170361845))

			expect(Pair.defaults.size).to eq(1)
		end

		it "returns instances of Pair" do
			expect(Pair.defaults.first).to be_an_instance_of(Pair)
		end
	end

	describe "self#custom" do

	end
end
