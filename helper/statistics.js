const Statistics = {
  calculateNumOfCountries: (trips) => {
    return Statistics.uniqueArray(Statistics.flattenArray(trips)).length;
  },
  calculateArea: (trips) => {    
    return Statistics.uniqueArray(Statistics.flattenArray(trips)).reduce((acc, country) => acc + country.area, 0);
  },
  flattenArray: (array) => {
    return array.reduce((acc, currentValue) => acc.concat(currentValue.countries), []);
  },
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
};


module.exports = Statistics;
