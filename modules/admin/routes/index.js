const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// /admin/index
router.get('/', adminController.index);

module.exports = router;
