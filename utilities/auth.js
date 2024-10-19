const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { user_id: user.account_id, email: user.account_email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
