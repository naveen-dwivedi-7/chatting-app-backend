const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/users/list", userController.list);  

// Add user
router.get("/users/add", userController.showAddForm);
router.post("/users/add", userController.add);

// Edit user
router.get("/users/edit/:id", userController.showEditForm);
router.post("/users/edit/:id", userController.update);
router.put("/users/edit/:id", userController.update);


// Delete user
router.delete("/users/delete/:id", userController.delete);

module.exports = router;