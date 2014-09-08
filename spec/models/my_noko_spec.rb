require 'spec_helper'

describe 'MyNoko' do

  it "parser will " do
    before_article_count = Article.count
    url = "https://news.google.com/news/section?pz=1&cf=all&ned=us&hl=en&q=Ukraine&topicsid=FRONTPAGE&ict=tnv0&topicnv=__AB21PFzgFYiVzdeR9RgYfVUQIcN3eLnuy0SFp6v4XPqFsz2R_VVVPTPpS7769omAMRTuPCvzJHGZs8Vo_QMvPwIM2l7HrErhSkFrVGE_85p2vIw6XonHyE3ia-6wbhMJSoyNWqPtZXWvcBW4IoIEZle-m2KYkxuGe-5qvDHKYKxSBXsKiUW2yQxCB8IccprleyCCNJX3gkyMk4QXxbxSGYIkfZkxpgEPeO2SL9F5IJW8-j0_EdG5iQ3UCAGVi9lBcs5-9bV2GlmR6AvjL_Od10HiJF5AfVc7sPaQ-Er29DKGyVWzN1znybnpOdidY6YY_mk1oE5qe4XX9K4T8vo0Fqk1Jp33FbxjQz468Q5IKuiX2ywuGnUo-NGf_QLj8NWiihBiaQytWrWl-giyLcagQKLHEpTgvOqHhx5Pmqn7Ipsa2Mx8wtn-Tkybk3mKujWZUc7IfZgJxqIF-oKL7EW7UetZMqd2dn-ADnyth2j09UzzeyBuKcgFpdCbZA4cFcF-90nQ-ZY8hizTcZmadXeWtaDVI4pvU6cH4bt4GcearTjyAxdTWB-y05CBuj9reBJb7e_yqyE7USwMcC8fUPUNry5FzyBjg4sGxzg1zFor9_saO2aTFLCVgAAGXxRsFys-ocPm2rsvtKpkkygocJUOFYw765Cb4bXgkHZdpw3eaJVEItWrM6oKxUmK1PTfEToWLHc7hlnt_FKRCrojMUoXOtF_Df6A9phyAw=="
    MyNoko.parse(url)
    after_article_count = Article.count
    expect(after_article_count).to eq(before_article_count+20)

  end

end