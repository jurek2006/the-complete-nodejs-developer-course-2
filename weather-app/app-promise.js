const fs = require('fs');
const yargs = require('yargs');
const axios = require('axios');


const argv = yargs
    .options({
        a: {
            alias: 'address',
            describe: 'Adres dla którego zostanie pobrana pogoda',
            string: true
        }, 
        d: {
            alias: 'default',
            describe: 'Zapisz adres jako domyślny'
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let address;

if(argv.address){
// jeśli podano adres
    
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

        // jeśli zdefiniowano opcję/flagę default - zapisanie jej jako adresu domyślnego
        if(argv.default){

            const defaultLocation = {
                formatted_address: response.data.results[0].formatted_address,
                latitude: response.data.results[0].geometry.location.lat,
                longtitude: response.data.results[0].geometry.location.lng
            }
            
            fs.writeFile('default-loc.json', JSON.stringify(defaultLocation, undefined, 2), (err) => {
                if(err) throw new Error('Nie udało się zapisać domyślnego zadresu');

                console.log('Zapisano jako domyślną lokalizację');
            });
        }
        
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
} else {
// jeśli nie podano adresu w parametrze - wczytanie i użycie adresu domyślnego

    const readDefaultAddress = () => {
        return new Promise((resolve, reject) => {
            fs.readFile('default-loc.json', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(JSON.parse(data));
                }
            });
        })
    }

    readDefaultAddress().then( defaultAddress => {
        console.log('Użycie adresu domyślnego:');
        console.log(defaultAddress.formatted_address);
        const weatherUrl = `https://api.darksky.net/forecast/c7cfcbce6684739088fa1d957987592e/${defaultAddress.latitude},${defaultAddress.longtitude}?units=si&lang=pl`;
        return axios.get(weatherUrl);
    }).then((response) => {
        const temperature = response.data.currently.temperature;
        const apparentTemperature = response.data.currently.apparentTemperature;

        console.log(`Aktualna temperatura ${temperature} st. C, temperatura odczuwalna ${apparentTemperature} st. C`);
    }).catch(error => {
        console.log('Błąd');
        if(error.code === 'ENOTFOUND'){
            console.log('Nieudane połączenie z serwerami weather API');
        } else if (error.code === 'ENOENT'){
            console.log('Nie można odczytać pliku aby wczytać domyślną lokalizację');
        } else {
            console.log(error.message);
        }
    });

    
}
