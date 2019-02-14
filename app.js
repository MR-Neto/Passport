const createError = require('http-errors');
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
require("dotenv").config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const travelLogRouter = require('./routes/travelLog');
const profileRouter = require('./routes/profile');
const protectedRoute = require('./middlewares/protected');
const notifications = require('./middlewares/notifications');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log('connected'))
  .catch(error => console.log('error', error));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layouts/layout');
app.set('layout extractScripts', true);

app.use(logger('dev'));
app.use(express.json());
app.use(expressSanitizer());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60, // 1 day
  }),
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

app.use(flash());
app.use(notifications);

app.use((req, res, next) => {
  app.locals.currentUser = req.session.currentUser;
  next();
});


app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/travellog', protectedRoute, travelLogRouter);
app.use('/profile', protectedRoute, profileRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log('YEASSSSS 1');
  next(createError(404));
});

// error handler
app.use((error, req, res) => {
  console.log('YEASSSSS 2');

  // Production mode
  let message;
  if (error.status === 404) {
    message = 'You got lost wanderer...';
    res.render('error', message);
  } else if (error.status || 500) {
    message = 'It seems our dear Passport broke. Try again later';
    res.render('error', message);
  }
  // // set locals, only providing error in development
  // res.locals.message = error.message;
  // res.locals.error = req.app.get('env') === 'development' ? error : {};
  // // render the error page
  // res.status(error.status || 500);
  // res.render('partials/error');
});

module.exports = app;
