const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: {
    error: 'Too many requests, try again later'
  }
});

module.exports = { authLimiter };