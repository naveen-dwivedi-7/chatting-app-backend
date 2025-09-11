const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");


const jwt = require("jsonwebtoken");

router.get("/dashboard", (req, res) => {
  const token = req.cookies.token; // read token from cookie

  if (!token) {
    // user not logged in
    return res.redirect("/login");
  }

  try {
    // decode and verify token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    // pass user to EJS template
    res.render("dashboard", { user });
  } catch (err) {
    console.error("Invalid token:", err);
    return res.redirect("/login");
  }
});


module.exports = router;



