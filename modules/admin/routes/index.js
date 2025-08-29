const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// /admin/index
router.get('/', adminController.index);

// GET login page
// router.get('/login', adminController.showLogin);

// // POST login form
// router.post('/login', adminController.login);

// router.get('/dashboard', adminController.dashboard);

module.exports = router;
