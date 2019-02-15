require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('../models/country');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('connected');
    return Country.deleteMany();
  })
  .then(() => {
    console.log('deleted');
    return axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;region;subregion;population;latlng;area;languages;flag;regionalBlocs;alpha2Code');
  })
  .then((res) => {
    console.log('accessed API');
    const { data } = res;
    const cleanData = data.map((country) => {
      if (country.name === 'Bolivia (Plurinational State of)') {
        country.name = 'Bolivia';
      }
      if (country.name === 'Iran (Islamic Republic of)') {
        country.name = 'Iran';
      }
      if (country.name === `Korea (Democratic People's Republic of)`) {
        country.name = 'North Korea';
      }
      if (country.name === 'Korea (Republic of)') {
        country.name = 'South Korea';
      }
      if (country.name === 'United States of America') {
        country.name = 'United States';
      }
      if (country.name === 'United Kingdom of Great Britain and Northern Ireland') {
        country.name = 'United Kingdom';
      }


      let lat = country.latlng[0] || 0;
      let lng = country.latlng[1] || 0;
      country.location = {
        type: 'Point',
        coordinates: [lng, lat],
      };
      delete country.latlng;
      return country;
    });

    return Country.insertMany(cleanData);
  })
  .then(() => {
    console.log('loaded data');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log('error ', err);
  });
