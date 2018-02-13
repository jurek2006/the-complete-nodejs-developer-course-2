// const obj = {
//     name: 'Jurek'
// };

// let stringObj = JSON.stringify(obj);

// console.log(typeof stringObj);
// console.log(stringObj);

// const personString = `{ "name": "Andrew", 
//                         "age": 8}`;

// const person = JSON.parse(personString);

// console.log(typeof person);
// console.log(person);

const fs = require('fs');

const originalNote = {
    title: 'Some title', 
    body: 'Some body'
}

let originalNoteString = JSON.stringify(originalNote);
fs.writeFileSync('notes.json', originalNoteString);

let noteString = fs.readFileSync('notes.json');

let note = JSON.parse(noteString);
console.log(typeof note);
console.log(note.title);