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

// User creation (API only)
router.post('/create', adminController.create);
module.exports = router;
