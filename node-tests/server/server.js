const express = require('express');

var app = express();

app.get('/', (req, res) => {
    res.status(404).send({
        error: 'Page not found.',
        name: 'Todo App v1.0'
    });
});

// GET /users - zwraca tablicę użytkowników
app.get('/users', (req, res) => {
    res.send([
        { name: 'Franek', age: 44},
        { name: 'Ździsiek', age: 54},
        { name: 'Jurek', age: 34},
        { name: 'Józek', age: 24},
    ]);
});

app.listen(3000);
module.exports.app = app;