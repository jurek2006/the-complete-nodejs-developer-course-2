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
    orders.forEach((order) => {
        console.log(`${order.id}.\t${order.productName}\t${order.amount}\t*\t${order.price} zł \t= ${order.amount * order.price} zł`);
    });
    console.log(`Wartość zamówień RAZEM: ${orders.reduce((previousValue, order) => previousValue + (order.amount * order.price), 0 )} zł`);
}

const listOrders = (productName, orderId) => {
    const orders = fetchOrders();

    if(orderId){
        // informacje o zamówieniu o określonym id
        console.log(`Szczegóły zamówienia ${orderId}:`);
        console.log(`--------------------------------------`);
        printOrders(orders.filter(order => order.id === orderId));
    } else if(productName){
        // lista zamówień danego produktu
        console.log(`Lista zamówień produktu ${productName}:`);
        console.log(`--------------------------------------`);
        printOrders(orders.filter(order => order.productName === productName));

    } else {
        // lista wszystkich zamówień
        console.log(`Lista wszystkich zamówień:`);
        console.log(`--------------------------`);
        printOrders(orders);
    }
}

module.exports = {
    sellProduct, 
    listOrders
}