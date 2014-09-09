
require_relative '../../app/models/alchemy'
#need to fix the function and the tests for bad api call handling
describe Alchemy do
  let(:url){'http://online.wsj.com/articles/russia-says-ukraine-nato-ambitions-threaten-peace-efforts-1409828434'}
  describe "self#alchemize" do
    pending "Should return an array of keywords" do
      expect(Alchemy.alchemize(url)[0]["text"]).to eq("Ukraine")
    end
  end
end
