const mongoose = require('mongoose');

const idValidator = (req, res, next) => {
  const { id } = req.params;
  if (mongoose.Types.ObjectId.isValid(id) && id.match(/^[a-fA-F0-9]{24}$/)) {
    next();
  } else {
    res.render('error/404');
  }
};

module.exports = idValidator;
