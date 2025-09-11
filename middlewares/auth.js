const jwt = require('jsonwebtoken');
require('dotenv').config();



function authenticateToken(req, res, next) {
  const token = req.cookies.token; // read token from cookie

  if (!token) {
    // user not logged in
    return res.redirect("/login");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // verify token
    req.user = user; // attach user info to request object
    next(); // proceed to next middleware or route handler
  } catch (err) {
    console.error("Invalid token:", err);
    return res.redirect("/login");
  }
}

module.exports = authenticateToken;
