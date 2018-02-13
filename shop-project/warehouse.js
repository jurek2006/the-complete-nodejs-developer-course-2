const   fs = require('fs'),
        _ = require('lodash');

const fetchWarehouse = () => {
    try {
        return JSON.parse(fs.readFileSync('warehouse-data.json'));
    } catch (error) {
        return []
    }
}

const saveWarehouse = warehouse => {
    fs.writeFileSync('warehouse-data.json', JSON.stringify(warehouse));
}

const findProduct = (name, warehouse) => {
    // zwraca produkt o nazwie name (normalnie powinien być jeden) z warehouse
    return warehouse.filter(product => product.name === name)[0];
}

const updateProduct = (name, amount, price) => {
    // tworzy produkt, jeśli nie ma takiego w magazynie
    // uaktualnie jego stan i/lub cenę, jeśli istnieje już taki produkt w magazynie
    
    // sprawdzenie, czy jeśli przekazano amount i price to są one liczbą nieujemną
    let stop = false;
    if(amount && !(_.isNumber(amount) && amount >= 0)){
        console.log('Błąd. Ilość produktu powinna być liczbą nieujemną lub niezdefiniowana (pominięta)');
        stop = true;
    }
    if(price && !(_.isNumber(price) && price >= 0)) {
        console.log('Błąd. Cena jednostkowa produktu powinna być liczbą nieujemną lub niezdefiniowana (pominięta)');
        stop = true;
    }
    if(stop){
        console.log('Produkt nie został dodany/uaktualniony');
        return;
    }

    let warehouse = fetchWarehouse();

    const product = {
        name, 
        amount, 
        price
    }

    // let productsExisting = warehouse.filter(product => product.name === name);
    let productExisting = findProduct(product.name, warehouse);

    if(!productExisting){
        // jeśli nie znaleziono produktu o zadanej nazwie - utworzenie go
        warehouse.push(product);
        console.log(`Produkt ${name} został dodany do magazynu (Ilość: ${amount}, cena jednostkowa: ${price})`);
    } else {
        // uaktualnienie ilości i/lub ceny dla istniejącego produktu
        
        if(amount) productExisting.amount = amount;
        if(price) productExisting.price = price;
        console.log(`Produkt ${productExisting.name} został uaktualniony (Ilość: ${productExisting.amount}, cena jednostkowa: ${productExisting.price})`);

    }
    saveWarehouse(warehouse);

    return product;
}

const removeProduct = name => {
    const warehouse = fetchWarehouse();
    let foundProduct = findProduct(name, warehouse);
    if(foundProduct){
        let warehouseAfterRemove = warehouse.filter(product => product !== foundProduct);
        saveWarehouse(warehouseAfterRemove);
        console.log(`Usunięto produkt z magazynu - Nazwa produktu: ${foundProduct.name}, ilość: ${foundProduct.amount}, cena jednostkowa: ${foundProduct.price}`);
    } else {
        console.log(`Nie znaleziono produktu o nazwie ${name}`);
    }
}

const statusProduct = name => {
    const warehouse = fetchWarehouse();
    const foundProduct = findProduct(name, warehouse);
    if(foundProduct){
        console.log(`Stan magazynowy produktu ${foundProduct.name} - ilość: ${foundProduct.amount} szt., cena jednostkowa: ${foundProduct.price} zł`)
    } else {
        console.log(`Nie znalezionu produktu ${name} w magazynie.`)
    }
}

const listWarehouse = () => {
    console.log('Całościowy raport magazynowy:');

    const warehouse = fetchWarehouse();
    let i = 0;
    warehouse.forEach(product => {
        console.log(`${++i}\t${product.name}\tilość: ${product.amount}\tcena: ${product.price}`);
    });
}

module.exports = {
    updateProduct,
    removeProduct,
    listWarehouse,
    statusProduct
}