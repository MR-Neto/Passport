const express = require('express');
const Country = require('../models/country');
const User = require('../models/user');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('travellog');
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
      return null;
    })
    .catch((error) => {
      next(error);
    });

  res.render('add');
});

module.exports = router;
