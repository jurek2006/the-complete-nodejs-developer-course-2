console.log('Starting node.js');

const addNote = (title, body) => {
    console.log('Adding note', title, body);
}

const getNote = (title) => {
    console.log('Getting note', title);
}

const removeNote = (title) => {
    console.log('Removing note', title);
}

const getAll = () => {
    console.log('getting all notes');
}

module.exports = {
    addNote,
    getNote,
    removeNote,
    getAll,
}