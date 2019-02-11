const express = require('express');
const Country = require('../models/country');
const User = require('../models/user');
const Trip = require('../models/trip');


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
  const { user, country, startDate, endDate } = req.body;

  const userId = req.session.currentUser._id;

  Trip.create({
    name: 'TRIP',
    dates: { startDate, endDate },
  })
    .then((userCreated) => {
      req.session.currentUser = userCreated;
      res.redirect('/travellog');
    })
    .catch((error) => {
      next(error);
    });

  Country.findOne({ name: country })
    .then((foundCountry) => {
      if (foundCountry) {
        return User.findByIdAndUpdate(userId, { $push: { travelLog: foundCountry._id } });
      }
      req.flash('error', 'Incorrect country input');
      res.redirect('/travellog/add');
    })
    .then(() => {
      res.redirect('/travellog');
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/delete', (req, res, next) => {
  const countryId = req.params.id;
  const userId = req.session.currentUser._id;

  User.findByIdAndUpdate(userId, { $pull: { travelLog: countryId } })
    .then(() => {
      res.redirect('/travellog');
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/map', (req, res, next) => {
  const { _id } = req.session.currentUser;

  User.findById(_id).populate('travelLog')
    .then((data) => {
      res.render('map', { travelLog: data.travelLog });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
