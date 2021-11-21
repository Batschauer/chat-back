const { writeFile } = require('fs');

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
        await writeFile(
            './data/messages.json',
            json, { flag: 'w+' },
            function(e) {
                if (e) console.log('Error: ', e);
            }
        );
    } else {
        const json = JSON.stringify({ messages: [] });
        await writeFile(
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