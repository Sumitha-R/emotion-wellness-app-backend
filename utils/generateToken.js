require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: '90d' }); // 90 days = ~3 months
};

module.exports = generateToken; 