console.log('Starting app.js');

const   fs = require('fs'),
        os = require('os'),
        _ = require('lodash'),
        notes = require('./notes');

let filteredArray = _.uniq(['Jurek', 1, 'Jurek', 1, 2, 3, 4, 5]);
console.log(filteredArray);

// let res = notes.addNote();
// console.log(res);

// let add = notes.add(4, -2);
// console.log(add);
        
// let user = os.userInfo();

// fs.appendFile('greetings.txt', `Hello ${user.username}! You are ${notes.age}.`, (err) => {
//     if (err) throw err;
//     console.log('Tekst został dodany do pliku');
// });