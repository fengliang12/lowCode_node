const jwt = require('jsonwebtoken')

function createToken(payload) {
  const secret = process.env.JWT_SECRET || 'jwt-secret'
  return jwt.sign(payload, secret, { expiresIn: '7d' })
}

module.exports = { createToken }
