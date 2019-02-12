const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const User = require('../models/user');
const Country = require('../models/country');
const loggedInRoute = require('../middlewares/loggedIn');
require("dotenv").config();

const router = express.Router();
const bcryptSalt = 10;

router.get('/login', loggedInRoute, (req, res, next) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;
  res.render('auth/login', { clientId, redirectUri });
});

router.get('/login/instagram', (req, res, next) => {
  const { code } = req.query;
  console.log(code);

  axios.post('https://api.instagram.com/oauth/access_token', {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: process.env.REDIRECT_URI,
    code,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    req.flash('info', 'Please fill all fields');
    res.redirect('/auth/login');
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Incorrect user or password');
        res.redirect('/auth/login');
      }
      if (bcrypt.compareSync(password, user.password)) {
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
  Country.find({})
    .then((countries) => {
      res.render('auth/signup', { countries });
    })
    .catch((error) => {
      next(error);
    });
});

router.post('/signup', (req, res, next) => {
  const { username, password, homeCountry } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '' || homeCountry === '') {
    req.flash('info', 'Please fill all fields');
    res.redirect('/auth/signup');
  }
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        User.create({
          username,
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
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect('/');
  });
});

module.exports = router;
