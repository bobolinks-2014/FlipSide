
require_relative '../../app/models/alchemy'

describe Alchemy do
  let(:url){'http://online.wsj.com/articles/russia-says-ukraine-nato-ambitions-threaten-peace-efforts-1409828434'}
  describe "self#alchemize" do
    it "Should return an array of keywords" do
      expect(Alchemy.alchemize(url)[0]["text"]).to eq("Ukraine")
    end
  end
end
