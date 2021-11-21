const { writeFile } = require('fs');

async function addUser(userName, password) {
    const storageUsers = await require('../data/users.json');
    let _users = storageUsers ? storageUsers['users'] : [];

    let newUser = {
        id: _users.length + 1,
        userName: userName,
        password: password,
        publicKey: '@TODO: Gerar a public key',
    };

    _users.push(newUser);

    const json = JSON.stringify({ users: _users });
    await writeFile('./data/users.json', json, { flag: 'w+' }, function(e) {
        if (e) console.log('Error: ', e);
    });

    return newUser;
}

async function findUser(userName) {
    const _records = await require('../data/users.json');

    const user = _records.users.find((item) => item.userName === userName);

    return user;
}

async function getUsers(userName) {
    const _records = await require('../data/users.json');

    const users = _records.users.filter((value) => value.userName !== userName);

    return users;
}

module.exports = { addUser, findUser, getUsers };