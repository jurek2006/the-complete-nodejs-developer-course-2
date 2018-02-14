// Projekt utrwalający wiadomości z sekcji 3
// Obsługa sklepu

// sprzedaż towaru X
// zwrot zamówienia X
// stan kasy
// stan magazynu
// dodanie towaru X do magazynu
// sprawdzenie stanu magazynu i wartości

// node app.js sell -p komputer -a 2 //sprzedanie produktu komputer w ilości 2
// node app.js return -i 123 //zwrot zamówienia o numerze 123
// node app.js cash //podanie stanu kasy
// node app.js cash -s 100 //ustawienie stanu kasy na 100
// node app.js orders //lista zamówień
// node app.js orders -i 12 //szczegóły zamówienia o id 12
// node app.js orders -p komputer //wyszukanie zamówień dla produktu komputer

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
        warehouse = require('./warehouse'),
        cash = require('./cash');

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
            .command('orders', 'Zamówienia', {
                product: {
                    describe: 'Nazwa produktu do wyszukania zamówień',
                    alias: 'p'
                },
                id: {
                    describe: 'Id zamówienia dla którego mają być wyświetlone szczegóły (jeśli 0) to wszystkie zamówienia',
                    alias: 'i'
                }
            })
            .command('cash', 'Stan kasy', {
                details: {
                    describe: 'Wyświetl szczegóły wszystkich operacji kasowych',
                    alias: 'd'
                },
                set: {
                    describe: `Ustawienie aktualnego stanu kasy`,
                    alias: 's'
                }
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
        if(argv.set){
            // ustawianie salda kasy
            cash.addCashOperation({
                operation: "set cash saldo",
                saldo: argv.set
            })
        }
        cash.cashStatus(argv.details); //wyświetlenie aktualnego stanu kasy
        break;
    case 'orders':
        shop.listOrders(argv.product, argv.id)
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
