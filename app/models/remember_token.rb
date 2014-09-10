class RememberToken
  def self.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def self.encrypt(token)
    Digest::SHA1.hexdigest(token.to_s)
  end

  def self.encrypted_remember_token
    encrypt(remember_token)
  end
end
