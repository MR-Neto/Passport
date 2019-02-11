const express = require('express');
const mongoose = require('mongoose');
const Country = require('../models/country');
const User = require('../models/user');
const Trip = require('../models/trip');
const Statistics = require('../helper/statistics');


const router = express.Router();

router.get('/', (req, res, next) => {
  const { _id } = req.session.currentUser;

  Trip.find({ users: _id }).populate('countries.country')
    .then((trips) => {     
      const numOfCountries = Statistics.calculateNumOfCountries(trips);
      const areaCovered = Statistics.calculateArea(trips);
      const lastVisitedCountryFlag = Statistics.getLastVisiteCountryFlag(trips);
      console.log(lastVisitedCountryFlag);

      res.render('travellog', {
        trips,
        numOfCountries,
        areaCovered,
        lastVisitedCountryFlag,
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/add', (req, res, next) => {
  res.render('add');
});


router.post('/', (req, res, next) => {
  const { country, startDate, endDate } = req.body;

  const userId = req.session.currentUser._id;

  Country.findOne({ name: country })
    .then((foundCountry) => {
      if (foundCountry) {
        const countryId = mongoose.Types.ObjectId(foundCountry._id);

        return Trip.create({
          name: country,
          users: [userId],
          countries: [{ country: countryId, dates: { startDate, endDate } }],
        });
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
  const tripId = req.params.id;

  Trip.findByIdAndDelete(tripId)
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
