const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/multerconfig");
const authenticateToken = require("../middlewares/auth");
// const jwt = require("jsonwebtoken");

router.get("/", authenticateToken,userController.listUsers);

router.get("/add", authenticateToken,userController.showAddForm);
router.post("/add", authenticateToken,upload.single("profile_image"), userController.add);

// router.get("/:id/edit", userController.editForm);
router.get("/edit/:id", authenticateToken,userController.editForm);


// Update User
router.put("/:id", authenticateToken,upload.single("profile_image"), userController.update);

// router.delete("/delete/:id", userController.delete);
// router.get("/delete/:id", userController.delete);
router.delete("/:id",authenticateToken, userController.delete);



module.exports = router;







