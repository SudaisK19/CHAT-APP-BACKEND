// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Not authorized, no token');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // { _id, name, email, role, ... }
    next();
  } catch (err) {
    res.status(401).send('Not authorized, token failed');
  }
};

module.exports = { protect };
