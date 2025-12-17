const jwt = require('jsonwebtoken')
const verifyToken = (req, res, next) => {
  const token = req.cookies.lmstoken; // Get the token from cookies
  if (!token) return res.status(401).send('Access denied. No token provided.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).send('Invalid token.');
    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;