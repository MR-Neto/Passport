const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  homeCountry: { type: String },
  isCreatedFromInstagram: { type: Boolean, default: false },
  profileUser: { type: String },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
