const mongoose = require('mongoose');

const { Schema } = mongoose;

const countrySchema = new Schema({
  name: { type: String, required: true, unique: true },
  capital: { type: String },
  region: { type: String },
  subregion: { type: String },
  population: { type: String },
  location: {
    type: {
      type: String,
    },
    coordinates: [Number],
  },
  area: { type: Number },
  languages: { type: Array },
  flag: { type: String },
  regionalBlocs: { type: Array },
  coordinates: {
    type: {
      type: String,
    },
    coordinates: [[[Number]]],
  },
});

countrySchema.index({ location: '2dsphere' });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
