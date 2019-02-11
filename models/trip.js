const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const tripSchema = new Schema({
  name: { type: String },
  users: [{ type: ObjectId, ref: 'User' }],
  countries: [{ type: ObjectId, ref: 'Country' }],
  dates: {
    startData: { type: Date },
    endData: { type: Date },
  },
}, {
  timestamps: true,
});

const Trip = mongoose.model('Country', tripSchema);

module.exports = Trip;
