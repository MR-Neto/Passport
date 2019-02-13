require("dotenv").config();
const axios = require('axios');
const mongoose = require('mongoose');
const Country = require('../models/country');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(async () => {
    console.log('connected');
    await Country.deleteMany();
    console.log('deleted countries');
    const countriesApiRes = await axios.get('https://restcountries.eu/rest/v2/all?fields=name;capital;region;subregion;population;latlng;area;languages;flag;regionalBlocs');
    console.log('accessed countries API');
    const { data } = countriesApiRes;

    const cleanData = data.map((country) => {
      let lat = country.latlng[0] || 0;
      let lng = country.latlng[1] || 0;
      country.location = {
        type: 'Point',
        coordinates: [lng, lat],
      };
      delete country.latlng;
      return country;
    });

    cleanData.forEach(async (country) => {
      const coordinatesRes = await axios.get(`https://nominatim.openstreetmap.org/search?country=${country.name.replace(" ", "+")}&format=json&polygon_geojson=1`);
      console.log('got coordinates for ', country.name);
      console.log('got coordinates for ', coordinatesRes.data[0].geojson);
      if (coordinatesRes.data[0].geojson) {
        const createdDoc = await Country.create({
          name: country.name,
          capital: country.capital,
          region: country.region,
          subregion: country.subregion,
          population: country.population,
          location: country.location,
          area: country.area,
          languages: country.languages,
          flag: country.flag,
          regionalBlocs: country.regionalBlocs,
          coordinates: coordinatesRes.data[0].geojson,
        });
        console.log('Added to DB: ', createdDoc.name);
      } else {
        const createdDoc = await Country.create({
          name: country.name,
          capital: country.capital,
          region: country.region,
          subregion: country.subregion,
          population: country.population,
          location: country.location,
          area: country.area,
          languages: country.languages,
          flag: country.flag,
          regionalBlocs: country.regionalBlocs,
          coordinates: [],
        });
        console.log('Added to DB: ', createdDoc.name);
      }
    });
  })
  .catch((err) => {
    console.log('error ', err);
  });


  //console.log('loaded countries');
  //mongoose.connection.close();