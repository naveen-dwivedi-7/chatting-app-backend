const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const authenticateToken = require("../middlewares/auth");

// ✅ List conversations
router.get("/", authenticateToken,conversationController.list);

// ✅ Show Add Conversation form
router.get("/create", authenticateToken,conversationController.showAddForm);

// ✅ Add Conversation
router.post("/create", authenticateToken,conversationController.add);

// ✅ Show Edit form
router.get("/:id/edit", authenticateToken,conversationController.editForm);

// ✅ Update Conversation
router.post("/:id/update",authenticateToken, conversationController.update);

// ✅ Delete Conversation
router.post("/:id/delete",authenticateToken, conversationController.delete);

module.exports = router;
