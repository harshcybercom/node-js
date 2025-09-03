const express = require("express");
const router = express.Router();
const ApiUserController = require("../controllers/apiUserController");

// Create controller instance for non-static methods
const apiUserController = new ApiUserController();

// Authentication routes (static methods)
router.get("/login", ApiUserController.showLogin);
router.post("/login", ApiUserController.login);

router.get("/register", ApiUserController.showRegister);
router.post("/register", ApiUserController.register);

router.get("/dashboard", ApiUserController.dashboard);
router.get("/logout", ApiUserController.logout);

// API Index
router.get("/", apiUserController.index);

// CRUD operations for API users
router.get("/users", apiUserController.list);           // Read all users
router.post("/users", apiUserController.create);        // Create new user
router.put("/users/:id", apiUserController.update);     // Update user
router.delete("/users/:id", apiUserController.delete);  // Delete user

module.exports = router;
