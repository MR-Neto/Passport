const Country = require('../models/country');

const Statistics = {


  calculateNumOfCountries: trips => Statistics.uniqueArray(Statistics.flattenArray(trips)).length,

  calculateArea: trips => Statistics.uniqueArray(Statistics.flattenArray(trips))
    .reduce((acc, country) => acc + country.area, 0),


  getLastVisiteCountryFlag: (trips) => {
    const sortedDates = Statistics.flattenArray(trips).sort((a, b) => {
      if (a.dates.endDate < b.dates.endDate) {
        return -1;
      }
      if (a.dates.endDate > b.dates.endDate) {
        return 1;
      }
      // a must be equal to b
      return 0;
    });
    // Check the case where trips is empty
    if (sortedDates.length > 0) {
      return sortedDates.pop().country.flag;
    }
    return undefined;
  },

  calculateContinents: (trips) => {
    let africa = 0;
    let americas = 0;
    let europe = 0;
    let asia = 0;
    let oceania = 0;
    let polar = 0;

    Statistics.uniqueArray(Statistics.flattenArray(trips)).forEach((country) => {
      if (country.region === 'Africa' && africa === 0) {
        africa = 1;
      }
      if (country.region === 'Americas' && americas === 0) {
        americas = 1;
      }
      if (country.region === 'Europe' && europe === 0) {
        europe = 1;
      }
      if (country.region === 'Asia' && asia === 0) {
        asia = 1;
      }
      if (country.region === 'Oceania' && oceania === 0) {
        oceania = 1;
      }
      if (country.region === 'Polar' && polar === 0) {
        polar = 1;
      }
    });

    return africa + americas + europe + asia + oceania + polar;
  },

  calculateTotalWorldArea: countries => countries.reduce((acc, country) => acc + (Number(country.area) || 0), 0),

  flattenArray: array => array
    .reduce((acc, currentValue) => acc.concat(currentValue.countries), []),

  uniqueArray: (array) => {
    const stringArray = [];
    const uniqueArray = [];

    array.forEach((element) => {
      if (!stringArray.includes(element.country.toString())) {
        stringArray.push(element.country.toString());
        uniqueArray.push(element.country);
      }
    });
    return uniqueArray;
  },
  worldArea: 0,
};

Country.find({})
  .then((countries) => {
    Statistics.worldArea = Statistics.calculateTotalWorldArea(countries);
  });


module.exports = Statistics;
