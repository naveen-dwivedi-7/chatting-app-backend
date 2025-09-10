const jwt = require("jsonwebtoken");
require("dotenv").config();


function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(`authHeader:${authHeader}`)
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  const token = authHeader.split(" ")[1]; // after "Bearer"'
  console.log(`token:${token}`)
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user; // attach decoded token payload
    next();
  });
}

module.exports = authenticateToken;

