const express = require('express');
const router = express.Router();

// /catalog/product
router.get('/', (req, res) => {
  res.json({ message: 'Catalog product list' });
});

// /catalog/product/:id
router.get('/:id', (req, res) => {
  res.json({ message: `Product details for ${req.params.id}` });
});

module.exports = router;
