// routes/user.js
const express = require('express');
const router = express.Router();

function load(app, baseRoute)
{
      // /user/:id
    router.get('/save/:id', (req, res) => {
      res.json({ message: `User ID received: ${req.params.id}` });
    });

    // /user
    router.get('/', (req, res) => {
      res.json({ message: 'User list', data: req.body });
    });

    // /user
    router.get('/create', (req, res) => {
        res.json({ message: 'User create action'});
      });
    app.use('/catalog/user', router);
}


/*


// GET /user/:id
router.get('/save/:id', (req, res) => {
  res.json({ message: `User ID received: ${req.params.id}` });
});

// GET /user
router.get('/', (req, res) => {
  res.json({ message: 'User list', data: req.body });
});

// GET /user
router.get('/create', (req, res) => {
    res.json({ message: 'User create action'});
  });

  */

module.exports = load;
