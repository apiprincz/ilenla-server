const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://currency-converter5.p.rapidapi.com/currency/convert',
  params: {format: 'json', from: 'AUD', to: 'CAD', amount: '1'},
  headers: {
    'X-RapidAPI-Key': '6cc4023449msheff0175014a90cdp16ea95jsnc08414ec7622',
    'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(response.data);
}).catch(function (error) {
	console.error(error);
});