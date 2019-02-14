const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const tripSchema = new Schema({
  name: { type: String },
  img: { type: String },
  users: [{ type: ObjectId, ref: 'User' }],
  countries: [{
    country: { type: ObjectId, ref: 'Country' },
    dates: {
      startDate: { type: Date },
      endDate: { type: Date },
    },
  }],
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
