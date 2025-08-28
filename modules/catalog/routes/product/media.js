const express = require('express');
const router = express.Router();

// /catalog/product/media
router.get('/', (req, res) => {
  res.json({ message: 'Product media list' });
});

// /catalog/product/media/upload
router.get('/upload', (req, res) => {
  res.json({ message: 'Product media uploaded' });
});

module.exports = router;
