// Projekt utrwalający wiadomości z sekcji 3
// Obsługa sklepu

// sprzedaż towaru X
// zwrot zamówienia X
// stan kasy
// stan magazynu
// dodanie towaru X do magazynu
// sprawdzenie stanu magazynu i wartości

// node app.js sell -p komputer -a 2 //sprzedanie produktu komputer w ilości 2
// node app.js return -o 123 //zwrot zamówienia o numerze 123
// node app.js cash //podanie stanu kasy
// node app.js cash -s 100 //ustawienie stanu kasy na 100
// node app.js order //lista zamówień
// node app.js order -o 12//szczegóły zamówienia o id 12
// node app.js warehouse //wylistowanie stanu magazynowego
// node app.js warehouse -p komputer //stan magazynowy produktu komputer //--product
// node app.js warehouse -p komputer -a 20 //stan magazynowy produktu komputer ustawiany na 20 szt. (utworzenie produktu jeśli nie ma o takiej nazwie) // --amount --price
// node app.js warehouse -p komputer -v 1000 //wartość produktu komputer ustawiana na 1000 zł (utworzenie produktu jeśli nie ma o takiej nazwie)
// node app.js warehouse -p komputer -r //usuwanie produktu komputer z magazynu //--remove

// (*) node app.js warehouse -p komputer -a 20 -v 1000 //

const   fs = require('fs'),
		_ = require('lodash'),
		yargs = require('yargs');

const   shop = require('./shop'),
        warehouse = require('./warehouse');

const argv = yargs
            .command('warehouse', 'Stan magazynu', {
                product: {
                    describe: 'Nazwa towaru',
                    alias: 'p'
                },
                amount: {
                    describe: 'Ustawienie ilości produktu w magazynie',
                    alias: 'a'
                }, 
                price: {
                    describe: 'Ustawienie ceny produktu w magazynie',
                    alias: 'v'
                },
                remove:{
                    describe: 'Usuwanie produktu',
                    alias: 'r'
                }
            })
            .command('sell', 'Sprzedaż towaru', {
                product: {
                    describe: 'Nazwa towaru do sprzedania',
                    demand: true,
                    alias: 'p'
                },
                amount: {
                    describe: 'Ilość sprzedawanego towaru (gdy nie podano jest to 1)',
                    alias: 'a'
                }, 
            })
            .help()
            .argv;

let command = argv._[0];

switch (command){
    case 'sell':
        // sprzedaż towaru - domyślnie w ilości 1
        shop.sellProduct(argv.product, argv.amount);
        break;
    case 'return':
        console.log('Zwrot zamówienia');
        break;
    case 'cash':
        console.log('Stan kasy');
        break;
    case 'order':
        console.log('Lista zamówień');
        break;
    case 'warehouse':
        if(!argv.product){
            // jeśli nie zdefiniowano parametru produktu - wylistowanie stanu magazynowego 
            warehouse.listWarehouse();
        } else {

            if(argv.amount || argv.price){
                // jeśli zdefiniowano amount lub price - dodawanie lub uaktualnianie istniejącego produktu
                warehouse.updateProduct(argv.product, argv.amount, argv.price);
            } else if(argv.remove){
                // jeśli zdefiniowane remove - usuwanie produktu
                warehouse.removeProduct(argv.product);
            } else {
                // jeśli nie zdefiniowano parametru ilości ani wartości dla produktu - wyświetlenie stanu magazynowego produktu
                warehouse.statusProduct(argv.product);
            }
        }
        break;
    default:
        console.log('Nie rozpoznano polecenia');
        break;
}
