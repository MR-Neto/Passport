require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const Coordinates = require('../models/coordinates');
const Country = require('../models/country');


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async () => {
    console.log('connected');
    await Coordinates.deleteMany();
    console.log('deleted coordinates');
    const countries = await Country.find();
    console.log('found countries');

    countries.forEach(async (country) => {
      const coordinatesRes = await axios.get(`https://nominatim.openstreetmap.org/search?country=${country.name.replace(" ","+")}&format=json&polygon_geojson=1&namedetails=1`);
      if (coordinatesRes.data.length > 0) {
        // const name = coordinatesRes.data[0].namedetails.int_name || coordinatesRes.data[0].namedetails.name || coordinatesRes.data[0].namedetails.official_name || coordinatesRes.data[0].display_name;
        // console.log('NAME coordinates', name);
        // console.log('NAME Country DB country ', country.name);
        const createdDoc = await Coordinates.create({ name: country.name, coordinates: coordinatesRes.data[0].geojson });
        console.log("SAVED COORDINATES FOR ", createdDoc.name);
      }
    });

  })
  .catch((err) => {
    console.log('error ', err);
  });


//  mongoose.connection.close();
