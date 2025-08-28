const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// /admin/admin
router.get('/', adminController.dashboard);

router.post('/create', adminController.create);
router.get('/list', adminController.list);

module.exports = router;
