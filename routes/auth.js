const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const mongoose = require('mongoose');
const qs = require('query-string');
const User = require('../models/user');
const Country = require('../models/country');
const Trip = require('../models/trip');

const { ObjectId } = mongoose.Types;
const loggedInRoute = require('../middlewares/loggedIn');
require('dotenv').config();

const router = express.Router();
const bcryptSalt = 10;

router.get('/login', loggedInRoute, (req, res, next) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  res.render('auth/login', { clientId, redirectUri });
});

router.get('/login/instagram', async (req, res, next) => {
  const { code } = req.query;

  try {
    const tokenResult = await axios.post(
      'https://api.instagram.com/oauth/access_token',
      qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI,
        code,
      }),
    );
    const { username, profile_picture } = tokenResult.data.user;
    const token = tokenResult.data.access_token;
    const user = await User.findOne({ username });
    if (!user) {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(username, salt);
      const userCreated = await User.create({
        username,
        password: hashPass,
        profilePicture: profile_picture,
        isCreatedFromInstagram: true,
      });
      req.session.currentUser = userCreated;

      // HOW TO PROTECT THE TOKEN????
      const media = await axios.get(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${token}`);

      const instagramTrips = [];

      for (let index = 0; index < media.data.data.length; index++) {
        if (media.data.data[index].location) {
          const geocode = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${media.data.data[index].location.latitude},${media.data.data[index].location.longitude}&result_type=country&key=${process.env.GEOCODEAPIKEY}`);
          if (geocode.data.results.length > 0 && media.data.data[index].images.low_resolution.url) {
            const trip = {
              img: media.data.data[index].images.low_resolution.url,
              name: geocode.data.results[0].formatted_address,
              users: [ObjectId(req.session.currentUser._id)],
            };
            instagramTrips.push(trip);
          }
        }
      }

      const countries = await Country.find({});

      for (let index = 0; index < instagramTrips.length; index++) {
        instagramTrips[index].countries = [{
          country: countries.find((country) => {
            return country.name === instagramTrips[index].name;
          })._id,
        }];
      }
      const createdTrips = await Trip.insertMany(instagramTrips);
    } else {
      req.session.currentUser = user;
    }

    res.redirect('/travellog');
  } catch (error) {
    next(error);
  }
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    req.flash('info', 'Please fill all fields');
    res.redirect('/auth/login');
  }
  const sanitizedUsername = req.sanitize(username);
  const sanitizedPassword = req.sanitize(password);
  const trimmedUsername = sanitizedUsername.trim();
  const trimmedPassword = sanitizedPassword.trim();
  User.findOne({ username: trimmedUsername })
    .then((user) => {
      if (!user || user === null) {
        req.flash('error', 'Incorrect user or password');
        res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(trimmedPassword, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/travellog');
      } else {
        req.flash('error', 'Incorrect user or password');
        res.redirect('/auth/login');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/signup', loggedInRoute, (req, res, next) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  Country.find({})
    .then((countries) => {
      res.render('auth/signup', { countries, clientId, redirectUri });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/signup', (req, res, next) => {
  const { username, password, homeCountry } = req.body;

  if (username === '' || password === '' || homeCountry === '') {
    req.flash('info', 'Please fill all fields');
    res.redirect('/auth/signup');
  }
  const sanitizedUsername = req.sanitize(username);
  const sanitizedPassword = req.sanitize(password);
  const trimmedUsername = sanitizedUsername.trim();
  const trimmedPassword = sanitizedPassword.trim();
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(trimmedPassword, salt);

  User.findOne({ username: trimmedUsername })
    .then((user) => {
      if (!user) {
        User.create({
          username: trimmedUsername,
          password: hashPass,
          homeCountry,
        })
          .then((userCreated) => {
            req.session.currentUser = userCreated;
            res.redirect('/travellog');
          })
          .catch((error) => {
            next(error);
          });
      } else {
        req.flash('error', 'Incorrect values');
        res.redirect('/auth/signup');
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
    // cannot access session here
    res.redirect('/');
  });
});

module.exports = router;
