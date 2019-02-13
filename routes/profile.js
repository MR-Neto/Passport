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
            // Update User session with new properties
            req.session.currentUser.username = username;
            req.session.currentUser.homeCountry = homeCountry;
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

router.get('/delete', (req, res, next) => {
  const { _id } = req.session.currentUser;

  User.findByIdAndDelete(_id)
    .then(() => {
      req.session.destroy();
      res.redirect('/');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
