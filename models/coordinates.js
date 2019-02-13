const mongoose = require('mongoose');

const { Schema } = mongoose;

const coordinatesSchema = new Schema({
  name: { type: String },
  coordinates: { type: Schema.Types.Mixed },
});

coordinatesSchema.index({ location: '2dsphere' });

const Coordinates = mongoose.model('Coordinate', coordinatesSchema);

module.exports = Coordinates;
