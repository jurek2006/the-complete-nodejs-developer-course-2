const   fs = require('fs'),
        _ = require('lodash');

const warehouse = require('./warehouse');

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
        orders.push({
            productName: sold.name,
            amount: sold.amount,
            price: sold.price
        });
        saveOrders(orders);

        console.log(`Sprzedano ${sold.amount} szt. produktu ${sold.name}. Cena jednostkowa ${sold.price} zł`);
        console.log(`Wartość zamówienia: ${sold.amount * sold.price} zł`);
    }
}

module.exports = {
    sellProduct
}