const   request = require('request');

const getWeather = (latitude, longtitude, callback) => {
    request({
        url: `https://api.darksky.net/forecast/c7cfcbce6684739088fa1d957987592e/${latitude},${longtitude}?units=si&lang=pl`,
        json: true
    }, (error, response, body) => {
        if(!error && response.statusCode === 200){
            callback(undefined, {
                temperature: body.currently.temperature,
                apparentTemperature: body.currently.apparentTemperature
            });
        } else {
            callback('Nie można pobrać danych z API forecast.io');
        } 
    });
}

module.exports = {
    getWeather
}