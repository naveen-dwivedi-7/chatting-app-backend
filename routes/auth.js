const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middlewares/multerconfig");

const authenticateJWT = require("../middlewares/auth");

router.get("/profile", authenticateJWT, (req, res) => {
  res.json({ message: "Welcome", user: req.user });
});

router.get("/register", authController.showRegister);

// Register route with file upload
router.post("/register", upload.single("profile_image"), authController.register);


// Register routes
router.get("/register", authController.showRegister);
router.post("/register", upload.single("profile_image"), authController.register);

// Login routes
router.get("/login", authController.showLogin);
router.post("/login", authController.login);



module.exports = router;
