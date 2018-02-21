const   request = require('request');

const geocodeAddress = (address, callback)=> {
    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address),
        json: true
    }, (error, response, body) => {
        if(error){
            callback('Nie można połączyć z serwerami Google');
        } else if(body.status === 'ZERO_RESULTS'){
            callback('Nie znaleziono adresu');
        } else if(body.status === 'OK'){
            callback(undefined, {
                address: body.results[0].formatted_address,
                latitude: body.results[0].geometry.location.lat,
                longtitude: body.results[0].geometry.location.lng
            })
        } else {
            callback(`Niestandardowy status ${body.status}`);
        }
    });
}

module.exports = {
    geocodeAddress
}