require('dotenv').config();
const jwt = require('jsonwebtoken');

const payload = {
  id: 'static_user_id_123',
  name: 'Sumithaa'
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '90d' });

console.log('Generated token (valid for 90 days):\n');
console.log(token); 