const fs = require('fs');

const fetchNotes = () => {
    try{
        return JSON.parse(fs.readFileSync('notes-data.json'));
    } catch(err){
        return [];
    }
}

const saveNotes = (notes) => {
    
        fs.writeFileSync('notes-data.json', JSON.stringify(notes));
}

const addNote = (title, body) => {
    let notes = fetchNotes();
    const note = {
        title, 
        body
    }  

    let duplicateNotes = notes.filter((note) => note.title === title ); //znalezienie duplikatu (czyli czy już istnieje wiadomośc o takim tytule)

    if(duplicateNotes.length === 0){
        // jeśli nie istnieje wiadomość o takim tytule - jest dodawana
        notes.push(note);
        saveNotes(notes);
        return note;
    }
}

const getNote = (title) => {
    return fetchNotes().filter(note => note.title === title)[0]; //zwrócenie tylko wiadomości o zadanym tytule
}

const removeNote = (title) => {
    // fetch notes
	let notes = fetchNotes();
	// filter notes, removing with title of argument
	const filteredNotes = notes.filter(note => note.title !== title);
	// save new notes array
	if(notes.length !== filteredNotes.length){
		saveNotes(filteredNotes);
		return true;
	} else {
		return false;
	}
}

const getAll = () => {
    return fetchNotes();
}

const logNote = (note) => {
    debugger;
    console.log('--------------');
    console.log(`Tytuł: ${note.title}`);
    console.log(`Treść: ${note.body}`);
}

module.exports = {
    addNote,
    getNote,
    removeNote,
    getAll,
    logNote
}