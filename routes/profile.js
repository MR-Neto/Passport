const express = require('express');
const User = require('../models/user');
const Country = require('../models/country');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  Country.find({})
    .then((countries) => {
      res.render('profile', { countries });
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { username, homeCountry } = req.body;
  const { _id } = req.session.currentUser;

  if (username === '' || homeCountry === '') {
    // res.render('partials/signup', {
    //   errorMessage: 'Indicate a username and a password to sign up'
    // });
    return;
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        User.findByIdAndUpdate(_id, { username, homeCountry })
          .then(() => {
            res.redirect('/travellog');
          })
          .catch((err) => {
            next(err);
          });
      } else {
        req.flash('error', 'Incorrect values');
        res.redirect('/profile');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/delete', (req, res, next) => {
  const { _id } = req.session.currentUser;

  User.findByIdAndDelete(_id)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
