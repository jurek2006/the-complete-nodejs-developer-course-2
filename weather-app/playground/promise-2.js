const   request = require('request');

const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address),
            json: true
        }, (error, response, body) => {
            if(error){
                reject('Nie można połączyć z serwerami Google');
            } else if(body.status === 'ZERO_RESULTS'){
                reject('Nie znaleziono adresu');
            } else if(body.status === 'OK'){
                resolve({
                    address: body.results[0].formatted_address,
                    latitude: body.results[0].geometry.location.lat,
                    longtitude: body.results[0].geometry.location.lng
                })
            } else {
                reject(`Niestandardowy status ${body.status}`);
            }
        });
    });
};

geocodeAddress('Olawa').then(
    (location) => {
        console.log(JSON.stringify(location, undefined, 2));
    },
    (errorMessage) => {
        console.log(errorMessage);
    }
);