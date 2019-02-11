const Statistics = {
  calculateNumOfCountries: trips => Statistics.uniqueArray(Statistics.flattenArray(trips)).length,

  calculateArea: trips => Statistics.uniqueArray(Statistics.flattenArray(trips))
    .reduce((acc, country) => acc + country.area, 0),

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
    return sortedDates.pop().country.flag;
  },
};

module.exports = Statistics;
