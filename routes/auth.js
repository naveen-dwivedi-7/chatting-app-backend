// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const auth = require('../middlewares/auth');

// // User Routes

// router.get('/users',authController.getAllUsers)

// router.get('/user/:id',authController.getUser)

// router.post('/user/create',authController.createUser)

// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../validators/authvalidator");
const { validationResult } = require("express-validator");

// Example routes
router.get("/users", authController.getAllUsers);
router.get("/user/:id", authController.getUser);
// router.post("/user/create", authController.createUser);

// router.post('/user/create', (req, res, next) => {
//   console.log("✅ Route /user/create hit, body:", req.body);
//   next(); // forward to controller
// }, authController.createUser);

// router.post('/register',authController.register)
// router.post('/login',authController.login)
// Login POST with validation
router.post("/login", loginValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render login.ejs with error messages
    return res.status(400).render("login", { errors: errors.array() });
  }

  authController.login(req, res);
});


router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);

// router.post("/register", authController.createUser);

// Register route with validation
router.post("/register", registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // For EJS form
    return res.status(400).render("register", { errors: errors.array() });

    // OR if using fetch/JSON API
    // return res.status(400).json({ errors: errors.array() });
  }
  authController.createUser(req, res);
});




module.exports = router;
