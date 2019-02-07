const mongoose = require('mongoose');
const Country = require('../models/country');

const countries = [
  {
    name: 'Portugal',
  },
  {
    name: 'France',
  },
  {
    name: 'Spain',
  },
  {
    name: 'Italy',
  },
  {
    name: 'Belgium',
  },
  {
    name: 'Guatemala',
  },
];

mongoose.connect('mongodb://localhost:27017/travelLog', { useNewUrlParser: true })
  .then(() => {
    console.log('connected');
    return Country.deleteMany();
  })
  .then(() => {
    console.log('deleted');
    return Country.insertMany(countries);
  })
  .then(() => {
    console.log('loaded data');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('error ', err);
  });
