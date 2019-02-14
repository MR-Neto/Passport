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
    .catch((error) => {
      next(error);
    });
});

router.post('/', (req, res, next) => {
  const { username, homeCountry } = req.body;
  const { _id } = req.session.currentUser;

  if (username === '' || homeCountry === '') {
    return;
  }
  const sanitizedUsername = req.sanitize(username);
  const trimmedUsername = sanitizedUsername.trim();

  // In case you do not change the username
  if (req.session.currentUser.username === trimmedUsername) {
    User.findByIdAndUpdate(_id, { homeCountry })
      .then(() => {
        // Update User session with new properties
        req.session.currentUser.homeCountry = homeCountry;
        res.redirect('/travellog');
      })
      .catch((err) => {
        next(err);
      });
  // In case you do not change the country of origin
  } else if (!homeCountry) {
    User.findByIdAndUpdate(_id, { username: trimmedUsername })
      .then(() => {
        // Update User session with new properties
        req.session.currentUser.username = trimmedUsername;
        res.redirect('/travellog');
      })
      .catch((err) => {
        next(err);
      });
  } else {
    User.findOne({ username: trimmedUsername })
      .then((user) => {
        if (!user) {
          User.findByIdAndUpdate(_id, { username, homeCountry })
            .then(() => {
              // Update User session with new properties
              req.session.currentUser.username = trimmedUsername;
              req.session.currentUser.homeCountry = homeCountry;
              res.redirect('/travellog');
            })
            .catch((error) => {
              next(error);
            });
        } else {
          req.flash('error', 'Incorrect values');
          res.redirect('/profile');
        }
      })
      .catch((error) => {
        next(error);
      });
  }
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
