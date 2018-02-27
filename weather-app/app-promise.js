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
        },
        f: {
            alias: 'farenheitTemp',
            describe: 'Wyświetl temperaturę w farenheitach zamiast w celsjuszach.'
        },
        p: {
            alias: 'hours48',
            describe: 'Wyświetl prognozę na 48h'
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

const getWeatherRequest = (latitude, longtitude, farenheitTemp = false) => {
    // zapytanie do forecast.io o pogodę - zwraca promisę

    const weatherUrl = `https://api.darksky.net/forecast/c7cfcbce6684739088fa1d957987592e/${latitude},${longtitude}?units=${farenheitTemp ? 'us' : 'si'}&lang=pl`;
    return axios.get(weatherUrl);
}

const getWeatherResponse = (response) => {
// funkcja obsługi poprawnego zapytania (promisy) dla getWeather
    const temperature = response.data.currently.temperature;
    const apparentTemperature = response.data.currently.apparentTemperature;
    let unit;
    if (response.data.flags.units === 'si') unit = 'C';
    else if(response.data.flags.units === 'us') unit = 'F'

    console.log(`Aktualna temperatura ${temperature} st. ${unit}, temperatura odczuwalna ${apparentTemperature} st. ${unit}`);
    if(argv.hours48){
        console.log('Prognoza na 48h: ');

        const intlOptions = { 
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', 
            hour12: false,
            timeZone: 'Europe/Warsaw',
            timeZoneName: 'short'
        };

        for(const hour in response.data.hourly.data){
            
            const date = new Intl.DateTimeFormat('pl-PL', intlOptions).format(new Date(response.data.hourly.data[hour].time * 1000)); 
            const temperature = response.data.hourly.data[hour].temperature.toString().padStart(9);
            const apparentTemperature = response.data.hourly.data[hour].apparentTemperature.toString().padStart(9);
            const summary = response.data.hourly.data[hour].summary.toString().padEnd(30);

            let precip = '';
            const precipProbability = response.data.hourly.data[hour].precipProbability;
            if(precipProbability > 0){
                precip = `${parseInt(precipProbability * 100)}% ${response.data.hourly.data[hour].precipType}`
            }

            console.log(`${date} --- Temp.: ${temperature} st. ${unit}   Odczuwalna: ${apparentTemperature} st. ${unit}   ${summary} ${precip}`);
        }
    }
}

const getWeatherErrorHandler = (error) => {
// funkcja obsługi błędnego zapytania (promisy) dla getWeather
    console.log('Błąd');
    if(error.code === 'ENOTFOUND'){
        console.log('Nieudane połączenie z serwerami weather API');
    } else if (error.code === 'ENOENT'){
        console.log('Nie można odczytać pliku aby wczytać domyślną lokalizację');
    } else {
        console.log(error.message);
    }
}
    

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
        return getWeatherRequest(latitude, longtitude, argv.farenheitTemp);

    }).then(getWeatherResponse).catch(getWeatherErrorHandler);
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

        // ZAPYTANIE O POGODĘ DO FORECAST.IO
        return getWeatherRequest(defaultAddress.latitude, defaultAddress.longtitude, argv.farenheitTemp);
        
    }).then(getWeatherResponse)
    .catch(getWeatherErrorHandler);

}

