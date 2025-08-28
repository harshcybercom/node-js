const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../../../middleware/authMiddleware');

// /admin/admin
router.get('/list', authMiddleware, adminController.list);
router.get('/', authMiddleware, adminController.dashboard);

router.post('/create', adminController.create);
router.post('/login', adminController.login);

module.exports = router;
