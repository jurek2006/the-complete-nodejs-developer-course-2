const   fs = require('fs'),
		_ = require('lodash'),
		yargs = require('yargs');

const   notes = require('./notes');

const titleOptions = {
	describe: 'Tytuł notatki',
	demand: true, 
	alias: 't'
};

const bodyOptions = {
	describe: 'Treść notatki',
	demand: true, 
	alias: 'b'
};
const argv = yargs
			.command('add', 'Dodaj nową notatkę', {
				title: titleOptions,
				body: bodyOptions
			})
			.command('list', 'Wyświetl wszystkie notatki')
			.command('read', 'Wyświetl określoną notatkę', {
				title: titleOptions,
			})
			.command('remove', 'Usuń określoną notatkę', {
				title: titleOptions,
			})
			.help()
			.argv;
let command = argv._[0];


if(command === 'add'){

	let note = notes.addNote(argv.title, argv.body);
	if(note){
		console.log('Dodano notatkę');
		notes.logNote(note);
	} else {
		console.log(`Duplikat tytułu - nie dodano do note`);
	}

} else if(command === 'list'){

	const allNotes = notes.getAll();
	console.log(`Wyświetlanie ${allNotes.length} notatek:`);
	allNotes.forEach(note => notes.logNote(note));

} else if(command === 'read'){

	const foundNote = notes.getNote(argv.title);
	if(foundNote){
		console.log('Znaleziono notatkę');
		notes.logNote(foundNote);
	} else {
		console.log(`Brak notatki o tytule ${argv.title}`);
	}

} else if(command === 'remove'){

	if(notes.removeNote(argv.title)){
		console.log(`Usunięto notatkę ${argv.title}.`);
	} else {
		console.log(`Brak notatki o tytule ${argv.title}`);
	}
	
} else {
	console.log('Command not recognized');
}
