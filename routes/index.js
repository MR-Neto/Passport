const express = require('express');
const Country = require('../models/country');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  Country.find({})
    .then((countries) => {
      res.render('home', { countries });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
