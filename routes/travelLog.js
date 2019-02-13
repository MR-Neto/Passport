const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Country = require('../models/country');
const User = require('../models/user');
const Trip = require('../models/trip');
const Statistics = require('../helper/statistics');
require("dotenv").config();


const router = express.Router();

router.get('/', (req, res, next) => {
  const { _id } = req.session.currentUser;

  Trip.find({ users: _id }).populate('countries.country')
    .then((trips) => {
      const numOfCountries = Statistics.calculateNumOfCountries(trips);
      const areaCovered = Statistics.calculateArea(trips);
      const totalWorldArea = Statistics.worldArea;
      const percentageArea = Math.round(areaCovered / totalWorldArea * 100 * 100) / 100;
      const lastVisitedCountryFlag = Statistics.getLastVisiteCountryFlag(trips);
      const numOfContinents = Statistics.calculateContinents(trips);

      res.render('travellog', {
        trips,
        numOfCountries,
        percentageArea,
        lastVisitedCountryFlag,
        numOfContinents,
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/add', (req, res, next) => {
  Country.find({})
    .then((countries) => {
      res.render('add', { countries });
    })
    .catch((err) => {
      next(err);
    });
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

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  Trip.findById(id).populate('countries.country')
    .then((trip) => {
      res.render('trip-details', { trip });
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

  Trip.find({ users: _id }).populate('countries.country')
    .then((trips) => {
      const countries = Statistics.uniqueArray(Statistics.flattenArray(trips));
      res.render('map', { countries, GMAPAPIKEY: process.env.GMAPAPIKEY });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
