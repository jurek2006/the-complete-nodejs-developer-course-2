console.log('Starting app.js');

const   fs = require('fs'),
		_ = require('lodash'),
		yargs = require('yargs');

const   notes = require('./notes');

const argv = yargs.argv;
let command = argv._[0];
console.log(`Command: ${command}`);
console.log('Yargs: ', argv);

if(command === 'add'){
	notes.addNote(argv.title, argv.body);
} else if(command === 'list'){
	notes.getAll();
} else if(command === 'read'){
	notes.getNote(argv.title);
} else if(command === 'remove'){
    notes.removeNote(argv.title);
} else {
	console.log('Command not recognized');
}
