const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('profile');
  console.log(req.session.currentUser);
});

router.post('/profile', (req, res, next) => {
  const { username, homeCountry } = req.body;
  const { id } = req.session.currentUser;
});

module.exports = router;
