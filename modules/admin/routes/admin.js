const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../../../middleware/authMiddleware');

// Register
router.get('/register', adminController.showRegister);
router.post('/register', adminController.register);

// Login page + auth
router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);

// Logout
router.get('/logout', authMiddleware, adminController.logout);

// Protected routes
router.get('/dashboard', authMiddleware, adminController.dashboard);
router.get('/list', authMiddleware, adminController.list);

// CRUD for users (protected)
router.get('/users', authMiddleware, adminController.list);
router.post('/users', authMiddleware, adminController.create); // already exists
router.put('/users/:id', authMiddleware, adminController.update);
router.delete('/users/:id', authMiddleware, adminController.delete);

// User creation (API only)
router.post('/create', adminController.create);
module.exports = router;
