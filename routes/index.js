// routes/index.js
const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/auth");

router.get("/", isAuthenticated, (req, res) => {
  res.render("home", { title: "Chat App Home" });
});


module.exports = router;
