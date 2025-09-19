const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authenticateToken = require("../middlewares/auth");


router.get("/", authenticateToken,messageController.index);
router.get("/new",authenticateToken, messageController.new);
router.post("/create",authenticateToken, messageController.create);
router.get("/:id/edit",authenticateToken, messageController.edit);
router.post("/:id/update",authenticateToken, messageController.update);
router.post("/:id/delete",authenticateToken, messageController.delete);

module.exports = router;
