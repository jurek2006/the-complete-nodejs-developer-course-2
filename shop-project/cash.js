const   fs = require('fs'),
        _ = require('lodash');

const fetchCash = () => {
    try {
        return JSON.parse(fs.readFileSync('cash-data.json'));
    } catch (error) {
        return []
    }
}

const saveCash = cash => fs.writeFileSync('cash-data.json', JSON.stringify(cash));

const addCashOperation = (operation) => {
    const cash = fetchCash();
    if(!operation.saldo){
    // Jeśli nie podano salda (nie jest ono ręcznie zdefiniowane) - Wyliczenie salda
    // jeśli nie ma wcześniej nic w cash to saldo jest równe wartości operacji, gdy są wcześniejsze zamówienia saldo wynosi saldo ostatniej operacji + wartość bieżącej
        operation.saldo = cash.length === 0 ? operation.cashUpdate : cash[cash.length - 1].saldo + operation.cashUpdate;
    }
    // zapisanie daty i czasu operacji
    operation.dateTime = `${new Date().toLocaleString('pl-PL', {year: 'numeric', month: '2-digit', day:'2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'})}`;
    cash.push(operation);
    saveCash(cash);
}

const cashStatus = details => {
// wyświetla stan kasy - jeśli wybrano details wyświetla szczegóły wszystkich operacji kasowych
    
// ogólny stan kasy - czyli saldo po ostatniej operacji
    const cash = fetchCash();
    console.log(`Aktualny stan kasy: ${cash[cash.length-1].saldo} zł`);
    console.log(`-------------------------------------------------`);

    if(details){
        // szczegóły stanu kasy
        console.log(`Szczegóły operacji kasowych:`);
        cash.forEach(cashOperation => console.log(`Data: ${cashOperation.dateTime} \tKwota: \t${cashOperation.cashUpdate} zł \tOperacja: \t${cashOperation.operation} do zamówienia ${cashOperation.orderId}. \tSaldo po operacji: \t${cashOperation.saldo}`));
    } 

}

module.exports = {
    addCashOperation,
    cashStatus
}