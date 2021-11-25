const { writeFile } = require('fs');

async function getMessages(from, to) {
    let storageMessages = await require('../data/messages.json');
    console.log('storageMessages: ', storageMessages);
    console.log('from: ', from);
    console.log('to: ', to);

    let messages = [];

    if (storageMessages) {
        messages = storageMessages.messages.filter(
            (value) => value.destination === `from_${from}_to_${to}`
        );

        storageMessages.messages = storageMessages.messages.filter(
            (value) => value.destination !== `from_${from}_to_${to}`
        );

        const json = JSON.stringify({...storageMessages });
        writeFile(
            './data/messages.json',
            json, { flag: 'w+' },
            function(e) {
                if (e) console.log('Error: ', e);
            }
        );
    } else {
        const json = JSON.stringify({ messages: [] });
        writeFile(
            './data/messages.json',
            json, { flag: 'w+' },
            function(e) {
                if (e) console.log('Error: ', e);
            }
        );
    }

    return messages;
}

module.exports = { getMessages };