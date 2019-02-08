const express = require('express');
const Country = require('../models/country');
const User = require('../models/user');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  const { _id } = req.session.currentUser;

  User.findById(_id).populate('travelLog')
    .then((data) => {
      res.render('travellog', { travelLog: data.travelLog });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/add', (req, res, next) => {
  res.render('add');
});

router.post('/', (req, res, next) => {
  const { country } = req.body;
  const { _id } = req.session.currentUser;

  Country.findOne({ name: country })
    .then((foundCountry) => {
      if (foundCountry) {
        return User.findByIdAndUpdate(_id, { $push: { travelLog: foundCountry._id } });
      }
    })
    .then(() => {
      res.redirect('/travellog');      
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
