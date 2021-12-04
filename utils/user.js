const { KeyObject } = require('crypto');
const { writeFile } = require('fs');
const NodeRSA = require('node-rsa');

async function addUser(userName, password) {
    const storageUsers = await require('../data/users.json');
    let _users = storageUsers ? storageUsers.users : [];

    let newUser = {
        id: _users.length + 1,
        userName: userName,
        password: password,
    };
    _users.push(newUser);
    generateKeys(userName)

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

async function generateKeys(user) {
    let key = new NodeRSA({ b: 512 });

    const private = key.generateKeyPair().exportKey('pkcs1');
    const public = key.exportKey('pkcs1-public');

    let keyPair = {
        user,
        public,
        private,
    }

    const storageKeys = require('../data/keys.json') || { keys: [] };
    storageKeys.keys.push(keyPair);

    const json = JSON.stringify({...storageKeys });
    writeFile('./data/keys.json', json, { flag: 'w+' }, function(e) {
        if (e) console.log('Error: ', e);
    });
}

module.exports = { addUser, findUser, getUsers };