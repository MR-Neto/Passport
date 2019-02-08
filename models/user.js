const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;


const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  homeCountry: { type: String, required: true },
  travelLog: [{ type: ObjectId, ref: 'Country' }],
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
