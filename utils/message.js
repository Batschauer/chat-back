const { writeFile } = require('fs');
const NodeRSA = require('node-rsa');

async function getMessages(from, to) {
    let storageMessages = await require('../data/messages.json');

    let messages = [];

    if (storageMessages) {
        messages = storageMessages.messages.filter(
            (value) => value.destination === `from_${from}_to_${to}`
        );

        storageMessages.messages = storageMessages.messages.filter(
            (value) => value.destination !== `from_${from}_to_${to}`
        );

        const json = JSON.stringify({...storageMessages });
        writeFile('./data/messages.json', json, { flag: 'w+' }, function(e) {
            if (e) console.log('Error: ', e);
        });
    } else {
        const json = JSON.stringify({ messages: [] });
        writeFile('./data/messages.json', json, { flag: 'w+' }, function(e) {
            if (e) console.log('Error: ', e);
        });
    }

    let readabbleMessages = [];

    if (Array.isArray(messages) && messages.length) {
        readabbleMessages = await Promise.all(
            messages.map(async({ data, ...rest }) => ({
                ...rest,
                data: await decrypt(to, data),
            }))
        );
    }

    return readabbleMessages;
}

async function sendMessage(from, to, data) {
    let storageMessages = await require('../data/messages.json');

    const id = Date.now();

    let message = {
        id,
        destination: `from_${from}_to_${to}`,
        data: (await encrypt(to, data)) || '',
    };

    storageMessages.messages.push(message);

    const json = JSON.stringify({...storageMessages });
    writeFile('./data/messages.json', json, { flag: 'w+' }, function(e) {
        if (e) console.log('Error: ', e);
    });

    return id;
}

async function encrypt(user, data) {
    const storageKey = await getPublic(user);

    let key = new NodeRSA();
    key.importKey(storageKey, 'pkcs1-public-pem');

    return key.encrypt(data, 'base64');
}

async function decrypt(user, data) {
    const storageKey = await getPrivate(user);

    let key = new NodeRSA();
    key.importKey(storageKey, 'pkcs1-private-pem');

    return key.decrypt(data, 'utf8');
}

async function getPrivate(user) {
    const storageKeys = await require('../data/keys.json');
    if (storageKeys) {
        const { private } = storageKeys.keys.find(
            (value) => value.user === user
        );
        return private;
    }
}

async function getPublic(user) {
    const storageKeys = await require('../data/keys.json');
    if (storageKeys) {
        const { public } = storageKeys.keys.find(
            (value) => value.user === user
        );
        return public;
    }
}

module.exports = { getMessages, sendMessage };