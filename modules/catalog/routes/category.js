const express = require('express');
const router = express.Router();

// /catalog/category
router.get('/', (req, res) => {
  res.json({ message: 'Catalog category list' });
});

module.exports = router;
