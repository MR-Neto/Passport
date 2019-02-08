const loggedInRoute = (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect('/travellog');
  } else {
    next();
  }
};

module.exports = loggedInRoute;