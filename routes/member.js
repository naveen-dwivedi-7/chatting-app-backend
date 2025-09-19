const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const authenticateToken = require("../middlewares/auth");


router.get("/",authenticateToken, memberController.index);
router.get("/new",authenticateToken, memberController.new);
router.post("/", memberController.create);
router.get("/:id/edit",authenticateToken, memberController.edit);
router.put("/:id",authenticateToken, memberController.update);
router.delete("/:id",authenticateToken, memberController.delete);

module.exports = router;
