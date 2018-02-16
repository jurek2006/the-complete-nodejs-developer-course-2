const   fs = require('fs'),
        _ = require('lodash');

const   warehouse = require('./warehouse'),
        cash = require('./cash');

const fetchOrders = () => {
    try {
        return JSON.parse(fs.readFileSync('orders-data.json'));
    } catch (error) {
        return []
    }
}

const saveOrders = orders => fs.writeFileSync('orders-data.json', JSON.stringify(orders));

const sellProduct = (product, amount = 1) =>{
    // sprawdzenie w magazynie czy jest dany produkt, w ilości nie mniejszej niż amount i czy ustalono cenę (jeśli nie, to nie można sprzedać)
    const sold = warehouse.takeProduct(product, amount);

    if(sold){
        // zapisanie zamówienia
        // zamienić na UPDATE ZAMÓWIENIE
        let orders = fetchOrders();
        const id = orders.length + 1;
        orders.push({
            id: id,
            productName: sold.name,
            amount: sold.amount,
            price: sold.price
        });
        saveOrders(orders);
        // zapisanie operacji kasowej:
        cash.addCashOperation({
            cashUpdate: sold.amount * sold.price,
            orderId: id,
            operation: 'sold product'
        });

        console.log(`Sprzedano ${sold.amount} szt. produktu ${sold.name}. Cena jednostkowa ${sold.price} zł`);
        console.log(`Wartość zamówienia: ${sold.amount * sold.price} zł`);
    }
}

const printOrders = orders => {
// wyświetla w konsoli wszystkie produkty z listy orders
    if(orders.length > 0){

        orders.forEach((order) => {
            console.log(`${order.id}.\t${order.productName}\t${order.amount}\t*\t${order.price} zł \t= ${order.amount * order.price} zł`);
        });
        console.log(`Wartość zamówień RAZEM: ${orders.reduce((previousValue, order) => previousValue + (order.amount * order.price), 0 )} zł`);
    } else {
        console.log(`Brak zamówienia o zadanych parametrach`);
    }
}

const listOrders = (productName, orderId) => {
    const orders = fetchOrders();

    if(orderId){
        // informacje o zamówieniu o określonym id
        console.log(`Szczegóły zamówienia ${orderId}:`);
        console.log(`--------------------------------------`);
        const foundOrders = orders.filter(order => order.id === orderId);
        printOrders(foundOrders);
        return(foundOrders);
    } else if(productName){
        // lista zamówień danego produktu
        console.log(`Lista zamówień produktu ${productName}:`);
        console.log(`--------------------------------------`);
        const foundOrders = orders.filter(order => order.productName === productName)
        printOrders(foundOrders);
        return(foundOrders);

    } else {
        // lista wszystkich zamówień
        console.log(`Lista wszystkich zamówień:`);
        console.log(`--------------------------`);
        printOrders(orders);
        return orders;
    }
}

const returnOrder = orderId => {
// zwrot zamówienia o zadanym id

    // Pobranie zamówienia - jeśli istnieje i sprawdzenie, czy już nie zostało zwrócone
    const foundOrdersArr = listOrders(null, orderId);
    if(foundOrdersArr.length === 1){
    // jeśli znaleziono zamówienie
    // Uaktualnienie stanu kasy - zapisanie operacji zwrotu
    const order = foundOrdersArr[0];
    
        if(!order.returned){
            // zamówienie nie ma statusu zwróconego
            console.log(`Zwrot zamówienia o id ${orderId}`);
            const operation = {
                cashUpdate: - order.amount * order.price,
                orderId: order.id,
                operation: 'order returned'
            }
            cash.addCashOperation(operation);
        
            // Uaktualnienie stanu magazynu
            warehouse.returnProduct(order);
            
            // Uaktualnienie stanu zamówienia - na zwrócone
            // Zamienić na "UPDATE ZAMÓWIENIE"
            
            let orders = fetchOrders();
            const orderToUpdate = orders.filter(curr => curr.id === order.id)[0];
            if(orderToUpdate){
                orderToUpdate.returned = true;
            }
            saveOrders(orders);
        } else {
            console.log(`Zamówienie o id ${orderId} ma już status zwróconego`);
        }

    } else if(foundOrdersArr.length === 0){
        console.log(`Brak zamówienia o id ${orderId}`);
    } else {
        // jeśli znaleziono więcej niż jedno zamówienie o zadanym id to też jest błąd
        console.log(`Nieznany błąd zwrotu zamówienia. Znaleziono więcej niż jedno zamówienie dla danego id`);
    }


}

module.exports = {
    sellProduct, 
    listOrders,
    returnOrder
}