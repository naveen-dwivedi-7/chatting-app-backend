const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const userController = require("../controllers/userController");


// // Protected profile route
// router.get("/profile", authenticateToken, (req, res) => {
//   res.json({ message: "Welcome", user: req.user });
// });

router.get("/list", authenticateToken, userController.listUsers);
//router.get("/list", userController.listUsers);


module.exports = router;
