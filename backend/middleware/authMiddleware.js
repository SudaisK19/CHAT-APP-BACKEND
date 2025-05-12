// middleware/authMiddleware.js
const jwt           = require("jsonwebtoken");
const asyncHandler  = require("express-async-handler");
const User          = require("../models/userModel");

exports.protect = asyncHandler(async (req, res, next) => {
  console.log("→ Authorization header:", req.headers.authorization);

  // 1) grab the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, token missing");
  }

  console.log("→ Raw token string:", token);

  // 2) verify inside a single try/catch
  try {
    console.log("→ About to verify token…");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("↳ decoded JWT payload:", decoded);

    // 3) attach user and continue
    req.user = await User.findById(decoded.id).select("-password");
    return next();
  } catch (err) {
    console.error("🚫 JWT verification failed:", err.message);
    res.status(401);
    throw new Error("Not authorized, token invalid");
  }
});
