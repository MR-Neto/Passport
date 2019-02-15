const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const moment = require('moment');
const idValidator = require('../middlewares/idValidation');
const User = require('../models/user');
const Country = require('../models/country');
const Trip = require('../models/trip');
const Statistics = require('../helper/statistics');

const { ObjectId } = mongoose.Types;
require('dotenv').config();

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

        let img = '';
        switch (foundCountry.region) {
          case 'Europe':
            img = '../img/trip-europe.jpg';
            break;
          case 'Americas':
            img = '../img/trip-americas.jpg';
            break;
          case 'Asia':
            img = '../img/trip-asia.jpg';
            break;
          case 'Oceania':
            img = '../img/trip-oceania.jpg';
            break;
          case 'Africa':
            img = '../img/trip-africa.jpg';
            break;
          default:
            img = '../img/trip-background.jpg';
            break;
        }

        return Trip.create({
          name: country,
          img,
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

router.get('/map', (req, res, next) => {
  const { _id } = req.session.currentUser;

  Trip.find({ users: _id }).populate('countries.country')
    .then((trips) => {
      const countries = Statistics.uniqueArray(Statistics.flattenArray(trips));
      console.log(countries);
      res.render('map', { countries, GMAPAPIKEY: process.env.GMAPAPIKEY });
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/comparison', async (req, res, next) => {
  const user = req.session.currentUser._id;

  const tripsUser = await Trip.find({ users: user }).populate('countries.country');
  const countriesUser = Statistics.uniqueArray(Statistics.flattenArray(tripsUser));
  const countriesComparisonUser = [];

  res.render('comparison', { countriesUser, countriesComparisonUser, GMAPAPIKEY: process.env.GMAPAPIKEY });
});

router.post('/comparison', async (req, res, next) => {
  const user = req.session.currentUser._id;
  const { nameComparisonUser } = req.body;
  const tripsUser = await Trip.find({ users: user }).populate('countries.country');
  const countriesUser = Statistics.uniqueArray(Statistics.flattenArray(tripsUser));
  const comparisonUser = await User.find({ username: nameComparisonUser });
  const tripsComparisonUser = await Trip
    .find({ users: comparisonUser[0]._id })
    .populate('countries.country');
  const countriesComparisonUser = Statistics.uniqueArray(Statistics.flattenArray(tripsComparisonUser));
  res.render('comparison', { countriesUser, countriesComparisonUser, GMAPAPIKEY: process.env.GMAPAPIKEY });
});

router.get('/:id', idValidator, (req, res, next) => {
  const { id } = req.params;
  Trip.findById(id).populate('countries.country')
    .then((trip) => {
      const startDate = moment(trip.countries[0].dates.startDate).format('MMM Do YYYY');
      const endDate = moment(trip.countries[0].dates.endDate).format('MMM Do YYYY');
      const { name } = trip.countries[0].country;
      const { flag } = trip.countries[0].country;
      const { region } = trip.countries[0].country;
      const { capital } = trip.countries[0].country;
      res.render('trip-details', {
        name,
        flag,
        region,
        capital,
        startDate,
        endDate,
      });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/:id/delete', idValidator, (req, res, next) => {
  const tripId = req.params.id;

  Trip.findByIdAndDelete(tripId)
    .then(() => {
      res.redirect('/travellog');
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
