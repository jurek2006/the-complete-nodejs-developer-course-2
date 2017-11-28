console.log('Starting node.js');

module.exports.addNote = () => {
    console.log('Add note');
    return 'New note';
};

module.exports.add = (a, b) => a + b;