require('dotenv').config();
const jwt = require('jsonwebtoken');

// Generate a test token with a dummy user ID
const testUserId = '507f1f77bcf86cd799439011'; // MongoDB ObjectId format
const token = jwt.sign(
  { id: testUserId, email: 'test@example.com' },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

console.log('Test JWT Token:');
console.log(token);
console.log('\nUse this token in Authorization header as: Bearer ' + token);
