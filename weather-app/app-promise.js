const yargs = require('yargs');
const axios = require('axios');


const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Adres dla którego zostanie pobrana pogoda',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

// ZAPYTANIE O DŁUGOŚĆ I SZEROKOŚĆ GEOGRAFICZNĄ DO GOOGLE API
const geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(argv.address);

axios.get(geocodeUrl).then((response) => {
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('Nie można znaleźć adresu');
    } else if(response.data.status === 'OVER_QUERY_LIMIT'){
        throw new Error('Przekroczenie limitu API');
    }
    
    const latitude = response.data.results[0].geometry.location.lat;
    const longtitude = response.data.results[0].geometry.location.lng;
    
    console.log(response.data.results[0].formatted_address);
    
    // ZAPYTANIE O POGODĘ DO FORECAST.IO
    const weatherUrl = `https://api.darksky.net/forecast/c7cfcbce6684739088fa1d957987592e/${latitude},${longtitude}?units=si&lang=pl`;

    return axios.get(weatherUrl);
}).then((response) => {
    const temperature = response.data.currently.temperature;
    const apparentTemperature = response.data.currently.apparentTemperature;

    console.log(`Aktualna temperatura ${temperature} st. C, temperatura odczuwalna ${apparentTemperature} st. C`);
}).catch((error) => {
    if(error.code === 'ENOTFOUND'){
        console.log('Nieudane połączenie z serwerami API');
    } else {
        console.log(error.message);
    }
});