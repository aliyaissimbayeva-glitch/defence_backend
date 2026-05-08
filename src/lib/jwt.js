const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m'
  });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d'
  });
}

module.exports = { generateAccessToken, generateRefreshToken };