const getUser = (id, callback) => {
    const user = {
        id: id,
        name: 'Viking'
    };

    setTimeout(() => {
        callback(user);
    }, 3000);
};

getUser(23, (user) => {
    console.log(user);
})