const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const protectedRoutes = require('../middlewares/protectedRoutes');

const router = express.Router();
const bcryptSalt = 10;

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  console.log("POST LOGIN");
  const { username, password } = req.body;

  if (username === '' || password === '') {
    // res.render('partials/users', {
    //   user: undefined,
    //   errorMessage: 'Indicate a username and a password to sign up'
    // });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        // res.render('partials/users', {
        //   user: undefined,
        //   errorMessage: "The username doesn't exist"
        // });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect('/travellog');
      } else {
        // res.render('partials/users', {
        //   user: undefined,
        //   errorMessage: 'Incorrect user or password'
        // });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password, homeCountry } = req.body;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === '' || password === '' || homeCountry === '') {
    // res.render('partials/signup', {
    //   errorMessage: 'Indicate a username and a password to sign up'
    // });
    return;
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
        // res.render('partials/signup', { errorMessage: "Incorrect Username or Password" });
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
