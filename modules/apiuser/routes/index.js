const express = require("express");
const router = express.Router();
const ApiUserController = require("../controllers/apiUserController");

// Create controller instance for non-static methods
const apiUserController = new ApiUserController();

// Authentication routes (static methods)
router.get("/login", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.showLogin(req, res);
});
router.post("/login", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.login(req, res);
});

router.get("/register", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.showRegister(req, res);
});
router.post("/register", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.register(req, res);
});

// router.get("/dashboard", ApiUserController.dashboard);
router.get("/dashboard", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.listing(req, res);
});
router.get("/logout", (req, res) => {
    const controller = new ApiUserController(req, res);
    controller.logout(req, res);
});

// API Index
router.get("/", apiUserController.index);

// CRUD operations for API users
router.get("/users", apiUserController.list);           // Read all users
router.post("/users", apiUserController.create);        // Create new user
router.put("/users/:id", apiUserController.update);     // Update user
router.delete("/users/:id", apiUserController.delete);  // Delete user

module.exports = router;
