const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middlewares/multerconfig");
const authenticateToken=require("../middlewares/auth")




// Register routes
router.get("/register", authController.showRegister);
router.post("/register", upload.single("profile_image"), authController.register);


router.get('/login', authController.showLogin);

router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
