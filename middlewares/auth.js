const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // const token =localStorage.getItem('token');
  console.log(`Token:${token}`);


  if (!token) {
    console.log("❌ No token found, redirecting to login");
    return res.redirect("/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("❌ Invalid token:", err);
      return res.redirect("/login");
    }

    req.user = user; // attach decoded user info to req
    next();
  });
};



module.exports = authenticateToken;
